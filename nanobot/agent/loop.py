"""Agent loop: the core processing engine."""

from __future__ import annotations

import asyncio
import dataclasses
import json
import os
import time
from contextlib import AsyncExitStack, nullcontext
from pathlib import Path
from typing import TYPE_CHECKING, Any, Awaitable, Callable

from loguru import logger

from nanobot.agent.autocompact import AutoCompact
from nanobot.agent.context import ContextBuilder
from nanobot.agent.hook import AgentHook, AgentHookContext, CompositeHook
from nanobot.agent.memory import MemoryStore
from nanobot.agent.memory import Consolidator, Dream
from nanobot.agent.runner import _MAX_INJECTIONS_PER_TURN, AgentRunSpec, AgentRunner
from nanobot.agent.subagent import SubagentManager
from nanobot.agent.tools.cron import CronTool
from nanobot.agent.skills import BUILTIN_SKILLS_DIR
from nanobot.agent.tools.filesystem import CopyFileTool, EditFileTool, ListDirTool, ReadFileTool, WriteFileTool
from nanobot.agent.tools.local_paths import get_user_file_roots
from nanobot.agent.tools.message import MessageTool
from nanobot.agent.tools.notebook import NotebookEditTool
from nanobot.agent.tools.registry import ToolRegistry
from nanobot.agent.tools.search import GlobTool, GrepTool
from nanobot.agent.tools.shell import ExecTool
from nanobot.agent.tools.spawn import SpawnTool
from nanobot.agent.tools.web import WebFetchTool, WebSearchTool
from nanobot.bus.events import InboundMessage, OutboundMessage
from nanobot.command import CommandContext, CommandRouter, register_builtin_commands
from nanobot.bus.queue import MessageBus
from nanobot.config.schema import AgentDefaults
from nanobot.providers.base import LLMProvider
from nanobot.session.manager import Session, SessionManager
from nanobot.utils.helpers import image_placeholder_text, truncate_text as truncate_text_fn
from nanobot.utils.runtime import EMPTY_FINAL_RESPONSE_MESSAGE

if TYPE_CHECKING:
    from nanobot.config.schema import ChannelsConfig, ExecToolConfig, WebToolsConfig
    from nanobot.cron.service import CronService


UNIFIED_SESSION_KEY = "unified:default"


class _LoopHook(AgentHook):
    """Core hook for the main loop."""

    def __init__(
        self,
        agent_loop: AgentLoop,
        on_progress: Callable[..., Awaitable[None]] | None = None,
        on_stream: Callable[[str], Awaitable[None]] | None = None,
        on_stream_end: Callable[..., Awaitable[None]] | None = None,
        *,
        channel: str = "cli",
        chat_id: str = "direct",
        message_id: str | None = None,
    ) -> None:
        super().__init__(reraise=True)
        self._loop = agent_loop
        self._on_progress = on_progress
        self._on_stream = on_stream
        self._on_stream_end = on_stream_end
        self._channel = channel
        self._chat_id = chat_id
        self._message_id = message_id
        self._stream_buf = ""

    def wants_streaming(self) -> bool:
        return self._on_stream is not None

    async def on_stream(self, context: AgentHookContext, delta: str) -> None:
        from nanobot.utils.helpers import strip_think

        prev_clean = strip_think(self._stream_buf)
        self._stream_buf += delta
        new_clean = strip_think(self._stream_buf)
        incremental = new_clean[len(prev_clean) :]
        if incremental and self._on_stream:
            await self._on_stream(incremental)

    async def on_stream_end(self, context: AgentHookContext, *, resuming: bool) -> None:
        if self._on_stream_end:
            await self._on_stream_end(resuming=resuming)
        self._stream_buf = ""

    async def before_execute_tools(self, context: AgentHookContext) -> None:
        if self._on_progress:
            if not self._on_stream:
                thought = self._loop._strip_think(
                    context.response.content if context.response else None
                )
                if thought:
                    await self._on_progress(thought)
            tool_hint = self._loop._strip_think(self._loop._tool_hint(context.tool_calls))
            await self._on_progress(tool_hint, tool_hint=True)
        for tc in context.tool_calls:
            args_str = json.dumps(tc.arguments, ensure_ascii=False)
            logger.info("Tool call: {}({})", tc.name, args_str[:200])
        self._loop._set_tool_context(self._channel, self._chat_id, self._message_id)

    async def after_iteration(self, context: AgentHookContext) -> None:
        u = context.usage or {}
        logger.debug(
            "LLM usage: prompt={} completion={} cached={}",
            u.get("prompt_tokens", 0),
            u.get("completion_tokens", 0),
            u.get("cached_tokens", 0),
        )

    def finalize_content(self, context: AgentHookContext, content: str | None) -> str | None:
        return self._loop._prepare_outbound_content(content)

#   单助手业务编排层。
class AgentLoop:
    """
    AgentLoop 是一个生产级异步 AI 代理运行时，实现了完整的 "思考 - 行动 - 观察" 代理循环：
    1.从消息总线接收用户消息
    2.整合历史对话、记忆、知识库和工具定义构建完整上下文
    3.调用大模型生成响应或工具调用指令
    4.安全执行工具调用并获取结果
    5.将结果返回给用户，同时更新会话状态和记忆
    6.支持多轮迭代、子代理协作、定时任务和 MCP 扩展

        用户发送消息
        ↓
    FastAPI接口
        ↓
    MessageBus（消息总线）
        ↓
    AgentLoop（核心引擎）
        ↓
    ├─ ContextBuilder → 构建上下文（历史+记忆+知识库+工具）
    ├─ AgentRunner → 执行代理循环
    │  ├─ 调用LLMProvider → 获取模型响应
    │  ├─ 解析工具调用
    │  └─ 调用ToolRegistry → 执行工具
    ├─ Consolidator → 压缩上下文（如果需要）
    └─ 更新SessionManager → 保存会话状态
        ↓
    MessageBus（发送响应）
        ↓
    前端接收响应
    """

    _RUNTIME_CHECKPOINT_KEY = "runtime_checkpoint"
    _PENDING_USER_TURN_KEY = "pending_user_turn"

    def __init__(
        self,
        bus: MessageBus,
        provider: LLMProvider,
        workspace: Path,
        model: str | None = None,
        #   单轮对话最多执行的工具调用次数，防止无限循环（默认10次）
        max_iterations: int | None = None,
        #   上下文窗口大小，超过会自动压缩
        context_window_tokens: int | None = None,
        context_block_limit: int | None = None,
        #   工具返回结果的最大长度，防止上下文溢出
        max_tool_result_chars: int | None = None,
        #   大模型调用失败时的重试策略
        provider_retry_mode: str = "standard",
        #   网页浏览工具的配置（代理、超时、白名单等）
        web_config: WebToolsConfig | None = None,
        #   代码执行工具的配置（超时、允许的命令、资源限制等）
        exec_config: ExecToolConfig | None = None,
        #   定时任务服务，支持代理创建定时任务
        cron_service: CronService | None = None,
        #   是否限制所有文件操作只能在工作目录内进行
        restrict_to_workspace: bool = False,
        #   会话状态持久化管理器
        session_manager: SessionManager | None = None,
        #   MCP 服务器配置，支持 Model Context Protocol 扩展服务器
        mcp_servers: dict | None = None,
        channels_config: ChannelsConfig | None = None,
        #   系统时区，代理使用的时区，影响时间相关的工具和功能
        timezone: str | None = None,
        #   会话过期时间（分钟），0 表示永不过期
        session_ttl_minutes: int = 0,
        #   钩子列表，代理生命周期钩子，可以在消息处理的各个阶段插入自定义逻辑
        hooks: list[AgentHook] | None = None,
        #   是否使用统一会话模式（所有用户共享一个会话）
        unified_session: bool = False,
        disabled_skills: list[str] | None = None,
        allowed_skills: list[str] | None = None,
        #   记忆存储，长期记忆存储后端
        memory_store: MemoryStore | None = None,
        context_builder: ContextBuilder | None = None,
        extra_read_dirs: list[Path] | None = None,
    ):
        from nanobot.config.schema import ExecToolConfig, WebToolsConfig

        defaults = AgentDefaults()
        """
            消息总线 self.bus:
                1.系统内部的发布 - 订阅消息系统
                2.所有用户消息通过总线发送给代理
                3.所有代理响应、状态更新、错误信息也通过总线发送
                4.实现了前端和后端的完全解耦
        """
        self.bus = bus
        self.channels_config = channels_config
        self.provider = provider
        self.workspace = workspace
        self.model = model or provider.get_default_model()
        self.max_iterations = (
            max_iterations if max_iterations is not None else defaults.max_tool_iterations
        )
        self.context_window_tokens = (
            context_window_tokens
            if context_window_tokens is not None
            else defaults.context_window_tokens
        )
        self.context_block_limit = context_block_limit
        self.max_tool_result_chars = (
            max_tool_result_chars
            if max_tool_result_chars is not None
            else defaults.max_tool_result_chars
        )
        self.provider_retry_mode = provider_retry_mode
        self.web_config = web_config or WebToolsConfig()
        self.exec_config = exec_config or ExecToolConfig()
        self.cron_service = cron_service
        self.restrict_to_workspace = restrict_to_workspace
        self._start_time = time.time()
        self._last_usage: dict[str, int] = {}
        self._extra_hooks: list[AgentHook] = hooks or []
        self._extra_read_dirs = extra_read_dirs or []
        """
        上下文构建器 self.context代理的 "记忆中枢"
        负责整合以下所有信息构建最终的 prompt：
        1.系统提示词
        2.历史对话记录
        3.长期记忆
        4.知识库内容（RAG）
        5.可用工具定义
        6.当前时间和环境信息
        自动处理上下文窗口溢出，进行智能压缩
        """
        self.context = context_builder or ContextBuilder(
            workspace,
            timezone=timezone,
            disabled_skills=disabled_skills,
            allowed_skills=allowed_skills,
            memory_store=memory_store,
        )
        """
        会话管理器 self.sessions
        1.负责所有会话状态的持久化和加载
        2.每个会话有独立的状态、历史和记忆
        3.支持会话的导入、导出和删除
        4.与 AutoCompact 配合自动清理过期会话
        """
        self.sessions = session_manager or SessionManager(workspace)
        """
        工具注册中心 self.tools
        1.所有可用工具的注册和管理中心
        2.提供工具定义的自动生成
        3.负责工具调用的参数校验和安全检查
        4.支持动态注册和注销工具
        """
        self.tools = ToolRegistry()
        """
        代理执行器 self.runner
        1.实际执行 "思考 - 行动 - 观察" 循环的核心组件
        2.负责调用大模型、解析工具调用、执行工具
        3.处理多轮工具调用迭代
        4.实现了完善的错误处理和超时控制
        """
        self.runner = AgentRunner(provider)
        """
        子代理管理器 self.subagents
        1.支持多代理协作模式
        2.可以创建专门处理特定任务的子代理
        3.负责子代理的生命周期管理和通信
        4.实现了任务分解和结果汇总
        """
        self.subagents = SubagentManager(
            provider=provider,
            workspace=workspace,
            bus=bus,
            model=self.model,
            web_config=self.web_config,
            max_tool_result_chars=self.max_tool_result_chars,
            exec_config=self.exec_config,
            restrict_to_workspace=restrict_to_workspace,
            disabled_skills=disabled_skills,
        )
        self._unified_session = unified_session
        self._running = False
        self._mcp_servers = mcp_servers or {}
        self._mcp_stacks: dict[str, AsyncExitStack] = {}
        self._mcp_connected = False
        self._mcp_connecting = False
        """
        任务管理器 self._active_tasks 和 self._background_tasks
        1.跟踪所有正在运行的异步任务
        2.可以在需要时取消任务（如用户点击 "停止生成"）
        3.防止任务泄漏
        4.系统关闭时可以优雅地等待所有任务完成
        """
        self._active_tasks: dict[str, list[asyncio.Task]] = {}  # session_key -> tasks
        self._background_tasks: list[asyncio.Task] = []
        """
        会话级串行执行 self._session_locks
        1.每个会话有自己独立的异步锁
        2.保证同一个会话的请求永远串行执行
        3.彻底解决了同一个会话的消息乱序和状态混乱问题
        4.与之前的 _session_lock 机制完全一致
        """
        self._session_locks: dict[str, asyncio.Lock] = {}
        # Per-session pending queues for mid-turn message injection.
        # When a session has an active task, new messages for that session
        # are routed here instead of creating a new task.
        """
        会话内消息队列 self._pending_queues
        1.当一个会话正在处理请求时，新的消息会进入这个队列
        2.而不是创建一个新的任务
        3.保证消息按到达顺序处理
        4.支持 "打断" 功能：用户可以在代理生成过程中发送新消息
        """
        self._pending_queues: dict[str, asyncio.Queue] = {}
        """
        全局并发控制 self._concurrency_gate
        1.使用 asyncio.Semaphore 控制全局最大并发请求数
        2.默认值 3 是一个保守的安全值，可以根据服务器性能调整
        3.防止大模型 API 被打爆，也防止服务器资源耗尽
        """
        _max = int(os.environ.get("NANOBOT_MAX_CONCURRENT_REQUESTS", "3"))
        self._concurrency_gate: asyncio.Semaphore | None = (
            asyncio.Semaphore(_max) if _max > 0 else None
        )
        """
        上下文压缩器 self.consolidator
        1.当上下文超过窗口大小时，自动压缩历史对话
        2.使用大模型对历史对话进行摘要和提炼
        3.保留最重要的信息，丢弃冗余内容
        4.保证代理永远不会因为上下文过长而崩溃
        """
        self.consolidator = Consolidator(
            store=self.context.memory,
            provider=provider,
            model=self.model,
            sessions=self.sessions,
            context_window_tokens=context_window_tokens,
            build_messages=self.context.build_messages,
            get_tool_definitions=self.tools.get_definitions,
            max_completion_tokens=provider.generation.max_tokens,
        )
        """
        自动会话清理 self.auto_compact
        1.后台运行的守护任务
        2.自动清理超过 TTL 的过期会话
        3.释放内存和磁盘空间
        4.可以配置清理频率和策略
        """
        self.auto_compact = AutoCompact(
            sessions=self.sessions,
            consolidator=self.consolidator,
            session_ttl_minutes=session_ttl_minutes,
        )
        """
        离线记忆整合 self.dream
        1.灵感来自人类的睡眠做梦过程
        2.在系统空闲时，对长期记忆进行整合和提炼
        3.提取重要信息，形成更高级别的知识
        4.提升代理的长期记忆能力
        """
        self.dream = Dream(
            store=self.context.memory,
            provider=provider,
            model=self.model,
        )
        self._register_default_tools()
        self.commands = CommandRouter()
        register_builtin_commands(self.commands)

#   注册文件、搜索、消息、执行命令等默认工具。
    def _register_default_tools(self) -> None:
        """Register the default set of tools."""
        allowed_dir = (
            self.workspace if (self.restrict_to_workspace or self.exec_config.sandbox) else None
        )
        extra_user_dirs = get_user_file_roots() if allowed_dir else []
        extra_read = ([BUILTIN_SKILLS_DIR] + self._extra_read_dirs + extra_user_dirs) if allowed_dir else None
        extra_browse = (self._extra_read_dirs + extra_user_dirs) if allowed_dir else None
        extra_write = extra_user_dirs if allowed_dir else None
        self.tools.register(
            ReadFileTool(
                workspace=self.workspace, allowed_dir=allowed_dir, extra_allowed_dirs=extra_read
            )
        )
        for cls in (WriteFileTool, EditFileTool):
            self.tools.register(
                cls(workspace=self.workspace, allowed_dir=allowed_dir, extra_allowed_dirs=extra_write)
            )
        self.tools.register(
            CopyFileTool(
                workspace=self.workspace,
                allowed_dir=allowed_dir,
                extra_allowed_dirs=extra_write,
            )
        )
        self.tools.register(
            ListDirTool(
                workspace=self.workspace,
                allowed_dir=allowed_dir,
                extra_allowed_dirs=extra_browse,
            )
        )
        for cls in (GlobTool, GrepTool):
            self.tools.register(
                cls(
                    workspace=self.workspace,
                    allowed_dir=allowed_dir,
                    extra_allowed_dirs=extra_browse,
                )
            )
        self.tools.register(NotebookEditTool(workspace=self.workspace, allowed_dir=allowed_dir))
        """
        代码执行工具
        只有当exec_config.enable=True时才会注册
        1.最高危的工具，允许 AI 代理执行任意系统命令
        2.所有命令都在工作目录下执行
        3.可以配置超时时间，防止命令无限运行
        4.支持沙箱模式，进一步限制命令的权限
        5.可以配置允许的环境变量，防止敏感信息泄露
        """
        if self.exec_config.enable:
            self.tools.register(
                ExecTool(
                    working_dir=str(self.workspace),
                    timeout=self.exec_config.timeout,
                    restrict_to_workspace=self.restrict_to_workspace,
                    sandbox=self.exec_config.sandbox,
                    path_append=self.exec_config.path_append,
                    allowed_env_keys=self.exec_config.allowed_env_keys,
                    extra_allowed_dirs=extra_write,
                )
            )
        """
        网络访问工具
        只有当web_config.enable=True时才会注册
        1.包含两个工具：
        WebSearchTool：使用搜索引擎搜索网页
        WebFetchTool：获取指定 URL 的网页内容
        2.支持代理配置，适合需要翻墙的环境
        3.可以配置搜索白名单、黑名单和结果数量限制
        """
        if self.web_config.enable:
            self.tools.register(
                WebSearchTool(config=self.web_config.search, proxy=self.web_config.proxy)
            )
            self.tools.register(WebFetchTool(proxy=self.web_config.proxy))
        """
        通信工具
        1.允许 AI 代理主动向用户发送消息
        2.绑定到消息总线的publish_outbound方法
        3.支持流式输出、状态更新和错误提示
        4.是代理与用户交互的唯一通道
        """
        self.tools.register(MessageTool(send_callback=self.bus.publish_outbound))
        """
        子代理工具
        1.允许 AI 代理创建子代理来处理复杂任务
        2.子代理拥有与主代理相同的工具和权限
        3.主代理可以将任务分解给多个子代理并行执行
        4.子代理完成任务后会将结果返回给主代理
        """
        self.tools.register(SpawnTool(manager=self.subagents))
        """
        定时任务工具
        只有当传入了cron_service时才会注册
        1.允许 AI 代理创建定时任务
        2.支持标准的 Cron 表达式
        例如："每天早上 9 点提醒我开会"
        3.定时任务会持久化保存，服务重启后仍然有效
        """
        if self.cron_service:
            self.tools.register(
                CronTool(self.cron_service, default_timezone=self.context.timezone or "UTC")
            )

    async def _connect_mcp(self) -> None:
        """Connect to configured MCP servers (one-time, lazy)."""
        if self._mcp_connected or self._mcp_connecting or not self._mcp_servers:
            return
        self._mcp_connecting = True
        from nanobot.agent.tools.mcp import connect_mcp_servers

        try:
            self._mcp_stacks = await connect_mcp_servers(self._mcp_servers, self.tools)
            if self._mcp_stacks:
                self._mcp_connected = True
            else:
                logger.warning("No MCP servers connected successfully (will retry next message)")
        except asyncio.CancelledError:
            logger.warning("MCP connection cancelled (will retry next message)")
            self._mcp_stacks.clear()
        except BaseException as e:
            logger.error("Failed to connect MCP servers (will retry next message): {}", e)
            self._mcp_stacks.clear()
        finally:
            self._mcp_connecting = False

#   上下文桥梁方法，解决"全局工具实例"与"请求级会话上下文"的矛盾，给工具注入 channel、chat_id、message_id。
    def _set_tool_context(self, channel: str, chat_id: str, message_id: str | None = None) -> None:
        """Update context for all tools that need routing info."""
        for name in ("message", "spawn", "cron"):
            if tool := self.tools.get(name):
                if hasattr(tool, "set_context"):
                    tool.set_context(channel, chat_id, *([message_id] if name == "message" else []))

    @staticmethod
    def _strip_think(text: str | None) -> str | None:
        """Remove <think>…</think> blocks that some models embed in content."""
        if not text:
            return None
        from nanobot.utils.helpers import strip_think

        return strip_think(text) or None

    @staticmethod
    def _prepare_outbound_content(text: str | None) -> str | None:
        """Normalize assistant replies into concise plain-text chat formatting."""
        if not text:
            return None
        from nanobot.utils.helpers import prettify_response_text

        return prettify_response_text(text) or None

    @staticmethod
    def _tool_hint(tool_calls: list) -> str:
        """Format tool calls as concise hints with smart abbreviation."""
        from nanobot.utils.tool_hints import format_tool_hints

        return format_tool_hints(tool_calls)

    def _effective_session_key(self, msg: InboundMessage) -> str:
        """Return the session key used for task routing and mid-turn injections."""
        if self._unified_session and not msg.session_key_override:
            return UNIFIED_SESSION_KEY
        return msg.session_key

    async def _run_agent_loop(
        self,
        initial_messages: list[dict],
        on_progress: Callable[..., Awaitable[None]] | None = None,
        on_stream: Callable[[str], Awaitable[None]] | None = None,
        on_stream_end: Callable[..., Awaitable[None]] | None = None,
        *,
        session: Session | None = None,
        channel: str = "cli",
        chat_id: str = "direct",
        message_id: str | None = None,
        pending_queue: asyncio.Queue | None = None,
    ) -> tuple[str | None, list[str], list[dict], str, bool]:
        """Run the agent iteration loop.

        *on_stream*: called with each content delta during streaming.
        *on_stream_end(resuming)*: called when a streaming session finishes.
        ``resuming=True`` means tool calls follow (spinner should restart);
        ``resuming=False`` means this is the final response.

        Returns (final_content, tools_used, messages, stop_reason, had_injections).
        """
        loop_hook = _LoopHook(
            self,
            on_progress=on_progress,
            on_stream=on_stream,
            on_stream_end=on_stream_end,
            channel=channel,
            chat_id=chat_id,
            message_id=message_id,
        )
        hook: AgentHook = (
            CompositeHook([loop_hook] + self._extra_hooks) if self._extra_hooks else loop_hook
        )

        async def _checkpoint(payload: dict[str, Any]) -> None:
            if session is None:
                return
            self._set_runtime_checkpoint(session, payload)

        async def _drain_pending(*, limit: int = _MAX_INJECTIONS_PER_TURN) -> list[dict[str, Any]]:
            """Non-blocking drain of follow-up messages from the pending queue."""
            if pending_queue is None:
                return []
            items: list[dict[str, Any]] = []
            while len(items) < limit:
                try:
                    pending_msg = pending_queue.get_nowait()
                except asyncio.QueueEmpty:
                    break
                user_content = self.context._build_user_content(
                    pending_msg.content,
                    pending_msg.media if pending_msg.media else None,
                )
                runtime_ctx = self.context._build_runtime_context(
                    pending_msg.channel,
                    pending_msg.chat_id,
                    self.context.timezone,
                )
                if isinstance(user_content, str):
                    merged: str | list[dict[str, Any]] = f"{runtime_ctx}\n\n{user_content}"
                else:
                    merged = [{"type": "text", "text": runtime_ctx}] + user_content
                items.append({"role": "user", "content": merged})
            return items

        result = await self.runner.run(AgentRunSpec(
            initial_messages=initial_messages,
            tools=self.tools,
            model=self.model,
            max_iterations=self.max_iterations,
            max_tool_result_chars=self.max_tool_result_chars,
            hook=hook,
            error_message="Sorry, I encountered an error calling the AI model.",
            concurrent_tools=True,
            workspace=self.workspace,
            session_key=session.key if session else None,
            context_window_tokens=self.context_window_tokens,
            context_block_limit=self.context_block_limit,
            provider_retry_mode=self.provider_retry_mode,
            progress_callback=on_progress,
            checkpoint_callback=_checkpoint,
            injection_callback=_drain_pending,
        ))
        self._last_usage = result.usage
        if result.stop_reason == "max_iterations":
            logger.warning("Max iterations ({}) reached", self.max_iterations)
        elif result.stop_reason == "error":
            logger.error("LLM returned error: {}", (result.final_content or "")[:200])
        return result.final_content, result.tools_used, result.messages, result.stop_reason, result.had_injections

    async def run(self) -> None:
        """Run the agent loop, dispatching messages as tasks to stay responsive to /stop."""
        self._running = True
        await self._connect_mcp()
        logger.info("Agent loop started")

        while self._running:
            try:
                msg = await asyncio.wait_for(self.bus.consume_inbound(), timeout=1.0)
            except asyncio.TimeoutError:
                self.auto_compact.check_expired(
                    self._schedule_background,
                    active_session_keys=self._pending_queues.keys(),
                )
                continue
            except asyncio.CancelledError:
                # Preserve real task cancellation so shutdown can complete cleanly.
                # Only ignore non-task CancelledError signals that may leak from integrations.
                if not self._running or asyncio.current_task().cancelling():
                    raise
                continue
            except Exception as e:
                logger.warning("Error consuming inbound message: {}, continuing...", e)
                continue

            raw = msg.content.strip()
            if self.commands.is_priority(raw):
                ctx = CommandContext(msg=msg, session=None, key=msg.session_key, raw=raw, loop=self)
                result = await self.commands.dispatch_priority(ctx)
                if result:
                    await self.bus.publish_outbound(result)
                continue
            effective_key = self._effective_session_key(msg)
            # If this session already has an active pending queue (i.e. a task
            # is processing this session), route the message there for mid-turn
            # injection instead of creating a competing task.
            if effective_key in self._pending_queues:
                pending_msg = msg
                if effective_key != msg.session_key:
                    pending_msg = dataclasses.replace(
                        msg,
                        session_key_override=effective_key,
                    )
                try:
                    self._pending_queues[effective_key].put_nowait(pending_msg)
                except asyncio.QueueFull:
                    logger.warning(
                        "Pending queue full for session {}, falling back to queued task",
                        effective_key,
                    )
                else:
                    logger.info(
                        "Routed follow-up message to pending queue for session {}",
                        effective_key,
                    )
                    continue
            # Compute the effective session key before dispatching
            # This ensures /stop command can find tasks correctly when unified session is enabled
            task = asyncio.create_task(self._dispatch(msg))
            self._active_tasks.setdefault(effective_key, []).append(task)
            task.add_done_callback(
                lambda t, k=effective_key: self._active_tasks.get(k, [])
                and self._active_tasks[k].remove(t)
                if t in self._active_tasks.get(k, [])
                else None
            )

    async def _dispatch(self, msg: InboundMessage) -> None:
        """Process a message: per-session serial, cross-session concurrent."""
        session_key = self._effective_session_key(msg)
        if session_key != msg.session_key:
            msg = dataclasses.replace(msg, session_key_override=session_key)
        lock = self._session_locks.setdefault(session_key, asyncio.Lock())
        gate = self._concurrency_gate or nullcontext()

        # Register a pending queue so follow-up messages for this session are
        # routed here (mid-turn injection) instead of spawning a new task.
        pending = asyncio.Queue(maxsize=20)
        self._pending_queues[session_key] = pending

        try:
            async with lock, gate:
                try:
                    on_stream = on_stream_end = None
                    if msg.metadata.get("_wants_stream"):
                        # Split one answer into distinct stream segments.
                        stream_base_id = f"{msg.session_key}:{time.time_ns()}"
                        stream_segment = 0

                        def _current_stream_id() -> str:
                            return f"{stream_base_id}:{stream_segment}"

                        async def on_stream(delta: str) -> None:
                            meta = dict(msg.metadata or {})
                            meta["_stream_delta"] = True
                            meta["_stream_id"] = _current_stream_id()
                            await self.bus.publish_outbound(OutboundMessage(
                                channel=msg.channel, chat_id=msg.chat_id,
                                content=delta,
                                metadata=meta,
                            ))

                        async def on_stream_end(*, resuming: bool = False) -> None:
                            nonlocal stream_segment
                            meta = dict(msg.metadata or {})
                            meta["_stream_end"] = True
                            meta["_resuming"] = resuming
                            meta["_stream_id"] = _current_stream_id()
                            await self.bus.publish_outbound(OutboundMessage(
                                channel=msg.channel, chat_id=msg.chat_id,
                                content="",
                                metadata=meta,
                            ))
                            stream_segment += 1

                    response = await self._process_message(
                        msg, on_stream=on_stream, on_stream_end=on_stream_end,
                        pending_queue=pending,
                    )
                    if response is not None:
                        await self.bus.publish_outbound(response)
                    elif msg.channel == "cli":
                        await self.bus.publish_outbound(OutboundMessage(
                            channel=msg.channel, chat_id=msg.chat_id,
                            content="", metadata=msg.metadata or {},
                        ))
                except asyncio.CancelledError:
                    logger.info("Task cancelled for session {}", session_key)
                    raise
                except Exception:
                    logger.exception("Error processing message for session {}", session_key)
                    await self.bus.publish_outbound(OutboundMessage(
                        channel=msg.channel, chat_id=msg.chat_id,
                        content="Sorry, I encountered an error.",
                    ))
        finally:
            # Drain any messages still in the pending queue and re-publish
            # them to the bus so they are processed as fresh inbound messages
            # rather than silently lost.
            queue = self._pending_queues.pop(session_key, None)
            if queue is not None:
                leftover = 0
                while True:
                    try:
                        item = queue.get_nowait()
                    except asyncio.QueueEmpty:
                        break
                    await self.bus.publish_inbound(item)
                    leftover += 1
                if leftover:
                    logger.info(
                        "Re-published {} leftover message(s) to bus for session {}",
                        leftover, session_key,
                    )

    async def close_mcp(self) -> None:
        """Drain pending background archives, then close MCP connections."""
        if self._background_tasks:
            await asyncio.gather(*self._background_tasks, return_exceptions=True)
            self._background_tasks.clear()
        for name, stack in self._mcp_stacks.items():
            try:
                await stack.aclose()
            except (RuntimeError, BaseExceptionGroup):
                logger.debug("MCP server '{}' cleanup error (can be ignored)", name)
        self._mcp_stacks.clear()

    def _schedule_background(self, coro) -> None:
        """Schedule a coroutine as a tracked background task (drained on shutdown)."""
        task = asyncio.create_task(coro)
        self._background_tasks.append(task)
        task.add_done_callback(self._background_tasks.remove)

    def stop(self) -> None:
        """Stop the agent loop."""
        self._running = False
        logger.info("Agent loop stopping")

    """
    _process_message 是一个异步安全的单条消息处理主方法：
    1.统一处理用户消息和系统消息（子代理返回、定时任务触发等）
    2.自动恢复崩溃的会话和运行时状态
    3.优先处理斜杠命令
    4.构建完整的对话上下文
    5.执行 "思考 - 行动 - 观察" 代理循环
    6.持久化会话状态和对话历史
    7.返回标准化的响应消息
    8.调度后台任务进行上下文压缩和记忆整合

    收到消息
        ↓
    判断消息类型：系统消息 / 用户消息
        ↓
    获取或创建会话 → 恢复运行时检查点 → 恢复待处理用户轮次
        ↓
    自动准备会话 → 检查并压缩过长上下文
        ↓
    拦截并处理斜杠命令 → 命中则直接返回命令结果
        ↓
    注入工具上下文 → 启动消息轮次
        ↓
    提前持久化用户消息（崩溃恢复核心）
        ↓
    执行代理循环（调用LLM → 解析工具调用 → 执行工具 → 多轮迭代）
        ↓
    处理响应 → 保存对话轮次 → 清理临时状态
        ↓
    调度后台上下文压缩任务
        ↓
    返回最终响应（或None如果已通过MessageTool发送）
    """
    async def _process_message(
        self,
        #   入站消息,标准化的消息对象，包含内容、渠道、发送者、元数据等
        msg: InboundMessage,
        session_key: str | None = None,
        on_progress: Callable[[str], Awaitable[None]] | None = None,
        on_stream: Callable[[str], Awaitable[None]] | None = None,
        on_stream_end: Callable[..., Awaitable[None]] | None = None,
        pending_queue: asyncio.Queue | None = None,
    ) -> OutboundMessage | None:
        """Process a single inbound message and return the response."""
        #   分支 1：系统消息处理 ("channel:chat_id")
        if msg.channel == "system":
            channel, chat_id = (
                msg.chat_id.split(":", 1) if ":" in msg.chat_id else ("cli", msg.chat_id)
            )
            logger.info("Processing system message from {}", msg.sender_id)
            key = f"{channel}:{chat_id}"
            session = self.sessions.get_or_create(key)
            # 恢复运行时检查点
            if self._restore_runtime_checkpoint(session):
                self.sessions.save(session)
            # 恢复待处理用户轮次
            if self._restore_pending_user_turn(session):
                self.sessions.save(session)

            session, pending = self.auto_compact.prepare_session(session, key)

            await self.consolidator.maybe_consolidate_by_tokens(session)
            # 注入工具上下文
            self._set_tool_context(channel, chat_id, msg.metadata.get("message_id"))
            history = session.get_history(max_messages=0)
            current_role = "assistant" if msg.sender_id == "subagent" else "user"
            # 构建上下文
            messages = self.context.build_messages(
                history=history,
                current_message=msg.content, channel=channel, chat_id=chat_id,
                session_summary=pending,
                current_role=current_role,
            )
            # 执行代理循环
            final_content, _, all_msgs, _, _ = await self._run_agent_loop(
                messages, session=session, channel=channel, chat_id=chat_id,
                message_id=msg.metadata.get("message_id"),
            )
            # 保存会话
            self._save_turn(session, all_msgs, 1 + len(history))
            self._clear_runtime_checkpoint(session)
            self.sessions.save(session)
            self._schedule_background(self.consolidator.maybe_consolidate_by_tokens(session))
            # 返回响应
            return OutboundMessage(
                channel=channel,
                chat_id=chat_id,
                content=self._prepare_outbound_content(final_content) or "Background task completed.",
            )
        #   分支 2：普通用户消息处理（核心流程）
        """
        会话初始化与状态恢复
        核心设计：崩溃恢复机制
        1.如果服务在处理消息的过程中崩溃（OOM、SIGKILL、重启等），重启后会自动恢复到崩溃前的状态
        2._restore_runtime_checkpoint：恢复代理循环的中间状态（已执行的工具调用、生成的部分响应等）
        3._restore_pending_user_turn：恢复用户的原始提问
        4.这是生产级系统与玩具项目的核心区别之一，保证用户的消息永远不会丢失
        """
        preview = msg.content[:80] + "..." if len(msg.content) > 80 else msg.content
        logger.info("Processing message from {}:{}: {}", msg.channel, msg.sender_id, preview)

        key = session_key or msg.session_key
        session = self.sessions.get_or_create(key)
        # 崩溃恢复：恢复运行时检查点
        if self._restore_runtime_checkpoint(session):
            self.sessions.save(session)
        # 崩溃恢复：恢复待处理的用户轮次
        if self._restore_pending_user_turn(session):
            self.sessions.save(session)
        # 自动准备会话（清理过期状态）
        session, pending = self.auto_compact.prepare_session(session, key)

        """
        斜杠命令拦截
        优先处理以 / 开头的斜杠命令
        如果命令命中，直接返回命令结果，不进入代理循环
        常见命令：/clear（清空会话）、/help（帮助）、/status（系统状态）等
        """
        raw = msg.content.strip()
        ctx = CommandContext(msg=msg, session=session, key=key, raw=raw, loop=self)
        if result := await self.commands.dispatch(ctx):
            return result
        # 自动压缩过长的上下文
        await self.consolidator.maybe_consolidate_by_tokens(session)
        # 注入工具上下文
        self._set_tool_context(msg.channel, msg.chat_id, msg.metadata.get("message_id"))
        # 启动消息轮次，重置MessageTool的状态
        if message_tool := self.tools.get("message"):
            if isinstance(message_tool, MessageTool):
                message_tool.start_turn()
        # 获取历史对话
        history = session.get_history(max_messages=0)
        # 构建完整的prompt上下文
        initial_messages = self.context.build_messages(
            history=history,
            current_message=msg.content,
            session_summary=pending,
            media=msg.media if msg.media else None,
            channel=msg.channel,
            chat_id=msg.chat_id,
        )
        # 定义进度回调，通过消息总线发送状态更新
        async def _bus_progress(content: str, *, tool_hint: bool = False) -> None:
            meta = dict(msg.metadata or {})
            meta["_progress"] = True
            meta["_tool_hint"] = tool_hint
            await self.bus.publish_outbound(
                OutboundMessage(
                    channel=msg.channel,
                    chat_id=msg.chat_id,
                    content=content,
                    metadata=meta,
                )
            )

        """
        核心安全设计：用户消息提前持久化
        这是整个方法最关键的一行代码，也是工业级系统可靠性的核心保障：
        1.在执行代理循环之前，就把用户的消息保存到会话中
        2.如果服务在代理循环执行过程中崩溃，重启后可以从会话日志中恢复用户的消息
        3.如果不这么做，用户的消息会在崩溃后永久丢失，用户需要重新输入
        4._mark_pending_user_turn 标记这个轮次还没有完成，重启后会自动继续处理
        """
        user_persisted_early = False
        if isinstance(msg.content, str) and msg.content.strip():
            session.add_message("user", msg.content)
            self._mark_pending_user_turn(session)
            self.sessions.save(session)
            user_persisted_early = True
        """
        执行代理循环
        调用核心的 _run_agent_loop 方法执行 "思考 - 行动 - 观察" 循环
        传递所有回调函数，支持流式输出和进度更新
        返回值说明：
        1.final_content：最终生成的响应内容
        2.all_msgs：整个轮次生成的所有消息（用户消息、助手响应、工具调用、工具结果）
        3.stop_reason：循环停止的原因（正常结束、达到最大迭代次数、错误等）
        4.had_injections：是否在轮次中注入了新的消息（用户打断）
        """
        final_content, _, all_msgs, stop_reason, had_injections = await self._run_agent_loop(
            initial_messages,
            on_progress=on_progress or _bus_progress,
            on_stream=on_stream,
            on_stream_end=on_stream_end,
            session=session,
            channel=msg.channel,
            chat_id=msg.chat_id,
            message_id=msg.metadata.get("message_id"),
            pending_queue=pending_queue,
        )
        """
        响应处理与会话保存
        """
        # 处理空响应
        if final_content is None or not final_content.strip():
            final_content = EMPTY_FINAL_RESPONSE_MESSAGE
        else:
            final_content = self._prepare_outbound_content(final_content) or EMPTY_FINAL_RESPONSE_MESSAGE

        # 保存对话轮次，跳过已经提前保存的用户消息
        save_skip = 1 + len(history) + (1 if user_persisted_early else 0)
        self._save_turn(session, all_msgs, save_skip)
        # 清理临时状态
        self._clear_pending_user_turn(session)
        self._clear_runtime_checkpoint(session)
        # 保存最终会话状态
        self.sessions.save(session)
        # 调度后台任务，在空闲时压缩上下文
        self._schedule_background(self.consolidator.maybe_consolidate_by_tokens(session))

        """
        空响应特殊逻辑
        如果代理在执行过程中已经通过 MessageTool 主动发送了消息，就不需要再返回最终响应
        但如果在轮次中用户注入了新的消息（打断了代理），仍然需要返回最终响应
        避免重复发送相同的内容给用户
        """
        if (mt := self.tools.get("message")) and isinstance(mt, MessageTool) and mt._sent_in_turn:
            if not had_injections or stop_reason == "empty_final_response":
                return None
        """
        返回最终响应
        """
        preview = final_content[:120] + "..." if len(final_content) > 120 else final_content
        logger.info("Response to {}:{}: {}", msg.channel, msg.sender_id, preview)

        meta = dict(msg.metadata or {})
        if on_stream is not None and stop_reason != "error":
            meta["_streamed"] = True
        return OutboundMessage(
            channel=msg.channel,
            chat_id=msg.chat_id,
            content=final_content,
            metadata=meta,
        )

    def _sanitize_persisted_blocks(
        self,
        content: list[dict[str, Any]],
        *,
        should_truncate_text: bool = False,
        drop_runtime: bool = False,
    ) -> list[dict[str, Any]]:
        """Strip volatile multimodal payloads before writing session history."""
        filtered: list[dict[str, Any]] = []
        for block in content:
            if not isinstance(block, dict):
                filtered.append(block)
                continue

            if (
                drop_runtime
                and block.get("type") == "text"
                and isinstance(block.get("text"), str)
                and block["text"].startswith(ContextBuilder._RUNTIME_CONTEXT_TAG)
            ):
                continue

            if block.get("type") == "image_url" and block.get("image_url", {}).get(
                "url", ""
            ).startswith("data:image/"):
                path = (block.get("_meta") or {}).get("path", "")
                filtered.append({"type": "text", "text": image_placeholder_text(path)})
                continue

            if block.get("type") == "text" and isinstance(block.get("text"), str):
                text = block["text"]
                if should_truncate_text and len(text) > self.max_tool_result_chars:
                    text = truncate_text_fn(text, self.max_tool_result_chars)
                filtered.append({**block, "text": text})
                continue

            filtered.append(block)

        return filtered

    def _save_turn(self, session: Session, messages: list[dict], skip: int) -> None:
        """Save new-turn messages into session, truncating large tool results."""
        from datetime import datetime

        for m in messages[skip:]:
            entry = dict(m)
            role, content = entry.get("role"), entry.get("content")
            if role == "assistant" and not content and not entry.get("tool_calls"):
                continue  # skip empty assistant messages — they poison session context
            if role == "tool":
                if isinstance(content, str) and len(content) > self.max_tool_result_chars:
                    entry["content"] = truncate_text_fn(content, self.max_tool_result_chars)
                elif isinstance(content, list):
                    filtered = self._sanitize_persisted_blocks(content, should_truncate_text=True)
                    if not filtered:
                        continue
                    entry["content"] = filtered
            elif role == "user":
                if isinstance(content, str) and content.startswith(ContextBuilder._RUNTIME_CONTEXT_TAG):
                    # Strip the entire runtime-context block (including any session summary).
                    # The block is bounded by _RUNTIME_CONTEXT_TAG and _RUNTIME_CONTEXT_END.
                    end_marker = ContextBuilder._RUNTIME_CONTEXT_END
                    end_pos = content.find(end_marker)
                    if end_pos >= 0:
                        after = content[end_pos + len(end_marker):].lstrip("\n")
                        if after:
                            entry["content"] = after
                        else:
                            continue
                    else:
                        # Fallback: no end marker found, strip the tag prefix
                        after_tag = content[len(ContextBuilder._RUNTIME_CONTEXT_TAG):].lstrip("\n")
                        if after_tag.strip():
                            entry["content"] = after_tag
                        else:
                            continue
                if isinstance(content, list):
                    filtered = self._sanitize_persisted_blocks(content, drop_runtime=True)
                    if not filtered:
                        continue
                    entry["content"] = filtered
            entry.setdefault("timestamp", datetime.now().isoformat())
            session.messages.append(entry)
        session.updated_at = datetime.now()

    def _set_runtime_checkpoint(self, session: Session, payload: dict[str, Any]) -> None:
        """Persist the latest in-flight turn state into session metadata."""
        session.metadata[self._RUNTIME_CHECKPOINT_KEY] = payload
        self.sessions.save(session)

    def _mark_pending_user_turn(self, session: Session) -> None:
        session.metadata[self._PENDING_USER_TURN_KEY] = True

    def _clear_pending_user_turn(self, session: Session) -> None:
        session.metadata.pop(self._PENDING_USER_TURN_KEY, None)

#   清理运行断点。
    def _clear_runtime_checkpoint(self, session: Session) -> None:
        if self._RUNTIME_CHECKPOINT_KEY in session.metadata:
            session.metadata.pop(self._RUNTIME_CHECKPOINT_KEY, None)

    @staticmethod
    def _checkpoint_message_key(message: dict[str, Any]) -> tuple[Any, ...]:
        return (
            message.get("role"),
            message.get("content"),
            message.get("tool_call_id"),
            message.get("name"),
            message.get("tool_calls"),
            message.get("reasoning_content"),
            message.get("thinking_blocks"),
        )

#   恢复中断的工具调用状态。
    def _restore_runtime_checkpoint(self, session: Session) -> bool:
        """Materialize an unfinished turn into session history before a new request."""
        #   导入依赖与获取检查点数据
        from datetime import datetime

        checkpoint = session.metadata.get(self._RUNTIME_CHECKPOINT_KEY)
        if not isinstance(checkpoint, dict):
            return False
        """
        提取检查点中的状态数据
        从检查点字典中提取三个核心状态字段：
        1.assistant_message：上一次中断时助手生成的部分响应消息
        2.completed_tool_results：上一次中断时已经完成的工具调用结果列表
        3.pending_tool_calls：上一次中断时未完成的工具调用列表
        4.为后两个字段设置默认值空列表，避免后续遍历时报错
        """
        assistant_message = checkpoint.get("assistant_message")
        completed_tool_results = checkpoint.get("completed_tool_results") or []
        pending_tool_calls = checkpoint.get("pending_tool_calls") or []
        """
        构建待恢复的消息列表
        初始化空列表restored_messages，用于存储最终要恢复到会话历史的消息
        检查assistant_message是否为字典类型，若是则创建其副本
        为副本添加默认的timestamp字段，值为当前时间的 ISO 格式字符串
        将处理后的助手消息添加到待恢复列表
        """
        restored_messages: list[dict[str, Any]] = []
        if isinstance(assistant_message, dict):
            restored = dict(assistant_message)
            restored.setdefault("timestamp", datetime.now().isoformat())
            restored_messages.append(restored)
        #   恢复已完成的工具调用结果
        for message in completed_tool_results:
            if isinstance(message, dict):
                restored = dict(message)
                restored.setdefault("timestamp", datetime.now().isoformat())
                restored_messages.append(restored)
        #   处理未完成的工具调用
        for tool_call in pending_tool_calls:
            if not isinstance(tool_call, dict):
                continue
            tool_id = tool_call.get("id")
            name = ((tool_call.get("function") or {}).get("name")) or "tool"
            restored_messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_id,
                    "name": name,
                    "content": "Error: Task interrupted before this tool finished.",
                    "timestamp": datetime.now().isoformat(),
                }
            )
        #   去重重叠消息
        overlap = 0
        #   计算最大可能的重叠长度max_overlap，为现有会话消息长度和待恢复消息长度的较小值
        max_overlap = min(len(session.messages), len(restored_messages))
        for size in range(max_overlap, 0, -1):
            existing = session.messages[-size:]
            restored = restored_messages[:size]
            #   比较现有会话消息的最后size条和待恢复消息的前size条，通过_checkpoint_message_key方法生成的唯一键判断是否完全一致
            if all(
                self._checkpoint_message_key(left) == self._checkpoint_message_key(right)
                for left, right in zip(existing, restored)
            ):
                overlap = size
                break
        #   仅将待恢复消息中重叠部分之后的内容添加到会话历史中，避免重复添加已存在的消息
        session.messages.extend(restored_messages[overlap:])

        self._clear_pending_user_turn(session)
        self._clear_runtime_checkpoint(session)
        return True

    def _restore_pending_user_turn(self, session: Session) -> bool:
        """Close a turn that only persisted the user message before crashing."""
        from datetime import datetime

        if not session.metadata.get(self._PENDING_USER_TURN_KEY):
            return False

        if session.messages and session.messages[-1].get("role") == "user":
            session.messages.append(
                {
                    "role": "assistant",
                    "content": "Error: Task interrupted before a response was generated.",
                    "timestamp": datetime.now().isoformat(),
                }
            )
            session.updated_at = datetime.now()

        self._clear_pending_user_turn(session)
        return True

#   处理 Web/API 直接文本请求。
    async def process_direct(
        self,
        content: str,
        session_key: str = "cli:direct",
        channel: str = "cli",
        chat_id: str = "direct",
        on_progress: Callable[[str], Awaitable[None]] | None = None,
        on_stream: Callable[[str], Awaitable[None]] | None = None,
        on_stream_end: Callable[..., Awaitable[None]] | None = None,
    ) -> OutboundMessage | None:
        """
            异步调用实例的_connect_mcp方法
            确保所有配置的 MCP 扩展服务器已完成连接
            若已连接则直接返回，不会重复执行连接操作
        """
        await self._connect_mcp()
        #   构建内部标准化消息对象
        msg = InboundMessage(channel=channel, sender_id="user", chat_id=chat_id, content=content)
        #   调用核心处理方法并返回结果
        return await self._process_message(
            msg,
            session_key=session_key,
            on_progress=on_progress,
            on_stream=on_stream,
            on_stream_end=on_stream_end,
        )
    
