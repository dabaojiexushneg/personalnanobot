"""Inbound bus routing for the assistant cluster."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

from nanobot.bus.events import OutboundMessage
from nanobot.utils.helpers import detect_response_style

if TYPE_CHECKING:
    from nanobot.cluster.runtime import AssistantCluster


class ClusterInboundRouter:
    """Encapsulate inbound channel message routing and trace persistence."""

    def __init__(self, cluster: "AssistantCluster"):
        self.cluster = cluster

    async def route_bus(self) -> None:
        while self.cluster._running:
            try:
                msg = await asyncio.wait_for(self.cluster.bus.consume_inbound(), timeout=1.0)
            except asyncio.TimeoutError:
                continue
            except asyncio.CancelledError:
                break
            await self._handle_message(msg)

    async def _handle_message(self, msg) -> None:
        async with self.cluster._session_lock(f"{msg.channel}:{msg.session_key}"):
            defer_key = f"{msg.channel}:{msg.session_key}"
            if self.cluster._should_defer_non_text(msg.content, msg.media):
                self.cluster._queue_pending_media(defer_key, msg.media)
                return

            route = self.cluster.route_request(
                content=msg.content,
                channel=msg.channel,
                chat_id=msg.chat_id,
            )
            if route.direct_response:
                assistant = self.cluster.service.get_assistant(route.assistant_id)
                prefix = f"[{assistant.name if assistant else route.assistant_id}] "
                await self.cluster.bus.publish_outbound(
                    OutboundMessage(
                        channel=msg.channel,
                        chat_id=msg.chat_id,
                        content=prefix + route.content,
                        metadata=msg.metadata,
                    )
                )
                return
            runtime = self.cluster.runtimes.get(route.assistant_id)
            if runtime is None:
                reason = self.cluster.runtime_errors.get(route.assistant_id)
                await self.cluster.bus.publish_outbound(
                    OutboundMessage(
                        channel=msg.channel,
                        chat_id=msg.chat_id,
                        content=f"助手 {route.assistant_id} 不可用。{reason or ''}".strip(),
                        metadata=msg.metadata,
                    )
                )
                return
            if not runtime.assistant.enabled:
                await self.cluster.bus.publish_outbound(
                    OutboundMessage(
                        channel=msg.channel,
                        chat_id=msg.chat_id,
                        content=f"{runtime.assistant.name} 当前已停用。",
                        metadata=msg.metadata,
                    )
                )
                return
            daily_token_limit = getattr(runtime.assistant, "daily_token_limit", None)
            daily_token_usage = self.cluster._assistant_token_usage_today(route.assistant_id)
            if daily_token_limit and daily_token_usage >= daily_token_limit:
                await self.cluster.bus.publish_outbound(
                    OutboundMessage(
                        channel=msg.channel,
                        chat_id=msg.chat_id,
                        content=(
                            f"{runtime.assistant.name} 已达到今日 token 配额上限："
                            f"{daily_token_usage}/{daily_token_limit}"
                        ),
                        metadata=msg.metadata,
                    )
                )
                return

            effective_media = self.cluster._consume_pending_media(defer_key, msg.media)
            effective_content = self.cluster._merge_upload_context(route.content, effective_media)
            effective_content, knowledge_hits = self.cluster._merge_knowledge_context(route.assistant_id, effective_content)
            control = self.cluster._control_store()
            trace_id = (
                control.create_trace(
                    session_id=msg.session_key,
                    channel=msg.channel,
                    chat_id=msg.chat_id,
                    assistant_id=route.assistant_id,
                    request_content=msg.content,
                )
                if control else None
            )
            if control and trace_id:
                for hit in knowledge_hits:
                    control.add_trace_event(
                        trace_id,
                        "knowledge_hit",
                        hit["content"],
                        {
                            "title": hit["title"],
                            "filename": hit["filename"],
                            "score": hit["score"],
                            "lexical_score": hit.get("lexical_score", 0.0),
                            "vector_score": hit.get("vector_score", 0.0),
                            "retrieval": hit.get("retrieval", []),
                        },
                    )
            try:
                outbound, emitted = await runtime.ask(
                    content=effective_content,
                    session_key=f"{route.assistant_id}:{msg.session_key}",
                    channel=msg.channel,
                    chat_id=msg.chat_id,
                    media=effective_media,
                    metadata=msg.metadata,
                )
            except Exception as exc:
                if control and trace_id:
                    control.finalize_trace(
                        trace_id,
                        response_content="",
                        response_style="chat",
                        media_count=0,
                        status="failed",
                        error_message=str(exc),
                        prompt_tokens=0,
                        completion_tokens=0,
                        total_tokens=0,
                    )
                raise
            usage = runtime.usage_snapshot()
            user_emitted = self.cluster._collect_user_facing_emitted(emitted)
            if trace_id:
                self.cluster._record_trace_events(trace_id, emitted)
            for emitted_msg in user_emitted:
                await self.cluster.bus.publish_outbound(emitted_msg)

            response_text = outbound.content if outbound else ""
            if user_emitted or not response_text.strip():
                final_content = "\n\n".join(
                    item.content.strip()
                    for item in user_emitted
                    if item.content and item.content.strip()
                ).strip()
                if control and trace_id:
                    control.finalize_trace(
                        trace_id,
                        response_content=final_content,
                        response_style=detect_response_style(final_content),
                        media_count=sum(len(item.media or []) for item in user_emitted),
                        status="completed",
                        prompt_tokens=usage["prompt_tokens"],
                        completion_tokens=usage["completion_tokens"],
                        total_tokens=usage["total_tokens"],
                    )
                return

            final_content = f"[{runtime.assistant.name}] {response_text}"
            if control and trace_id:
                control.finalize_trace(
                    trace_id,
                    response_content=final_content,
                    response_style=detect_response_style(final_content),
                    media_count=0,
                    status="completed",
                    prompt_tokens=usage["prompt_tokens"],
                    completion_tokens=usage["completion_tokens"],
                    total_tokens=usage["total_tokens"],
                )
            await self.cluster.bus.publish_outbound(
                OutboundMessage(
                    channel=msg.channel,
                    chat_id=msg.chat_id,
                    content=final_content,
                    metadata=msg.metadata,
                )
            )
