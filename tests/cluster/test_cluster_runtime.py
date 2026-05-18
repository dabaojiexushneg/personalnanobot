import asyncio
import sys
from datetime import datetime
from types import SimpleNamespace

import pytest

from nanobot.bus.events import InboundMessage
from nanobot.bus.events import OutboundMessage
from nanobot.bus.queue import MessageBus
from nanobot.cluster.collaboration import MultiAgentCollaborator
from nanobot.cluster.task_runner import ClusterTaskRunner
from nanobot.config.schema import MCPServerConfig
from nanobot.cluster.runtime import AssistantCluster


def test_non_text_turn_is_deferred_only_for_media():
    assert AssistantCluster._should_defer_non_text("", ["a.png"])
    assert AssistantCluster._should_defer_non_text("   ", ["a.png"])
    assert AssistantCluster._should_defer_non_text("[image]\n[Image: source: /tmp/a.png]", ["/tmp/a.png"])
    assert AssistantCluster._should_defer_non_text("[file: demo.pdf]\n[File: source: /tmp/demo.pdf]", ["/tmp/demo.pdf"])
    assert AssistantCluster._should_defer_non_text(
        "[File]\nReceived files:\n- demo.7z\n  saved: D:\\agent\\nanobot\\.runtime\\media\\qq\\demo.7z",
        [r"D:\agent\nanobot\.runtime\media\qq\demo.7z"],
    )
    assert not AssistantCluster._should_defer_non_text("请分析这个文件", ["a.png"])
    assert not AssistantCluster._should_defer_non_text("[image]\n请放到桌面", ["a.png"])
    assert not AssistantCluster._should_defer_non_text("[voice] 帮我总结一下", ["a.wav"])
    assert not AssistantCluster._should_defer_non_text("", [])


def test_pending_media_queue_deduplicates_and_consumes():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._pending_media = {}

    cluster._queue_pending_media("web:demo", ["a.png", "a.png"])
    cluster._queue_pending_media("web:demo", ["b.png"])

    merged = cluster._consume_pending_media("web:demo", ["b.png", "c.png"])

    assert merged == ["a.png", "b.png", "c.png"]
    assert cluster._consume_pending_media("web:demo") == []


def test_knowledge_context_requires_explicit_user_request():
    assert not AssistantCluster._should_use_knowledge_context("你好，今天吃什么")
    assert not AssistantCluster._should_use_knowledge_context("知识库是怎么搭建的？")
    assert not AssistantCluster._should_use_knowledge_context("RAG 的原理是什么？")

    assert AssistantCluster._should_use_knowledge_context("请根据知识库告诉我宽带什么时候扣费")
    assert AssistantCluster._should_use_knowledge_context("基于当前知识库完成任务")
    assert AssistantCluster._should_use_knowledge_context("查一下知识库里视频会员异地登录怎么处理")
    assert AssistantCluster._should_use_knowledge_context("请参考上传的文档回答这个问题")
    assert AssistantCluster._should_use_knowledge_context("请结合资料总结一下续费提醒规则")


def test_merge_knowledge_context_skips_search_without_trigger():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._control_store = lambda: object()
    called = {"count": 0}

    def search_knowledge(*args, **kwargs):
        called["count"] += 1
        return [{"title": "demo", "retrieval": ["bm25"], "score": 1.0, "content": "demo"}]

    cluster.search_knowledge = search_knowledge

    content, hits = cluster._merge_knowledge_context("consult", "你好，帮我写一段话")

    assert content == "你好，帮我写一段话"
    assert hits == []
    assert called["count"] == 0


def test_merge_knowledge_context_searches_with_explicit_trigger():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._control_store = lambda: object()
    cluster.search_knowledge = lambda *args, **kwargs: [
        {"title": "个人生活账号助手演示知识库", "retrieval": ["bm25"], "score": 0.9, "content": "家庭宽带每月 18 日扣费。"}
    ]

    content, hits = cluster._merge_knowledge_context("consult", "请根据知识库告诉我宽带什么时候扣费")

    assert len(hits) == 1
    assert "以下是与你当前问题最相关的知识库内容" in content
    assert "家庭宽带每月 18 日扣费" in content


def test_list_mcp_servers_includes_global_and_assistant_sources():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster.config = SimpleNamespace(
        tools=SimpleNamespace(
            mcp_servers={
                "filesystem": MCPServerConfig(
                    type="stdio",
                    command="npx",
                    args=["@modelcontextprotocol/server-filesystem", "D:/agent/nanobot"],
                ),
            },
        ),
    )
    cluster.service = SimpleNamespace(
        list_assistants=lambda: [
            SimpleNamespace(
                name="AI 开发助手",
                mcp_servers={
                    "webSearch": MCPServerConfig(
                        type="stdio",
                        command="npx",
                        args=["@asdrubalinasmyth/web-search-mcp"],
                    ),
                },
            ),
        ],
    )

    catalog = cluster.list_mcp_servers()

    assert catalog[0]["name"] == "filesystem"
    assert "全局" in catalog[0]["sources"]
    assert catalog[0]["valid"] is True
    assert catalog[1]["name"] == "webSearch"
    assert "AI 开发助手" in catalog[1]["sources"]


def test_validate_mcp_servers_reports_invalid_stdio_config():
    cluster = AssistantCluster.__new__(AssistantCluster)

    result = cluster.validate_mcp_servers(
        {
            "broken": {
                "type": "stdio",
                "command": "",
                "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
            },
        }
    )

    assert result["valid"] is False
    assert result["servers"][0]["name"] == "broken"
    assert result["servers"][0]["issues"]


def test_validate_mcp_servers_accepts_valid_http_config():
    cluster = AssistantCluster.__new__(AssistantCluster)

    result = cluster.validate_mcp_servers(
        {
            "remote": {
                "type": "streamableHttp",
                "url": "http://127.0.0.1:3000/mcp",
                "enabledTools": ["*"],
            },
        }
    )

    assert result["valid"] is True
    assert result["servers"][0]["transport"] == "streamableHttp"


def test_validate_mcp_servers_accepts_existing_command_path():
    cluster = AssistantCluster.__new__(AssistantCluster)

    result = cluster.validate_mcp_servers(
        {
            "python": {
                "type": "stdio",
                "command": sys.executable,
                "args": ["-V"],
            },
        }
    )

    assert result["valid"] is True


def test_resolve_default_channel_target_falls_back_to_channel_latest():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster.list_channel_targets = lambda: [
        {"channel": "weixin", "chat_id": "wx_latest", "assistant_id": "consult", "updated_at": "2"},
        {"channel": "qq", "chat_id": "qq_latest", "assistant_id": "developer", "updated_at": "1"},
    ]

    assert cluster.resolve_default_channel_target(channel="weixin", assistant_id="image") == "wx_latest"


async def _fake_ask_with_image(**kwargs):
    return None, [
        OutboundMessage(
            channel="web",
            chat_id="web",
            content="这是为您生成的西红柿鸡蛋面图片",
            media=[r"D:\agent\nanobot\.runtime\cluster\assistants\image\workspace\generated_images\demo.png"],
        )
    ]


def test_chat_returns_media_from_message_tool():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._pending_media = {}
    cluster.config = SimpleNamespace(cluster=SimpleNamespace(auto_route=False))
    assistant = SimpleNamespace(id="image", name="AI 生图助手", enabled=True)
    cluster.service = SimpleNamespace(
        get_assistant=lambda assistant_id: assistant,
        get_default_assistant_id=lambda: "image",
    )
    cluster.runtimes = {
        "image": SimpleNamespace(
            assistant=assistant,
            ask=_fake_ask_with_image,
            usage_snapshot=lambda: {
                "prompt_tokens": 120,
                "completion_tokens": 36,
                "total_tokens": 156,
            },
        )
    }
    cluster.runtime_errors = {}
    cluster.route_request = lambda **kwargs: SimpleNamespace(
        assistant_id="image",
        content=kwargs["content"],
        changed_binding=False,
        direct_response=False,
    )

    import asyncio

    result = asyncio.run(
        cluster.chat(
            assistant_id="image",
            content="让bot给我生成一张西红柿鸡蛋面的图片",
            session_id="web:test",
            channel="web",
            chat_id="web",
            media=[],
        )
    )

    assert result["content"] == "这是为您生成的西红柿鸡蛋面图片"
    assert result["media"][0]["path"].endswith("demo.png")
    assert result["usage"]["total_tokens"] == 156


async def _fake_ask_with_progress_noise(**kwargs):
    return OutboundMessage(
        channel="web",
        chat_id="web",
        content="好的，我已经分析了这张图片。以下是内容总结：图片信息总结",
    ), [
        OutboundMessage(
            channel="web",
            chat_id="web",
            content='filesystem::move_file("a", "b")',
            metadata={"_progress": True, "_tool_hint": True},
        ),
        OutboundMessage(
            channel="web",
            chat_id="web",
            content='read "D:/tmp/demo.png"',
            metadata={"_progress": True, "_tool_hint": True},
        ),
    ]


def test_chat_ignores_progress_messages_in_final_content():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._pending_media = {}
    cluster.config = SimpleNamespace(cluster=SimpleNamespace(auto_route=False))
    assistant = SimpleNamespace(id="consult", name="AI 咨询助手", enabled=True)
    cluster.service = SimpleNamespace(
        get_assistant=lambda assistant_id: assistant,
        get_default_assistant_id=lambda: "consult",
    )
    cluster.runtimes = {
        "consult": SimpleNamespace(
            assistant=assistant,
            ask=_fake_ask_with_progress_noise,
            usage_snapshot=lambda: {
                "prompt_tokens": 88,
                "completion_tokens": 52,
                "total_tokens": 140,
            },
        )
    }
    cluster.runtime_errors = {}
    cluster.route_request = lambda **kwargs: SimpleNamespace(
        assistant_id="consult",
        content=kwargs["content"],
        changed_binding=False,
        direct_response=False,
    )

    import asyncio

    result = asyncio.run(
        cluster.chat(
            assistant_id="consult",
            content="让bot分析一张图片的内容，总结发给我",
            session_id="web:test",
            channel="web",
            chat_id="web",
            media=[r"D:\agent\nanobot\.runtime\web_uploads\web_test\demo.png"],
        )
    )

    assert result["content"] == "好的，我已经分析了这张图片。以下是内容总结：图片信息总结"
    assert "filesystem::move_file" not in result["content"]
    assert 'read "D:/tmp/demo.png"' not in result["content"]
    assert result["usage"]["prompt_tokens"] == 88


def test_collaborator_auto_mode_skips_image_and_media():
    cluster = SimpleNamespace(
        config=SimpleNamespace(
            cluster=SimpleNamespace(
                collaboration=SimpleNamespace(
                    mode="auto",
                    min_content_length=24,
                    auto_keywords=["架构", "方案"],
                )
            )
        )
    )
    collaborator = MultiAgentCollaborator(cluster)

    assert collaborator.should_collaborate(
        assistant_id="consult",
        content="请给我一份系统架构方案",
        media=[],
    )
    assert not collaborator.should_collaborate(
        assistant_id="image",
        content="请给我一份系统架构方案",
        media=[],
    )
    assert not collaborator.should_collaborate(
        assistant_id="consult",
        content="看图",
        media=["a.png"],
    )


def test_chat_uses_collaboration_when_enabled():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._pending_media = {}
    cluster._session_locks = {}
    cluster.config = SimpleNamespace(
        cluster=SimpleNamespace(
            auto_route=False,
            collaboration=SimpleNamespace(mode="always"),
        )
    )
    assistant = SimpleNamespace(id="consult", name="AI 咨询助手", enabled=True, daily_token_limit=None)
    cluster.service = SimpleNamespace(
        get_assistant=lambda assistant_id: assistant,
        get_default_assistant_id=lambda: "consult",
    )
    cluster.runtimes = {
        "consult": SimpleNamespace(
            assistant=assistant,
        )
    }
    cluster.runtime_errors = {}
    cluster.route_request = lambda **kwargs: SimpleNamespace(
        assistant_id="consult",
        content=kwargs["content"],
        changed_binding=False,
        direct_response=False,
    )
    cluster._control_store = lambda: None
    cluster._assistant_token_usage_today = lambda assistant_id: 0
    cluster._merge_upload_context = lambda content, media: content
    cluster._merge_knowledge_context = lambda assistant_id, content: (content, [])

    async def _fake_execute(**kwargs):
        return {
            "assistant_id": "consult",
            "assistant_name": "AI 咨询助手",
            "content": "这是多助手协同后的最终结论。",
            "changed_binding": False,
            "deferred": False,
            "content_style": "chat",
            "citations": [],
            "quota": {"daily_token_limit": None, "daily_token_usage": 0},
            "media": [],
            "usage": {
                "prompt_tokens": 120,
                "completion_tokens": 36,
                "total_tokens": 156,
            },
            "collaboration": {
                "planner_assistant_id": "expert",
                "synthesis_assistant_id": "consult",
                "worker_assistant_ids": ["consult", "developer"],
                "worker_results": [],
            },
        }

    cluster.collaborator = SimpleNamespace(
        should_collaborate=lambda **kwargs: True,
        execute=_fake_execute,
    )

    result = asyncio.run(
        cluster.chat(
            assistant_id="consult",
            content="请多助手一起给我做一个系统设计方案",
            session_id="web:test",
            channel="web",
            chat_id="web",
            media=[],
        )
    )

    assert result["content"] == "这是多助手协同后的最终结论。"
    assert result["collaboration"]["planner_assistant_id"] == "expert"
    assert result["usage"]["total_tokens"] == 156


def test_collaborator_falls_back_when_summary_model_fails():
    class FakeControl:
        def __init__(self) -> None:
            self.events: list[dict] = []

        def add_trace_event(self, trace_id, event_type, content, metadata=None):
            self.events.append({
                "event_type": event_type,
                "content": content,
                "metadata": metadata or {},
            })

    class FakeRuntime:
        def __init__(self, assistant_id: str, name: str, content: str):
            self.assistant = SimpleNamespace(
                id=assistant_id,
                name=name,
                enabled=True,
                description=f"{name} 说明",
            )
            self._content = content

        async def ask(self, **kwargs):
            return OutboundMessage(channel="web", chat_id="web", content=self._content), []

        def usage_snapshot(self):
            return {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2}

    control = FakeControl()
    cluster = SimpleNamespace(
        config=SimpleNamespace(
            cluster=SimpleNamespace(
                collaboration=SimpleNamespace(
                    mode="always",
                    planner_assistant_id="expert",
                    synthesis_assistant_id="expert",
                    worker_assistant_ids=["consult", "developer"],
                    max_workers=2,
                    execution_mode="parallel",
                    auto_keywords=[],
                    min_content_length=1,
                )
            )
        ),
        control=control,
        runtimes={
            "expert": FakeRuntime("expert", "AI 智能专家", "协同计划"),
            "consult": FakeRuntime("consult", "AI 咨询助手", "咨询助手结果"),
            "developer": FakeRuntime("developer", "AI 开发助手", "开发助手结果"),
        },
        _merge_knowledge_context=lambda assistant_id, content: (content, []),
        _collect_user_facing_emitted=lambda emitted: [],
    )
    collaborator = MultiAgentCollaborator(cluster)

    async def _run():
        original_run_prompt = collaborator._run_prompt

        async def _run_prompt(**kwargs):
            if kwargs["assistant_id"] == "expert" and kwargs["session_key"].endswith(":synthesis"):
                raise RuntimeError("summary quota exhausted")
            if kwargs["assistant_id"] == "developer":
                raise RuntimeError("worker quota exhausted")
            return await original_run_prompt(**kwargs)

        collaborator._run_prompt = _run_prompt
        return await collaborator.execute(
            route_assistant_id="consult",
            content="请做综合分析",
            session_id="s1",
            channel="web",
            chat_id="web",
            trace_id="trace-1",
        )

    result = asyncio.run(_run())

    assert "降级汇总" in result["content"]
    assert result["collaboration"]["worker_results"][0]["status"] == "completed"
    assert result["collaboration"]["worker_results"][1]["status"] == "failed"
    assert any(item["metadata"].get("status") == "fallback" for item in control.events)


async def _fake_ask_channel_reply(**kwargs):
    return OutboundMessage(
        channel="qq",
        chat_id="qq-user",
        content="已经处理好了，这是最终回复。",
    ), []


def test_route_inbound_bus_publishes_final_channel_reply():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._pending_media = {}
    cluster._running = True
    cluster.bus = MessageBus()
    cluster.service = SimpleNamespace(get_assistant=lambda assistant_id: None)
    assistant = SimpleNamespace(id="consult", name="AI 咨询助手", enabled=True)
    cluster.runtimes = {
        "consult": SimpleNamespace(
            assistant=assistant,
            ask=_fake_ask_channel_reply,
            usage_snapshot=lambda: {
                "prompt_tokens": 24,
                "completion_tokens": 16,
                "total_tokens": 40,
            },
        )
    }
    cluster.runtime_errors = {}
    cluster.route_request = lambda **kwargs: SimpleNamespace(
        assistant_id="consult",
        content=kwargs["content"],
        changed_binding=False,
        direct_response=False,
    )

    import asyncio

    async def _run():
        task = asyncio.create_task(cluster._route_inbound_bus())
        await cluster.bus.publish_inbound(
            InboundMessage(
                channel="qq",
                sender_id="user-1",
                chat_id="qq-user",
                content="你好",
                metadata={"message_id": "mid-1"},
            )
        )
        outbound = await asyncio.wait_for(cluster.bus.consume_outbound(), timeout=1)
        cluster._running = False
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
        return outbound

    outbound = asyncio.run(_run())

    assert outbound.channel == "qq"
    assert outbound.chat_id == "qq-user"
    assert outbound.content == "[AI 咨询助手] 已经处理好了，这是最终回复。"


def test_route_request_supports_chinese_switch_passphrase():
    cluster = AssistantCluster.__new__(AssistantCluster)
    bindings: list[tuple[str, str, str]] = []
    assistants = [
        SimpleNamespace(
            id="developer",
            name="AI 开发助手",
            routing=SimpleNamespace(aliases=["开发", "code", "dev"]),
        ),
        SimpleNamespace(
            id="consult",
            name="AI 咨询助手",
            routing=SimpleNamespace(aliases=["咨询", "help"]),
        ),
    ]
    cluster.service = SimpleNamespace(
        get_enabled_assistants=lambda: assistants,
        get_default_assistant_id=lambda: "consult",
        get_assistant=lambda assistant_id: next((a for a in assistants if a.id == assistant_id), None),
        set_binding=lambda channel, chat_id, assistant_id: bindings.append((channel, chat_id, assistant_id)),
        get_binding=lambda channel, chat_id: None,
    )
    cluster.config = SimpleNamespace(cluster=SimpleNamespace(auto_route=False))

    result = cluster.route_request(
        content="切换到开发助手",
        channel="qq",
        chat_id="qq-user",
    )

    assert result.assistant_id == "developer"
    assert result.direct_response is True
    assert result.changed_binding is True
    assert "已切换到 AI 开发助手" in result.content
    assert bindings == [("qq", "qq-user", "developer")]


def test_route_request_supports_assistant_help_passphrase():
    cluster = AssistantCluster.__new__(AssistantCluster)
    assistants = [
        SimpleNamespace(
            id="consult",
            name="AI 咨询助手",
            routing=SimpleNamespace(aliases=["咨询"]),
        ),
    ]
    cluster.service = SimpleNamespace(
        get_enabled_assistants=lambda: assistants,
        get_default_assistant_id=lambda: "consult",
        get_assistant=lambda assistant_id: assistants[0],
        set_binding=lambda channel, chat_id, assistant_id: None,
        get_binding=lambda channel, chat_id: None,
    )
    cluster.config = SimpleNamespace(cluster=SimpleNamespace(auto_route=False))

    result = cluster.route_request(
        content="助手口令",
        channel="weixin",
        chat_id="wx-user",
    )

    assert result.assistant_id == "consult"
    assert result.direct_response is True
    assert "切换到咨询助手" in result.content


def test_chat_blocks_when_daily_token_limit_reached():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._pending_media = {}
    cluster.config = SimpleNamespace(cluster=SimpleNamespace(auto_route=False))
    assistant = SimpleNamespace(id="consult", name="AI 咨询助手", enabled=True, daily_token_limit=100)
    cluster.service = SimpleNamespace(
        get_assistant=lambda assistant_id: assistant,
        get_default_assistant_id=lambda: "consult",
    )
    cluster.control = SimpleNamespace(assistant_token_usage_today=lambda assistant_id: 120)
    cluster.runtimes = {
        "consult": SimpleNamespace(
            assistant=assistant,
            ask=_fake_ask_channel_reply,
            usage_snapshot=lambda: {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
        )
    }
    cluster.runtime_errors = {}
    cluster.route_request = lambda **kwargs: SimpleNamespace(
        assistant_id="consult",
        content=kwargs["content"],
        changed_binding=False,
        direct_response=False,
    )

    import asyncio

    with pytest.raises(ValueError, match="今日 token 配额上限"):
        asyncio.run(
            cluster.chat(
                assistant_id="consult",
                content="你好",
                session_id="web:test",
                channel="web",
                chat_id="web",
                media=[],
            )
        )


def test_chat_serializes_same_session_requests():
    cluster = AssistantCluster.__new__(AssistantCluster)
    cluster._pending_media = {}
    cluster.config = SimpleNamespace(cluster=SimpleNamespace(auto_route=False))
    assistant = SimpleNamespace(id="consult", name="AI 咨询助手", enabled=True, daily_token_limit=None)
    timeline: list[str] = []

    async def _slow_ask(**kwargs):
        import asyncio

        timeline.append(f"start:{kwargs['content']}")
        await asyncio.sleep(0.05)
        timeline.append(f"end:{kwargs['content']}")
        return OutboundMessage(channel="web", chat_id="web", content=f"done:{kwargs['content']}"), []

    cluster.service = SimpleNamespace(
        get_assistant=lambda assistant_id: assistant,
        get_default_assistant_id=lambda: "consult",
    )
    cluster.control = SimpleNamespace(assistant_token_usage_today=lambda assistant_id: 0)
    cluster.runtimes = {
        "consult": SimpleNamespace(
            assistant=assistant,
            ask=_slow_ask,
            usage_snapshot=lambda: {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2},
        )
    }
    cluster.runtime_errors = {}
    cluster.route_request = lambda **kwargs: SimpleNamespace(
        assistant_id="consult",
        content=kwargs["content"],
        changed_binding=False,
        direct_response=False,
    )

    import asyncio

    async def _run():
        return await asyncio.gather(
            cluster.chat(
                assistant_id="consult",
                content="first",
                session_id="shared-session",
                channel="web",
                chat_id="web",
                media=[],
            ),
            cluster.chat(
                assistant_id="consult",
                content="second",
                session_id="shared-session",
                channel="web",
                chat_id="web",
                media=[],
            ),
        )

    result = asyncio.run(_run())

    assert [item["content"] for item in result] == ["done:first", "done:second"]
    assert timeline == ["start:first", "end:first", "start:second", "end:second"]


def test_task_runner_skips_when_rag_condition_not_met():
    class FakeControl:
        def __init__(self) -> None:
            self.runs: list[dict] = []

        def get_task(self, task_id: str) -> dict:
            return {
                "id": task_id,
                "assistant_id": "consult",
                "prompt": "巡检一下",
                "target_channel": "weixin",
                "require_rag_connected": True,
                "require_channel_online": True,
                "min_success_gap_minutes": 0,
            }

        def record_task_run(self, task_id: str, **kwargs) -> None:
            self.runs.append({"task_id": task_id, **kwargs})

        def last_successful_task_run_at(self, task_id: str) -> str | None:
            return None

    cluster = SimpleNamespace(
        control=FakeControl(),
        rag_status=lambda: {"connected": False},
        channel_status=lambda: {"weixin": {"enabled": True, "running": True}},
        chat=lambda **kwargs: pytest.fail("chat should not run when task conditions fail"),
    )

    import asyncio

    result = asyncio.run(ClusterTaskRunner(cluster).execute_task("task-1"))

    assert result["status"] == "skipped"
    assert "RAG / Milvus" in result["skip_reason"]
    assert cluster.control.runs[0]["status"] == "skipped"


def test_task_runner_skips_when_recent_success_gap_not_met():
    class FakeControl:
        def __init__(self) -> None:
            self.runs: list[dict] = []

        def get_task(self, task_id: str) -> dict:
            return {
                "id": task_id,
                "assistant_id": "consult",
                "prompt": "巡检一下",
                "target_channel": "",
                "require_rag_connected": False,
                "require_channel_online": False,
                "min_success_gap_minutes": 30,
            }

        def record_task_run(self, task_id: str, **kwargs) -> None:
            self.runs.append({"task_id": task_id, **kwargs})

        def last_successful_task_run_at(self, task_id: str) -> str | None:
            return datetime.now().astimezone().isoformat()

    cluster = SimpleNamespace(
        control=FakeControl(),
        rag_status=lambda: {"connected": True},
        channel_status=lambda: {},
        chat=lambda **kwargs: pytest.fail("chat should not run when task gap condition fails"),
    )

    import asyncio

    result = asyncio.run(ClusterTaskRunner(cluster).execute_task("task-2"))

    assert result["status"] == "skipped"
    assert "距离上次成功执行不足" in result["skip_reason"]
    assert cluster.control.runs[0]["status"] == "skipped"


def test_task_runner_passes_collaboration_mode_to_chat():
    class FakeControl:
        def __init__(self) -> None:
            self.runs: list[dict] = []

        def get_task(self, task_id: str) -> dict:
            return {
                "id": task_id,
                "assistant_id": "consult",
                "prompt": "做一份综合分析",
                "target_channel": "",
                "target_chat_id": "",
                "require_rag_connected": False,
                "require_channel_online": False,
                "min_success_gap_minutes": 0,
                "collaboration_mode": "always",
            }

        def record_task_run(self, task_id: str, **kwargs) -> None:
            self.runs.append({"task_id": task_id, **kwargs})

        def list_task_runs(self, task_id: str, limit: int = 20) -> list[dict]:
            return []

    calls: list[dict] = []

    async def _chat(**kwargs):
        calls.append(kwargs)
        return {
            "assistant_id": "consult",
            "content": "协同任务完成",
            "media": [],
        }

    cluster = SimpleNamespace(
        control=FakeControl(),
        rag_status=lambda: {"connected": True},
        channel_status=lambda: {},
        chat=_chat,
    )

    result = asyncio.run(ClusterTaskRunner(cluster).execute_task("task-3"))

    assert result["content"] == "协同任务完成"
    assert calls[0]["collaboration_mode"] == "always"
    assert cluster.control.runs[0]["status"] == "completed"
