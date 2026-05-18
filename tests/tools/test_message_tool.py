import pytest

from nanobot.agent.tools.message import MessageTool
from nanobot.bus.events import OutboundMessage


@pytest.mark.asyncio
async def test_message_tool_returns_error_when_no_target_context() -> None:
    tool = MessageTool()
    result = await tool.execute(content="test")
    assert result == "Error: No target channel/chat specified"


@pytest.mark.asyncio
async def test_message_tool_prettifies_markdown_before_sending() -> None:
    sent: list[OutboundMessage] = []

    async def _capture(msg: OutboundMessage) -> None:
        sent.append(msg)

    tool = MessageTool(send_callback=_capture)
    tool.set_context("weixin", "user-1")

    result = await tool.execute(
        content="# 标题\n\n**你好**\n- 第一项\n[官网](https://example.com)"
    )

    assert result == "Message sent to weixin:user-1"
    assert len(sent) == 1
    assert sent[0].content == "标题\n\n你好\n- 第一项\n官网（https://example.com）"
