"""Helpers for status-oriented CLI commands."""

from __future__ import annotations

from rich.console import Console


def show_status(*, console: Console, logo: str) -> None:
    """Render the current nanobot CLI/runtime status."""
    from nanobot.config.loader import get_config_path, load_config
    from nanobot.providers.registry import PROVIDERS

    config_path = get_config_path()
    config = load_config()
    workspace = config.workspace_path

    console.print(f"{logo} nanobot Status\n")
    console.print(f"Config: {config_path} {'[green]✓[/green]' if config_path.exists() else '[red]✗[/red]'}")
    console.print(f"Workspace: {workspace} {'[green]✓[/green]' if workspace.exists() else '[red]✗[/red]'}")

    if not config_path.exists():
        return

    console.print(f"Model: {config.agents.defaults.model}")
    for spec in PROVIDERS:
        provider_config = getattr(config.providers, spec.name, None)
        if provider_config is None:
            continue
        if spec.is_oauth:
            console.print(f"{spec.label}: [green]✓ (OAuth)[/green]")
        elif spec.is_local:
            if provider_config.api_base:
                console.print(f"{spec.label}: [green]✓ {provider_config.api_base}[/green]")
            else:
                console.print(f"{spec.label}: [dim]not set[/dim]")
        else:
            has_key = bool(provider_config.api_key)
            console.print(f"{spec.label}: {'[green]✓[/green]' if has_key else '[dim]not set[/dim]'}")
