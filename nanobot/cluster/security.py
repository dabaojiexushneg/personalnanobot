"""Security helpers for cluster auth, cookies, and CSRF."""

from __future__ import annotations

import secrets
from dataclasses import dataclass

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError

from nanobot.config.schema import ClusterWebConfig

_PASSWORD_HASHER = PasswordHasher()
_LEGACY_DELIMITER = "$"


def hash_password(password: str) -> str:
    """Hash a password with argon2id."""

    return _PASSWORD_HASHER.hash(password)


def is_modern_password_hash(value: str) -> bool:
    return str(value or "").startswith("$argon2id$")


def is_legacy_password_hash(value: str) -> bool:
    current = str(value or "")
    return bool(current) and not is_modern_password_hash(current) and _LEGACY_DELIMITER in current


def verify_password(password: str, password_hash: str) -> bool:
    """Return whether *password* matches the argon2id hash."""

    try:
        return _PASSWORD_HASHER.verify(password_hash, password)
    except (InvalidHashError, VerificationError, VerifyMismatchError):
        return False


def password_needs_rehash(password_hash: str) -> bool:
    """Return whether the hash should be re-generated with current parameters."""

    if not is_modern_password_hash(password_hash):
        return True
    try:
        return _PASSWORD_HASHER.check_needs_rehash(password_hash)
    except InvalidHashError:
        return True


def new_csrf_token() -> str:
    return secrets.token_urlsafe(32)


@dataclass(frozen=True)
class CookieSettings:
    secure: bool
    path: str
    samesite: str
    httponly: bool = True


def cookie_settings(web_config: ClusterWebConfig) -> CookieSettings:
    """Resolve runtime cookie settings, allowing local dev to relax secure cookies."""

    secure = bool(web_config.cookie_secure and not web_config.dev_mode)
    return CookieSettings(
        secure=secure,
        path=web_config.cookie_path,
        samesite=web_config.cookie_samesite,
    )
