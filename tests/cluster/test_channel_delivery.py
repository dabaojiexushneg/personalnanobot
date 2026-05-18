import pytest

from nanobot.cluster.runtime import AssistantCluster


class _FakeSessions:
    def __init__(self, rows):
        self._rows = rows

    def list_sessions(self):
        return self._rows


class _FakeRuntime:
    def __init__(self, rows):
        self.sessions = _FakeSessions(rows)


class _FakeChannelManager:
    def __init__(self):
        self.enabled_channels = ["qq", "weixin"]
        self.sent = []

    async def send_now(self, msg):
        self.sent.append(msg)


def test_list_channel_targets_deduplicates_recent_targets():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster.runtimes = {
        "consult": _FakeRuntime([
            {"key": "consult:qq:openid-1", "updated_at": "2026-04-14T12:00:00"},
            {"key": "consult:web:web:default", "updated_at": "2026-04-14T11:00:00"},
        ]),
        "writer": _FakeRuntime([
            {"key": "writer:weixin:user-2", "updated_at": "2026-04-14T13:00:00"},
            {"key": "writer:qq:openid-1", "updated_at": "2026-04-14T10:00:00"},
        ]),
    }

    targets = cluster.list_channel_targets()

    assert targets == [
        {
            "channel": "weixin",
            "chat_id": "user-2",
            "assistant_id": "writer",
            "updated_at": "2026-04-14T13:00:00",
        },
        {
            "channel": "qq",
            "chat_id": "openid-1",
            "assistant_id": "consult",
            "updated_at": "2026-04-14T12:00:00",
        },
    ]


def test_resolve_default_channel_target_prefers_selected_assistant():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster.runtimes = {
        "consult": _FakeRuntime([
            {"key": "consult:qq:openid-1", "updated_at": "2026-04-14T12:00:00"},
        ]),
        "writer": _FakeRuntime([
            {"key": "writer:qq:openid-2", "updated_at": "2026-04-14T13:00:00"},
        ]),
    }

    assert cluster.resolve_default_channel_target(channel="qq", assistant_id="consult") == "openid-1"
    assert cluster.resolve_default_channel_target(channel="qq") == "openid-2"


@pytest.mark.asyncio
async def test_send_channel_message_uses_channel_manager():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._channel_manager = _FakeChannelManager()
    cluster.resolve_default_channel_target = lambda **kwargs: "openid-1"

    result = await cluster.send_channel_message(
        channel="qq",
        chat_id="",
        assistant_id="consult",
        content="你好",
    )

    assert result["status"] == "sent"
    assert cluster._channel_manager.sent[0].channel == "qq"
    assert cluster._channel_manager.sent[0].chat_id == "openid-1"
    assert cluster._channel_manager.sent[0].content == "你好"
