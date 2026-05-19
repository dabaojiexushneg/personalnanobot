"""Control-plane persistence for auth, knowledge base, tasks, and traces."""

from __future__ import annotations

import hashlib
import json
import secrets
import sqlite3
import threading
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

from croniter import croniter

from nanobot.cluster.rag import MilvusKnowledgeStore
from nanobot.config.schema import ClusterRagConfig
from nanobot.cluster.security import (
    hash_password,
    is_legacy_password_hash,
    new_csrf_token,
    password_needs_rehash,
    verify_password,
)
from nanobot.utils.helpers import ensure_dir


def _now() -> datetime:
    return datetime.now().astimezone()


def _now_iso() -> str:
    return _now().isoformat()


def _chunk_text(text: str, *, chunk_size: int = 700, overlap: int = 120) -> list[str]:
    normalized = (text or "").replace("\r\n", "\n").replace("\r", "\n").strip()
    if not normalized:
        return []
    chunks: list[str] = []
    start = 0
    while start < len(normalized):
        end = min(len(normalized), start + chunk_size)
        chunk = normalized[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(normalized):
            break
        start = max(end - overlap, start + 1)
    return chunks

#   SQLite 控制面存储。
class ClusterControlStore:
    """SQLite store for control-plane data."""

    ROLE_LEVELS = {"viewer": 1, "admin": 2}
    PROTECTED_ADMIN_USERNAME = "admin"

    def __init__(
        self,
        db_path: Path,
        *,
        rag_config: ClusterRagConfig | None = None,
        knowledge_store: Any | None = None,
    ):
        self.db_path = Path(db_path)
        ensure_dir(self.db_path.parent)
        self._lock = threading.RLock()
        self._conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._init_tables()
        self._knowledge_store = knowledge_store or MilvusKnowledgeStore(rag_config=rag_config)

    def _init_tables(self) -> None:
        with self._lock, self._conn:
            self._conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL,
                    enabled INTEGER NOT NULL DEFAULT 1,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    last_login_at TEXT
                );
                CREATE TABLE IF NOT EXISTS auth_sessions (
                    token_hash TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    csrf_token TEXT NOT NULL DEFAULT '',
                    expires_at TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    assistant_id TEXT NOT NULL,
                    prompt TEXT NOT NULL,
                    task_kind TEXT NOT NULL DEFAULT 'generic',
                    collaboration_mode TEXT NOT NULL DEFAULT 'inherit',
                    schedule_kind TEXT NOT NULL,
                    cron_expression TEXT NOT NULL DEFAULT '',
                    interval_minutes INTEGER NOT NULL DEFAULT 0,
                    enabled INTEGER NOT NULL DEFAULT 1,
                    require_rag_connected INTEGER NOT NULL DEFAULT 0,
                    require_channel_online INTEGER NOT NULL DEFAULT 0,
                    min_success_gap_minutes INTEGER NOT NULL DEFAULT 0,
                    max_retries INTEGER NOT NULL DEFAULT 0,
                    retry_backoff_seconds INTEGER NOT NULL DEFAULT 60,
                    target_channel TEXT NOT NULL DEFAULT '',
                    target_chat_id TEXT NOT NULL DEFAULT '',
                    created_by TEXT NOT NULL,
                    updated_by TEXT NOT NULL,
                    next_run_at TEXT,
                    last_run_at TEXT,
                    last_status TEXT NOT NULL DEFAULT 'idle',
                    last_result TEXT NOT NULL DEFAULT '',
                    lease_owner TEXT NOT NULL DEFAULT '',
                    lease_expires_at TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS task_runs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_id TEXT NOT NULL,
                    started_at TEXT NOT NULL,
                    completed_at TEXT,
                    status TEXT NOT NULL,
                    result TEXT NOT NULL DEFAULT ''
                );
                CREATE TABLE IF NOT EXISTS traces (
                    id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    channel TEXT NOT NULL,
                    chat_id TEXT NOT NULL,
                    assistant_id TEXT NOT NULL,
                    request_content TEXT NOT NULL,
                    response_content TEXT NOT NULL DEFAULT '',
                    response_style TEXT NOT NULL DEFAULT 'chat',
                    media_count INTEGER NOT NULL DEFAULT 0,
                    status TEXT NOT NULL DEFAULT 'running',
                    error_message TEXT NOT NULL DEFAULT '',
                    started_at TEXT NOT NULL,
                    completed_at TEXT,
                    duration_ms INTEGER NOT NULL DEFAULT 0,
                    prompt_tokens INTEGER NOT NULL DEFAULT 0,
                    completion_tokens INTEGER NOT NULL DEFAULT 0,
                    total_tokens INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS trace_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    trace_id TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    content TEXT NOT NULL,
                    metadata TEXT NOT NULL DEFAULT '{}',
                    created_at TEXT NOT NULL
                );
                """
            )
            self._ensure_column("tasks", "lease_owner", "TEXT NOT NULL DEFAULT ''")
            self._ensure_column("tasks", "lease_expires_at", "TEXT")
            self._ensure_column("tasks", "task_kind", "TEXT NOT NULL DEFAULT 'generic'")
            self._ensure_column("tasks", "collaboration_mode", "TEXT NOT NULL DEFAULT 'inherit'")
            self._ensure_column("tasks", "cron_expression", "TEXT NOT NULL DEFAULT ''")
            self._ensure_column("tasks", "require_rag_connected", "INTEGER NOT NULL DEFAULT 0")
            self._ensure_column("tasks", "require_channel_online", "INTEGER NOT NULL DEFAULT 0")
            self._ensure_column("tasks", "min_success_gap_minutes", "INTEGER NOT NULL DEFAULT 0")
            self._ensure_column("tasks", "max_retries", "INTEGER NOT NULL DEFAULT 0")
            self._ensure_column("tasks", "retry_backoff_seconds", "INTEGER NOT NULL DEFAULT 60")
            self._ensure_column("auth_sessions", "csrf_token", "TEXT NOT NULL DEFAULT ''")
            self._ensure_column("traces", "prompt_tokens", "INTEGER NOT NULL DEFAULT 0")
            self._ensure_column("traces", "completion_tokens", "INTEGER NOT NULL DEFAULT 0")
            self._ensure_column("traces", "total_tokens", "INTEGER NOT NULL DEFAULT 0")
            self._conn.execute(
                "UPDATE users SET role = 'viewer' WHERE role NOT IN ('viewer', 'admin')"
            )

    def close(self) -> None:
        with self._lock:
            if getattr(self, "_conn", None) is not None:
                self._conn.close()

    def _ensure_column(self, table: str, column: str, column_type: str) -> None:
        columns = self._conn.execute(f"PRAGMA table_info({table})").fetchall()
        if any(row["name"] == column for row in columns):
            return
        self._conn.execute(
            f"ALTER TABLE {table} ADD COLUMN {column} {column_type}"
        )

    @staticmethod
    def _hash_secret(raw: str) -> str:
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    @classmethod
    def _normalize_role(cls, role: str) -> str:
        role = str(role or "").strip().lower()
        return "viewer" if role == "operator" else role

    @classmethod
    def _hash_password(cls, password: str, salt: str | None = None) -> str:
        if salt:
            digest = cls._hash_secret(f"{salt}:{password}")
            return f"{salt}${digest}"
        return hash_password(password)

    @classmethod
    def _verify_password(cls, password: str, stored: str) -> bool:
        if is_legacy_password_hash(stored):
            salt, digest = stored.split("$", 1)
            return cls._hash_password(password, salt) == f"{salt}${digest}"
        return verify_password(password, stored)

    def has_users(self) -> bool:
        with self._lock:
            row = self._conn.execute("SELECT 1 FROM users LIMIT 1").fetchone()
        return bool(row)

    def has_admin_user(self) -> bool:
        with self._lock:
            row = self._conn.execute(
                "SELECT 1 FROM users WHERE role = 'admin' AND enabled = 1 LIMIT 1"
            ).fetchone()
        return bool(row)

    def has_protected_admin(self) -> bool:
        with self._lock:
            row = self._conn.execute(
                """
                SELECT 1 FROM users
                WHERE username = ? AND role = 'admin' AND enabled = 1
                LIMIT 1
                """,
                (self.PROTECTED_ADMIN_USERNAME,),
            ).fetchone()
        return bool(row)

    def ensure_protected_admin(self, password: str | None = None) -> dict[str, Any]:
        now = _now_iso()
        password = str(password or "").strip()
        with self._lock, self._conn:
            row = self._conn.execute(
                "SELECT id, password_hash FROM users WHERE username = ?",
                (self.PROTECTED_ADMIN_USERNAME,),
            ).fetchone()
            if row:
                if password:
                    self._conn.execute(
                        """
                        UPDATE users
                        SET role = 'admin',
                            enabled = 1,
                            updated_at = ?,
                            password_hash = ?
                        WHERE id = ?
                        """,
                        (now, self._hash_password(password), row["id"]),
                    )
                else:
                    self._conn.execute(
                        """
                        UPDATE users
                        SET role = 'admin', enabled = 1, updated_at = ?
                        WHERE id = ?
                        """,
                        (now, row["id"]),
                    )
                target_id = row["id"]
            else:
                if not password:
                    raise ValueError("初始化内置 admin 账号必须提供密码")
                target_id = str(uuid.uuid4())
                self._conn.execute(
                    """
                    INSERT INTO users(id, username, password_hash, role, enabled, created_at, updated_at)
                    VALUES (?, ?, ?, 'admin', 1, ?, ?)
                    """,
                    (
                        target_id,
                        self.PROTECTED_ADMIN_USERNAME,
                        self._hash_password(password),
                        now,
                        now,
                    ),
                )
            row = self._conn.execute(
                """
                SELECT id, username, role, enabled, created_at, updated_at, last_login_at
                FROM users WHERE id = ?
                """,
                (target_id,),
            ).fetchone()
        return (
            dict(row) | {"protected": row["username"] == self.PROTECTED_ADMIN_USERNAME}
            if row
            else {}
        )

    def ensure_seed_user(self, username: str, password: str, role: str = "admin") -> None:
        if not password.strip():
            return
        username = username.strip()
        if username == self.PROTECTED_ADMIN_USERNAME:
            self.ensure_protected_admin(password)
            return
        role = self._normalize_role(role or "viewer")
        if role not in self.ROLE_LEVELS:
            raise ValueError("角色必须是 viewer 或 admin")
        with self._lock, self._conn:
            row = self._conn.execute(
                "SELECT id FROM users WHERE username = ?",
                (username,),
            ).fetchone()
            if row:
                return
            now = _now_iso()
            self._conn.execute(
                """
                INSERT INTO users(id, username, password_hash, role, enabled, created_at, updated_at)
                VALUES (?, ?, ?, ?, 1, ?, ?)
                """,
                (str(uuid.uuid4()), username, self._hash_password(password), role, now, now),
            )

    def bootstrap_admin(self, username: str, password: str) -> dict[str, Any]:
        if self.has_users():
            raise ValueError("管理员已初始化")
        return self.upsert_user(
            username=username,
            role="admin",
            enabled=True,
            password=password,
            user_id=None,
        )

    def list_users(self) -> list[dict[str, Any]]:
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT id, username, role, enabled, created_at, updated_at, last_login_at
                FROM users
                ORDER BY username ASC
                """
            ).fetchall()
        return [
            dict(row) | {"protected": row["username"] == self.PROTECTED_ADMIN_USERNAME}
            for row in rows
        ]

    def upsert_user(
        self,
        *,
        username: str,
        role: str,
        enabled: bool,
        password: str | None = None,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        now = _now_iso()
        username = username.strip()
        role = self._normalize_role(role.strip() or "viewer")
        if not username:
            raise ValueError("用户名不能为空")
        if role not in self.ROLE_LEVELS:
            raise ValueError("角色必须是 viewer 或 admin")
        with self._lock, self._conn:
            if user_id:
                current = self._conn.execute(
                    "SELECT username, password_hash FROM users WHERE id = ?",
                    (user_id,),
                ).fetchone()
                if not current:
                    raise ValueError("用户不存在")
                if current["username"] == self.PROTECTED_ADMIN_USERNAME:
                    username = self.PROTECTED_ADMIN_USERNAME
                    role = "admin"
                    enabled = True
                password_hash = self._hash_password(password) if password else current["password_hash"]
                self._conn.execute(
                    """
                    UPDATE users
                    SET username = ?, password_hash = ?, role = ?, enabled = ?, updated_at = ?
                    WHERE id = ?
                    """,
                    (username, password_hash, role, int(enabled), now, user_id),
                )
                target_id = user_id
            else:
                if username == self.PROTECTED_ADMIN_USERNAME:
                    role = "admin"
                    enabled = True
                existing = self._conn.execute(
                    "SELECT id, password_hash FROM users WHERE username = ?",
                    (username,),
                ).fetchone()
                if existing:
                    raise ValueError("用户已存在，请先在右侧用户列表点击“编辑”后再保存修改")
                if not password:
                    raise ValueError("新建用户必须设置密码")
                target_id = str(uuid.uuid4())
                self._conn.execute(
                    """
                    INSERT INTO users(id, username, password_hash, role, enabled, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (target_id, username, self._hash_password(password), role, int(enabled), now, now),
                )
            row = self._conn.execute(
                """
                SELECT id, username, role, enabled, created_at, updated_at, last_login_at
                FROM users WHERE id = ?
                """,
                (target_id,),
            ).fetchone()
        return (
            dict(row) | {"protected": row["username"] == self.PROTECTED_ADMIN_USERNAME}
            if row
            else {}
        )

    def delete_user(self, user_id: str) -> None:
        with self._lock, self._conn:
            row = self._conn.execute(
                "SELECT username, role FROM users WHERE id = ?",
                (user_id,),
            ).fetchone()
            if not row:
                return
            if row["username"] == self.PROTECTED_ADMIN_USERNAME:
                raise ValueError("内置 admin 管理员账号不能删除")
            if row["role"] == "admin":
                admin_count = self._conn.execute(
                    "SELECT COUNT(*) AS count FROM users WHERE role = 'admin' AND enabled = 1"
                ).fetchone()
                if int(admin_count["count"] if admin_count else 0) <= 1:
                    raise ValueError("不能删除最后一个可用管理员账号")
            self._conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
            self._conn.execute("DELETE FROM auth_sessions WHERE user_id = ?", (user_id,))

    def authenticate_user(self, username: str, password: str) -> dict[str, Any] | None:
        with self._lock, self._conn:
            row = self._conn.execute(
                """
                SELECT id, username, password_hash, role, enabled
                FROM users
                WHERE username = ?
                """,
                (username,),
            ).fetchone()
            if not row or not int(row["enabled"]):
                return None
            if not self._verify_password(password, row["password_hash"]):
                return None
            now = _now_iso()
            password_hash = row["password_hash"]
            if password_needs_rehash(password_hash):
                password_hash = self._hash_password(password)
            self._conn.execute(
                "UPDATE users SET password_hash = ?, last_login_at = ?, updated_at = ? WHERE id = ?",
                (password_hash, now, now, row["id"]),
            )
        return {
            "id": row["id"],
            "username": row["username"],
            "role": row["role"],
            "enabled": bool(row["enabled"]),
        }

    def create_session(self, user_id: str, ttl_minutes: int) -> tuple[str, str]:
        token = secrets.token_urlsafe(32)
        token_hash = self._hash_secret(token)
        csrf_token = new_csrf_token()
        expires_at = (_now() + timedelta(minutes=ttl_minutes)).isoformat()
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT OR REPLACE INTO auth_sessions(token_hash, user_id, csrf_token, expires_at, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (token_hash, user_id, csrf_token, expires_at, _now_iso()),
            )
        return token, csrf_token

    def get_session_user(self, token: str) -> dict[str, Any] | None:
        token_hash = self._hash_secret(token)
        now = _now()
        with self._lock, self._conn:
            row = self._conn.execute(
                """
                SELECT u.id, u.username, u.role, u.enabled, s.expires_at, s.csrf_token
                FROM auth_sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token_hash = ?
                """,
                (token_hash,),
            ).fetchone()
            if not row:
                return None
            if datetime.fromisoformat(row["expires_at"]) <= now or not int(row["enabled"]):
                self._conn.execute("DELETE FROM auth_sessions WHERE token_hash = ?", (token_hash,))
                return None
        return {
            "id": row["id"],
            "username": row["username"],
            "role": row["role"],
            "enabled": bool(row["enabled"]),
            "csrf_token": row["csrf_token"],
        }

    def validate_csrf(self, token: str, csrf_token: str) -> bool:
        current = self.get_session_user(token)
        if not current:
            return False
        return str(current.get("csrf_token") or "") == str(csrf_token or "")

    def delete_session(self, token: str) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                "DELETE FROM auth_sessions WHERE token_hash = ?",
                (self._hash_secret(token),),
            )

    def create_knowledge_document(
        self,
        *,
        title: str,
        filename: str,
        content_type: str,
        text_content: str,
        assistant_scope: list[str],
        created_by: str,
    ) -> dict[str, Any]:
        doc_id = str(uuid.uuid4())
        now = _now_iso()
        chunks = _chunk_text(text_content)
        return self._knowledge_store.create_document(
            document_id=doc_id,
            title=title,
            filename=filename,
            content_type=content_type,
            text_content=text_content,
            assistant_scope=assistant_scope,
            created_by=created_by,
            created_at=now,
            updated_at=now,
            chunks=chunks,
        )

#   查询知识文档列表。
    def list_knowledge_documents(self) -> list[dict[str, Any]]:
        return self._knowledge_store.list_documents()

    def get_knowledge_document(self, document_id: str) -> dict[str, Any] | None:
        return self._knowledge_store.get_document(document_id)

#   查询单个知识文档详情。
    def get_knowledge_document_detail(self, document_id: str) -> dict[str, Any] | None:
        document = self.get_knowledge_document(document_id)
        if not document:
            return None
        chunks_getter = getattr(self._knowledge_store, "get_document_chunks", None)
        chunks = chunks_getter(document_id) if callable(chunks_getter) else []
        return {**document, "chunks": chunks}

#   删除知识文档。
    def delete_knowledge_document(self, document_id: str) -> None:
        self._knowledge_store.delete_document(document_id)

#   控制层调用 Milvus 执行检索。
    def search_knowledge(
        self,
        query: str,
        *,
        assistant_id: str | None = None,
        limit: int = 4,
    ) -> list[dict[str, Any]]:
        if not query.strip():
            return []
        return self._knowledge_store.search(query, assistant_id=assistant_id, limit=limit)

    def get_rag_status(self) -> dict[str, Any]:
        status_getter = getattr(self._knowledge_store, "backend_status", None)
        if callable(status_getter):
            return status_getter()
        stats = self._knowledge_store.stats()
        return {
            "backend": "unknown",
            "available": True,
            "connected": True,
            "collection_name": "",
            "embedding_model": "",
            "vector_dimension": 0,
            "bm25_available": False,
            "uri": "",
            "libraries": [],
            "knowledge_docs": int(stats.get("knowledge_docs", 0)),
            "knowledge_chunks": int(stats.get("knowledge_chunks", 0)),
            "last_error": "",
        }

#   创建 Trace 主记录。
    def create_trace(
        self,
        *,
        session_id: str,
        channel: str,
        chat_id: str,
        assistant_id: str,
        request_content: str,
    ) -> str:
        trace_id = str(uuid.uuid4())
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT INTO traces(
                    id, session_id, channel, chat_id, assistant_id, request_content, started_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (trace_id, session_id, channel, chat_id, assistant_id, request_content, _now_iso()),
            )
        return trace_id

#   追加 Trace 事件。
    def add_trace_event(
        self,
        trace_id: str,
        event_type: str,
        content: str,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT INTO trace_events(trace_id, event_type, content, metadata, created_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    trace_id,
                    event_type,
                    content,
                    json.dumps(metadata or {}, ensure_ascii=False),
                    _now_iso(),
                ),
            )

#   写入最终回答、状态和 token。
    def finalize_trace(
        self,
        trace_id: str,
        *,
        response_content: str,
        response_style: str,
        media_count: int,
        status: str,
        error_message: str = "",
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        total_tokens: int = 0,
    ) -> None:
        completed_at = _now()
        with self._lock:
            row = self._conn.execute(
                "SELECT started_at FROM traces WHERE id = ?",
                (trace_id,),
            ).fetchone()
        started_at = datetime.fromisoformat(row["started_at"]) if row else completed_at
        duration_ms = max(int((completed_at - started_at).total_seconds() * 1000), 0)
        with self._lock, self._conn:
            self._conn.execute(
                """
                UPDATE traces
                SET response_content = ?, response_style = ?, media_count = ?, status = ?,
                    error_message = ?, completed_at = ?, duration_ms = ?,
                    prompt_tokens = ?, completion_tokens = ?, total_tokens = ?
                WHERE id = ?
                """,
                (
                    response_content,
                    response_style,
                    media_count,
                    status,
                    error_message,
                    completed_at.isoformat(),
                    duration_ms,
                    prompt_tokens,
                    completion_tokens,
                    total_tokens,
                    trace_id,
                ),
            )

#   返回 Trace 列表。
    def list_traces(self, limit: int = 50) -> list[dict[str, Any]]:
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT id, session_id, channel, chat_id, assistant_id, request_content,
                       response_content, response_style, media_count, status, error_message,
                       started_at, completed_at, duration_ms, prompt_tokens,
                       completion_tokens, total_tokens
                FROM traces
                ORDER BY started_at DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [dict(row) for row in rows]

    def get_trace(self, trace_id: str) -> dict[str, Any] | None:
        with self._lock:
            trace = self._conn.execute(
                """
                SELECT id, session_id, channel, chat_id, assistant_id, request_content,
                       response_content, response_style, media_count, status, error_message,
                       started_at, completed_at, duration_ms, prompt_tokens,
                       completion_tokens, total_tokens
                FROM traces
                WHERE id = ?
                """,
                (trace_id,),
            ).fetchone()
            events = self._conn.execute(
                """
                SELECT event_type, content, metadata, created_at
                FROM trace_events
                WHERE trace_id = ?
                ORDER BY id ASC
                """,
                (trace_id,),
            ).fetchall()
        if not trace:
            return None
        payload = dict(trace)
        payload["events"] = [
            {
                "event_type": row["event_type"],
                "content": row["content"],
                "metadata": json.loads(row["metadata"] or "{}"),
                "created_at": row["created_at"],
            }
            for row in events
        ]
        return payload

    def get_dashboard_summary(self) -> dict[str, Any]:
        knowledge_stats = self._knowledge_store.stats()
        with self._lock:
            trace_row = self._conn.execute(
                """
                SELECT COUNT(*) AS total,
                       SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END) AS failed,
                       AVG(duration_ms) AS avg_duration,
                       SUM(total_tokens) AS total_tokens
                FROM traces
                """
            ).fetchone()
            task_row = self._conn.execute(
                "SELECT COUNT(*) AS total, SUM(CASE WHEN enabled = 1 THEN 1 ELSE 0 END) AS enabled FROM tasks"
            ).fetchone()
        return {
            "traces_total": int(trace_row["total"] or 0) if trace_row else 0,
            "traces_failed": int(trace_row["failed"] or 0) if trace_row else 0,
            "avg_duration_ms": int(trace_row["avg_duration"] or 0) if trace_row else 0,
            "trace_total_tokens": int(trace_row["total_tokens"] or 0) if trace_row else 0,
            "tasks_total": int(task_row["total"] or 0) if task_row else 0,
            "tasks_enabled": int(task_row["enabled"] or 0) if task_row else 0,
            "knowledge_docs": int(knowledge_stats.get("knowledge_docs", 0)),
            "knowledge_chunks": int(knowledge_stats.get("knowledge_chunks", 0)),
        }

    def assistant_token_usage_today(self, assistant_id: str) -> int:
        today_prefix = _now().date().isoformat()
        with self._lock:
            row = self._conn.execute(
                """
                SELECT SUM(total_tokens) AS total
                FROM traces
                WHERE assistant_id = ? AND started_at LIKE ?
                """,
                (assistant_id, f"{today_prefix}%"),
            ).fetchone()
        return int(row["total"] or 0) if row else 0

    def daily_token_usage(self, days: int = 14) -> list[dict[str, Any]]:
        days = max(1, min(int(days or 14), 90))
        end_date = _now().date()
        start_date = end_date - timedelta(days=days - 1)
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT substr(started_at, 1, 10) AS usage_date,
                       COUNT(*) AS trace_count,
                       SUM(prompt_tokens) AS prompt_tokens,
                       SUM(completion_tokens) AS completion_tokens,
                       SUM(total_tokens) AS total_tokens
                FROM traces
                WHERE substr(started_at, 1, 10) >= ?
                GROUP BY usage_date
                ORDER BY usage_date ASC
                """,
                (start_date.isoformat(),),
            ).fetchall()
        by_date = {row["usage_date"]: row for row in rows}
        items: list[dict[str, Any]] = []
        for offset in range(days):
            usage_date = (start_date + timedelta(days=offset)).isoformat()
            row = by_date.get(usage_date)
            items.append(
                {
                    "date": usage_date,
                    "trace_count": int(row["trace_count"] or 0) if row else 0,
                    "prompt_tokens": int(row["prompt_tokens"] or 0) if row else 0,
                    "completion_tokens": int(row["completion_tokens"] or 0) if row else 0,
                    "total_tokens": int(row["total_tokens"] or 0) if row else 0,
                }
            )
        return items

    @staticmethod
    def _compute_next_run(
        schedule_kind: str,
        interval_minutes: int,
        from_time: datetime | None = None,
        *,
        cron_expression: str = "",
    ) -> str | None:
        base = from_time or _now()
        if schedule_kind == "interval":
            if interval_minutes <= 0:
                return None
            return (base + timedelta(minutes=interval_minutes)).isoformat()
        if schedule_kind == "cron":
            expr = cron_expression.strip()
            if not expr:
                return None
            return croniter(expr, base).get_next(datetime).isoformat()
        if schedule_kind != "interval" or interval_minutes <= 0:
            return None
        return (base + timedelta(minutes=interval_minutes)).isoformat()

    @staticmethod
    def _task_row_to_dict(row: sqlite3.Row | None) -> dict[str, Any] | None:
        if not row:
            return None
        return dict(row) | {
            "enabled": bool(row["enabled"]),
            "require_rag_connected": bool(row["require_rag_connected"]),
            "require_channel_online": bool(row["require_channel_online"]),
            "collaboration_mode": str(row["collaboration_mode"] or "inherit"),
        }

#   保存或更新任务配置。
    def upsert_task(self, payload: dict[str, Any], updated_by: str) -> dict[str, Any]:
        now = _now()
        task_id = str(payload.get("id") or "").strip() or str(uuid.uuid4())
        enabled = bool(payload.get("enabled", True))
        schedule_kind = str(payload.get("schedule_kind") or "manual")
        task_kind = str(payload.get("task_kind") or "generic").strip() or "generic"
        collaboration_mode = str(payload.get("collaboration_mode") or "inherit").strip() or "inherit"
        if collaboration_mode not in {"inherit", "off", "auto", "always"}:
            raise ValueError("collaboration_mode 必须是 inherit、off、auto 或 always")
        cron_expression = str(payload.get("cron_expression") or "").strip()
        interval_minutes = int(payload.get("interval_minutes") or 0)
        require_rag_connected = bool(payload.get("require_rag_connected", False))
        require_channel_online = bool(payload.get("require_channel_online", False))
        min_success_gap_minutes = max(int(payload.get("min_success_gap_minutes") or 0), 0)
        max_retries = max(int(payload.get("max_retries") or 0), 0)
        retry_backoff_seconds = max(int(payload.get("retry_backoff_seconds") or 60), 15)
        if schedule_kind == "cron" and not cron_expression:
            raise ValueError("cron 任务需要填写 cron_expression")
        if schedule_kind == "cron":
            try:
                croniter(cron_expression, now)
            except Exception as exc:
                raise ValueError(f"无效 cron 表达式: {cron_expression}") from exc
        next_run_at = (
            self._compute_next_run(
                schedule_kind,
                interval_minutes,
                now,
                cron_expression=cron_expression,
            ) if enabled else None
        )
        with self._lock, self._conn:
            existing = self._conn.execute("SELECT created_by, created_at FROM tasks WHERE id = ?", (task_id,)).fetchone()
            created_by = existing["created_by"] if existing else updated_by
            created_at = existing["created_at"] if existing else now.isoformat()
            self._conn.execute(
                """
                INSERT INTO tasks(
                    id, name, assistant_id, prompt, task_kind, collaboration_mode, schedule_kind, cron_expression, interval_minutes, enabled,
                    require_rag_connected, require_channel_online, min_success_gap_minutes,
                    max_retries, retry_backoff_seconds,
                    target_channel, target_chat_id, created_by, updated_by, next_run_at,
                    created_at, updated_at, last_status, last_result, lease_owner, lease_expires_at
                )
                VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    '', NULL
                )
                ON CONFLICT(id) DO UPDATE SET
                    name = excluded.name,
                    assistant_id = excluded.assistant_id,
                    prompt = excluded.prompt,
                    task_kind = excluded.task_kind,
                    collaboration_mode = excluded.collaboration_mode,
                    schedule_kind = excluded.schedule_kind,
                    cron_expression = excluded.cron_expression,
                    interval_minutes = excluded.interval_minutes,
                    enabled = excluded.enabled,
                    require_rag_connected = excluded.require_rag_connected,
                    require_channel_online = excluded.require_channel_online,
                    min_success_gap_minutes = excluded.min_success_gap_minutes,
                    max_retries = excluded.max_retries,
                    retry_backoff_seconds = excluded.retry_backoff_seconds,
                    target_channel = excluded.target_channel,
                    target_chat_id = excluded.target_chat_id,
                    updated_by = excluded.updated_by,
                    next_run_at = excluded.next_run_at,
                    updated_at = excluded.updated_at
                """,
                (
                    task_id,
                    payload["name"],
                    payload["assistant_id"],
                    payload["prompt"],
                    task_kind,
                    collaboration_mode,
                    schedule_kind,
                    cron_expression,
                    interval_minutes,
                    int(enabled),
                    int(require_rag_connected),
                    int(require_channel_online),
                    min_success_gap_minutes,
                    max_retries,
                    retry_backoff_seconds,
                    str(payload.get("target_channel") or ""),
                    str(payload.get("target_chat_id") or ""),
                    created_by,
                    updated_by,
                    next_run_at,
                    created_at,
                    now.isoformat(),
                    str(payload.get("last_status") or "idle"),
                    str(payload.get("last_result") or ""),
                ),
            )
        return self.get_task(task_id) or {}

#   查询任务列表。
    def list_tasks(self) -> list[dict[str, Any]]:
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT id, name, assistant_id, prompt, task_kind, collaboration_mode, schedule_kind, interval_minutes, enabled,
                       cron_expression, require_rag_connected, require_channel_online, min_success_gap_minutes,
                       max_retries, retry_backoff_seconds, target_channel, target_chat_id, created_by, updated_by, next_run_at,
                       last_run_at, last_status, last_result, lease_owner, lease_expires_at, created_at, updated_at
                FROM tasks
                ORDER BY updated_at DESC
                """
            ).fetchall()
        return [self._task_row_to_dict(row) for row in rows if row]

    def get_task(self, task_id: str) -> dict[str, Any] | None:
        with self._lock:
            row = self._conn.execute(
                """
                SELECT id, name, assistant_id, prompt, task_kind, collaboration_mode, schedule_kind, interval_minutes, enabled,
                       cron_expression, require_rag_connected, require_channel_online, min_success_gap_minutes,
                       max_retries, retry_backoff_seconds, target_channel, target_chat_id, created_by, updated_by, next_run_at,
                       last_run_at, last_status, last_result, lease_owner, lease_expires_at, created_at, updated_at
                FROM tasks WHERE id = ?
                """,
                (task_id,),
            ).fetchone()
        return self._task_row_to_dict(row)

    def delete_task(self, task_id: str) -> None:
        with self._lock, self._conn:
            self._conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            self._conn.execute("DELETE FROM task_runs WHERE task_id = ?", (task_id,))

    def claim_due_tasks(
        self,
        worker_id: str,
        *,
        lease_seconds: int = 900,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        now = _now()
        now_iso = now.isoformat()
        lease_expires_at = (now + timedelta(seconds=max(30, lease_seconds))).isoformat()
        claimed: list[dict[str, Any]] = []
        with self._lock, self._conn:
            self._conn.execute("BEGIN IMMEDIATE")
            try:
                rows = self._conn.execute(
                    """
                    SELECT id, name, assistant_id, prompt, task_kind, collaboration_mode, schedule_kind, cron_expression, interval_minutes, enabled,
                           require_rag_connected, require_channel_online, min_success_gap_minutes,
                           max_retries, retry_backoff_seconds, target_channel, target_chat_id, created_by, updated_by, next_run_at,
                           last_run_at, last_status, last_result, lease_owner, lease_expires_at,
                           created_at, updated_at
                    FROM tasks
                    WHERE enabled = 1
                      AND schedule_kind IN ('interval', 'cron')
                      AND next_run_at IS NOT NULL
                      AND next_run_at <= ?
                      AND (lease_expires_at IS NULL OR lease_expires_at = '' OR lease_expires_at <= ?)
                    ORDER BY next_run_at ASC
                    LIMIT ?
                    """,
                    (now_iso, now_iso, limit),
                ).fetchall()
                for row in rows:
                    updated = self._conn.execute(
                        """
                        UPDATE tasks
                        SET lease_owner = ?, lease_expires_at = ?, last_status = 'running', updated_at = ?
                        WHERE id = ?
                          AND enabled = 1
                          AND schedule_kind IN ('interval', 'cron')
                          AND next_run_at IS NOT NULL
                          AND next_run_at <= ?
                          AND (lease_expires_at IS NULL OR lease_expires_at = '' OR lease_expires_at <= ?)
                        """,
                        (worker_id, lease_expires_at, now_iso, row["id"], now_iso, now_iso),
                    )
                    if updated.rowcount:
                        claimed_row = dict(row)
                        claimed_row["lease_owner"] = worker_id
                        claimed_row["lease_expires_at"] = lease_expires_at
                        claimed_row["last_status"] = "running"
                        claimed.append(claimed_row | {"enabled": bool(row["enabled"])})
                self._conn.commit()
            except Exception:
                self._conn.rollback()
                raise
        return claimed

    def schedule_task_retry(
        self,
        task_id: str,
        *,
        retry_backoff_seconds: int,
        message: str,
        worker_id: str | None = None,
    ) -> str:
        next_run_at = (_now() + timedelta(seconds=max(retry_backoff_seconds, 15))).isoformat()
        now_iso = _now_iso()
        with self._lock, self._conn:
            if worker_id:
                self._conn.execute(
                    """
                    UPDATE tasks
                    SET last_status = 'retrying', last_result = ?, next_run_at = ?, updated_at = ?,
                        lease_owner = '', lease_expires_at = NULL
                    WHERE id = ? AND lease_owner = ?
                    """,
                    (message, next_run_at, now_iso, task_id, worker_id),
                )
            else:
                self._conn.execute(
                    """
                    UPDATE tasks
                    SET last_status = 'retrying', last_result = ?, next_run_at = ?, updated_at = ?,
                        lease_owner = '', lease_expires_at = NULL
                    WHERE id = ?
                    """,
                    (message, next_run_at, now_iso, task_id),
                )
        return next_run_at

    def heartbeat_task_lease(self, task_id: str, worker_id: str, *, lease_seconds: int = 900) -> bool:
        now = _now()
        lease_expires_at = (now + timedelta(seconds=max(30, lease_seconds))).isoformat()
        with self._lock, self._conn:
            updated = self._conn.execute(
                """
                UPDATE tasks
                SET lease_expires_at = ?, updated_at = ?
                WHERE id = ? AND lease_owner = ?
                """,
                (lease_expires_at, now.isoformat(), task_id, worker_id),
            )
        return bool(updated.rowcount)

    def get_due_tasks(self) -> list[dict[str, Any]]:
        """Compatibility helper for legacy callers and tests."""
        return self.claim_due_tasks("inline-scheduler", lease_seconds=900, limit=100)

    def record_task_run(
        self,
        task_id: str,
        *,
        status: str,
        result: str,
        completed_at: datetime | None = None,
        started_at: datetime | None = None,
        worker_id: str | None = None,
    ) -> None:
        finished = completed_at or _now()
        started = started_at or finished
        task = self.get_task(task_id)
        next_run_at = None
        if task and task["enabled"]:
            next_run_at = self._compute_next_run(
                task["schedule_kind"],
                int(task["interval_minutes"] or 0),
                finished,
                cron_expression=str(task.get("cron_expression") or ""),
            )
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT INTO task_runs(task_id, started_at, completed_at, status, result)
                VALUES (?, ?, ?, ?, ?)
                """,
                (task_id, started.isoformat(), finished.isoformat(), status, result),
            )
            if worker_id:
                self._conn.execute(
                    """
                    UPDATE tasks
                    SET last_run_at = ?, last_status = ?, last_result = ?, next_run_at = ?, updated_at = ?,
                        lease_owner = '', lease_expires_at = NULL
                    WHERE id = ? AND lease_owner = ?
                    """,
                    (finished.isoformat(), status, result, next_run_at, finished.isoformat(), task_id, worker_id),
                )
            else:
                self._conn.execute(
                    """
                    UPDATE tasks
                    SET last_run_at = ?, last_status = ?, last_result = ?, next_run_at = ?, updated_at = ?,
                        lease_owner = '', lease_expires_at = NULL
                    WHERE id = ?
                    """,
                    (finished.isoformat(), status, result, next_run_at, finished.isoformat(), task_id),
                )

    def list_task_runs(self, task_id: str, limit: int = 20) -> list[dict[str, Any]]:
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT id, task_id, started_at, completed_at, status, result
                FROM task_runs
                WHERE task_id = ?
                ORDER BY id DESC
                LIMIT ?
                """,
                (task_id, limit),
            ).fetchall()
        return [dict(row) for row in rows]

    def last_successful_task_run_at(self, task_id: str) -> str | None:
        with self._lock:
            row = self._conn.execute(
                """
                SELECT completed_at
                FROM task_runs
                WHERE task_id = ? AND status = 'completed'
                ORDER BY id DESC
                LIMIT 1
                """,
                (task_id,),
            ).fetchone()
        return str(row["completed_at"]) if row and row["completed_at"] else None
