"""OpenAI-compatible HTTP API server for a fixed nanobot session.

Provides /v1/chat/completions and /v1/models endpoints.
All requests route to a single persistent API session.
"""

from __future__ import annotations

import asyncio
import json
import time
import uuid
from typing import Any

from aiohttp import web
from loguru import logger

from nanobot.utils.runtime import EMPTY_FINAL_RESPONSE_MESSAGE

API_SESSION_KEY = "api:default"
API_CHAT_ID = "default"
API_COMPATIBILITY = {
    "multi_message": True,
    "streaming_text": True,
    "tool_calls": False,
    "vision_inputs": "text-only extraction",
}
APP_KEY_AGENT_LOOP: web.AppKey[Any] = web.AppKey("agent_loop")
APP_KEY_MODEL_NAME: web.AppKey[str] = web.AppKey("model_name")
APP_KEY_REQUEST_TIMEOUT: web.AppKey[float] = web.AppKey("request_timeout")
APP_KEY_SESSION_LOCKS: web.AppKey[dict[str, asyncio.Lock]] = web.AppKey("session_locks")


# ---------------------------------------------------------------------------
# Response helpers
# ---------------------------------------------------------------------------

def _error_json(status: int, message: str, err_type: str = "invalid_request_error") -> web.Response:
    return web.json_response(
        {"error": {"message": message, "type": err_type, "code": status}},
        status=status,
    )


def _chat_completion_response(content: str, model: str) -> dict[str, Any]:
    return {
        "id": f"chatcmpl-{uuid.uuid4().hex[:12]}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": content},
                "finish_reason": "stop",
            }
        ],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
    }


def _estimate_tokens(text: str) -> int:
    stripped = str(text or "").strip()
    if not stripped:
        return 0
    return max(1, len(stripped) // 4)


def _response_text(value: Any) -> str:
    """Normalize process_direct output to plain assistant text."""
    if value is None:
        return ""
    if hasattr(value, "content"):
        return str(getattr(value, "content") or "")
    return str(value)


def _messages_to_prompt(messages: list[dict[str, Any]]) -> tuple[str, int]:
    parts: list[str] = []
    prompt_tokens = 0
    for message in messages:
        role = str(message.get("role") or "user").strip() or "user"
        content = message.get("content", "")
        if isinstance(content, list):
            content = " ".join(
                part.get("text", "")
                for part in content
                if isinstance(part, dict) and part.get("type") == "text"
            )
        text = str(content or "").strip()
        if not text:
            continue
        parts.append(f"{role.upper()}:\n{text}")
        prompt_tokens += _estimate_tokens(text)
    return "\n\n".join(parts).strip(), prompt_tokens


def _usage_payload(agent_loop: Any, prompt_tokens: int, completion_text: str) -> dict[str, int]:
    usage = getattr(agent_loop, "_last_usage", {}) or {}
    completion_tokens = int(usage.get("completion_tokens", 0) or usage.get("completion_tokens_estimate", 0))
    if completion_tokens <= 0:
        completion_tokens = _estimate_tokens(completion_text)
    prompt_value = int(usage.get("prompt_tokens", 0) or prompt_tokens)
    cached_tokens = int(usage.get("cached_tokens", 0) or 0)
    return {
        "prompt_tokens": prompt_value,
        "completion_tokens": completion_tokens,
        "cached_tokens": cached_tokens,
        "total_tokens": prompt_value + completion_tokens,
    }


def _stream_chunk(model: str, content: str, *, finish_reason: str | None = None) -> str:
    payload = {
        "id": f"chatcmpl-{uuid.uuid4().hex[:12]}",
        "object": "chat.completion.chunk",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index": 0,
                "delta": {"content": content} if content else {},
                "finish_reason": finish_reason,
            }
        ],
    }
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


# ---------------------------------------------------------------------------
# Route handlers
# ---------------------------------------------------------------------------

async def handle_chat_completions(request: web.Request) -> web.Response:
    """POST /v1/chat/completions"""

    # --- Parse body ---
    try:
        body = await request.json()
    except Exception:
        return _error_json(400, "Invalid JSON body")

    messages = body.get("messages")
    if not isinstance(messages, list) or not messages:
        return _error_json(400, "messages must contain at least one item")
    if not all(isinstance(message, dict) for message in messages):
        return _error_json(400, "messages must be objects")
    if not any(str(message.get("role") or "").strip() == "user" for message in messages):
        return _error_json(400, "messages must include at least one user message")
    wants_stream = bool(body.get("stream", False))
    user_content, prompt_tokens = _messages_to_prompt(messages)
    if not user_content:
        return _error_json(400, "messages did not contain any textual content")

    agent_loop = request.app[APP_KEY_AGENT_LOOP]
    timeout_s: float = request.app.get(APP_KEY_REQUEST_TIMEOUT, 120.0)
    model_name: str = request.app.get(APP_KEY_MODEL_NAME, "nanobot")
    if (requested_model := body.get("model")) and requested_model != model_name:
        return _error_json(400, f"Only configured model '{model_name}' is available")

    session_key = f"api:{body['session_id']}" if body.get("session_id") else API_SESSION_KEY
    session_locks: dict[str, asyncio.Lock] = request.app[APP_KEY_SESSION_LOCKS]
    session_lock = session_locks.setdefault(session_key, asyncio.Lock())

    logger.info("API request session_key={} content={}", session_key, user_content[:80])

    _FALLBACK = EMPTY_FINAL_RESPONSE_MESSAGE

    try:
        async with session_lock:
            try:
                streamed_chunks: list[str] = []

                async def _on_stream(delta: str) -> None:
                    streamed_chunks.append(delta)

                response = await asyncio.wait_for(
                    agent_loop.process_direct(
                        content=user_content,
                        session_key=session_key,
                        channel="api",
                        chat_id=API_CHAT_ID,
                        on_stream=_on_stream if wants_stream else None,
                    ),
                    timeout=timeout_s,
                )
                response_text = _response_text(response) or "".join(streamed_chunks)

                if not response_text or not response_text.strip():
                    logger.warning(
                        "Empty response for session {}, retrying",
                        session_key,
                    )
                    retry_response = await asyncio.wait_for(
                        agent_loop.process_direct(
                            content=user_content,
                            session_key=session_key,
                            channel="api",
                            chat_id=API_CHAT_ID,
                        ),
                        timeout=timeout_s,
                    )
                    response_text = _response_text(retry_response)
                    if not response_text or not response_text.strip():
                        logger.warning(
                            "Empty response after retry for session {}, using fallback",
                            session_key,
                        )
                        response_text = _FALLBACK

            except asyncio.TimeoutError:
                return _error_json(504, f"Request timed out after {timeout_s}s")
            except Exception:
                logger.exception("Error processing request for session {}", session_key)
                return _error_json(500, "Internal server error", err_type="server_error")
    except Exception:
        logger.exception("Unexpected API lock error for session {}", session_key)
        return _error_json(500, "Internal server error", err_type="server_error")

    usage = _usage_payload(agent_loop, prompt_tokens, response_text)
    if wants_stream:
        stream = web.StreamResponse(
            status=200,
            headers={
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )
        await stream.prepare(request)
        if streamed_chunks:
            for chunk in streamed_chunks:
                await stream.write(_stream_chunk(model_name, chunk).encode("utf-8"))
        else:
            await stream.write(_stream_chunk(model_name, response_text).encode("utf-8"))
        await stream.write(_stream_chunk(model_name, "", finish_reason="stop").encode("utf-8"))
        await stream.write(b"data: [DONE]\n\n")
        await stream.write_eof()
        return stream

    payload = _chat_completion_response(response_text, model_name)
    payload["usage"] = usage
    return web.json_response(payload)


async def handle_models(request: web.Request) -> web.Response:
    """GET /v1/models"""
    model_name = request.app.get(APP_KEY_MODEL_NAME, "nanobot")
    return web.json_response({
        "object": "list",
        "data": [
            {
                "id": model_name,
                "object": "model",
                "created": 0,
                "owned_by": "nanobot",
                "metadata": API_COMPATIBILITY,
            }
        ],
    })


async def handle_health(request: web.Request) -> web.Response:
    """GET /health"""
    return web.json_response({"status": "ok", "compatibility": API_COMPATIBILITY})


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app(agent_loop, model_name: str = "nanobot", request_timeout: float = 120.0) -> web.Application:
    """Create the aiohttp application.

    Args:
        agent_loop: An initialized AgentLoop instance.
        model_name: Model name reported in responses.
        request_timeout: Per-request timeout in seconds.
    """
    app = web.Application()
    app[APP_KEY_AGENT_LOOP] = agent_loop
    app[APP_KEY_MODEL_NAME] = model_name
    app[APP_KEY_REQUEST_TIMEOUT] = request_timeout
    app[APP_KEY_SESSION_LOCKS] = {}  # per-user locks, keyed by session_key

    app.router.add_post("/v1/chat/completions", handle_chat_completions)
    app.router.add_get("/v1/models", handle_models)
    app.router.add_get("/health", handle_health)
    return app
