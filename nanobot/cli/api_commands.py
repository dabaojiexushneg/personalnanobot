"""Helpers for the OpenAI-compatible API CLI command."""

from __future__ import annotations


def run_api_server(
    *,
    runtime_config,
    host: str,
    port: int,
    timeout: float,
    verbose: bool,
    console,
    logo: str,
    make_provider,
) -> None:
    try:
        from aiohttp import web  # noqa: F401
    except ImportError as exc:  # pragma: no cover - user environment issue
        raise RuntimeError("aiohttp is required. Install with: pip install 'nanobot-ai[api]'") from exc

    from loguru import logger

    from nanobot.agent.loop import AgentLoop
    from nanobot.api.server import create_app
    from nanobot.bus.queue import MessageBus
    from nanobot.session.manager import SessionManager
    from nanobot.utils.helpers import sync_workspace_templates

    if verbose:
        logger.enable("nanobot")
    else:
        logger.disable("nanobot")

    sync_workspace_templates(runtime_config.workspace_path)
    bus = MessageBus()
    provider = make_provider(runtime_config)
    session_manager = SessionManager(runtime_config.workspace_path)
    agent_loop = AgentLoop(
        bus=bus,
        provider=provider,
        workspace=runtime_config.workspace_path,
        model=runtime_config.agents.defaults.model,
        max_iterations=runtime_config.agents.defaults.max_tool_iterations,
        context_window_tokens=runtime_config.agents.defaults.context_window_tokens,
        context_block_limit=runtime_config.agents.defaults.context_block_limit,
        max_tool_result_chars=runtime_config.agents.defaults.max_tool_result_chars,
        provider_retry_mode=runtime_config.agents.defaults.provider_retry_mode,
        web_config=runtime_config.tools.web,
        exec_config=runtime_config.tools.exec,
        restrict_to_workspace=runtime_config.tools.restrict_to_workspace,
        session_manager=session_manager,
        mcp_servers=runtime_config.tools.mcp_servers,
        channels_config=runtime_config.channels,
        timezone=runtime_config.agents.defaults.timezone,
        unified_session=runtime_config.agents.defaults.unified_session,
        disabled_skills=runtime_config.agents.defaults.disabled_skills,
        session_ttl_minutes=runtime_config.agents.defaults.session_ttl_minutes,
    )

    model_name = runtime_config.agents.defaults.model
    console.print(f"{logo} Starting OpenAI-compatible API server")
    console.print(f"  [cyan]Endpoint[/cyan] : http://{host}:{port}/v1/chat/completions")
    console.print(f"  [cyan]Model[/cyan]    : {model_name}")
    console.print("  [cyan]Session[/cyan]  : api:default")
    console.print(f"  [cyan]Timeout[/cyan]  : {timeout}s")
    if host in {"0.0.0.0", "::"}:
        console.print(
            "[yellow]Warning:[/yellow] API is bound to all interfaces. "
            "Only do this behind a trusted network boundary, firewall, or reverse proxy."
        )
    console.print()

    api_app = create_app(agent_loop, model_name=model_name, request_timeout=timeout)

    async def on_startup(_app):
        await agent_loop._connect_mcp()

    async def on_cleanup(_app):
        await agent_loop.close_mcp()

    api_app.on_startup.append(on_startup)
    api_app.on_cleanup.append(on_cleanup)

    web.run_app(api_app, host=host, port=port, print=lambda msg: logger.info(msg))
