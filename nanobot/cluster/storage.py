"""SQLite-backed persistence for clustered assistants.

SQLite is the source of truth for assistant memory, history, preferences, and
session data. The text files in each workspace are compatibility mirrors for
human inspection and older workflows; they are synchronized from SQLite after
startup and on write.
"""

from __future__ import annotations

import json
import sqlite3
import threading
from datetime import datetime
from pathlib import Path
from typing import Any

from nanobot.agent.memory import MemoryStore
from nanobot.session.manager import Session, SessionManager
from nanobot.utils.helpers import ensure_dir


class SQLiteMemoryStore(MemoryStore):
    """SQLite-first memory store with shadow-file compatibility mirrors."""

    def __init__(
        self,
        workspace: Path,
        db_path: Path,
        max_history_entries: int = MemoryStore._DEFAULT_MAX_HISTORY,
    ):
        self.db_path = Path(db_path)
        self._lock = threading.RLock()
        self._conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._init_tables()
        super().__init__(workspace, max_history_entries=max_history_entries)
        self._bootstrap_from_shadow_files()
        self._sync_shadow_files()

    def _init_tables(self) -> None:
        ensure_dir(self.db_path.parent)
        with self._lock, self._conn:
            self._conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS documents (
                    name TEXT PRIMARY KEY,
                    content TEXT NOT NULL DEFAULT '',
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS history (
                    cursor INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    content TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS metadata (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS preferences (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS task_contexts (
                    session_key TEXT NOT NULL,
                    key TEXT NOT NULL,
                    value TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    PRIMARY KEY (session_key, key)
                );
                """
            )

    def _bootstrap_from_shadow_files(self) -> None:
        with self._lock, self._conn:
            for name, path in (
                ("memory", self.memory_file),
                ("soul", self.soul_file),
                ("user", self.user_file),
            ):
                exists = self._conn.execute(
                    "SELECT 1 FROM documents WHERE name = ?",
                    (name,),
                ).fetchone()
                if exists:
                    continue
                content = self.read_file(path)
                self._conn.execute(
                    "INSERT INTO documents(name, content, updated_at) VALUES (?, ?, ?)",
                    (name, content, datetime.now().isoformat()),
                )

            has_history = self._conn.execute("SELECT 1 FROM history LIMIT 1").fetchone()
            if has_history:
                return
            for entry in super()._read_entries():
                self._conn.execute(
                    "INSERT INTO history(cursor, timestamp, content) VALUES (?, ?, ?)",
                    (
                        entry["cursor"],
                        entry["timestamp"],
                        entry["content"],
                    ),
                )
            if cursor := self._conn.execute("SELECT MAX(cursor) AS cursor FROM history").fetchone():
                value = cursor["cursor"] or 0
                self._conn.execute(
                    "INSERT OR REPLACE INTO metadata(key, value) VALUES ('cursor', ?)",
                    (str(value),),
                )
            if self._dream_cursor_file.exists():
                self._conn.execute(
                    "INSERT OR REPLACE INTO metadata(key, value) VALUES ('dream_cursor', ?)",
                    (self._dream_cursor_file.read_text(encoding="utf-8").strip() or "0",),
                )

    def _sync_shadow_files(self) -> None:
        self.memory_file.write_text(self.read_memory(), encoding="utf-8")
        self.soul_file.write_text(self.read_soul(), encoding="utf-8")
        self.user_file.write_text(self.read_user(), encoding="utf-8")
        self._sync_history_shadow()

    def _sync_history_shadow(self) -> None:
        entries = self._read_entries()
        with open(self.history_file, "w", encoding="utf-8") as handle:
            for entry in entries:
                handle.write(json.dumps(entry, ensure_ascii=False) + "\n")
        self._cursor_file.write_text(str(self._current_cursor()), encoding="utf-8")
        self._dream_cursor_file.write_text(str(self.get_last_dream_cursor()), encoding="utf-8")

    def _get_document(self, name: str) -> str:
        with self._lock:
            row = self._conn.execute(
                "SELECT content FROM documents WHERE name = ?",
                (name,),
            ).fetchone()
        return str(row["content"]) if row else ""

    def _set_document(self, name: str, content: str) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT INTO documents(name, content, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(name) DO UPDATE SET
                    content = excluded.content,
                    updated_at = excluded.updated_at
                """,
                (name, content, datetime.now().isoformat()),
            )

    def read_memory(self) -> str:
        return self._get_document("memory")

    def write_memory(self, content: str) -> None:
        self._set_document("memory", content)
        self.memory_file.write_text(content, encoding="utf-8")

    def read_soul(self) -> str:
        return self._get_document("soul")

    def write_soul(self, content: str) -> None:
        self._set_document("soul", content)
        self.soul_file.write_text(content, encoding="utf-8")

    def read_user(self) -> str:
        return self._get_document("user")

    def write_user(self, content: str) -> None:
        self._set_document("user", content)
        self.user_file.write_text(content, encoding="utf-8")

    def append_history(self, entry: str) -> int:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        content = entry.rstrip()
        with self._lock, self._conn:
            cursor = self._conn.execute(
                "INSERT INTO history(timestamp, content) VALUES (?, ?)",
                (timestamp, content),
            ).lastrowid
            self._conn.execute(
                "INSERT OR REPLACE INTO metadata(key, value) VALUES ('cursor', ?)",
                (str(cursor),),
            )
        self._sync_history_shadow()
        return int(cursor)

    def _current_cursor(self) -> int:
        with self._lock:
            row = self._conn.execute("SELECT MAX(cursor) AS cursor FROM history").fetchone()
        return int(row["cursor"] or 0) if row else 0

    def _read_entries(self) -> list[dict[str, Any]]:
        with self._lock:
            rows = self._conn.execute(
                "SELECT cursor, timestamp, content FROM history ORDER BY cursor ASC"
            ).fetchall()
        return [
            {"cursor": int(row["cursor"]), "timestamp": row["timestamp"], "content": row["content"]}
            for row in rows
        ]

    def _write_entries(self, entries: list[dict[str, Any]]) -> None:
        with self._lock, self._conn:
            self._conn.execute("DELETE FROM history")
            for entry in entries:
                self._conn.execute(
                    "INSERT INTO history(cursor, timestamp, content) VALUES (?, ?, ?)",
                    (entry["cursor"], entry["timestamp"], entry["content"]),
                )
            self._conn.execute(
                "INSERT OR REPLACE INTO metadata(key, value) VALUES ('cursor', ?)",
                (str(entries[-1]["cursor"] if entries else 0),),
            )
        self._sync_history_shadow()

    def read_unprocessed_history(self, since_cursor: int) -> list[dict[str, Any]]:
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT cursor, timestamp, content
                FROM history
                WHERE cursor > ?
                ORDER BY cursor ASC
                """,
                (since_cursor,),
            ).fetchall()
        return [
            {"cursor": int(row["cursor"]), "timestamp": row["timestamp"], "content": row["content"]}
            for row in rows
        ]

    def compact_history(self) -> None:
        if self.max_history_entries <= 0:
            return
        with self._lock, self._conn:
            rows = self._conn.execute("SELECT COUNT(*) AS count FROM history").fetchone()
            count = int(rows["count"] or 0) if rows else 0
            if count <= self.max_history_entries:
                return
            to_delete = count - self.max_history_entries
            self._conn.execute(
                """
                DELETE FROM history
                WHERE cursor IN (
                    SELECT cursor FROM history
                    ORDER BY cursor ASC
                    LIMIT ?
                )
                """,
                (to_delete,),
            )
        self._sync_history_shadow()

    def get_last_dream_cursor(self) -> int:
        with self._lock:
            row = self._conn.execute(
                "SELECT value FROM metadata WHERE key = 'dream_cursor'"
            ).fetchone()
        return int(row["value"]) if row and str(row["value"]).strip() else 0

    def set_last_dream_cursor(self, cursor: int) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                "INSERT OR REPLACE INTO metadata(key, value) VALUES ('dream_cursor', ?)",
                (str(cursor),),
            )
        self._dream_cursor_file.write_text(str(cursor), encoding="utf-8")

    def set_preference(self, key: str, value: Any) -> None:
        payload = json.dumps(value, ensure_ascii=False)
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT INTO preferences(key, value, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    value = excluded.value,
                    updated_at = excluded.updated_at
                """,
                (key, payload, datetime.now().isoformat()),
            )

    def get_preference(self, key: str, default: Any = None) -> Any:
        with self._lock:
            row = self._conn.execute(
                "SELECT value FROM preferences WHERE key = ?",
                (key,),
            ).fetchone()
        if not row:
            return default
        try:
            return json.loads(row["value"])
        except json.JSONDecodeError:
            return default

    def list_preferences(self) -> dict[str, Any]:
        with self._lock:
            rows = self._conn.execute("SELECT key, value FROM preferences ORDER BY key ASC").fetchall()
        result: dict[str, Any] = {}
        for row in rows:
            try:
                result[row["key"]] = json.loads(row["value"])
            except json.JSONDecodeError:
                result[row["key"]] = row["value"]
        return result

    def set_task_context(self, session_key: str, key: str, value: Any) -> None:
        payload = json.dumps(value, ensure_ascii=False)
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT INTO task_contexts(session_key, key, value, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(session_key, key) DO UPDATE SET
                    value = excluded.value,
                    updated_at = excluded.updated_at
                """,
                (session_key, key, payload, datetime.now().isoformat()),
            )

    def get_task_context(self, session_key: str) -> dict[str, Any]:
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT key, value
                FROM task_contexts
                WHERE session_key = ?
                ORDER BY key ASC
                """,
                (session_key,),
            ).fetchall()
        result: dict[str, Any] = {}
        for row in rows:
            try:
                result[row["key"]] = json.loads(row["value"])
            except json.JSONDecodeError:
                result[row["key"]] = row["value"]
        return result


class SQLiteSessionManager(SessionManager):
    """Session manager that persists all conversation state in SQLite."""

    def __init__(self, workspace: Path, db_path: Path):
        self.workspace = workspace
        self.db_path = Path(db_path)
        self._cache: dict[str, Session] = {}
        self._lock = threading.RLock()
        self.sessions_dir = ensure_dir(self.workspace / "sessions")
        self.legacy_sessions_dir = ensure_dir(self.workspace / "legacy_sessions")
        ensure_dir(self.db_path.parent)
        self._conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        with self._lock, self._conn:
            self._conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS sessions (
                    session_key TEXT PRIMARY KEY,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    metadata TEXT NOT NULL,
                    last_consolidated INTEGER NOT NULL DEFAULT 0
                );
                CREATE TABLE IF NOT EXISTS session_messages (
                    session_key TEXT NOT NULL,
                    msg_index INTEGER NOT NULL,
                    payload TEXT NOT NULL,
                    PRIMARY KEY (session_key, msg_index),
                    FOREIGN KEY (session_key) REFERENCES sessions(session_key) ON DELETE CASCADE
                );
                """
            )

    def _load(self, key: str) -> Session | None:
        with self._lock:
            meta = self._conn.execute(
                """
                SELECT session_key, created_at, updated_at, metadata, last_consolidated
                FROM sessions
                WHERE session_key = ?
                """,
                (key,),
            ).fetchone()
            if not meta:
                return None
            rows = self._conn.execute(
                """
                SELECT payload
                FROM session_messages
                WHERE session_key = ?
                ORDER BY msg_index ASC
                """,
                (key,),
            ).fetchall()
        messages = [json.loads(row["payload"]) for row in rows]
        return Session(
            key=key,
            messages=messages,
            created_at=datetime.fromisoformat(meta["created_at"]),
            updated_at=datetime.fromisoformat(meta["updated_at"]),
            metadata=json.loads(meta["metadata"]),
            last_consolidated=int(meta["last_consolidated"] or 0),
        )

    def save(self, session: Session) -> None:
        with self._lock, self._conn:
            self._conn.execute(
                """
                INSERT INTO sessions(session_key, created_at, updated_at, metadata, last_consolidated)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(session_key) DO UPDATE SET
                    updated_at = excluded.updated_at,
                    metadata = excluded.metadata,
                    last_consolidated = excluded.last_consolidated
                """,
                (
                    session.key,
                    session.created_at.isoformat(),
                    session.updated_at.isoformat(),
                    json.dumps(session.metadata, ensure_ascii=False),
                    session.last_consolidated,
                ),
            )
            self._conn.execute(
                "DELETE FROM session_messages WHERE session_key = ?",
                (session.key,),
            )
            for index, msg in enumerate(session.messages):
                self._conn.execute(
                    """
                    INSERT INTO session_messages(session_key, msg_index, payload)
                    VALUES (?, ?, ?)
                    """,
                    (session.key, index, json.dumps(msg, ensure_ascii=False)),
                )
        self._cache[session.key] = session

    def list_sessions(self) -> list[dict[str, Any]]:
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT session_key, created_at, updated_at
                FROM sessions
                ORDER BY updated_at DESC
                """
            ).fetchall()
        return [
            {
                "key": row["session_key"],
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "path": str(self.db_path),
            }
            for row in rows
        ]
