"""Local user file roots exposed to file tools in restricted mode."""

from __future__ import annotations

import os
from pathlib import Path


def get_desktop_dir() -> Path:
    """Return the user's Desktop path.

    ``NANOBOT_DESKTOP_DIR`` is primarily for tests and controlled deployments
    where the OS desktop is redirected.
    """
    override = os.environ.get("NANOBOT_DESKTOP_DIR")
    if override:
        return Path(override).expanduser().resolve()

    if os.name == "nt":
        try:
            import winreg

            with winreg.OpenKey(
                winreg.HKEY_CURRENT_USER,
                r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders",
            ) as key:
                value, _ = winreg.QueryValueEx(key, "Desktop")
            if value:
                return Path(os.path.expandvars(str(value))).expanduser().resolve()
        except Exception:
            pass
        home = os.environ.get("USERPROFILE") or str(Path.home())
    else:
        home = str(Path.home())
    return (Path(home) / "Desktop").expanduser().resolve()


def get_user_file_roots() -> list[Path]:
    """Return narrowly-scoped local folders agents may use for user files."""
    return [get_desktop_dir()]
