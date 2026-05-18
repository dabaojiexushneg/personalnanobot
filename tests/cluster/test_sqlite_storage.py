from pathlib import Path

from nanobot.cluster.storage import SQLiteMemoryStore, SQLiteSessionManager
from nanobot.session.manager import Session


def test_sqlite_memory_store_roundtrip(tmp_path: Path):
    workspace = tmp_path / "workspace"
    db_path = tmp_path / "assistant.sqlite3"
    store = SQLiteMemoryStore(workspace, db_path)

    store.write_memory("长期记忆")
    store.write_soul("专业人格")
    store.write_user("用户偏好")
    cursor = store.append_history("执行上下文 A")
    store.set_last_dream_cursor(cursor)
    store.set_preference("tone", {"style": "friendly"})
    store.set_task_context("session-1", "job", {"step": 2})

    reloaded = SQLiteMemoryStore(workspace, db_path)
    assert reloaded.read_memory() == "长期记忆"
    assert reloaded.read_soul() == "专业人格"
    assert reloaded.read_user() == "用户偏好"
    assert reloaded.read_unprocessed_history(0)[0]["content"] == "执行上下文 A"
    assert reloaded.get_last_dream_cursor() == cursor
    assert reloaded.get_preference("tone") == {"style": "friendly"}
    assert reloaded.get_task_context("session-1") == {"job": {"step": 2}}


def test_sqlite_session_manager_roundtrip(tmp_path: Path):
    workspace = tmp_path / "workspace"
    db_path = tmp_path / "assistant.sqlite3"
    manager = SQLiteSessionManager(workspace, db_path)

    session = Session(key="web:demo")
    session.add_message("user", "你好")
    session.add_message("assistant", "你好，我是开发助手。")
    session.last_consolidated = 1
    session.metadata["channel"] = "web"
    manager.save(session)

    reloaded = SQLiteSessionManager(workspace, db_path)
    loaded = reloaded.get_or_create("web:demo")
    assert loaded.messages[0]["content"] == "你好"
    assert loaded.messages[1]["content"] == "你好，我是开发助手。"
    assert loaded.last_consolidated == 1
    assert loaded.metadata["channel"] == "web"
    assert reloaded.list_sessions()[0]["key"] == "web:demo"


def test_sqlite_remains_source_of_truth_when_shadow_files_drift(tmp_path: Path):
    workspace = tmp_path / "workspace"
    db_path = tmp_path / "assistant.sqlite3"
    store = SQLiteMemoryStore(workspace, db_path)
    store.write_memory("SQLite authoritative memory")

    store.memory_file.write_text("stale shadow file", encoding="utf-8")

    reloaded = SQLiteMemoryStore(workspace, db_path)
    assert reloaded.read_memory() == "SQLite authoritative memory"
    assert reloaded.memory_file.read_text(encoding="utf-8") == "SQLite authoritative memory"
