"""Minimal multi-agent collaboration orchestration."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from types import SimpleNamespace
from typing import TYPE_CHECKING, Any

from nanobot.utils.helpers import detect_response_style

if TYPE_CHECKING:
    from nanobot.cluster.runtime import AssistantCluster, AssistantRuntime


@dataclass(slots=True)
class CollaborationUsage:
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0

    def add(self, snapshot: dict[str, int] | None) -> None:
        data = snapshot or {}
        self.prompt_tokens += int(data.get("prompt_tokens", 0) or 0)
        self.completion_tokens += int(data.get("completion_tokens", 0) or 0)
        self.total_tokens += int(data.get("total_tokens", 0) or 0)

    def to_dict(self) -> dict[str, int]:
        return {
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "total_tokens": self.total_tokens,
        }

#   多助手协同核心类。
class MultiAgentCollaborator:
    """Coordinate a planner, several workers, and a synthesizer."""

    def __init__(self, cluster: AssistantCluster):
        self.cluster = cluster

    def _config(self) -> Any:
        cluster_config = getattr(getattr(self.cluster, "config", None), "cluster", None)
        config = getattr(cluster_config, "collaboration", None)
        if config is not None:
            return config
        return SimpleNamespace(
            mode="off",
            planner_assistant_id="expert",
            synthesis_assistant_id="",
            worker_assistant_ids=["consult", "developer", "writer"],
            max_workers=3,
            execution_mode="parallel",
            auto_keywords=[],
            min_content_length=24,
        )

#   判断是否触发协同。
    def should_collaborate(
        self,
        *,
        assistant_id: str,
        content: str,
        media: list[str] | None,
        mode_override: str | None = None,
    ) -> bool:
        config = self._config()
        mode = (mode_override or "").strip() or str(config.mode or "off")
        if mode == "inherit":
            mode = str(config.mode or "off")
        if mode == "off":
            return False
        if media:
            return False
        if assistant_id == "image":
            return False
        text = (content or "").strip()
        if not text:
            return False
        if mode == "always":
            return True
        lowered = text.lower()
        if len(text) >= int(config.min_content_length):
            return True
        return any(keyword.lower() in lowered for keyword in config.auto_keywords)

    def _resolve_runtime(self, assistant_id: str | None) -> AssistantRuntime | None:
        if not assistant_id:
            return None
        return self.cluster.runtimes.get(assistant_id)

#   选择 Planner 助手。
    def _resolve_planner_runtime(self, fallback_assistant_id: str) -> tuple[str, AssistantRuntime]:
        config = self._config()
        planner_id = config.planner_assistant_id or fallback_assistant_id
        planner = self._resolve_runtime(planner_id) or self._resolve_runtime(fallback_assistant_id)
        if planner is None:
            raise ValueError("没有可用的编排助手，无法执行多 agent 协同。")
        return planner.assistant.id, planner

#   选择 Summary 汇总助手。
    def _resolve_synthesis_runtime(
        self,
        *,
        fallback_assistant_id: str,
        planner_id: str,
    ) -> tuple[str, AssistantRuntime]:
        config = self._config()
        synthesis_id = config.synthesis_assistant_id or planner_id or fallback_assistant_id
        runtime = (
            self._resolve_runtime(synthesis_id)
            or self._resolve_runtime(planner_id)
            or self._resolve_runtime(fallback_assistant_id)
        )
        if runtime is None:
            raise ValueError("没有可用的汇总助手，无法生成协同结果。")
        return runtime.assistant.id, runtime

#   选择 Worker 助手。
    def _resolve_worker_runtimes(
        self,
        *,
        primary_assistant_id: str,
        planner_id: str,
    ) -> list[tuple[str, AssistantRuntime]]:
        config = self._config()
        candidates: list[str] = [primary_assistant_id, *config.worker_assistant_ids]
        resolved: list[tuple[str, AssistantRuntime]] = []
        seen: set[str] = set()
        for assistant_id in candidates:
            if assistant_id in seen or assistant_id == planner_id:
                continue
            runtime = self._resolve_runtime(assistant_id)
            if runtime is None or not runtime.assistant.enabled:
                continue
            seen.add(assistant_id)
            resolved.append((assistant_id, runtime))
            if len(resolved) >= config.max_workers:
                break
        if not resolved:
            fallback = self._resolve_runtime(primary_assistant_id)
            if fallback is not None and fallback.assistant.id != planner_id:
                return [(fallback.assistant.id, fallback)]
        return resolved

#   汇总失败时生成降级结果。
    @staticmethod
    def _fallback_summary(
        *,
        content: str,
        plan_text: str,
        worker_results: list[dict[str, Any]],
    ) -> str:
        successful = [item for item in worker_results if item.get("status") == "completed" and str(item.get("content") or "").strip()]
        failed = [item for item in worker_results if item.get("status") == "failed"]
        sections = [
            "多助手协同已完成，但最终汇总模型不可用，以下为系统基于各助手结果整理的降级汇总。",
            "",
            "## 原始任务",
            content.strip(),
            "",
            "## 协同计划",
            plan_text.strip() or "未生成协同计划。",
            "",
            "## 各助手结果",
        ]
        if successful:
            for item in successful:
                sections.extend([
                    f"### {item.get('assistant_name') or item.get('assistant_id')}",
                    str(item.get("content") or "").strip(),
                    "",
                ])
        else:
            sections.append("没有可用的成功执行结果。")
        if failed:
            sections.extend([
                "",
                "## 未完成的助手",
                "\n".join(
                    f"- {item.get('assistant_name') or item.get('assistant_id')}: {item.get('error') or '执行失败'}"
                    for item in failed
                ),
            ])
        return "\n".join(sections).strip()

#   复用单助手运行时执行阶段任务。
    async def _run_prompt(
        self,
        *,
        runtime: AssistantRuntime,
        assistant_id: str,
        session_key: str,
        channel: str,
        chat_id: str,
        content: str,
    ) -> tuple[str, list[dict[str, Any]], dict[str, int]]:
        enriched_content, knowledge_hits = self.cluster._merge_knowledge_context(assistant_id, content)
        outbound, emitted = await runtime.ask(
            content=enriched_content,
            session_key=session_key,
            channel=channel,
            chat_id=chat_id,
            media=[],
        )
        user_emitted = self.cluster._collect_user_facing_emitted(emitted)
        emitted_content = "\n\n".join(
            msg.content.strip()
            for msg in user_emitted
            if msg.content and msg.content.strip()
        ).strip()
        response_text = outbound.content if outbound else ""
        return emitted_content or response_text, knowledge_hits, runtime.usage_snapshot()

#   执行 Planner -> Workers -> Summary 全流程。
    async def execute(
        self,
        *,
        route_assistant_id: str,
        content: str,
        session_id: str,
        channel: str,
        chat_id: str,
        trace_id: str | None,
    ) -> dict[str, Any]:
        planner_id, planner_runtime = self._resolve_planner_runtime(route_assistant_id)
        synthesis_id, synthesis_runtime = self._resolve_synthesis_runtime(
            fallback_assistant_id=route_assistant_id,
            planner_id=planner_id,
        )
        workers = self._resolve_worker_runtimes(
            primary_assistant_id=route_assistant_id,
            planner_id=planner_id,
        )
        if not workers:
            raise ValueError("没有可用的执行助手，无法执行多 agent 协同。")

        usage = CollaborationUsage()
        if trace_id:
            self.cluster.control.add_trace_event(
                trace_id,
                "collaboration_start",
                f"planner={planner_id}; workers={','.join(worker_id for worker_id, _ in workers)}",
                {
                    "planner_assistant_id": planner_id,
                    "worker_assistant_ids": [worker_id for worker_id, _ in workers],
                    "synthesis_assistant_id": synthesis_id,
                },
            )

        roster = "\n".join(
            f"- {worker_id}: {runtime.assistant.name}；职责：{runtime.assistant.description or '通用分析'}"
            for worker_id, runtime in workers
        )
        planner_prompt = (
            "你是多助手协同编排器。请把用户任务拆成一份短小、可执行的协同计划。\n"
            "要求：\n"
            "1. 先写目标。\n"
            "2. 再写 2-4 个执行要点。\n"
            "3. 再给出每个参与助手的关注点。\n"
            "4. 输出简洁中文，不要写 JSON。\n\n"
            f"用户任务：\n{content}\n\n"
            f"可用执行助手：\n{roster}"
        )
        plan_text, plan_hits, plan_usage = await self._run_prompt(
            runtime=planner_runtime,
            assistant_id=planner_id,
            session_key=f"{planner_id}:{session_id}:plan",
            channel=channel,
            chat_id=chat_id,
            content=planner_prompt,
        )
        usage.add(plan_usage)
        if trace_id:
            for hit in plan_hits:
                self.cluster.control.add_trace_event(
                    trace_id,
                    "knowledge_hit",
                    hit["content"],
                    {
                        "title": hit.get("title"),
                        "filename": hit.get("filename"),
                        "score": hit.get("score"),
                        "retrieval": hit.get("retrieval", []),
                        "assistant_id": planner_id,
                        "phase": "plan",
                    },
                )
            self.cluster.control.add_trace_event(
                trace_id,
                "collaboration_plan",
                plan_text,
                {
                    "planner_assistant_id": planner_id,
                    "worker_count": len(workers),
                },
            )

        async def _run_worker(worker_id: str, runtime: AssistantRuntime) -> dict[str, Any]:
            worker_prompt = (
                "你正在参与一次多助手协作。\n"
                f"总任务：{content}\n\n"
                f"协同计划：\n{plan_text}\n\n"
                f"你的角色：{runtime.assistant.name}。\n"
                f"角色说明：{runtime.assistant.description or '通用执行助手'}\n\n"
                "请只输出你负责部分的专业结论、执行建议和风险点，不要重复总任务，不要写寒暄。"
            )
            try:
                result_text, result_hits, result_usage = await self._run_prompt(
                    runtime=runtime,
                    assistant_id=worker_id,
                    session_key=f"{worker_id}:{session_id}:worker",
                    channel=channel,
                    chat_id=chat_id,
                    content=worker_prompt,
                )
                return {
                    "assistant_id": worker_id,
                    "assistant_name": runtime.assistant.name,
                    "content": result_text,
                    "knowledge_hits": result_hits,
                    "usage": result_usage,
                    "status": "completed",
                    "error": "",
                }
            except Exception as exc:
                return {
                    "assistant_id": worker_id,
                    "assistant_name": runtime.assistant.name,
                    "content": "",
                    "knowledge_hits": [],
                    "usage": {},
                    "status": "failed",
                    "error": str(exc),
                }

        if self._config().execution_mode == "parallel":
            worker_results = await asyncio.gather(
                *[_run_worker(worker_id, runtime) for worker_id, runtime in workers]
            )
        else:
            worker_results = []
            for worker_id, runtime in workers:
                worker_results.append(await _run_worker(worker_id, runtime))

        for result in worker_results:
            usage.add(result["usage"])
            if trace_id:
                for hit in result["knowledge_hits"]:
                    self.cluster.control.add_trace_event(
                        trace_id,
                        "knowledge_hit",
                        hit["content"],
                        {
                            "title": hit.get("title"),
                            "filename": hit.get("filename"),
                            "score": hit.get("score"),
                            "retrieval": hit.get("retrieval", []),
                            "assistant_id": result["assistant_id"],
                            "phase": "worker",
                        },
                    )
                self.cluster.control.add_trace_event(
                    trace_id,
                    "collaboration_worker_result",
                    result["content"] if result.get("status") == "completed" else str(result.get("error") or "执行失败"),
                    {
                        "assistant_id": result["assistant_id"],
                        "assistant_name": result["assistant_name"],
                        "status": result.get("status", "completed"),
                        "error": result.get("error", ""),
                    },
                )

        completed_worker_results = [
            result for result in worker_results
            if result.get("status") == "completed" and str(result.get("content") or "").strip()
        ]
        if not completed_worker_results:
            failed_text = "\n".join(
                f"- {result['assistant_name']}: {result.get('error') or '执行失败'}"
                for result in worker_results
            )
            raise ValueError(f"所有协同执行助手均失败，无法生成结果。\n{failed_text}")

        worker_summary = "\n\n".join(
            f"[{result['assistant_name']}]\n{result['content']}"
            for result in completed_worker_results
            if result["content"].strip()
        ).strip()
        synthesis_prompt = (
            "你是多助手协同任务的最终汇总助手。\n"
            "请基于用户原始问题、协同计划和各助手产出，整合出一版最终答复。\n"
            "要求：\n"
            "1. 直接给结论。\n"
            "2. 保留结构化层次。\n"
            "3. 去重、消除冲突。\n"
            "4. 如有风险和前提，单独列出。\n"
            "5. 不要提到“某某助手说了什么”，直接输出最终结果。\n\n"
            f"用户问题：\n{content}\n\n"
            f"协同计划：\n{plan_text}\n\n"
            f"各助手产出：\n{worker_summary}"
        )
        synthesis_hits: list[dict[str, Any]] = []
        synthesis_status = "completed"
        synthesis_error = ""
        try:
            final_text, synthesis_hits, synthesis_usage = await self._run_prompt(
                runtime=synthesis_runtime,
                assistant_id=synthesis_id,
                session_key=f"{synthesis_id}:{session_id}:synthesis",
                channel=channel,
                chat_id=chat_id,
                content=synthesis_prompt,
            )
            usage.add(synthesis_usage)
        except Exception as exc:
            synthesis_status = "fallback"
            synthesis_error = str(exc)
            final_text = self._fallback_summary(
                content=content,
                plan_text=plan_text,
                worker_results=worker_results,
            )
        if trace_id:
            for hit in synthesis_hits:
                self.cluster.control.add_trace_event(
                    trace_id,
                    "knowledge_hit",
                    hit["content"],
                    {
                        "title": hit.get("title"),
                        "filename": hit.get("filename"),
                        "score": hit.get("score"),
                        "retrieval": hit.get("retrieval", []),
                        "assistant_id": synthesis_id,
                        "phase": "synthesis",
                    },
                )
            self.cluster.control.add_trace_event(
                trace_id,
                "collaboration_summary",
                final_text,
                {
                    "synthesis_assistant_id": synthesis_id,
                    "status": synthesis_status,
                    "error": synthesis_error,
                },
            )

        collaboration_payload = {
            "planner_assistant_id": planner_id,
            "synthesis_assistant_id": synthesis_id,
            "worker_assistant_ids": [result["assistant_id"] for result in worker_results],
            "worker_results": [
                {
                    "assistant_id": result["assistant_id"],
                    "assistant_name": result["assistant_name"],
                    "content": result["content"],
                    "status": result.get("status", "completed"),
                    "error": result.get("error", ""),
                }
                for result in worker_results
            ],
        }
        return {
            "assistant_id": route_assistant_id,
            "assistant_name": self.cluster.runtimes[route_assistant_id].assistant.name,
            "content": final_text,
            "changed_binding": False,
            "deferred": False,
            "content_style": detect_response_style(final_text),
            "citations": [],
            "quota": {"daily_token_limit": None, "daily_token_usage": usage.total_tokens},
            "media": [],
            "usage": usage.to_dict(),
            "collaboration": collaboration_payload,
        }
