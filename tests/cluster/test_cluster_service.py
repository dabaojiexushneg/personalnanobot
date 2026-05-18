from pathlib import Path

import pytest

from nanobot.cluster.service import ClusterConfigService
from nanobot.config.schema import Config


def test_required_assistant_cannot_be_deleted(tmp_path: Path):
    config = Config()
    config.cluster.data_root = str(tmp_path / "cluster")
    service = ClusterConfigService(config)

    with pytest.raises(ValueError):
        service.delete_assistant("developer")


def test_binding_roundtrip(tmp_path: Path):
    config = Config()
    config.cluster.data_root = str(tmp_path / "cluster")
    service = ClusterConfigService(config)

    service.set_binding("qq", "chat-1", "writer")

    assert service.get_binding("qq", "chat-1") == "writer"
    service.clear_binding("qq", "chat-1")
    assert service.get_binding("qq", "chat-1") is None


def test_last_active_assistant_roundtrip(tmp_path: Path):
    config = Config()
    config.cluster.data_root = str(tmp_path / "cluster")
    service = ClusterConfigService(config)

    service.set_binding("weixin", "chat-2", "developer")

    assert service.get_last_active_assistant_id() == "developer"


def test_upsert_assistant_records_prompt_versions(tmp_path: Path):
    config = Config()
    config.cluster.data_root = str(tmp_path / "cluster")
    service = ClusterConfigService(config)

    service.upsert_assistant(
        {
            "id": "consult",
            "name": "AI 咨询助手",
            "persona_prompt": "你是一个稳健的咨询助手。",
            "provider": "dashscope",
            "model": "qwen3.5-plus",
        },
        changed_by="tester-a",
    )
    updated = service.upsert_assistant(
        {
            "id": "consult",
            "name": "AI 咨询助手",
            "persona_prompt": "你是一个稳健的咨询助手，并且回答时补充引用来源。",
            "prompt_change_note": "补充 RAG 引用规范",
            "provider": "dashscope",
            "model": "qwen3.5-plus",
        },
        changed_by="tester-b",
    )

    history = service.list_assistant_versions("consult")

    assert updated.prompt_version >= 2
    assert history[-1]["changed_by"] == "tester-b"
    assert history[-1]["change_note"] == "补充 RAG 引用规范"
    assert "引用来源" in history[-1]["persona_prompt"]
