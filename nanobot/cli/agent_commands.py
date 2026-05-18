"""Helpers for the interactive/direct agent CLI command."""

from __future__ import annotations

import asyncio
import signal
import sys


def run_agent_command(
    *,
    config,
    message: str | None,
    session_id: str,
    markdown: bool,
    logs: bool,
    console,
    logo: str,
    make_provider,
    migrate_cron_store,
    is_default_workspace,
    init_prompt_session,
    flush_pending_tty_input,
    restore_terminal,
    read_interactive_input_async,
    is_exit_command,
    print_agent_response,
    print_interactive_response,
    print_cli_progress_line,
    print_interactive_progress_line,
    restart_notice,
    should_show_cli_restart_notice,
    format_restart_completed_message,
) -> None:
    from loguru import logger

    from nanobot.agent.loop import AgentLoop
    from nanobot.bus.events import InboundMessage
    from nanobot.bus.queue import MessageBus
    from nanobot.cli.stream import StreamRenderer, ThinkingSpinner
    from nanobot.cron.service import CronService
    from nanobot.utils.helpers import sync_workspace_templates

    sync_workspace_templates(config.workspace_path)
    bus = MessageBus()
    provider = make_provider(config)

    if is_default_workspace(config.workspace_path):
        migrate_cron_store(config)

    cron_store_path = config.workspace_path / "cron" / "jobs.json"
    cron = CronService(cron_store_path)

    if logs:
        logger.enable("nanobot")
    else:
        logger.disable("nanobot")

    agent_loop = AgentLoop(
        bus=bus,
        provider=provider,
        workspace=config.workspace_path,
        model=config.agents.defaults.model,
        max_iterations=config.agents.defaults.max_tool_iterations,
        context_window_tokens=config.agents.defaults.context_window_tokens,
        web_config=config.tools.web,
        context_block_limit=config.agents.defaults.context_block_limit,
        max_tool_result_chars=config.agents.defaults.max_tool_result_chars,
        provider_retry_mode=config.agents.defaults.provider_retry_mode,
        exec_config=config.tools.exec,
        cron_service=cron,
        restrict_to_workspace=config.tools.restrict_to_workspace,
        mcp_servers=config.tools.mcp_servers,
        channels_config=config.channels,
        timezone=config.agents.defaults.timezone,
        unified_session=config.agents.defaults.unified_session,
        disabled_skills=config.agents.defaults.disabled_skills,
        session_ttl_minutes=config.agents.defaults.session_ttl_minutes,
    )

    if restart_notice and should_show_cli_restart_notice(restart_notice, session_id):
        print_agent_response(
            format_restart_completed_message(restart_notice.started_at_raw),
            render_markdown=False,
        )

    _thinking: ThinkingSpinner | None = None

    async def _cli_progress(content: str, *, tool_hint: bool = False) -> None:
        ch = agent_loop.channels_config
        if ch and tool_hint and not ch.send_tool_hints:
            return
        if ch and not tool_hint and not ch.send_progress:
            return
        print_cli_progress_line(content, _thinking)

    if message:
        async def run_once():
            renderer = StreamRenderer(render_markdown=markdown)
            response = await agent_loop.process_direct(
                message,
                session_id,
                on_progress=_cli_progress,
                on_stream=renderer.on_delta,
                on_stream_end=renderer.on_end,
            )
            if not renderer.streamed:
                await renderer.close()
                print_agent_response(
                    response.content if response else "",
                    render_markdown=markdown,
                    metadata=response.metadata if response else None,
                )
            await agent_loop.close_mcp()

        asyncio.run(run_once())
        return

    init_prompt_session()
    console.print(f"{logo} Interactive mode (type [bold]exit[/bold] or [bold]Ctrl+C[/bold] to quit)\n")

    if ":" in session_id:
        cli_channel, cli_chat_id = session_id.split(":", 1)
    else:
        cli_channel, cli_chat_id = "cli", session_id

    def _handle_signal(signum, frame):
        sig_name = signal.Signals(signum).name
        restore_terminal()
        console.print(f"\nReceived {sig_name}, goodbye!")
        sys.exit(0)

    signal.signal(signal.SIGINT, _handle_signal)
    signal.signal(signal.SIGTERM, _handle_signal)
    if hasattr(signal, "SIGHUP"):
        signal.signal(signal.SIGHUP, _handle_signal)
    if hasattr(signal, "SIGPIPE"):
        signal.signal(signal.SIGPIPE, signal.SIG_IGN)

    async def run_interactive():
        bus_task = asyncio.create_task(agent_loop.run())
        turn_done = asyncio.Event()
        turn_done.set()
        turn_response: list[tuple[str, dict]] = []
        renderer: StreamRenderer | None = None

        async def _consume_outbound():
            nonlocal renderer
            while True:
                try:
                    msg = await asyncio.wait_for(bus.consume_outbound(), timeout=1.0)
                    if msg.metadata.get("_stream_delta"):
                        if renderer:
                            await renderer.on_delta(msg.content)
                        continue
                    if msg.metadata.get("_stream_end"):
                        if renderer:
                            await renderer.on_end(resuming=msg.metadata.get("_resuming", False))
                        continue
                    if msg.metadata.get("_streamed"):
                        turn_done.set()
                        continue
                    if msg.metadata.get("_progress"):
                        is_tool_hint = msg.metadata.get("_tool_hint", False)
                        ch = agent_loop.channels_config
                        if ch and is_tool_hint and not ch.send_tool_hints:
                            pass
                        elif ch and not is_tool_hint and not ch.send_progress:
                            pass
                        else:
                            await print_interactive_progress_line(msg.content, _thinking)
                        continue
                    if not turn_done.is_set():
                        if msg.content:
                            turn_response.append((msg.content, dict(msg.metadata or {})))
                        turn_done.set()
                    elif msg.content:
                        await print_interactive_response(
                            msg.content,
                            render_markdown=markdown,
                            metadata=msg.metadata,
                        )
                except asyncio.TimeoutError:
                    continue
                except asyncio.CancelledError:
                    break

        outbound_task = asyncio.create_task(_consume_outbound())

        try:
            while True:
                try:
                    flush_pending_tty_input()
                    if renderer:
                        renderer.stop_for_input()
                    user_input = await read_interactive_input_async()
                    command = user_input.strip()
                    if not command:
                        continue
                    if is_exit_command(command):
                        restore_terminal()
                        console.print("\nGoodbye!")
                        break

                    turn_done.clear()
                    turn_response.clear()
                    renderer = StreamRenderer(render_markdown=markdown)
                    await bus.publish_inbound(
                        InboundMessage(
                            channel=cli_channel,
                            sender_id="user",
                            chat_id=cli_chat_id,
                            content=user_input,
                            metadata={"_wants_stream": True},
                        )
                    )
                    await turn_done.wait()

                    if turn_response:
                        content, meta = turn_response[0]
                        if content and not meta.get("_streamed"):
                            if renderer:
                                await renderer.close()
                            print_agent_response(content, render_markdown=markdown, metadata=meta)
                    elif renderer and not renderer.streamed:
                        await renderer.close()
                except KeyboardInterrupt:
                    restore_terminal()
                    console.print("\nGoodbye!")
                    break
                except EOFError:
                    restore_terminal()
                    console.print("\nGoodbye!")
                    break
        finally:
            agent_loop.stop()
            outbound_task.cancel()
            await asyncio.gather(bus_task, outbound_task, return_exceptions=True)
            await agent_loop.close_mcp()

    asyncio.run(run_interactive())
