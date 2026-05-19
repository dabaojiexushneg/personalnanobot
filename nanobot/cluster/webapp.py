"""FastAPI management console for the nanobot assistant cluster."""

from __future__ import annotations

import asyncio
import contextlib
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import hashlib
from pathlib import Path
import re
from typing import Any

from fastapi import Cookie, Depends, FastAPI, File, Form, Header, HTTPException, Query, Request, Response, UploadFile
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger
from pydantic import BaseModel, Field

from nanobot.cluster.mcp import probe_mcp_servers
from nanobot.cluster.rag import get_available_rag_libraries
from nanobot.cluster.security import cookie_settings
from nanobot.cluster.runtime import AssistantCluster
from nanobot.cluster.uploads import enforce_knowledge_text_limit, extract_text_from_bytes, persist_uploads

class ChatRequest(BaseModel):
    """Chat request payload."""

    assistant_id: str | None = None
    content: str
    session_id: str = "web:default"
    channel: str = "web"
    chat_id: str = "web"
    uploaded_paths: list[str] = Field(default_factory=list)
    sync_enabled: bool = False
    sync_channel: str = ""


class ChatStopRequest(BaseModel):
    """Stop an in-flight chat request for the current web session."""

    session_id: str = "web:default"
    channel: str = "web"


class ChannelSendRequest(BaseModel):
    """Direct channel-send payload from the management UI."""

    channel: str
    assistant_id: str | None = None
    chat_id: str = ""
    content: str = ""
    uploaded_paths: list[str] = Field(default_factory=list)


class LoginRequest(BaseModel):
    username: str
    password: str


class BootstrapRequest(BaseModel):
    username: str
    password: str


class UserPayload(BaseModel):
    id: str | None = None
    username: str
    password: str | None = None
    role: str = "viewer"
    enabled: bool = True


class KnowledgeSearchRequest(BaseModel):
    query: str
    assistant_id: str | None = None
    limit: int = 4


class TaskPayload(BaseModel):
    id: str | None = None
    name: str
    assistant_id: str
    prompt: str
    task_kind: str = "generic"
    collaboration_mode: str = "inherit"
    schedule_kind: str = "manual"
    cron_expression: str = ""
    interval_minutes: int = 0
    enabled: bool = True
    require_rag_connected: bool = False
    require_channel_online: bool = False
    min_success_gap_minutes: int = 0
    max_retries: int = 0
    retry_backoff_seconds: int = 60
    target_channel: str = ""
    target_chat_id: str = ""


class AssistantPayload(BaseModel):
    """Assistant management payload."""

    id: str
    name: str
    enabled: bool = True
    description: str = ""
    persona_prompt: str = ""
    provider: str = "auto"
    model: str = ""
    image_provider: str | None = None
    image_model: str | None = None
    workspace: str = ""
    tool_names: list[str] = Field(default_factory=list)
    enabled_skills: list[str] = Field(default_factory=list)
    disabled_skills: list[str] = Field(default_factory=list)
    max_tokens: int | None = None
    temperature: float | None = None
    reasoning_effort: str | None = None
    max_tool_iterations: int | None = None
    context_window_tokens: int | None = None
    max_tool_result_chars: int | None = None
    provider_retry_mode: str | None = None
    prompt_version: int = 1
    prompt_updated_at: str | None = None
    prompt_change_note: str = ""
    daily_token_limit: int | None = None
    mcp_servers: dict[str, Any] = Field(default_factory=dict)
    routing: dict[str, Any] = Field(default_factory=dict)


class MCPValidateRequest(BaseModel):
    mcp_servers: dict[str, Any] = Field(default_factory=dict)


def _web_root() -> Path:
    return Path(__file__).resolve().parents[2] / "web"


def _upload_root(cluster: AssistantCluster) -> Path:
    path = cluster.service.cluster_root / "web_uploads"
    path.mkdir(parents=True, exist_ok=True)
    return path


def _safe_session_fragment(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_.-]+", "_", value.strip())
    return cleaned or "web_default"


def _allowed_file_roots(cluster: AssistantCluster) -> list[Path]:
    roots = {cluster.service.cluster_root.resolve()}
    for assistant in cluster.service.list_assistants():
        roots.add(cluster.service.assistant_workspace(assistant).resolve())
    return list(roots)


def _ensure_allowed_path(cluster: AssistantCluster, raw_path: str) -> Path:
    target = Path(raw_path).expanduser().resolve()
    for root in _allowed_file_roots(cluster):
        with_root = False
        try:
            target.relative_to(root)
            with_root = True
        except ValueError:
            with_root = False
        if with_root:
            return target
    raise HTTPException(status_code=403, detail="File access denied")


def _knowledge_upload_root(cluster: AssistantCluster) -> Path:
    path = cluster.service.cluster_root / "knowledge_uploads"
    path.mkdir(parents=True, exist_ok=True)
    return path


def create_cluster_app(cluster: AssistantCluster) -> FastAPI:
    """Create the FastAPI application bound to a live cluster instance."""

    auth_cookie = "nb_session"
    csrf_header = "X-CSRF-Token"
    role_levels = cluster.control.ROLE_LEVELS
    cookies = cookie_settings(cluster.config.cluster.web)

    def _security_state() -> dict[str, Any]:
        return cluster.web_security_state() | {"metrics": cluster.metrics.snapshot()}

    def _role_at_least(role: str, minimum: str) -> bool:
        return role_levels.get(role, 0) >= role_levels.get(minimum, 0)

    async def _current_user(session_token: str | None = Cookie(default=None, alias=auth_cookie)) -> dict[str, Any]:
        if not cluster.config.cluster.web.auth_enabled and cluster.config.cluster.web.dev_mode:
            return {"id": "system", "username": "system", "role": "admin", "enabled": True}
        if not session_token:
            raise HTTPException(status_code=401, detail="请先登录")
        user = cluster.control.get_session_user(session_token)
        if not user:
            raise HTTPException(status_code=401, detail="登录状态已失效，请重新登录")
        return user

    def _require_role(minimum: str):
        async def _dep(user: dict[str, Any] = Depends(_current_user)) -> dict[str, Any]:
            if not _role_at_least(user["role"], minimum):
                raise HTTPException(status_code=403, detail="权限不足")
            return user
        return _dep

    def _require_write_role(minimum: str):
        async def _dep(
            request: Request,
            user: dict[str, Any] = Depends(_current_user),
            session_token: str | None = Cookie(default=None, alias=auth_cookie),
            csrf_token: str | None = Header(default=None, alias=csrf_header),
        ) -> dict[str, Any]:
            if not _role_at_least(user["role"], minimum):
                raise HTTPException(status_code=403, detail="权限不足")
            if cluster.config.cluster.web.auth_enabled and cluster.config.cluster.web.csrf_enabled:
                if not session_token or not csrf_token or not cluster.control.validate_csrf(session_token, csrf_token):
                    cluster.metrics.inc("csrf_rejected_total")
                    raise HTTPException(status_code=403, detail="CSRF 校验失败")
            return user
        return _dep

    async def _task_scheduler() -> None:
        while True:
            try:
                await cluster.run_due_tasks()
            except Exception:
                cluster.metrics.inc("task_scheduler_failures_total")
                logger.exception("Background task scheduler failed")
            await asyncio.sleep(15)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        await cluster.start()
        scheduler_task = asyncio.create_task(_task_scheduler())
        try:
            yield
        finally:
            scheduler_task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await scheduler_task
            await cluster.stop()

    app = FastAPI(title=cluster.config.cluster.web.title, lifespan=lifespan)
    web_root = _web_root()
    app.mount("/assets", StaticFiles(directory=web_root), name="assets")
    active_chat_tasks: dict[str, asyncio.Task[dict[str, Any]]] = {}

    def _active_chat_key(channel: str, session_id: str) -> str:
        return f"{channel.strip() or 'web'}:{session_id.strip() or 'web:default'}"

    def _rag_status_fallback(reason: str) -> dict[str, Any]:
        return {
            "backend": "milvus",
            "available": False,
            "connected": False,
            "collection_name": cluster.config.cluster.rag.collection_name,
            "embedding_model": cluster.config.cluster.rag.embedding_model,
            "vector_dimension": 384,
            "bm25_available": False,
            "uri": cluster.config.cluster.rag.uri,
            "libraries": get_available_rag_libraries(),
            "knowledge_docs": 0,
            "knowledge_chunks": 0,
            "last_error": reason,
        }

    async def _to_thread_or_fallback(
        label: str,
        func,
        *,
        timeout_seconds: float = 2.5,
        fallback: Any,
    ) -> Any:
        try:
            return await asyncio.wait_for(asyncio.to_thread(func), timeout=timeout_seconds)
        except asyncio.TimeoutError:
            logger.warning("{} timed out after {}s", label, timeout_seconds)
            return fallback
        except Exception as exc:
            logger.warning("{} failed: {}", label, exc)
            return fallback

    def _dashboard_fallback() -> dict[str, int]:
        return {
            "traces_total": 0,
            "traces_failed": 0,
            "avg_duration_ms": 0,
            "trace_total_tokens": 0,
            "tasks_total": 0,
            "tasks_enabled": 0,
            "knowledge_docs": 0,
            "knowledge_chunks": 0,
        }

    def _daily_token_usage_fallback(days: int = 14) -> list[dict[str, int | str]]:
        return [
            {
                "date": (datetime.now().astimezone().date() - timedelta(days=offset)).isoformat(),
                "trace_count": 0,
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0,
            }
            for offset in reversed(range(days))
        ]

    @app.get("/api/health")
    async def health() -> dict[str, Any]:
        return {"status": "ok", **_security_state()}

    @app.get("/metrics")
    async def metrics() -> PlainTextResponse:
        return PlainTextResponse(cluster.metrics.render_prometheus())

    @app.get("/api/auth/bootstrap-status")
    async def bootstrap_status() -> dict[str, Any]:
        return {
            "bootstrap_required": cluster.bootstrap_required(),
            "dev_mode": cluster.config.cluster.web.dev_mode,
            "auth_enabled": cluster.config.cluster.web.auth_enabled,
        }

    @app.post("/api/auth/bootstrap")
    async def bootstrap(
        request: BootstrapRequest,
        response: Response,
    ) -> dict[str, Any]:
        if not cluster.bootstrap_required():
            raise HTTPException(status_code=409, detail="管理员已初始化")
        if len(request.password.strip()) < 12:
            raise HTTPException(status_code=400, detail="管理员密码至少需要 12 位")
        try:
            user = cluster.control.bootstrap_admin(request.username.strip(), request.password)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        token, csrf_token = cluster.control.create_session(user["id"], cluster.config.cluster.web.session_ttl_minutes)
        response.set_cookie(
            auth_cookie,
            token,
            httponly=True,
            secure=cookies.secure,
            samesite=cookies.samesite,
            path=cookies.path,
            max_age=cluster.config.cluster.web.session_ttl_minutes * 60,
        )
        cluster.metrics.inc("auth_bootstrap_total")
        logger.bind(username=user["username"]).info("Cluster admin bootstrapped")
        return {"user": user, "csrf_token": csrf_token, "security": cluster.web_security_state()}

    @app.post("/api/auth/login")
    async def login(request: LoginRequest, response: Response) -> dict[str, Any]:
        if cluster.bootstrap_required():
            raise HTTPException(status_code=409, detail="请先初始化管理员账号")
        user = cluster.control.authenticate_user(request.username.strip(), request.password)
        if not user:
            cluster.metrics.inc("auth_login_failures_total")
            raise HTTPException(status_code=401, detail="用户名或密码错误")
        token, csrf_token = cluster.control.create_session(user["id"], cluster.config.cluster.web.session_ttl_minutes)
        response.set_cookie(
            auth_cookie,
            token,
            httponly=True,
            secure=cookies.secure,
            samesite=cookies.samesite,
            path=cookies.path,
            max_age=cluster.config.cluster.web.session_ttl_minutes * 60,
        )
        cluster.metrics.inc("auth_login_success_total")
        logger.bind(username=user["username"]).info("Cluster user logged in")
        return {"user": user, "csrf_token": csrf_token, "security": cluster.web_security_state()}

    @app.post("/api/auth/logout")
    async def logout(
        response: Response,
        session_token: str | None = Cookie(default=None, alias=auth_cookie),
    ) -> dict[str, str]:
        user = cluster.control.get_session_user(session_token) if session_token else None
        if session_token:
            cluster.control.delete_session(session_token)
        cluster.metrics.inc("auth_logout_total")
        logger.bind(username=(user or {}).get("username", "unknown")).info("Cluster user logged out")
        response.delete_cookie(auth_cookie, path=cookies.path)
        return {"status": "ok"}

    @app.get("/api/auth/me")
    async def me(user: dict[str, Any] = Depends(_current_user)) -> dict[str, Any]:
        return {"user": user, "csrf_token": user.get("csrf_token", ""), "security": cluster.web_security_state()}

    @app.get("/api/overview")
    async def overview(user: dict[str, Any] = Depends(_require_role("viewer"))) -> dict[str, Any]:
        dashboard = await _to_thread_or_fallback(
            "dashboard summary",
            cluster.dashboard_summary,
            fallback=_dashboard_fallback(),
        )
        return {
            "default_assistant_id": cluster.service.get_default_assistant_id(),
            "started_assistant_id": cluster.service.get_last_active_assistant_id()
            or cluster.service.get_default_assistant_id(),
            "assistants": cluster.list_assistants(),
            "channels": cluster.channel_status(),
            "channel_targets": cluster.list_channel_targets(),
            "mcp_servers": cluster.list_mcp_servers(),
            "skills": cluster.service.available_skills(),
            "dashboard": dashboard,
            "user": user,
            "security": cluster.web_security_state(),
            "metrics": cluster.metrics.snapshot(),
        }

    @app.get("/api/token-usage/daily")
    async def daily_token_usage(
        days: int = Query(default=14, ge=1, le=90),
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> list[dict[str, Any]]:
        return await _to_thread_or_fallback(
            "daily token usage",
            lambda: cluster.daily_token_usage(days),
            fallback=_daily_token_usage_fallback(days),
        )

    @app.get("/api/assistants")
    async def list_assistants(user: dict[str, Any] = Depends(_require_role("viewer"))) -> list[dict[str, Any]]:
        return cluster.list_assistants()

    @app.post("/api/mcp/validate")
    async def validate_mcp(
        payload: MCPValidateRequest,
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, Any]:
        return cluster.validate_mcp_servers(payload.mcp_servers)

    @app.post("/api/mcp/probe")
    async def probe_mcp(
        payload: MCPValidateRequest,
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, Any]:
        return await probe_mcp_servers(payload.mcp_servers, source="当前助手")

    @app.get("/api/assistants/{assistant_id}")
    async def get_assistant(assistant_id: str, user: dict[str, Any] = Depends(_require_role("viewer"))) -> dict[str, Any]:
        assistant = cluster.get_assistant(assistant_id)
        if assistant is None:
            raise HTTPException(status_code=404, detail="Assistant not found")
        assistant_config = cluster.service.get_assistant(assistant_id)
        return {
            **assistant,
            "skills_catalog": cluster.service.available_skills(assistant_config),
        }

    @app.get("/api/assistants/{assistant_id}/versions")
    async def assistant_versions(
        assistant_id: str,
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> list[dict[str, Any]]:
        return cluster.list_assistant_versions(assistant_id)

    @app.post("/api/assistants")
    async def create_or_update_assistant(
        payload: AssistantPayload,
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, Any]:
        try:
            return cluster.save_assistant(payload.model_dump(), changed_by=user["username"])
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.put("/api/assistants/{assistant_id}")
    async def update_assistant(
        assistant_id: str,
        payload: AssistantPayload,
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, Any]:
        body = payload.model_dump()
        body["id"] = assistant_id
        try:
            return cluster.save_assistant(body, changed_by=user["username"])
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.delete("/api/assistants/{assistant_id}")
    async def delete_assistant(
        assistant_id: str,
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, str]:
        try:
            cluster.delete_assistant(assistant_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return {"status": "deleted"}

    @app.get("/api/channels")
    async def channels(user: dict[str, Any] = Depends(_require_role("viewer"))) -> dict[str, Any]:
        return cluster.channel_status()

    @app.get("/api/skills")
    async def skills(user: dict[str, Any] = Depends(_require_role("viewer"))) -> list[dict[str, str]]:
        return cluster.service.available_skills()

    @app.get("/api/rag/libraries")
    async def rag_libraries(
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> list[dict[str, str | bool]]:
        return get_available_rag_libraries()

    @app.get("/api/rag/status")
    async def rag_status(
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> dict[str, Any]:
        return await _to_thread_or_fallback(
            "rag status",
            cluster.rag_status,
            fallback=_rag_status_fallback("Milvus 状态检查超时，请确认 Milvus 服务是否已启动。"),
        )

    @app.post("/api/chat")
    async def chat(
        request: ChatRequest,
        user: dict[str, Any] = Depends(_require_write_role("viewer")),
    ) -> dict[str, Any]:
        task_key = _active_chat_key(request.channel, request.session_id)
        existing_task = active_chat_tasks.get(task_key)
        if existing_task and not existing_task.done():
            raise HTTPException(status_code=409, detail="当前会话已有生成任务，请先暂停或等待完成")
        # 保存当前会话的生成 task，让 /api/chat/stop 能定位并取消后端生成。
        chat_task = asyncio.create_task(cluster.chat(
            assistant_id=request.assistant_id,
            content=request.content,
            session_id=request.session_id,
            channel=request.channel,
            chat_id=request.chat_id,
            media=request.uploaded_paths,
            collaboration_mode="off" if request.assistant_id else None,
        ))
        active_chat_tasks[task_key] = chat_task
        try:
            result = await chat_task
            if (
                request.sync_enabled
                and _role_at_least(user["role"], "admin")
                and request.sync_channel.strip()
                and not result.get("deferred")
            ):
                media_paths = [
                    str(item.get("path", "")).strip()
                    for item in (result.get("media") or [])
                    if str(item.get("path", "")).strip()
                    and not str(item.get("path", "")).startswith(("http://", "https://", "/api/files"))
                ]
                sync_content = "" if media_paths else str(result.get("content") or "").strip()
                try:
                    channel_result = await cluster.send_channel_message(
                        channel=request.sync_channel.strip(),
                        chat_id="",
                        assistant_id=result.get("assistant_id"),
                        content=sync_content,
                        media=media_paths,
                    )
                    result["channel_sync"] = {
                        "status": "sent",
                        "channel": channel_result["channel"],
                        "chat_id": channel_result.get("chat_id", ""),
                        "content": channel_result["content"],
                        "media_count": channel_result["media_count"],
                    }
                except (ValueError, RuntimeError) as sync_exc:
                    result["channel_sync"] = {
                        "status": "error",
                        "channel": request.sync_channel.strip(),
                        "message": str(sync_exc),
                    }
            return result
        except asyncio.CancelledError as exc:
            raise HTTPException(status_code=499, detail="本次生成已暂停") from exc
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        finally:
            if active_chat_tasks.get(task_key) is chat_task:
                active_chat_tasks.pop(task_key, None)

    @app.post("/api/chat/stop")
    async def stop_chat(
        request: ChatStopRequest,
        user: dict[str, Any] = Depends(_require_write_role("viewer")),
    ) -> dict[str, Any]:
        task_key = _active_chat_key(request.channel, request.session_id)
        chat_task = active_chat_tasks.get(task_key)
        if not chat_task or chat_task.done():
            return {"status": "idle", "stopped": False}
        # 前端 abort 只会中断浏览器等待；这里真正取消后端 asyncio 生成任务。
        chat_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await chat_task
        active_chat_tasks.pop(task_key, None)
        return {"status": "stopped", "stopped": True}

    @app.post("/api/channel-send")
    async def channel_send(
        request: ChannelSendRequest,
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, Any]:
        try:
            return await cluster.send_channel_message(
                channel=request.channel,
                chat_id=request.chat_id,
                assistant_id=request.assistant_id,
                content=request.content,
                media=request.uploaded_paths,
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except RuntimeError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc

    @app.post("/api/uploads")
    async def uploads(
        session_id: str = Form("web_default"),
        files: list[UploadFile] = File(...),
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, Any]:
        try:
            buffered = await persist_uploads(
                files,
                save_root=_upload_root(cluster) / _safe_session_fragment(session_id),
                web_config=cluster.config.cluster.web,
                allowed_extensions=cluster.config.cluster.web.allowed_upload_extensions,
            )
        except HTTPException:
            cluster.metrics.inc("uploads_rejected_total")
            raise
        cluster.metrics.inc("uploads_accepted_total", len(buffered))
        logger.bind(username=user["username"], channel="web").info("Uploaded {} files", len(buffered))
        return {
            "files": [
                {
                    "name": item.name,
                    "path": str(item.path),
                    "content_type": item.content_type,
                    "size_bytes": item.size_bytes,
                }
                for item in buffered
            ]
        }

    @app.get("/api/files")
    async def files(
        path: str = Query(..., min_length=1),
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> FileResponse:
        target = _ensure_allowed_path(cluster, path)
        if not target.exists() or not target.is_file():
            raise HTTPException(status_code=404, detail="File not found")
        return FileResponse(target)

    @app.get("/api/users")
    async def users(user: dict[str, Any] = Depends(_require_role("admin"))) -> list[dict[str, Any]]:
        return cluster.list_users()

    @app.post("/api/users")
    async def save_user(payload: UserPayload, user: dict[str, Any] = Depends(_require_write_role("admin"))) -> dict[str, Any]:
        try:
            return cluster.save_user(payload.model_dump())
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.delete("/api/users/{user_id}")
    async def delete_user(user_id: str, user: dict[str, Any] = Depends(_require_write_role("admin"))) -> dict[str, str]:
        try:
            cluster.delete_user(user_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        return {"status": "deleted"}

    @app.get("/api/knowledge/documents")
    async def knowledge_documents(user: dict[str, Any] = Depends(_require_role("viewer"))) -> list[dict[str, Any]]:
        return await _to_thread_or_fallback(
            "knowledge documents",
            cluster.list_knowledge_documents,
            fallback=[],
        )

    @app.get("/api/knowledge/documents/{document_id}")
    async def knowledge_document_detail(
        document_id: str,
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> dict[str, Any]:
        document = cluster.get_knowledge_document_detail(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Knowledge document not found")
        return document

    @app.post("/api/knowledge/upload")
    async def knowledge_upload(
        title: str = Form(""),
        assistant_scope: str = Form(""),
        files: list[UploadFile] = File(...),
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, Any]:
        save_root = _knowledge_upload_root(cluster)
        saved_docs: list[dict[str, Any]] = []
        skipped_docs: list[dict[str, str]] = []
        scope = [item.strip() for item in assistant_scope.split(",") if item.strip()]
        existing_hashes = {
            str(item.get("content_hash") or "")
            for item in cluster.list_knowledge_documents()
            if str(item.get("content_hash") or "")
        }
        try:
            buffered = await persist_uploads(
                files,
                save_root=save_root,
                web_config=cluster.config.cluster.web,
                allowed_extensions=cluster.config.cluster.web.allowed_knowledge_extensions,
            )
        except HTTPException:
            cluster.metrics.inc("knowledge_upload_rejected_total")
            raise
        for item in buffered:
            try:
                text = extract_text_from_bytes(item.name or "document.txt", item.raw)
                if not text.strip():
                    skipped_docs.append({"name": item.name, "reason": "文档未提取到可用文本"})
                    item.path.unlink(missing_ok=True)
                    continue
                enforce_knowledge_text_limit(text, cluster.config.cluster.web)
            except ValueError as exc:
                skipped_docs.append({"name": item.name, "reason": str(exc)})
                item.path.unlink(missing_ok=True)
                cluster.metrics.inc("knowledge_upload_rejected_total")
                continue
            except HTTPException as exc:
                skipped_docs.append({"name": item.name, "reason": str(exc.detail)})
                item.path.unlink(missing_ok=True)
                cluster.metrics.inc("knowledge_upload_rejected_total")
                continue
            content_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
            if content_hash in existing_hashes:
                skipped_docs.append({"name": item.name, "reason": "检测到重复文档，已跳过"})
                item.path.unlink(missing_ok=True)
                cluster.metrics.inc("knowledge_duplicates_total")
                continue
            existing_hashes.add(content_hash)
            saved_docs.append(
                cluster.save_knowledge_document(
                    title=title.strip() or Path(item.name).stem,
                    filename=str(item.path),
                    content_type=item.content_type or "text/plain",
                    text_content=text,
                    assistant_scope=scope,
                    created_by=user["username"],
                )
            )
        cluster.metrics.inc("knowledge_documents_uploaded_total", len(saved_docs))
        return {"documents": saved_docs, "skipped": skipped_docs}

    @app.post("/api/knowledge/search")
    async def knowledge_search(
        payload: KnowledgeSearchRequest,
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> dict[str, Any]:
        return {
            "items": cluster.search_knowledge(
                payload.query,
                assistant_id=payload.assistant_id,
                limit=max(1, min(payload.limit, 10)),
            )
        }

    @app.delete("/api/knowledge/documents/{document_id}")
    async def delete_knowledge(
        document_id: str,
        user: dict[str, Any] = Depends(_require_write_role("admin")),
    ) -> dict[str, str]:
        cluster.delete_knowledge_document(document_id)
        return {"status": "deleted"}

    @app.get("/api/tasks")
    async def tasks(user: dict[str, Any] = Depends(_require_role("viewer"))) -> list[dict[str, Any]]:
        return cluster.list_tasks()

    @app.post("/api/tasks")
    async def save_task(payload: TaskPayload, user: dict[str, Any] = Depends(_require_write_role("admin"))) -> dict[str, Any]:
        try:
            return cluster.save_task(payload.model_dump(), user["username"])
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    @app.delete("/api/tasks/{task_id}")
    async def delete_task(task_id: str, user: dict[str, Any] = Depends(_require_write_role("admin"))) -> dict[str, str]:
        cluster.delete_task(task_id)
        return {"status": "deleted"}

    @app.post("/api/tasks/{task_id}/run")
    async def run_task(task_id: str, user: dict[str, Any] = Depends(_require_write_role("admin"))) -> dict[str, Any]:
        try:
            return await cluster.execute_task(task_id)
        except ValueError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @app.get("/api/tasks/{task_id}/runs")
    async def task_runs(task_id: str, user: dict[str, Any] = Depends(_require_role("viewer"))) -> list[dict[str, Any]]:
        return cluster.list_task_runs(task_id)

    @app.get("/api/traces")
    async def traces(
        limit: int = Query(default=50, ge=1, le=200),
        user: dict[str, Any] = Depends(_require_role("viewer")),
    ) -> list[dict[str, Any]]:
        return cluster.list_traces(limit)

    @app.get("/api/traces/{trace_id}")
    async def trace_detail(trace_id: str, user: dict[str, Any] = Depends(_require_role("viewer"))) -> dict[str, Any]:
        trace = cluster.get_trace(trace_id)
        if not trace:
            raise HTTPException(status_code=404, detail="Trace not found")
        return trace

    @app.get("/")
    async def index() -> FileResponse:
        return FileResponse(web_root / "index.html")

    return app
