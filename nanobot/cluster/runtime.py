"""Runtime orchestration for the personal multi-assistant cluster."""

from __future__ import annotations

import asyncio
import contextlib
import os
import re
import secrets
import uuid
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import quote

from loguru import logger

from nanobot.agent.context import ContextBuilder
from nanobot.agent.loop import AgentLoop
from nanobot.agent.tools.local_paths import get_desktop_dir
from nanobot.bus.events import InboundMessage, OutboundMessage
from nanobot.bus.queue import MessageBus
from nanobot.channels.manager import ChannelManager
from nanobot.cluster.collaboration import MultiAgentCollaborator
from nanobot.cluster.control import ClusterControlStore
from nanobot.cluster.inbound_router import ClusterInboundRouter
from nanobot.cluster.mcp import normalize_mcp_servers, summarize_mcp_server
from nanobot.cluster.metrics import ClusterMetrics
from nanobot.cluster.service import ClusterConfigService
from nanobot.cluster.storage import SQLiteMemoryStore, SQLiteSessionManager
from nanobot.cluster.task_runner import ClusterTaskRunner
from nanobot.cluster.tools import GenerateImageTool
from nanobot.config.schema import AssistantClusterMemberConfig, Config, MCPServerConfig
from nanobot.nanobot import _make_provider
from nanobot.utils.helpers import detect_response_style

_SWITCH_RE = re.compile(r"^\s*/switch\s+([a-zA-Z0-9_-]+)\s*$")
_ASSISTANT_RE = re.compile(r"^\s*/assistant\s+([a-zA-Z0-9_-]+)\s*(.*)$", re.DOTALL)
_SWITCH_PHRASE_RE = re.compile(
    r"^\s*(?:切换(?:到)?|转到|转为|使用|改用|换成|进入|绑定(?:到)?)"
    r"(?:\s*(?:助手|AI助手)?)\s*[:：]?\s*(.+?)\s*$",
    re.IGNORECASE,
)
_SWITCH_SHORT_RE = re.compile(
    r"^\s*(?:助手|AI助手)\s*[:：]?\s*(.+?)\s*$",
    re.IGNORECASE,
)
_PASSCODE_HELP_RE = re.compile(
    r"^\s*(?:助手口令|查看助手|查看口令|切换口令|口令列表|助手列表|切换助手)\s*$",
    re.IGNORECASE,
)
_IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}
_REMOTE_IMAGE_RE = re.compile(r"https?://[^\s)]+?\.(?:png|jpg|jpeg|webp|gif|bmp)(?:\?[^\s)]*)?", re.IGNORECASE)
_MEDIA_MARKER_ONLY_RE = re.compile(
    r"^\s*(?:"
    r"\[(?:image|video|voice|audio|document|pdf)\]"
    r"|\[file(?::[^\]]*)?\]"
    r"|\[(?:Image|Video|Audio|File):\s*source:\s*[^\]]+\]"
    r"|\[attachment(?::[^\]]*)?\]"
    r")\s*$",
    re.IGNORECASE,
)


@dataclass(slots=True)
class RoutedRequest:
    """Normalized routing decision."""

    assistant_id: str
    content: str
    changed_binding: bool = False
    direct_response: bool = False

#   单个助手的运行时封装。
class AssistantRuntime:
    """One isolated assistant runtime."""
#   为助手创建 workspace、provider、context、AgentLoop。
    def __init__(
        self,
        root_config: Config,
        assistant: AssistantClusterMemberConfig,
        service: ClusterConfigService,
    ):
        self.root_config = root_config
        self.assistant = assistant
        self.service = service
        self.workspace = service.ensure_workspace_files(assistant)
        self.db_path = service.assistant_database(assistant.id)
        self.memory = SQLiteMemoryStore(self.workspace, self.db_path)
        self.sessions = SQLiteSessionManager(self.workspace, self.db_path)

        runtime_config = root_config.model_copy(deep=True)
        defaults = runtime_config.agents.defaults
        defaults.workspace = str(self.workspace)
        defaults.model = assistant.model or defaults.model
        defaults.provider = assistant.provider or defaults.provider
        if assistant.max_tokens is not None:
            defaults.max_tokens = assistant.max_tokens
        if assistant.temperature is not None:
            defaults.temperature = assistant.temperature
        if assistant.reasoning_effort is not None:
            defaults.reasoning_effort = assistant.reasoning_effort
        if assistant.max_tool_iterations is not None:
            defaults.max_tool_iterations = assistant.max_tool_iterations
        if assistant.context_window_tokens is not None:
            defaults.context_window_tokens = assistant.context_window_tokens
        if assistant.max_tool_result_chars is not None:
            defaults.max_tool_result_chars = assistant.max_tool_result_chars
        if assistant.provider_retry_mode is not None:
            defaults.provider_retry_mode = assistant.provider_retry_mode
        runtime_config.tools.mcp_servers = {
            **(runtime_config.tools.mcp_servers or {}),
            **(assistant.mcp_servers or {}),
        }
        self.provider = _make_provider(runtime_config)
        upload_root = service.cluster_root / "web_uploads"
        upload_root.mkdir(parents=True, exist_ok=True)
        self.context_builder = ContextBuilder(
            self.workspace,
            timezone=defaults.timezone,
            disabled_skills=assistant.disabled_skills,
            allowed_skills=assistant.enabled_skills,
            memory_store=self.memory,
        )
        self.loop = AgentLoop(
            bus=MessageBus(),
            provider=self.provider,
            workspace=self.workspace,
            model=defaults.model,
            max_iterations=defaults.max_tool_iterations,
            context_window_tokens=defaults.context_window_tokens,
            context_block_limit=defaults.context_block_limit,
            max_tool_result_chars=defaults.max_tool_result_chars,
            provider_retry_mode=defaults.provider_retry_mode,
            web_config=runtime_config.tools.web,
            exec_config=runtime_config.tools.exec,
            restrict_to_workspace=True,
            session_manager=self.sessions,
            mcp_servers=runtime_config.tools.mcp_servers,
            timezone=defaults.timezone,
            session_ttl_minutes=defaults.session_ttl_minutes,
            unified_session=False,
            disabled_skills=assistant.disabled_skills,
            allowed_skills=assistant.enabled_skills,
            memory_store=self.memory,
            context_builder=self.context_builder,
            extra_read_dirs=[upload_root],
        )
        dream_cfg = root_config.agents.defaults.dream
        if dream_cfg.model_override:
            self.loop.dream.model = dream_cfg.model_override
        self.loop.dream.max_batch_size = dream_cfg.max_batch_size
        self.loop.dream.max_iterations = dream_cfg.max_iterations
        self._apply_tool_policy(runtime_config)

#   根据 tool_names 裁剪工具权限。
    def _apply_tool_policy(self, runtime_config: Config) -> None:
        allowed = set(self.assistant.tool_names)
        if "read_file" in allowed or "list_dir" in allowed:
            allowed.add("copy_file")
        for tool_name in list(self.loop.tools.tool_names):
            if tool_name not in allowed and not tool_name.startswith("mcp_"):
                self.loop.tools.unregister(tool_name)
        if "generate_image" in allowed:
            image_model = self.assistant.image_model or ""
            provider = None
            api_base = None
            provider_name = self.assistant.image_provider or None
            if image_model:
                temp_config = runtime_config.model_copy(deep=True)
                provider_name = self.assistant.image_provider or temp_config.get_provider_name(image_model)
                if provider_name:
                    temp_config.agents.defaults.provider = provider_name
                provider = temp_config.get_provider(image_model)
                api_base = temp_config.get_api_base(image_model)
            self.loop.tools.register(
                GenerateImageTool(
                    api_key=provider.api_key if provider else None,
                    api_base=api_base,
                    provider_name=self.assistant.image_provider or provider_name,
                    model=image_model,
                    output_dir=self.workspace / "generated_images",
                )
            )

#   调用当前助手执行一次消息请求。
    async def ask(
        self,
        *,
        content: str,
        session_key: str,
        channel: str,
        chat_id: str,
        media: list[str] | None = None,
        metadata: dict[str, Any] | None = None,
        on_progress=None,
        on_stream=None,
        on_stream_end=None,
    ) -> tuple[OutboundMessage | None, list[OutboundMessage]]:
        outbound: OutboundMessage | None
        if media or metadata:
            inbound = InboundMessage(
                channel=channel,
                sender_id="user",
                chat_id=chat_id,
                content=content,
                media=media or [],
                metadata=metadata or {},
            )
            outbound = await self.loop._process_message(  # noqa: SLF001
                inbound,
                session_key=session_key,
                on_progress=on_progress,
                on_stream=on_stream,
                on_stream_end=on_stream_end,
            )
        else:
            outbound = await self.loop.process_direct(
                content=content,
                session_key=session_key,
                channel=channel,
                chat_id=chat_id,
                on_progress=on_progress,
                on_stream=on_stream,
                on_stream_end=on_stream_end,
            )

        emitted: list[OutboundMessage] = []
        while True:
            try:
                emitted.append(self.loop.bus.outbound.get_nowait())
            except asyncio.QueueEmpty:
                break
        return outbound, emitted

#   读取本轮 token 使用情况。
    def usage_snapshot(self) -> dict[str, int]:
        usage = getattr(self.loop, "_last_usage", {}) or {}
        prompt_tokens = int(usage.get("prompt_tokens", 0) or 0)
        completion_tokens = int(usage.get("completion_tokens", 0) or 0)
        total_tokens = int(usage.get("total_tokens", prompt_tokens + completion_tokens) or 0)
        return {
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens or (prompt_tokens + completion_tokens),
        }

#   关闭 MCP 等运行时资源。
    async def close(self) -> None:
        await self.loop.close_mcp()

#   多助手集群主类，统一管理助手、任务、RAG、Trace。
class AssistantCluster:
    """Owns runtimes, channel routing, and web-facing chat operations."""
#   初始化控制面数据库、任务中心、入站路由、多 Agent 协同器。
    def __init__(
        self,
        config: Config,
        *,
        config_path: Path | None = None,
        include_channels: bool = False,
    ):
        self.config = config
        self._validate_web_security(config)
        self.service = ClusterConfigService(config, config_path=config_path)
        self.control = ClusterControlStore(
            self.service.cluster_root / "control_plane.sqlite3",
            rag_config=config.cluster.rag,
        )
        self._ensure_initial_admin()
        self.metrics = ClusterMetrics()
        self.include_channels = include_channels
        self.bus = MessageBus()
        self.runtimes: dict[str, AssistantRuntime] = {}
        self.runtime_errors: dict[str, str] = {}
        self._router_task: asyncio.Task | None = None
        self._channel_task: asyncio.Task | None = None
        self._dream_task: asyncio.Task | None = None
        self._channel_manager: ChannelManager | None = None
        self._running = False
        self._pending_media: dict[str, list[str]] = {}
        self._session_locks: dict[str, asyncio.Lock] = {}
        self._worker_id = f"cluster-{uuid.uuid4().hex[:12]}"
        self.task_runner = ClusterTaskRunner(self)
        self.inbound_router = ClusterInboundRouter(self)
        self.collaborator = MultiAgentCollaborator(self)
        if self.config.cluster.web.dev_mode:
            logger.warning("Cluster web console is running in development mode; security hardening is relaxed.")
        self.reload_runtimes()

    @staticmethod
    def _validate_web_security(config: Config) -> None:
        web = config.cluster.web
        if not web.auth_enabled and not web.dev_mode:
            raise ValueError("禁止在非开发模式下关闭 Web 鉴权。请显式开启 cluster.web.dev_mode。")

    def bootstrap_required(self) -> bool:
        return not self.control.has_users()

    def _ensure_initial_admin(self) -> None:
        recovery_path = Path(__file__).resolve().parents[2] / "admin-recovery-password.txt"
        password = self.config.cluster.web.admin_password.strip()
        if not password and recovery_path.exists():
            for line in recovery_path.read_text(encoding="utf-8").splitlines():
                if line.startswith("密码："):
                    password = line.split("：", 1)[1].strip()
                    break
        if not password:
            password = secrets.token_urlsafe(24)
            recovery_path.write_text(
                (
                    "nanobot 内置 admin 恢复密码\n"
                    "用户名：admin\n"
                    f"密码：{password}\n\n"
                    "请登录后立即在用户管理中修改 admin 密码。\n"
                ),
                encoding="utf-8",
            )
            logger.warning(
                "Generated protected admin recovery password at {}",
                recovery_path,
            )
        self.control.ensure_protected_admin(password)

    def web_security_state(self) -> dict[str, Any]:
        web = self.config.cluster.web
        return {
            "auth_enabled": web.auth_enabled,
            "dev_mode": web.dev_mode,
            "bootstrap_required": self.bootstrap_required(),
            "csrf_enabled": web.csrf_enabled,
            "cookie_secure": bool(web.cookie_secure and not web.dev_mode),
            "cookie_samesite": web.cookie_samesite,
            "upload_max_file_mb": web.upload_max_file_mb,
            "upload_max_total_mb": web.upload_max_total_mb,
            "allowed_upload_extensions": list(web.allowed_upload_extensions),
            "allowed_knowledge_extensions": list(web.allowed_knowledge_extensions),
        }

#   遍历助手配置，为每个助手创建独立 AssistantRuntime。
    def reload_runtimes(self) -> None:
        #   转成列表对当前的运行时状态做了一个快照备份
        old_runtimes = list(self.runtimes.values())
        self.runtimes.clear()
        self.runtime_errors = {}
        for assistant in self.service.list_assistants():
            try:
                self.runtimes[assistant.id] = AssistantRuntime(self.config, assistant, self.service)
            except Exception as exc:
                logger.warning("Failed to initialize assistant {}: {}", assistant.id, exc)
                self.runtime_errors[assistant.id] = str(exc)
        for runtime in old_runtimes:
            with contextlib.suppress(RuntimeError):
                loop = asyncio.get_running_loop()
                loop.create_task(runtime.close())

#   返回助手状态、运行错误和 token 使用量。
    def list_assistants(self) -> list[dict[str, Any]]:
        result = []
        for assistant in self.service.list_assistants():
            payload = self.service.assistant_to_dict(assistant)
            payload["runtime_error"] = self.runtime_errors.get(assistant.id)
            payload["daily_token_usage"] = self.control.assistant_token_usage_today(assistant.id)
            result.append(payload)
        return result

    def list_assistant_versions(self, assistant_id: str) -> list[dict[str, Any]]:
        return self.service.list_assistant_versions(assistant_id)

    def list_users(self) -> list[dict[str, Any]]:
        return self.control.list_users()

    def save_user(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self.control.upsert_user(
            username=str(payload.get("username") or "").strip(),
            role=str(payload.get("role") or "viewer").strip() or "viewer",
            enabled=bool(payload.get("enabled", True)),
            password=str(payload.get("password") or "").strip() or None,
            user_id=str(payload.get("id") or "").strip() or None,
        )

    def delete_user(self, user_id: str) -> None:
        self.control.delete_user(user_id)

    def list_knowledge_documents(self) -> list[dict[str, Any]]:
        return self.control.list_knowledge_documents()

    def get_knowledge_document_detail(self, document_id: str) -> dict[str, Any] | None:
        return self.control.get_knowledge_document_detail(document_id)

#   保存知识文档并写入 Milvus。
    def save_knowledge_document(
        self,
        *,
        title: str,
        filename: str,
        content_type: str,
        text_content: str,
        assistant_scope: list[str],
        created_by: str,
    ) -> dict[str, Any]:
        return self.control.create_knowledge_document(
            title=title,
            filename=filename,
            content_type=content_type,
            text_content=text_content,
            assistant_scope=assistant_scope,
            created_by=created_by,
        )

    def delete_knowledge_document(self, document_id: str) -> None:
        self.control.delete_knowledge_document(document_id)

#   对外提供知识检索入口。
    def search_knowledge(self, query: str, assistant_id: str | None = None, limit: int = 4) -> list[dict[str, Any]]:
        return self.control.search_knowledge(query, assistant_id=assistant_id, limit=limit)

    def rag_status(self) -> dict[str, Any]:
        return self.control.get_rag_status()

    def evaluate_task_conditions(self, task: dict[str, Any]) -> dict[str, Any]:
        return self.task_runner.describe_conditions(task)

    def list_tasks(self) -> list[dict[str, Any]]:
        return [
            dict(task) | {"condition_evaluation": self.evaluate_task_conditions(task)}
            for task in self.control.list_tasks()
        ]

    def save_task(self, payload: dict[str, Any], updated_by: str) -> dict[str, Any]:
        task = self.control.upsert_task(payload, updated_by)
        return dict(task) | {"condition_evaluation": self.evaluate_task_conditions(task)}

    def delete_task(self, task_id: str) -> None:
        self.control.delete_task(task_id)

    def list_task_runs(self, task_id: str) -> list[dict[str, Any]]:
        return self.control.list_task_runs(task_id)

    def list_traces(self, limit: int = 50) -> list[dict[str, Any]]:
        return self.control.list_traces(limit)

    def get_trace(self, trace_id: str) -> dict[str, Any] | None:
        return self.control.get_trace(trace_id)

    def dashboard_summary(self) -> dict[str, Any]:
        return self.control.get_dashboard_summary()

    def _control_store(self) -> ClusterControlStore | None:
        """Return the optional control store.

        Some unit tests construct AssistantCluster via __new__ and only stub the
        fields they need. In those cases the control plane is intentionally
        absent, so runtime features that depend on it should degrade gracefully.
        """
        control = getattr(self, "control", None)
        return control if isinstance(control, ClusterControlStore) else None

    @staticmethod
    def _is_user_facing_emitted_message(msg: OutboundMessage) -> bool:
        metadata = msg.metadata or {}
        if metadata.get("_progress"):
            return False
        if metadata.get("_stream_delta") or metadata.get("_stream_end"):
            return False
        return bool((msg.content or "").strip() or (msg.media or []))

    def _collect_user_facing_emitted(self, emitted: list[OutboundMessage]) -> list[OutboundMessage]:
        return [msg for msg in emitted if self._is_user_facing_emitted_message(msg)]

    def _session_lock(self, key: str) -> asyncio.Lock:
        if not hasattr(self, "_session_locks"):
            self._session_locks = {}
        lock = self._session_locks.get(key)
        if lock is None:
            lock = asyncio.Lock()
            self._session_locks[key] = lock
        return lock

    def _collaborator(self) -> MultiAgentCollaborator:
        collaborator = getattr(self, "collaborator", None)
        if collaborator is None:
            collaborator = MultiAgentCollaborator(self)
            self.collaborator = collaborator
        return collaborator

    def _assistant_token_usage_today(self, assistant_id: str) -> int:
        if not hasattr(self, "control") or self.control is None:
            return 0
        return int(self.control.assistant_token_usage_today(assistant_id) or 0)

    def list_channel_targets(self) -> list[dict[str, str]]:
        seen: set[tuple[str, str]] = set()
        targets: list[dict[str, str]] = []
        for assistant_id, runtime in self.runtimes.items():
            for session in runtime.sessions.list_sessions():
                key = str(session.get("key") or "")
                parts = key.split(":", 2)
                if len(parts) < 3:
                    continue
                _, channel, chat_id = parts
                if channel not in {"qq", "weixin"} or not chat_id:
                    continue
                marker = (channel, chat_id)
                if marker in seen:
                    continue
                seen.add(marker)
                targets.append({
                    "channel": channel,
                    "chat_id": chat_id,
                    "assistant_id": assistant_id,
                    "updated_at": str(session.get("updated_at") or ""),
                })
        targets.sort(key=lambda item: item["updated_at"], reverse=True)
        return targets

    @staticmethod
    def _mcp_entry(
        name: str,
        server: MCPServerConfig,
        *,
        source: str,
    ) -> dict[str, Any]:
        return summarize_mcp_server(name, server, source=source)

    def list_mcp_servers(self) -> list[dict[str, Any]]:
        catalog: dict[str, dict[str, Any]] = {}

        def add_server(name: str, server: MCPServerConfig, source: str) -> None:
            entry = catalog.get(name)
            if entry is None:
                catalog[name] = self._mcp_entry(name, server, source=source)
                return
            if source not in entry["sources"]:
                entry["sources"].append(source)
            if not entry["endpoint"] and server.url:
                entry["endpoint"] = server.url.strip()
            if not entry["arguments"] and server.args:
                entry["arguments"] = " ".join(server.args).strip()
            if entry["transport"] == "unknown" and server.type:
                entry["transport"] = server.type
            merged_tools = list(dict.fromkeys([*entry["enabled_tools"], *(server.enabled_tools or [])]))
            entry["enabled_tools"] = merged_tools
            entry["tool_timeout"] = max(int(entry["tool_timeout"]), int(server.tool_timeout))
            entry["env_count"] = max(int(entry["env_count"]), len(server.env or {}))
            entry["header_count"] = max(int(entry["header_count"]), len(server.headers or {}))
            entry["valid"] = bool(entry["valid"]) and self._mcp_entry(name, server, source=source)["valid"]
            entry["issues"] = list(dict.fromkeys([*entry["issues"], *self._mcp_entry(name, server, source=source)["issues"]]))
            entry["warnings"] = list(dict.fromkeys([*entry["warnings"], *self._mcp_entry(name, server, source=source)["warnings"]]))

        for name, server in (self.config.tools.mcp_servers or {}).items():
            add_server(name, server, "全局")

        for assistant in self.service.list_assistants():
            for name, server in assistant.mcp_servers.items():
                add_server(name, server, assistant.name)

        result = list(catalog.values())
        for item in result:
            item["sources"].sort()
        result.sort(key=lambda item: item["name"].lower())
        return result

    def validate_mcp_servers(self, raw_servers: dict[str, Any] | None) -> dict[str, Any]:
        summaries, valid_servers = normalize_mcp_servers(raw_servers, source="当前助手")
        return {
            "valid": len(summaries) == len(valid_servers),
            "servers": summaries,
        }

    def resolve_default_channel_target(
        self,
        *,
        channel: str,
        assistant_id: str | None = None,
    ) -> str:
        targets = self.list_channel_targets()
        for item in targets:
            if item["channel"] != channel:
                continue
            if assistant_id and item["assistant_id"] != assistant_id:
                continue
            return item["chat_id"]
        if assistant_id:
            for item in targets:
                if item["channel"] == channel:
                    return item["chat_id"]
        guidance = f"请先从 {channel} 渠道给机器人发送一条消息，建立可回复会话后再使用同步发送。"
        if channel == "weixin":
            guidance = "请先从微信给机器人发送一条消息，建立可回复会话和上下文后再使用同步发送。"
        elif channel == "qq":
            guidance = "请先从 QQ 给机器人发送一条消息，建立可回复会话后再使用同步发送。"
        if assistant_id:
            raise ValueError(f"{assistant_id} 在 {channel} 渠道还没有绑定可发送的账号。{guidance}")
        raise ValueError(f"{channel} 渠道当前没有可用的绑定账号。{guidance}")

    def get_assistant(self, assistant_id: str) -> dict[str, Any] | None:
        assistant = self.service.get_assistant(assistant_id)
        if not assistant:
            return None
        payload = self.service.assistant_to_dict(assistant)
        payload["runtime_error"] = self.runtime_errors.get(assistant_id)
        return payload

    def save_assistant(self, payload: dict[str, Any], *, changed_by: str = "system") -> dict[str, Any]:
        validation = self.validate_mcp_servers(payload.get("mcp_servers") or {})
        if not validation["valid"]:
            issues = [
                f"{item['name']}: {'；'.join(item['issues'])}"
                for item in validation["servers"]
                if not item["valid"]
            ]
            raise ValueError("MCP 配置无效：" + " | ".join(issues))
        assistant = self.service.upsert_assistant(payload, changed_by=changed_by)
        self.reload_runtimes()
        result = self.service.assistant_to_dict(assistant)
        result["runtime_error"] = self.runtime_errors.get(assistant.id)
        result["daily_token_usage"] = self.control.assistant_token_usage_today(assistant.id)
        return result

    def delete_assistant(self, assistant_id: str) -> None:
        self.service.delete_assistant(assistant_id)
        self.reload_runtimes()

    def channel_status(self) -> dict[str, Any]:
        if not self._channel_manager:
            return {}
        return self._channel_manager.get_status()

    def _assistant_prompt_help(self) -> str:
        items = ", ".join(
            f"{assistant.id}({assistant.name})"
            for assistant in self.service.get_enabled_assistants()
        )
        return f"可用助手: {items}"

    def _assistant_switch_help(self) -> str:
        lines = [
            "可用切换口令：",
            "1. 切换到咨询助手",
            "2. 切换到生图助手",
            "3. 切换到开发助手",
            "4. 切换到投资助手",
            "5. 切换到社区助手",
            "6. 切换到写作助手",
            "7. 切换到智能专家",
            "",
            "也支持：助手 咨询、助手 开发、/switch consult、/assistant writer 帮我写一篇文案",
        ]
        return "\n".join(lines)

    @staticmethod
    def _normalize_assistant_token(value: str) -> str:
        token = re.sub(r"\s+", "", (value or "").strip()).lower()
        token = token.replace("ai", "")
        token = token.replace("助手", "")
        return token

    def _resolve_assistant_token(self, token: str) -> str | None:
        normalized = self._normalize_assistant_token(token)
        if not normalized:
            return None
        for assistant in self.service.get_enabled_assistants():
            candidates = {
                assistant.id,
                assistant.name,
                assistant.name.replace("AI ", ""),
                assistant.name.replace("AI", ""),
            }
            candidates.update(assistant.routing.aliases)
            for candidate in candidates:
                if self._normalize_assistant_token(candidate) == normalized:
                    return assistant.id
        return None

#   判断是否“只有附件、没有文字指令”。
    @staticmethod
    def _should_defer_non_text(content: str, media: list[str] | None) -> bool:
        # 附件消息没有文字指令时先挂起，避免用户只发文件/图片后 AI 立即乱答。
        if not media:
            return False
        return not AssistantCluster._extract_instruction_text(content)

    @staticmethod
    def _extract_instruction_text(content: str) -> str:
        """Return human instruction text after removing channel media markers."""
        meaningful_lines: list[str] = []
        in_received_files_block = False
        for raw_line in (content or "").splitlines():
            line = raw_line.strip()
            if not line:
                continue
            if line.lower() in {"received files:", "received file:"}:
                # QQ 等渠道会把附件列表写进正文；这些不是用户指令，不能触发模型回复。
                in_received_files_block = True
                continue
            if in_received_files_block:
                continue
            if _MEDIA_MARKER_ONLY_RE.match(line):
                continue
            meaningful_lines.append(line)
        return "\n".join(meaningful_lines).strip()

#   把无文字附件缓存到当前 session。
    def _queue_pending_media(self, key: str, media: list[str] | None) -> None:
        if not media:
            return
        # pending media 按会话隔离；同一个用户下一条文字指令会消费这些附件路径。
        bucket = self._pending_media.setdefault(key, [])
        for item in media:
            if item and item not in bucket:
                bucket.append(item)

#   用户补充文字后取出缓存附件并合并。
    def _consume_pending_media(self, key: str, media: list[str] | None = None) -> list[str]:
        combined: list[str] = []
        # pop 保证附件只被下一条明确指令消费一次，避免反复复制/分析同一个文件。
        for item in [*(self._pending_media.pop(key, [])), *(media or [])]:
            if item and item not in combined:
                combined.append(item)
        return combined

    @staticmethod
    def _merge_upload_context(content: str, media: list[str] | None) -> str:
        if not media:
            return content
        uploaded_lines = "\n".join(f"- {path}" for path in media)
        desktop = get_desktop_dir()
        # 任意格式附件走二进制文件链路：能读的再 read_file，不能读的也能 copy_file 转存。
        prefix = (
            "用户本轮上传了以下任意类型附件，可直接用 list_dir、copy_file 等工具复制或继续处理；"
            "只有文本、图片和 PDF 等可解析文件才适合用 read_file 读取内容：\n"
            f"{uploaded_lines}\n\n"
            f"如果用户要求保存到电脑桌面，请直接调用 copy_file，source_path 使用上面的本地附件路径，"
            f"destination_path 使用桌面目录：{desktop}；也可以使用“电脑桌面”作为目标目录别名。"
        )
        return f"{prefix}\n\n{content}".strip()

#   判断用户是否明确要求使用知识库。
    @staticmethod
    def _should_use_knowledge_context(content: str) -> bool:
        text = AssistantCluster._extract_instruction_text(content)
        if not text:
            return False
        if "以下是与你当前问题最相关的知识库内容" in text:
            return False

        explicit_phrases = (
            "根据知识库",
            "基于知识库",
            "依据知识库",
            "参考知识库",
            "结合知识库",
            "查询知识库",
            "检索知识库",
            "搜索知识库",
            "查知识库",
            "用知识库",
            "使用知识库",
            "从知识库",
            "当前知识库",
            "知识库资料",
            "知识库内容",
            "根据文档",
            "基于文档",
            "依据文档",
            "参考文档",
            "结合文档",
            "根据资料",
            "基于资料",
            "依据资料",
            "参考资料",
            "结合资料",
            "基于RAG",
            "根据RAG",
            "使用RAG",
            "RAG回答",
        )
        if any(phrase in text for phrase in explicit_phrases):
            return True
        #   组合模式匹配,解决简单关键词匹配的误触发问题。
        knowledge_terms = ("知识库", "知识文档", "资料库", "上传的文档", "上传的资料")
        use_verbs = ("根据", "基于", "依据", "参考", "结合", "查询", "检索", "搜索", "查找", "查一下", "用", "使用", "读取", "调用", "引用")
        answer_verbs = ("告诉", "回答", "整理", "总结", "摘要", "引用", "找出", "列出", "提取")

        for term in knowledge_terms:
            pos = text.find(term)
            while pos >= 0:
                before = text[max(0, pos - 12):pos]
                after = text[pos + len(term):pos + len(term) + 12]
                if any(verb in before for verb in use_verbs) or any(verb in after for verb in answer_verbs):
                    return True
                pos = text.find(term, pos + len(term))
        return False

#   检索知识片段并拼接到用户问题前。
    def _merge_knowledge_context(self, assistant_id: str, content: str) -> tuple[str, list[dict[str, Any]]]:
        if assistant_id == "image":
            return content, []
        if not self._should_use_knowledge_context(content):
            return content, []
        if not self._control_store():
            return content, []
        hits = self.search_knowledge(content, assistant_id=assistant_id, limit=4)
        if not hits:
            return content, []
        lines = []
        for index, hit in enumerate(hits, start=1):
            retrieval = "/".join(hit.get("retrieval") or []) or "keyword"
            lines.append(
                f"[知识片段 {index} | {hit['title']} | 召回: {retrieval} | score={float(hit.get('score', 0.0)):.3f}]\n{hit['content']}"
            )
        prefix = "以下是与你当前问题最相关的知识库内容，请优先基于这些资料回答，并在结论中自然引用来源标题：\n\n" + "\n\n".join(lines)
        return f"{prefix}\n\n用户问题：\n{content}".strip(), hits

    def _record_trace_events(self, trace_id: str, emitted: list[OutboundMessage]) -> None:
        control = self._control_store()
        if not control:
            return
        for msg in emitted:
            metadata = msg.metadata or {}
            if metadata.get("_tool_hint"):
                control.add_trace_event(trace_id, "tool_hint", msg.content, metadata)
            elif metadata.get("_progress"):
                control.add_trace_event(trace_id, "progress", msg.content, metadata)
            elif metadata.get("_stream_delta") or metadata.get("_stream_end"):
                continue
            elif (msg.content or "").strip() or (msg.media or []):
                control.add_trace_event(
                    trace_id,
                    "message",
                    msg.content or "",
                    {"media": list(msg.media or []), **metadata},
                )

    @staticmethod
    def _extract_image_paths(content: str) -> list[str]:
        seen: set[str] = set()
        images: list[str] = []
        for raw_line in content.splitlines():
            line = raw_line.strip()
            if not line:
                continue
            normalized = line[2:].strip() if line.startswith("- ") else line
            candidate = Path(normalized)
            if candidate.is_file() and candidate.suffix.lower() in _IMAGE_SUFFIXES:
                resolved = str(candidate.resolve())
                if resolved not in seen:
                    seen.add(resolved)
                    images.append(resolved)
        return images

    @staticmethod
    def _extract_remote_images(content: str) -> list[str]:
        seen: set[str] = set()
        images: list[str] = []
        for match in _REMOTE_IMAGE_RE.findall(content):
            if match not in seen:
                seen.add(match)
                images.append(match)
        return images

    @staticmethod
    def _local_image_to_url(path: str) -> str:
        return f"/api/files?path={quote(path)}"

    def _auto_route_assistant(self, content: str) -> str:
        lowered = content.lower()
        scores: list[tuple[int, str]] = []
        for assistant in self.service.get_enabled_assistants():
            score = 0
            for alias in assistant.routing.aliases:
                if alias.lower() in lowered:
                    score += 3
            for keyword in assistant.routing.keywords:
                if keyword.lower() in lowered:
                    score += 2
            if "```" in content and assistant.id == "developer":
                score += 3
            if any(token in lowered for token in ("图片", "海报", "插画", "banner")) and assistant.id == "image":
                score += 4
            if score > 0:
                scores.append((score, assistant.id))
        if scores:
            scores.sort(key=lambda item: (-item[0], item[1]))
            return scores[0][1]
        return self.service.get_default_assistant_id()

#   根据前端选择、会话绑定和关键词选择目标助手。
    def route_request(
        self,
        *,
        content: str,
        channel: str,
        chat_id: str,
        preferred_assistant_id: str | None = None,
    ) -> RoutedRequest:
        text = content.strip()
        if preferred_assistant_id:
            return RoutedRequest(preferred_assistant_id, text)

        if _PASSCODE_HELP_RE.match(text):
            return RoutedRequest(
                self.service.get_default_assistant_id(),
                self._assistant_switch_help(),
                direct_response=True,
            )

        if match := _SWITCH_RE.match(text):
            assistant_id = match.group(1)
            if self.service.get_assistant(assistant_id) is None:
                return RoutedRequest(
                    self.service.get_default_assistant_id(),
                    f"无效助手 ID: {assistant_id}\n\n{self._assistant_prompt_help()}",
                    direct_response=True,
                )
            self.service.set_binding(channel, chat_id, assistant_id)
            return RoutedRequest(
                assistant_id,
                f"已切换到 {assistant_id}。后续消息默认由该助手处理。\n\n{self._assistant_prompt_help()}",
                changed_binding=True,
                direct_response=True,
            )

        if match := _SWITCH_PHRASE_RE.match(text):
            assistant_token = match.group(1)
            assistant_id = self._resolve_assistant_token(assistant_token)
            if assistant_id is None:
                return RoutedRequest(
                    self.service.get_default_assistant_id(),
                    f"无法识别要切换的助手：{assistant_token}\n\n{self._assistant_switch_help()}",
                    direct_response=True,
                )
            self.service.set_binding(channel, chat_id, assistant_id)
            assistant = self.service.get_assistant(assistant_id)
            return RoutedRequest(
                assistant_id,
                f"已切换到 {assistant.name if assistant else assistant_id}。后续消息默认由该助手处理。\n\n{self._assistant_switch_help()}",
                changed_binding=True,
                direct_response=True,
            )

        if match := _SWITCH_SHORT_RE.match(text):
            assistant_token = match.group(1)
            assistant_id = self._resolve_assistant_token(assistant_token)
            if assistant_id is not None:
                self.service.set_binding(channel, chat_id, assistant_id)
                assistant = self.service.get_assistant(assistant_id)
                return RoutedRequest(
                    assistant_id,
                    f"已切换到 {assistant.name if assistant else assistant_id}。后续消息默认由该助手处理。\n\n{self._assistant_switch_help()}",
                    changed_binding=True,
                    direct_response=True,
                )

        if match := _ASSISTANT_RE.match(text):
            assistant_id = match.group(1)
            if self.service.get_assistant(assistant_id) is None:
                return RoutedRequest(
                    self.service.get_default_assistant_id(),
                    f"无效助手 ID: {assistant_id}\n\n{self._assistant_prompt_help()}",
                    direct_response=True,
                )
            message = match.group(2).strip() or "请先介绍你的能力边界和使用方式。"
            self.service.set_binding(channel, chat_id, assistant_id)
            return RoutedRequest(assistant_id, message, changed_binding=True)

        bound = self.service.get_binding(channel, chat_id)
        if bound and self.service.get_assistant(bound):
            return RoutedRequest(bound, text)

        if self.config.cluster.auto_route:
            return RoutedRequest(self._auto_route_assistant(text), text)
        return RoutedRequest(self.service.get_default_assistant_id(), text)

#   对同一 session 加锁，避免并发消息打乱上下文。
    async def chat(
        self,
        *,
        assistant_id: str | None,
        content: str,
        session_id: str,
        channel: str = "web",
        media: list[str] | None = None,
        chat_id: str = "web",
        collaboration_mode: str | None = None,
    ) -> dict[str, Any]:
        #   实现了细粒度的异步会话锁
        async with self._session_lock(f"{channel}:{session_id}"):
            return await self._chat_unlocked(
                assistant_id=assistant_id,
                content=content,
                session_id=session_id,
                channel=channel,
                chat_id=chat_id,
                media=media,
                collaboration_mode=collaboration_mode,
            )

#   串联一次请求：附件处理、路由、RAG、协同、Trace、回答。
    async def _chat_unlocked(
        self,
        *,
        assistant_id: str | None,
        content: str,
        session_id: str,
        channel: str = "web",
        chat_id: str = "web",
        media: list[str] | None = None,
        collaboration_mode: str | None = None,
    ) -> dict[str, Any]:
        #    媒体文件延迟处理，解决大文件上传慢导致用户长时间等待的问题
        defer_key = f"{channel}:{session_id}"
        if self._should_defer_non_text(content, media):
            self._queue_pending_media(defer_key, media)
            return {
                "assistant_id": assistant_id,
                "assistant_name": None,
                "content": "",
                "changed_binding": False,
                "deferred": True,
                "media": [],
            }
        #   请求智能路由，实现智能助手分配，让最合适的助手处理用户请求
        route = self.route_request(
            content=content,
            channel=channel,
            chat_id=chat_id,
            preferred_assistant_id=assistant_id,
        )
        if route.direct_response:
            assistant = self.service.get_assistant(route.assistant_id)
            return {
                "assistant_id": route.assistant_id,
                "assistant_name": assistant.name if assistant else route.assistant_id,
                "content": route.content,
                "changed_binding": route.changed_binding,
                "content_style": detect_response_style(route.content),
            }
        #   助手可用性与配额检查，在调用大模型之前进行前置检查，避免无效调用和资源浪费
        runtime = self.runtimes.get(route.assistant_id)
        if runtime is None:
            reason = self.runtime_errors.get(route.assistant_id)
            if reason:
                raise ValueError(f"Assistant {route.assistant_id} 无法启动: {reason}")
            raise ValueError(f"Assistant not found: {route.assistant_id}")
        if not runtime.assistant.enabled:
            raise ValueError(f"Assistant is disabled: {route.assistant_id}")
        daily_token_limit = getattr(runtime.assistant, "daily_token_limit", None)
        daily_token_usage = self._assistant_token_usage_today(route.assistant_id)
        if daily_token_limit and daily_token_usage >= daily_token_limit:
            raise ValueError(
                f"Assistant {route.assistant_id} 已达到今日 token 配额上限："
                f"{daily_token_usage}/{daily_token_limit}"
            )
        #   上下文合并，将用户输入、媒体文件、知识库内容合并成最终的 prompt，传给大模型
        effective_media = self._consume_pending_media(defer_key, media)
        effective_content = self._merge_upload_context(route.content, effective_media)
        effective_content, knowledge_hits = self._merge_knowledge_context(route.assistant_id, effective_content)
        #   全链路追踪初始化，实现全链路可观测性，方便监控、排查问题和数据分析
        control = self._control_store()
        trace_id = (
            control.create_trace(
                session_id=session_id,
                channel=channel,
                chat_id=chat_id,
                assistant_id=route.assistant_id,
                request_content=content,
            )
            if control else None
        )
        if control and trace_id:
            for hit in knowledge_hits:
                control.add_trace_event(
                    trace_id,
                    "knowledge_hit",
                    hit["content"],
                    {
                        "title": hit["title"],
                        "filename": hit["filename"],
                        "score": hit["score"],
                        "lexical_score": hit.get("lexical_score", 0.0),
                        "vector_score": hit.get("vector_score", 0.0),
                        "retrieval": hit.get("retrieval", []),
                    },
                )
        #   多助手协作模式处理，支持多助手协同工作，解决复杂任务
        collaborator = self._collaborator()
        if collaborator.should_collaborate(
            assistant_id=route.assistant_id,
            content=effective_content,
            media=effective_media,
            mode_override=collaboration_mode,
        ):
            try:
                result = await collaborator.execute(
                    route_assistant_id=route.assistant_id,
                    content=effective_content,
                    session_id=session_id,
                    channel=channel,
                    chat_id=chat_id,
                    trace_id=trace_id,
                )
            except asyncio.CancelledError:
                # 前端暂停会取消协作 task；Trace 标记 cancelled，方便区分用户取消和模型失败。
                if control and trace_id:
                    control.finalize_trace(
                        trace_id,
                        response_content="",
                        response_style="chat",
                        media_count=0,
                        status="cancelled",
                        error_message="用户暂停生成",
                        prompt_tokens=0,
                        completion_tokens=0,
                        total_tokens=0,
                    )
                raise
            except Exception as exc:
                if control and trace_id:
                    control.finalize_trace(
                        trace_id,
                        response_content="",
                        response_style="chat",
                        media_count=0,
                        status="failed",
                        error_message=str(exc),
                        prompt_tokens=0,
                        completion_tokens=0,
                        total_tokens=0,
                    )
                raise
            result["changed_binding"] = route.changed_binding
            result["quota"] = {
                "daily_token_limit": daily_token_limit,
                "daily_token_usage": daily_token_usage + int(result["usage"]["total_tokens"] or 0),
            }
            if control and trace_id:
                control.finalize_trace(
                    trace_id,
                    response_content=result["content"],
                    response_style=result["content_style"],
                    media_count=len(result.get("media") or []),
                    status="completed",
                    prompt_tokens=int(result["usage"]["prompt_tokens"] or 0),
                    completion_tokens=int(result["usage"]["completion_tokens"] or 0),
                    total_tokens=int(result["usage"]["total_tokens"] or 0),
                )
            return result
        #   单助手模式处理（默认模式），处理普通单助手聊天请求（90% 以上的请求会走这个分支）
        try:
            outbound, emitted = await runtime.ask(
                content=effective_content,
                session_key=f"{route.assistant_id}:{session_id}",
                channel=channel,
                chat_id=chat_id,
                media=effective_media,
            )
        except asyncio.CancelledError:
            # 单助手生成也响应同一套暂停机制，避免模型/工具循环继续占用资源。
            if control and trace_id:
                control.finalize_trace(
                    trace_id,
                    response_content="",
                    response_style="chat",
                    media_count=0,
                    status="cancelled",
                    error_message="用户暂停生成",
                    prompt_tokens=0,
                    completion_tokens=0,
                    total_tokens=0,
                )
            raise
        except Exception as exc:
            if control and trace_id:
                control.finalize_trace(
                    trace_id,
                    response_content="",
                    response_style="chat",
                    media_count=0,
                    status="failed",
                    error_message=str(exc),
                    prompt_tokens=0,
                    completion_tokens=0,
                    total_tokens=0,
                )
            raise
        #   结果处理与格式化，将模型的原始输出统一格式化为前端需要的结构
        usage = runtime.usage_snapshot()
        response_text = outbound.content if outbound else ""
        user_emitted = self._collect_user_facing_emitted(emitted)
        if trace_id:
            self._record_trace_events(trace_id, emitted)
        emitted_content = "\n\n".join(
            msg.content.strip()
            for msg in user_emitted
            if msg.content and msg.content.strip()
        ).strip()
        local_images = [
            *self._extract_image_paths(response_text),
            *[
                path
                for msg in user_emitted
                for path in (msg.media or [])
                if Path(path).suffix.lower() in _IMAGE_SUFFIXES
            ],
        ]
        dedup_local_images = list(dict.fromkeys(local_images))
        remote_images = self._extract_remote_images(response_text)
        final_content = emitted_content or response_text
        citations = [
            {
                "document_id": hit.get("document_id"),
                "title": hit.get("title"),
                "filename": hit.get("filename"),
                "score": hit.get("score"),
                "retrieval": hit.get("retrieval", []),
            }
            for hit in knowledge_hits
        ]
        if control and trace_id:
            control.finalize_trace(
                trace_id,
                response_content=final_content,
                response_style=detect_response_style(final_content),
                media_count=len(dedup_local_images) + len(remote_images),
                status="completed",
                prompt_tokens=usage["prompt_tokens"],
                completion_tokens=usage["completion_tokens"],
                total_tokens=usage["total_tokens"],
            )
        return {
            "assistant_id": route.assistant_id,
            "assistant_name": runtime.assistant.name,
            "content": final_content,
            "changed_binding": route.changed_binding,
            "deferred": False,
            "content_style": detect_response_style(final_content),
            "citations": citations,
            "quota": {
                "daily_token_limit": daily_token_limit,
                "daily_token_usage": daily_token_usage + usage["total_tokens"],
            },
            "media": [
                *[
                    {"type": "image", "path": path, "url": self._local_image_to_url(path)}
                    for path in dedup_local_images
                ],
                *[
                    {"type": "image", "path": url, "url": url}
                    for url in remote_images
                ],
            ],
            "usage": usage,
        }

    async def send_channel_message(
        self,
        *,
        channel: str,
        chat_id: str,
        assistant_id: str | None = None,
        content: str,
        media: list[str] | None = None,
    ) -> dict[str, Any]:
        if not self._channel_manager:
            raise ValueError("渠道发送尚未启动，请使用 --with-channels 启动集群服务。")
        if channel not in self._channel_manager.enabled_channels:
            raise ValueError(f"渠道未启用或不可用: {channel}")
        if not content.strip() and not media:
            raise ValueError("发送内容不能为空。")
        resolved_chat_id = chat_id.strip() or self.resolve_default_channel_target(
            channel=channel,
            assistant_id=assistant_id,
        )

        outbound = OutboundMessage(
            channel=channel,
            chat_id=resolved_chat_id,
            content=content.strip(),
            media=media or [],
        )
        await self._channel_manager.send_now(outbound)
        return {
            "status": "sent",
            "channel": channel,
            "chat_id": resolved_chat_id,
            "content": content.strip(),
            "media_count": len(media or []),
        }

    async def execute_task(self, task_id: str) -> dict[str, Any]:
        return await self.task_runner.execute_task(task_id)

    async def run_due_tasks(
        self,
        *,
        worker_id: str | None = None,
        lease_seconds: int = 900,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        return await self.task_runner.run_due_tasks(
            worker_id=worker_id,
            lease_seconds=lease_seconds,
            limit=limit,
        )

    async def _route_inbound_bus(self) -> None:
        if not hasattr(self, "inbound_router") or self.inbound_router is None:
            self.inbound_router = ClusterInboundRouter(self)
        await self.inbound_router.route_bus()

    async def _run_dream_once(self) -> None:
        for assistant_id, runtime in list(self.runtimes.items()):
            if not runtime.assistant.enabled:
                continue
            try:
                changed = await runtime.loop.dream.run()
                if changed:
                    logger.info("Dream memory consolidation completed for assistant {}", assistant_id)
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("Dream memory consolidation failed for assistant {}", assistant_id)

    async def _dream_scheduler(self) -> None:
        dream_cfg = self.config.agents.defaults.dream
        interval_seconds = max(60, int(dream_cfg.interval_h) * 3600)
        initial_delay = int(os.environ.get("NANOBOT_CLUSTER_DREAM_INITIAL_DELAY_SECONDS", "60"))
        if initial_delay > 0:
            await asyncio.sleep(initial_delay)
        while self._running:
            await self._run_dream_once()
            await asyncio.sleep(interval_seconds)

    async def start(self) -> None:
        self._running = True
        self._router_task = asyncio.create_task(self._route_inbound_bus())
        if self._dream_task is None:
            self._dream_task = asyncio.create_task(self._dream_scheduler())
        if self.include_channels:
            self._channel_manager = ChannelManager(self.config, self.bus)
            self._channel_task = asyncio.create_task(self._channel_manager.start_all())

    async def stop(self) -> None:
        self._running = False
        if self._dream_task:
            self._dream_task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._dream_task
            self._dream_task = None
        if self._router_task:
            self._router_task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._router_task
            self._router_task = None
        if self._channel_manager:
            await self._channel_manager.stop_all()
            self._channel_manager = None
        if self._channel_task:
            self._channel_task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._channel_task
            self._channel_task = None
        for runtime in self.runtimes.values():
            with contextlib.suppress(Exception):
                await runtime.close()
        control = self._control_store()
        if control:
            with contextlib.suppress(Exception):
                control.close()
        logger.info("Assistant cluster stopped")
