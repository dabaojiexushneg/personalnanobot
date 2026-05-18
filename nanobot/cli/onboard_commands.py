"""Helpers for onboarding-related CLI commands."""

from __future__ import annotations

from pathlib import Path

import typer
from rich.console import Console

from nanobot.config.paths import get_workspace_path
from nanobot.config.schema import Config
from nanobot.utils.helpers import sync_workspace_templates


def run_onboard_command(
    *,
    workspace: str | None,
    config: str | None,
    wizard: bool,
    console: Console,
    logo: str,
    onboard_plugins,
) -> None:
    """Initialize nanobot configuration and workspace."""
    from nanobot.config.loader import get_config_path, load_config, save_config, set_config_path

    if config:
        config_path = Path(config).expanduser().resolve()
        set_config_path(config_path)
        console.print(f"[dim]Using config: {config_path}[/dim]")
    else:
        config_path = get_config_path()

    def _apply_workspace_override(loaded: Config) -> Config:
        if workspace:
            loaded.agents.defaults.workspace = workspace
        return loaded

    if config_path.exists():
        if wizard:
            loaded_config = _apply_workspace_override(load_config(config_path))
        else:
            console.print(f"[yellow]Config already exists at {config_path}[/yellow]")
            console.print(
                "  [bold]y[/bold] = overwrite with defaults (existing values will be lost)"
            )
            console.print(
                "  [bold]N[/bold] = refresh config, keeping existing values and adding new fields"
            )
            if typer.confirm("Overwrite?"):
                loaded_config = _apply_workspace_override(Config())
                save_config(loaded_config, config_path)
                console.print(f"[green]✓[/green] Config reset to defaults at {config_path}")
            else:
                loaded_config = _apply_workspace_override(load_config(config_path))
                save_config(loaded_config, config_path)
                console.print(
                    f"[green]✓[/green] Config refreshed at {config_path} "
                    "(existing values preserved)"
                )
    else:
        loaded_config = _apply_workspace_override(Config())
        if not wizard:
            save_config(loaded_config, config_path)
            console.print(f"[green]✓[/green] Created config at {config_path}")

    if wizard:
        from nanobot.cli.onboard import run_onboard

        try:
            result = run_onboard(initial_config=loaded_config)
            if not result.should_save:
                console.print("[yellow]Configuration discarded. No changes were saved.[/yellow]")
                return

            loaded_config = result.config
            save_config(loaded_config, config_path)
            console.print(f"[green]✓[/green] Config saved at {config_path}")
        except Exception as exc:
            console.print(f"[red]✗[/red] Error during configuration: {exc}")
            console.print("[yellow]Please run 'nanobot onboard' again to complete setup.[/yellow]")
            raise typer.Exit(1) from exc

    onboard_plugins(config_path)

    workspace_path = get_workspace_path(loaded_config.workspace_path)
    if not workspace_path.exists():
        workspace_path.mkdir(parents=True, exist_ok=True)
        console.print(f"[green]✓[/green] Created workspace at {workspace_path}")

    sync_workspace_templates(workspace_path)

    agent_cmd = 'nanobot agent -m "Hello!"'
    gateway_cmd = "nanobot gateway"
    if config:
        agent_cmd += f" --config {config_path}"
        gateway_cmd += f" --config {config_path}"

    console.print(f"\n{logo} nanobot is ready!")
    console.print("\nNext steps:")
    if wizard:
        console.print(f"  1. Chat: [cyan]{agent_cmd}[/cyan]")
        console.print(f"  2. Start gateway: [cyan]{gateway_cmd}[/cyan]")
    else:
        console.print(f"  1. Add your API key to [cyan]{config_path}[/cyan]")
        console.print("     Get one at: https://openrouter.ai/keys")
        console.print(f"  2. Chat: [cyan]{agent_cmd}[/cyan]")
    console.print(
        "\n[dim]Want Telegram/WhatsApp? See: https://github.com/HKUDS/nanobot#-chat-apps[/dim]"
    )
