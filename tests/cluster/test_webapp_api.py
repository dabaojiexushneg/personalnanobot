from pathlib import Path

from fastapi.testclient import TestClient

from nanobot.cluster.runtime import AssistantCluster
from nanobot.cluster.webapp import create_cluster_app
from nanobot.config.loader import save_config
from nanobot.config.schema import Config


def make_dev_client(tmp_path: Path) -> TestClient:
    config = Config()
    config.cluster.data_root = str(tmp_path / "cluster")
    config.cluster.web.dev_mode = True
    config.cluster.web.auth_enabled = False
    config_path = tmp_path / "config.json"
    save_config(config, config_path)
    cluster = AssistantCluster(config, config_path=config_path, include_channels=False)
    app = create_cluster_app(cluster)
    app.state.cluster = cluster
    return TestClient(app)


def make_auth_client(tmp_path: Path) -> TestClient:
    config = Config()
    config.cluster.data_root = str(tmp_path / "cluster")
    config.cluster.web.dev_mode = True
    config.cluster.web.auth_enabled = True
    config.cluster.web.admin_password = "admin-secret-123"
    config_path = tmp_path / "config.json"
    save_config(config, config_path)
    cluster = AssistantCluster(config, config_path=config_path, include_channels=False)
    cluster.save_user(
        {
            "username": "viewer-user",
            "password": "viewer-secret-123",
            "role": "viewer",
            "enabled": True,
        }
    )
    app = create_cluster_app(cluster)
    app.state.cluster = cluster
    return TestClient(app)


def test_viewer_logout_clears_session_without_csrf(tmp_path: Path) -> None:
    with make_auth_client(tmp_path) as client:
        login_res = client.post(
            "/api/auth/login",
            json={"username": "viewer-user", "password": "viewer-secret-123"},
        )
        assert login_res.status_code == 200, login_res.text
        assert login_res.json()["user"]["role"] == "viewer"

        logout_res = client.post("/api/auth/logout")
        assert logout_res.status_code == 200, logout_res.text

        me_res = client.get("/api/auth/me")
        assert me_res.status_code == 401


def test_viewer_can_use_chat_endpoint(tmp_path: Path) -> None:
    with make_auth_client(tmp_path) as client:
        cluster = client.app.state.cluster

        async def fake_chat(**_: object) -> dict[str, object]:
            return {
                "assistant_id": "consult",
                "assistant_name": "AI 咨询助手",
                "content": "viewer chat ok",
                "content_style": "chat",
                "media": [],
                "usage": {"prompt_tokens": 1, "completion_tokens": 2, "total_tokens": 3},
            }

        cluster.chat = fake_chat
        login_res = client.post(
            "/api/auth/login",
            json={"username": "viewer-user", "password": "viewer-secret-123"},
        )
        assert login_res.status_code == 200, login_res.text
        csrf_token = login_res.json()["csrf_token"]

        chat_res = client.post(
            "/api/chat",
            json={
                "assistant_id": "consult",
                "content": "你好",
                "session_id": "test-session",
                "channel": "web",
                "chat_id": "web",
                "sync_enabled": True,
                "sync_channel": "weixin",
            },
            headers={"X-CSRF-Token": csrf_token},
        )

        assert chat_res.status_code == 200, chat_res.text
        payload = chat_res.json()
        assert payload["content"] == "viewer chat ok"
        assert "channel_sync" not in payload


def test_daily_token_usage_api_returns_trace_summary(tmp_path: Path) -> None:
    with make_dev_client(tmp_path) as client:
        cluster = client.app.state.cluster
        trace_id = cluster.control.create_trace(
            session_id="web:test",
            channel="web",
            chat_id="web",
            assistant_id="consult",
            request_content="统计今天 token",
        )
        cluster.control.finalize_trace(
            trace_id,
            response_content="ok",
            response_style="chat",
            media_count=0,
            status="completed",
            prompt_tokens=10,
            completion_tokens=5,
            total_tokens=15,
        )

        res = client.get("/api/token-usage/daily?days=3")

        assert res.status_code == 200, res.text
        payload = res.json()
        assert len(payload) == 3
        assert payload[-1]["trace_count"] == 1
        assert payload[-1]["prompt_tokens"] == 10
        assert payload[-1]["completion_tokens"] == 5
        assert payload[-1]["total_tokens"] == 15


def test_assistant_versions_and_task_fields_roundtrip(tmp_path: Path) -> None:
    with make_dev_client(tmp_path) as client:
        assistant_payload = {
            "id": "consult",
            "name": "AI 咨询助手",
            "description": "负责答疑和知识库问答",
            "persona_prompt": "你是一个专业咨询助手，回答时给出依据。",
            "prompt_version": 2,
            "prompt_change_note": "增加引用要求",
            "daily_token_limit": 6000,
            "provider": "dashscope",
            "model": "qwen3.5-plus",
            "tool_names": ["web_search"],
            "enabled_skills": [],
            "disabled_skills": [],
            "mcp_servers": {},
            "routing": {"aliases": ["咨询"], "keywords": ["问答"]},
            "enabled": True,
        }
        save_res = client.put("/api/assistants/consult", json=assistant_payload)
        assert save_res.status_code == 200, save_res.text
        assert save_res.json()["daily_token_limit"] == 6000

        versions_res = client.get("/api/assistants/consult/versions")
        assert versions_res.status_code == 200, versions_res.text
        assert versions_res.json()
        assert versions_res.json()[-1]["change_note"] == "增加引用要求"

        task_res = client.post(
            "/api/tasks",
            json={
                "name": "知识库摘要",
                "assistant_id": "consult",
                "prompt": "整理今天的知识库摘要",
                "task_kind": "knowledge_digest",
                "collaboration_mode": "always",
                "schedule_kind": "interval",
                "interval_minutes": 30,
                "require_rag_connected": True,
                "require_channel_online": False,
                "min_success_gap_minutes": 45,
                "max_retries": 2,
                "retry_backoff_seconds": 120,
                "enabled": True,
                "target_channel": "",
                "target_chat_id": "",
            },
        )
        assert task_res.status_code == 200, task_res.text
        payload = task_res.json()
        assert payload["task_kind"] == "knowledge_digest"
        assert payload["collaboration_mode"] == "always"
        assert payload["require_rag_connected"] is True
        assert payload["require_channel_online"] is False
        assert payload["min_success_gap_minutes"] == 45
        assert payload["condition_evaluation"]["items"]
        assert payload["max_retries"] == 2
        assert payload["retry_backoff_seconds"] == 120

        cron_task_res = client.post(
            "/api/tasks",
            json={
                "name": "工作日晨报",
                "assistant_id": "consult",
                "prompt": "整理今天的晨报",
                "task_kind": "report",
                "collaboration_mode": "auto",
                "schedule_kind": "cron",
                "cron_expression": "0 9 * * 1-5",
                "interval_minutes": 0,
                "require_rag_connected": False,
                "require_channel_online": True,
                "min_success_gap_minutes": 120,
                "max_retries": 1,
                "retry_backoff_seconds": 60,
                "enabled": True,
                "target_channel": "weixin",
                "target_chat_id": "",
            },
        )
        assert cron_task_res.status_code == 200, cron_task_res.text
        cron_payload = cron_task_res.json()
        assert cron_payload["schedule_kind"] == "cron"
        assert cron_payload["collaboration_mode"] == "auto"
        assert cron_payload["cron_expression"] == "0 9 * * 1-5"
        assert cron_payload["require_channel_online"] is True
        assert cron_payload["min_success_gap_minutes"] == 120
        assert cron_payload["condition_evaluation"]["items"]

        list_res = client.get("/api/tasks")
        assert list_res.status_code == 200, list_res.text
        tasks = list_res.json()
        assert tasks
        assert any(task["schedule_kind"] == "cron" for task in tasks)
        assert any(task["require_rag_connected"] is True for task in tasks)
        assert any(task["require_channel_online"] is True for task in tasks)
        assert all("condition_evaluation" in task for task in tasks)

        run_res = client.post(f"/api/tasks/{payload['id']}/run")
        assert run_res.status_code == 200, run_res.text
        run_payload = run_res.json()
        assert run_payload["status"] == "skipped"
        assert run_payload["skip_reason"]

        refreshed_tasks = client.get("/api/tasks")
        assert refreshed_tasks.status_code == 200, refreshed_tasks.text
        skipped_task = next(task for task in refreshed_tasks.json() if task["id"] == payload["id"])
        assert skipped_task["last_status"] == "skipped"
        assert skipped_task["last_result"]
