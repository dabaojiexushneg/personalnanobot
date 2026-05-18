"""Task execution workflow helpers for the assistant cluster."""

from __future__ import annotations

import asyncio
import contextlib
from datetime import datetime
from datetime import timedelta
from typing import Any, TYPE_CHECKING

if TYPE_CHECKING:
    from nanobot.cluster.runtime import AssistantCluster

#   自动化任务执行器。
class ClusterTaskRunner:
    """Encapsulate task execution, retries, and due-task polling."""

    def __init__(self, cluster: "AssistantCluster"):
        self.cluster = cluster

#   手动执行指定任务。
    async def execute_task(self, task_id: str) -> dict[str, Any]:
        task = self.cluster.control.get_task(task_id)
        return await self._execute_task_payload(task)

    async def _task_lease_heartbeat(
        self,
        task_id: str,
        worker_id: str,
        *,
        lease_seconds: int,
    ) -> None:
        interval = max(15, lease_seconds // 3)
        while True:
            await asyncio.sleep(interval)
            if not self.cluster.control.heartbeat_task_lease(
                task_id,
                worker_id,
                lease_seconds=lease_seconds,
            ):
                return

    def _render_task_prompt(self, task: dict[str, Any]) -> str:
        kind = str(task.get("task_kind") or "generic")
        prompt = str(task.get("prompt") or "").strip()
        if kind == "report":
            return (
                "请把结果整理成适合直接发送的结构化报告，优先给出结论、关键依据和下一步建议。\n\n"
                f"{prompt}"
            ).strip()
        if kind == "knowledge_digest":
            return (
                "请优先基于当前知识库完成任务，并尽量给出引用依据或文档来源标题。\n\n"
                f"{prompt}"
            ).strip()
        if kind == "channel_push":
            return (
                "请输出适合直接发到聊天渠道的一段成品消息，要求简洁、明确、可直接发送。\n\n"
                f"{prompt}"
            ).strip()
        if kind == "image_generation":
            return (
                "如果任务目标是生成图片，请直接调用生图工具，不要只返回提示词。\n\n"
                f"{prompt}"
            ).strip()
        return prompt

    def _retry_count(self, task_id: str, *, max_retries: int) -> int:
        if max_retries <= 0:
            return 0
        runs = self.cluster.control.list_task_runs(task_id, limit=max_retries + 1)
        attempts = 0
        for run in runs:
            status = str(run.get("status") or "")
            if status == "completed":
                break
            if status in {"retrying", "failed"}:
                attempts += 1
        return attempts

    def _rag_connected_snapshot(self) -> tuple[bool, str]:
        knowledge_store = getattr(self.cluster.control, "_knowledge_store", None)
        if knowledge_store is None:
            rag_status = self.cluster.rag_status()
            connected = bool(rag_status.get("connected"))
            detail = "Milvus / RAG 已连接" if connected else "当前未检测到 Milvus / RAG 连接"
            return connected, detail
        if getattr(knowledge_store, "_client", None) is not None:
            return True, "Milvus / RAG 已建立活动连接"
        if hasattr(knowledge_store, "available") and not bool(getattr(knowledge_store, "available")):
            return False, "RAG 依赖未就绪，当前无法建立连接"
        return False, "当前没有活动的 RAG 连接快照"

#   计算任务执行条件。
    def describe_conditions(self, task: dict[str, Any]) -> dict[str, Any]:
        items: list[dict[str, Any]] = []
        blocking_reasons: list[str] = []

        if bool(task.get("require_rag_connected")):
            connected, detail = self._rag_connected_snapshot()
            items.append(
                {
                    "key": "rag_connected",
                    "label": "RAG 已连接",
                    "matched": connected,
                    "detail": detail,
                }
            )
            if not connected:
                blocking_reasons.append("要求 RAG / Milvus 已连接，但当前未连接。")

        if bool(task.get("require_channel_online")):
            target_channel = str(task.get("target_channel") or "").strip()
            if not target_channel:
                items.append(
                    {
                        "key": "channel_online",
                        "label": "目标渠道在线",
                        "matched": False,
                        "detail": "未配置目标渠道，无法判断在线状态",
                    }
                )
                blocking_reasons.append("要求渠道在线，但当前任务未配置目标渠道。")
            else:
                channel_state = (self.cluster.channel_status() or {}).get(target_channel, {})
                online = bool(channel_state.get("enabled") and channel_state.get("running"))
                detail = (
                    f"{target_channel} 当前在线"
                    if online else f"{target_channel} 当前未就绪或未启动"
                )
                items.append(
                    {
                        "key": "channel_online",
                        "label": "目标渠道在线",
                        "matched": online,
                        "detail": detail,
                    }
                )
                if not online:
                    blocking_reasons.append(f"要求渠道在线，但 {target_channel} 当前未就绪。")

        min_gap = int(task.get("min_success_gap_minutes") or 0)
        if min_gap > 0:
            last_success_at = self.cluster.control.last_successful_task_run_at(task["id"])
            if last_success_at:
                completed_at = datetime.fromisoformat(last_success_at)
                deadline = completed_at + timedelta(minutes=min_gap)
                matched = deadline <= datetime.now().astimezone()
                detail = (
                    f"上次成功在 {completed_at.isoformat()}，已满足最少间隔 {min_gap} 分钟"
                    if matched else f"上次成功在 {completed_at.isoformat()}，距离要求的 {min_gap} 分钟仍未到"
                )
            else:
                matched = True
                detail = f"尚无成功记录，可立即执行（要求最少间隔 {min_gap} 分钟）"
            items.append(
                {
                    "key": "success_gap",
                    "label": "成功间隔限制",
                    "matched": matched,
                    "detail": detail,
                }
            )
            if not matched:
                blocking_reasons.append(f"距离上次成功执行不足 {min_gap} 分钟。")

        ready = not blocking_reasons
        return {
            "ready": ready,
            "items": items,
            "blocking_reason": f"已跳过：{blocking_reasons[0]}" if blocking_reasons else "",
            "summary": "当前满足执行条件" if ready else "当前被执行条件阻塞",
        }

#   返回任务不能执行的原因。
    def _condition_failure(self, task: dict[str, Any]) -> str | None:
        evaluation = self.describe_conditions(task)
        return str(evaluation.get("blocking_reason") or "") or None

    async def _execute_task_payload(
        self,
        task: dict[str, Any] | None,
        *,
        worker_id: str | None = None,
        lease_seconds: int = 900,
    ) -> dict[str, Any]:
        if not task:
            raise ValueError("任务不存在")
        started_at = datetime.now().astimezone()
        if skip_reason := self._condition_failure(task):
            self.cluster.control.record_task_run(
                task["id"],
                status="skipped",
                result=skip_reason[:1000],
                started_at=started_at,
                worker_id=worker_id,
            )
            return {
                "assistant_id": task["assistant_id"],
                "content": "",
                "status": "skipped",
                "skip_reason": skip_reason,
            }
        heartbeat_task: asyncio.Task | None = None
        if worker_id:
            heartbeat_task = asyncio.create_task(
                self._task_lease_heartbeat(
                    task["id"],
                    worker_id,
                    lease_seconds=lease_seconds,
                )
            )
        try:
            result = await self.cluster.chat(
                assistant_id=task["assistant_id"],
                content=self._render_task_prompt(task),
                session_id=f"task:{task['id']}",
                channel="web",
                chat_id="task-center",
                media=[],
                collaboration_mode=str(task.get("collaboration_mode") or "inherit"),
            )
            if task["target_channel"]:
                media_paths = [
                    str(item.get("path", "")).strip()
                    for item in (result.get("media") or [])
                    if str(item.get("path", "")).strip()
                    and not str(item.get("path", "")).startswith(("http://", "https://", "/api/files"))
                ]
                await self.cluster.send_channel_message(
                    channel=task["target_channel"],
                    chat_id=task["target_chat_id"] or "",
                    assistant_id=result.get("assistant_id"),
                    content="" if media_paths else str(result.get("content") or ""),
                    media=media_paths,
                )
            summary = str(result.get("content") or "").strip()
            self.cluster.control.record_task_run(
                task["id"],
                status="completed",
                result=summary[:1000],
                started_at=started_at,
                worker_id=worker_id,
            )
            return result
        except Exception as exc:
            max_retries = int(task.get("max_retries") or 0)
            attempts = self._retry_count(task["id"], max_retries=max_retries)
            if attempts < max_retries:
                message = f"执行失败，准备重试 {attempts + 1}/{max_retries}：{str(exc)[:900]}"
                self.cluster.control.record_task_run(
                    task["id"],
                    status="retrying",
                    result=message,
                    started_at=started_at,
                    worker_id=worker_id,
                )
                next_run_at = self.cluster.control.schedule_task_retry(
                    task["id"],
                    retry_backoff_seconds=int(task.get("retry_backoff_seconds") or 60),
                    message=message,
                    worker_id=None,
                )
                return {
                    "assistant_id": task["assistant_id"],
                    "content": "",
                    "status": "retrying",
                    "retry_scheduled_at": next_run_at,
                    "error": str(exc),
                }
            self.cluster.control.record_task_run(
                task["id"],
                status="failed",
                result=str(exc)[:1000],
                started_at=started_at,
                worker_id=worker_id,
            )
            raise
        finally:
            if heartbeat_task:
                heartbeat_task.cancel()
                with contextlib.suppress(asyncio.CancelledError):
                    await heartbeat_task

#   扫描并执行到期任务。
    async def run_due_tasks(
        self,
        *,
        worker_id: str | None = None,
        lease_seconds: int = 900,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        results: list[dict[str, Any]] = []
        owner = worker_id or self.cluster._worker_id
        for task in self.cluster.control.claim_due_tasks(
            owner,
            lease_seconds=lease_seconds,
            limit=limit,
        ):
            try:
                result = await self._execute_task_payload(
                    task,
                    worker_id=owner,
                    lease_seconds=lease_seconds,
                )
                results.append(
                    {
                        "task_id": task["id"],
                        "status": result.get("status", "completed"),
                        "result": result.get("content", ""),
                        "retry_scheduled_at": result.get("retry_scheduled_at"),
                    }
                )
            except Exception as exc:
                results.append({"task_id": task["id"], "status": "failed", "error": str(exc)})
        return results
