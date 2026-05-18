from nanobot.utils.helpers import detect_response_style, prettify_response_text


def test_prettify_response_text_strips_common_markdown() -> None:
    text = (
        "# 今日建议\n\n"
        "**先做这两件事：**\n"
        "- 检查持仓\n"
        "- 控制仓位\n\n"
        "`风险提示`\n"
        "[官网](https://example.com)\n"
    )

    result = prettify_response_text(text)

    assert "#" not in result
    assert "**" not in result
    assert "`" not in result
    assert "今日建议" in result
    assert "- 检查持仓" in result
    assert "- 控制仓位" in result
    assert "官网（https://example.com）" in result


def test_prettify_response_text_flattens_code_fences_and_tables() -> None:
    text = (
        "```python\nprint('hello')\n```\n\n"
        "| 项目 | 状态 |\n"
        "| --- | --- |\n"
        "| 微信 | 正常 |\n"
    )

    result = prettify_response_text(text)

    assert "```" not in result
    assert "python" not in result
    assert "print('hello')" in result
    assert "项目 · 状态" in result
    assert "微信 · 正常" in result


def test_detect_response_style_marks_command_reply_as_code() -> None:
    text = "请按下面执行：\npython -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npip install -e ."

    assert detect_response_style(text) == "code"


def test_detect_response_style_keeps_regular_reply_as_chat() -> None:
    text = "已经处理好了。现在你可以直接刷新页面，再试一次图片生成。"

    assert detect_response_style(text) == "chat"
