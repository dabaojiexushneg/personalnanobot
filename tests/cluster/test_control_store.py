from __future__ import annotations

from pathlib import Path

from nanobot.cluster.control import ClusterControlStore


class InMemoryKnowledgeStore:
    def __init__(self) -> None:
        self.documents: dict[str, dict] = {}
        self.chunks: list[dict] = []
        self.vector_override: list[dict] | None = None

    def create_document(
        self,
        *,
        document_id: str,
        title: str,
        filename: str,
        content_type: str,
        text_content: str,
        assistant_scope: list[str],
        created_by: str,
        created_at: str,
        updated_at: str,
        chunks: list[str],
    ) -> dict:
        document = {
            "id": document_id,
            "title": title,
            "filename": filename,
            "content_type": content_type,
            "assistant_scope": list(assistant_scope),
            "chunk_count": len(chunks),
            "content_hash": "test-hash",
            "created_by": created_by,
            "created_at": created_at,
            "updated_at": updated_at,
        }
        self.documents[document_id] = document
        for index, chunk in enumerate(chunks):
            self.chunks.append(
                {
                    "chunk_id": f"{document_id}:{index}",
                    "document_id": document_id,
                    "title": title,
                    "filename": filename,
                    "content": chunk,
                    "chunk_index": index,
                    "assistant_scope": list(assistant_scope),
                    "keywords": chunk,
                }
            )
        return document

    def list_documents(self) -> list[dict]:
        return sorted(self.documents.values(), key=lambda item: item["updated_at"], reverse=True)

    def get_document(self, document_id: str) -> dict | None:
        return self.documents.get(document_id)

    def delete_document(self, document_id: str) -> None:
        self.documents.pop(document_id, None)
        self.chunks = [chunk for chunk in self.chunks if chunk["document_id"] != document_id]

    def get_document_chunks(self, document_id: str, *, limit: int = 50) -> list[dict]:
        rows = [
            {
                "chunk_id": chunk["chunk_id"],
                "chunk_index": chunk["chunk_index"],
                "content": chunk["content"],
                "keywords": chunk["keywords"],
                "assistant_scope": list(chunk.get("assistant_scope") or []),
                "updated_at": self.documents.get(document_id, {}).get("updated_at", ""),
            }
            for chunk in self.chunks
            if chunk["document_id"] == document_id
        ]
        rows.sort(key=lambda item: item["chunk_index"])
        return rows[: max(1, limit)]

    def search(self, query: str, *, assistant_id: str | None = None, limit: int = 4) -> list[dict]:
        if self.vector_override is not None:
            return self.vector_override[:limit]
        query_text = query.strip()
        if not query_text:
            return []
        hits: list[dict] = []
        for chunk in self.chunks:
            scope = chunk.get("assistant_scope") or []
            if scope and assistant_id and assistant_id not in scope:
                continue
            if query_text[:2] and query_text[:2] not in chunk["content"] and query_text not in chunk["content"]:
                continue
            hits.append(
                {
                    "chunk_id": chunk["chunk_id"],
                    "document_id": chunk["document_id"],
                    "title": chunk["title"],
                    "filename": chunk["filename"],
                    "content": chunk["content"],
                    "chunk_index": chunk["chunk_index"],
                    "score": 1.0,
                    "lexical_score": 1.0,
                    "vector_score": 0.0,
                    "retrieval": ["bm25"],
                }
            )
        return hits[:limit]

    def stats(self) -> dict[str, int]:
        return {
            "knowledge_docs": len(self.documents),
            "knowledge_chunks": len(self.chunks),
        }

    def backend_status(self) -> dict[str, object]:
        stats = self.stats()
        return {
            "backend": "milvus",
            "available": True,
            "connected": True,
            "collection_name": "test_knowledge",
            "embedding_model": "all-MiniLM-L6-v2",
            "vector_dimension": 384,
            "bm25_available": True,
            "uri": "http://127.0.0.1:19530",
            "libraries": [],
            "knowledge_docs": stats["knowledge_docs"],
            "knowledge_chunks": stats["knowledge_chunks"],
            "last_error": "",
        }


def make_store(tmp_path: Path, knowledge_store: InMemoryKnowledgeStore | None = None) -> ClusterControlStore:
    return ClusterControlStore(
        tmp_path / "control_plane.sqlite3",
        knowledge_store=knowledge_store or InMemoryKnowledgeStore(),
    )


def test_user_auth_and_session(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    store.ensure_seed_user("admin", "secret123", "admin")

    user = store.authenticate_user("admin", "secret123")
    assert user is not None
    assert user["username"] == "admin"
    assert user["role"] == "admin"

    token, csrf_token = store.create_session(user["id"], ttl_minutes=30)
    assert csrf_token
    session_user = store.get_session_user(token)
    assert session_user is not None
    assert session_user["username"] == "admin"
    assert session_user["csrf_token"] == csrf_token
    assert store.validate_csrf(token, csrf_token)


def test_viewer_user_can_authenticate(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    created = store.upsert_user(
        username="viewer-user",
        role="viewer",
        enabled=True,
        password="viewer-secret",
    )

    user = store.authenticate_user("viewer-user", "viewer-secret")

    assert user is not None
    assert user["id"] == created["id"]
    assert user["role"] == "viewer"


def test_operator_role_is_migrated_to_viewer(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    user = store.upsert_user(
        username="legacy-operator",
        role="operator",
        enabled=True,
        password="operator-secret",
    )

    assert user["role"] == "viewer"
    assert store.authenticate_user("legacy-operator", "operator-secret")["role"] == "viewer"  # type: ignore[index]


def test_protected_admin_is_created_and_cannot_be_deleted(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    admin = store.ensure_protected_admin("admin-secret")

    assert admin["username"] == "admin"
    assert admin["role"] == "admin"
    assert admin["protected"] is True
    assert store.authenticate_user("admin", "admin-secret") is not None

    try:
        store.delete_user(admin["id"])
    except ValueError as exc:
        assert "不能删除" in str(exc)
    else:
        raise AssertionError("protected admin should not be deletable")


def test_protected_admin_cannot_be_disabled_or_demoted(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    admin = store.ensure_protected_admin("admin-secret")

    updated = store.upsert_user(
        user_id=admin["id"],
        username="renamed",
        role="viewer",
        enabled=False,
    )

    assert updated["username"] == "admin"
    assert updated["role"] == "admin"
    assert updated["enabled"] == 1


def test_last_admin_cannot_be_deleted(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    user = store.upsert_user(
        username="root",
        role="admin",
        enabled=True,
        password="root-secret",
    )

    try:
        store.delete_user(user["id"])
    except ValueError as exc:
        assert "最后一个" in str(exc)
    else:
        raise AssertionError("last admin should not be deletable")


def test_legacy_password_hash_is_upgraded_on_login(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    legacy_hash = store._hash_password("secret123", "legacy-salt")  # noqa: SLF001
    now = "2026-01-01T00:00:00+08:00"
    with store._lock, store._conn:  # noqa: SLF001
        store._conn.execute(
            """
            INSERT INTO users(id, username, password_hash, role, enabled, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?)
            """,
            ("u-1", "legacy", legacy_hash, "admin", now, now),
        )

    user = store.authenticate_user("legacy", "secret123")
    assert user is not None

    with store._lock:  # noqa: SLF001
        row = store._conn.execute("SELECT password_hash FROM users WHERE id = 'u-1'").fetchone()  # noqa: SLF001
    assert row is not None
    assert str(row["password_hash"]).startswith("$argon2id$")


def test_knowledge_search_returns_matching_chunk(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    document = store.create_knowledge_document(
        title="微信接入说明",
        filename="weixin.md",
        content_type="text/markdown",
        assistant_scope=["consult"],
        text_content="微信机器人登录需要先完成二维码登录，并保持长轮询连接稳定。",
        created_by="tester",
    )

    hits = store.search_knowledge("微信机器人怎么登录", assistant_id="consult", limit=3)
    assert hits
    assert hits[0]["document_id"] == document["id"]
    assert "微信" in hits[0]["content"]


def test_hybrid_knowledge_search_accepts_vector_only_hit(tmp_path: Path) -> None:
    knowledge_store = InMemoryKnowledgeStore()
    store = make_store(tmp_path, knowledge_store=knowledge_store)
    document = store.create_knowledge_document(
        title="群发规则",
        filename="broadcast.md",
        content_type="text/markdown",
        assistant_scope=["consult"],
        text_content="系统支持企业消息批量广播，并记录投递状态。",
        created_by="tester",
    )

    knowledge_store.vector_override = [
        {
            "chunk_id": f"{document['id']}:0",
            "document_id": document["id"],
            "title": document["title"],
            "filename": document["filename"],
            "content": "系统支持企业消息批量广播，并记录投递状态。",
            "chunk_index": 0,
            "score": 0.88,
            "lexical_score": 0.0,
            "vector_score": 0.88,
            "retrieval": ["vector"],
        }
    ]
    hits = store.search_knowledge("批量推送消息怎么配置", assistant_id="consult", limit=3)
    assert hits
    assert hits[0]["document_id"] == document["id"]
    assert hits[0]["retrieval"] == ["vector"]


def test_knowledge_document_detail_and_rag_status(tmp_path: Path) -> None:
    knowledge_store = InMemoryKnowledgeStore()
    store = make_store(tmp_path, knowledge_store=knowledge_store)
    document = store.create_knowledge_document(
        title="Milvus 接入说明",
        filename="milvus.md",
        content_type="text/markdown",
        assistant_scope=["consult", "image"],
        text_content="Milvus 负责文档 chunk、向量与混合检索，适合做基础 RAG 能力。",
        created_by="tester",
    )

    detail = store.get_knowledge_document_detail(document["id"])
    assert detail is not None
    assert detail["id"] == document["id"]
    assert detail["chunks"]
    assert detail["chunks"][0]["chunk_id"].startswith(f"{document['id']}:")

    status = store.get_rag_status()
    assert status["backend"] == "milvus"
    assert status["connected"] is True
    assert status["knowledge_docs"] == 1
    assert status["knowledge_chunks"] == len(detail["chunks"])


def test_task_and_dashboard_summary(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    task = store.upsert_task(
        {
            "name": "日报摘要",
            "assistant_id": "consult",
            "prompt": "整理今天的重要更新",
            "schedule_kind": "interval",
            "collaboration_mode": "auto",
            "interval_minutes": 30,
            "enabled": True,
        },
        updated_by="tester",
    )
    assert task["name"] == "日报摘要"
    assert task["collaboration_mode"] == "auto"
    assert store.get_due_tasks() == []

    store.record_task_run(task["id"], status="completed", result="执行成功")
    summary = store.get_dashboard_summary()
    assert summary["tasks_total"] == 1
    assert summary["tasks_enabled"] == 1


def test_claim_due_tasks_uses_lease_lock(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    task = store.upsert_task(
        {
            "name": "巡检任务",
            "assistant_id": "consult",
            "prompt": "检查系统状态",
            "schedule_kind": "interval",
            "interval_minutes": 1,
            "enabled": True,
        },
        updated_by="tester",
    )

    store._conn.execute(
        "UPDATE tasks SET next_run_at = ? WHERE id = ?",
        ("2000-01-01T00:00:00+08:00", task["id"]),
    )
    store._conn.commit()

    first = store.claim_due_tasks("worker-a", lease_seconds=300, limit=5)
    second = store.claim_due_tasks("worker-b", lease_seconds=300, limit=5)

    assert len(first) == 1
    assert first[0]["id"] == task["id"]
    assert first[0]["lease_owner"] == "worker-a"
    assert second == []


def test_task_retry_and_daily_token_usage(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    task = store.upsert_task(
        {
            "name": "知识摘要",
            "assistant_id": "consult",
            "prompt": "整理知识库重点",
            "task_kind": "knowledge_digest",
            "schedule_kind": "interval",
            "interval_minutes": 15,
            "max_retries": 2,
            "retry_backoff_seconds": 90,
            "enabled": True,
        },
        updated_by="tester",
    )

    next_run_at = store.schedule_task_retry(
        task["id"],
        retry_backoff_seconds=90,
        message="模型网关超时，等待重试",
    )
    assert next_run_at
    task_after_retry = store.get_task(task["id"])
    assert task_after_retry is not None
    assert task_after_retry["last_status"] == "retrying"
    assert task_after_retry["retry_backoff_seconds"] == 90

    trace_id = store.create_trace(
        session_id="web:test",
        channel="web",
        chat_id="web",
        assistant_id="consult",
        request_content="你好",
    )
    store.finalize_trace(
        trace_id,
        response_content="你好",
        response_style="chat",
        media_count=0,
        status="completed",
        prompt_tokens=120,
        completion_tokens=30,
        total_tokens=150,
    )

    assert store.assistant_token_usage_today("consult") == 150


def test_cron_task_next_run_is_generated(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    task = store.upsert_task(
        {
            "name": "工作日报",
            "assistant_id": "consult",
            "prompt": "生成工作日报",
            "task_kind": "report",
            "schedule_kind": "cron",
            "cron_expression": "0 9 * * 1-5",
            "enabled": True,
        },
        updated_by="tester",
    )

    assert task["schedule_kind"] == "cron"
    assert task["cron_expression"] == "0 9 * * 1-5"
    assert task["next_run_at"]


def test_task_condition_fields_and_last_success_roundtrip(tmp_path: Path) -> None:
    store = make_store(tmp_path)
    task = store.upsert_task(
        {
            "name": "条件化巡检",
            "assistant_id": "consult",
            "prompt": "检查系统健康状态",
            "schedule_kind": "interval",
            "interval_minutes": 20,
            "require_rag_connected": True,
            "require_channel_online": True,
            "min_success_gap_minutes": 90,
            "enabled": True,
            "target_channel": "weixin",
        },
        updated_by="tester",
    )

    assert task["require_rag_connected"] is True
    assert task["require_channel_online"] is True
    assert task["min_success_gap_minutes"] == 90

    store.record_task_run(task["id"], status="completed", result="ok")
    assert store.last_successful_task_run_at(task["id"])
