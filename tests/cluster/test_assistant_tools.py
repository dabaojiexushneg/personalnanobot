from nanobot.config.schema import build_default_cluster_assistants


def test_all_default_cluster_assistants_can_send_messages():
    assistants = build_default_cluster_assistants()
    assert assistants
    for assistant in assistants:
        assert "message" in assistant.tool_names
