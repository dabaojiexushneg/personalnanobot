"""Shared helpers for CLI commands that load runtime config."""

from __future__ import annotations

import json
from pathlib import Path

import typer
from rich.console import Console

from nanobot.config.schema import Config


def resolve_runtime_config_path(config: str | None = None) -> Path:
    """Resolve the active config path, honoring CLI overrides."""
    from nanobot.config.loader import get_config_path

    return Path(config).expanduser().resolve() if config else get_config_path()


def load_runtime_config(
    *,
    config: str | None = None,
    workspace: str | None = None,
    console: Console,
) -> Config:
    """Load config and optionally override the active workspace."""
    from nanobot.config.loader import load_config, resolve_config_env_vars, set_config_path

    config_path = None
    if config:
        config_path = resolve_runtime_config_path(config)
        if not config_path.exists():
            console.print(f"[red]Error: Config file not found: {config_path}[/red]")
            raise typer.Exit(1)
        set_config_path(config_path)
        console.print(f"[dim]Using config: {config_path}[/dim]")

    try:
        loaded = resolve_config_env_vars(load_config(config_path))
    except ValueError as exc:
        console.print(f"[red]Error: {exc}[/red]")
        raise typer.Exit(1) from exc

    _warn_deprecated_config_keys(config_path=config_path, console=console)
    if workspace:
        loaded.agents.defaults.workspace = workspace
    return loaded


def migrate_cron_store(config: Config) -> None:
    """One-time migration: move legacy global cron store into the workspace."""
    import shutil

    from nanobot.config.paths import get_cron_dir

    legacy_path = get_cron_dir() / "jobs.json"
    new_path = config.workspace_path / "cron" / "jobs.json"
    if legacy_path.is_file() and not new_path.exists():
        new_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(legacy_path), str(new_path))


def _warn_deprecated_config_keys(*, config_path: Path | None, console: Console) -> None:
    """Hint users to remove obsolete keys from their config file."""
    from nanobot.config.loader import get_config_path

    path = config_path or get_config_path()
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return
    if "memoryWindow" in raw.get("agents", {}).get("defaults", {}):
        console.print(
            "[dim]Hint: `memoryWindow` in your config is no longer used "
            "and can be safely removed.[/dim]"
        )
