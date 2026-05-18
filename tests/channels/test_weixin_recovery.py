from nanobot.channels.weixin import WeixinChannel


def test_reset_update_cursor_clears_saved_cursor():
    channel = WeixinChannel.__new__(WeixinChannel)
    channel._get_updates_buf = "stale-cursor"
    channel._next_poll_timeout_s = 99
    channel.config = type("Config", (), {"poll_timeout": 35, "token": ""})()
    saved = {"calls": 0}

    def _save_state():
        saved["calls"] += 1

    channel._save_state = _save_state

    channel._reset_update_cursor()

    assert channel._get_updates_buf == ""
    assert channel._next_poll_timeout_s == 35
    assert saved["calls"] == 1


async def _fake_qr_login_success():
    return True


import pytest


@pytest.mark.asyncio
async def test_recover_session_expired_retries_with_cursor_reset_then_relogin():
    channel = WeixinChannel.__new__(WeixinChannel)
    channel._get_updates_buf = "stale-cursor"
    channel._next_poll_timeout_s = 99
    channel._cursor_reset_attempted = False
    channel.config = type("Config", (), {"poll_timeout": 35, "token": ""})()
    channel._token = "cached-token"
    channel._save_state = lambda: None
    channel._qr_login = _fake_qr_login_success

    await channel._recover_session_expired()
    assert channel._get_updates_buf == ""
    assert channel._cursor_reset_attempted is True

    await channel._recover_session_expired()
    assert channel._token == ""
    assert channel._cursor_reset_attempted is False
