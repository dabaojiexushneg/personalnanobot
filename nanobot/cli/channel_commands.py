"""Helpers for channel-related CLI commands."""

from __future__ import annotations

import asyncio
from pathlib import Path

import typer


def show_channel_status(*, config_path: str | None, console) -> None:
    """Render channel enablement status from config."""
    from rich.table import Table

    from nanobot.channels.registry import discover_all
    from nanobot.config.loader import load_config, set_config_path

    resolved_config_path = Path(config_path).expanduser().resolve() if config_path else None
    if resolved_config_path is not None:
        set_config_path(resolved_config_path)

    config = load_config(resolved_config_path)

    table = Table(title="Channel Status")
    table.add_column("Channel", style="cyan")
    table.add_column("Enabled")

    for name, cls in sorted(discover_all().items()):
        section = getattr(config.channels, name, None)
        if section is None:
            enabled = False
        elif isinstance(section, dict):
            enabled = section.get("enabled", False)
        else:
            enabled = getattr(section, "enabled", False)
        table.add_row(
            cls.display_name,
            "[green]\u2713[/green]" if enabled else "[dim]\u2717[/dim]",
        )

    console.print(table)


def resolve_bridge_dir(*, console, logo: str) -> Path:
    """Get the bridge directory, setting it up if needed."""
    import shutil
    import subprocess

    from nanobot.config.paths import get_bridge_install_dir

    user_bridge = get_bridge_install_dir()
    if (user_bridge / "dist" / "index.js").exists():
        return user_bridge

    npm_path = shutil.which("npm")
    if not npm_path:
        console.print("[red]npm not found. Please install Node.js >= 18.[/red]")
        raise typer.Exit(1)

    pkg_bridge = Path(__file__).parent.parent / "bridge"
    src_bridge = Path(__file__).parent.parent.parent / "bridge"

    source = None
    if (pkg_bridge / "package.json").exists():
        source = pkg_bridge
    elif (src_bridge / "package.json").exists():
        source = src_bridge

    if not source:
        console.print("[red]Bridge source not found.[/red]")
        console.print("Try reinstalling: pip install --force-reinstall nanobot")
        raise typer.Exit(1)

    console.print(f"{logo} Setting up bridge...")
    user_bridge.parent.mkdir(parents=True, exist_ok=True)
    if user_bridge.exists():
        shutil.rmtree(user_bridge)
    shutil.copytree(source, user_bridge, ignore=shutil.ignore_patterns("node_modules", "dist"))

    try:
        console.print("  Installing dependencies...")
        subprocess.run([npm_path, "install"], cwd=user_bridge, check=True, capture_output=True)

        console.print("  Building...")
        subprocess.run([npm_path, "run", "build"], cwd=user_bridge, check=True, capture_output=True)

        console.print("[green]\u2713[/green] Bridge ready\n")
    except subprocess.CalledProcessError as exc:
        console.print(f"[red]Build failed: {exc}[/red]")
        if exc.stderr:
            console.print(f"[dim]{exc.stderr.decode()[:500]}[/dim]")
        raise typer.Exit(1) from exc

    return user_bridge


def login_channel(
    *,
    channel_name: str,
    force: bool,
    config_path: str | None,
    console,
    logo: str,
) -> None:
    """Authenticate with a channel via QR code or interactive flow."""
    from nanobot.channels.registry import discover_all
    from nanobot.config.loader import load_config, set_config_path

    resolved_config_path = Path(config_path).expanduser().resolve() if config_path else None
    if resolved_config_path is not None:
        set_config_path(resolved_config_path)

    config = load_config(resolved_config_path)
    channel_cfg = getattr(config.channels, channel_name, None) or {}

    all_channels = discover_all()
    if channel_name not in all_channels:
        available = ", ".join(all_channels.keys())
        console.print(f"[red]Unknown channel: {channel_name}[/red]  Available: {available}")
        raise typer.Exit(1)

    console.print(f"{logo} {all_channels[channel_name].display_name} Login\n")

    channel_cls = all_channels[channel_name]
    channel = channel_cls(channel_cfg, bus=None)
    success = asyncio.run(channel.login(force=force))
    if not success:
        raise typer.Exit(1)
