"""Custom tools for the assistant cluster."""

from __future__ import annotations

import asyncio
import base64
from datetime import datetime
from pathlib import Path
from typing import Any

import httpx

from nanobot.agent.tools.base import Tool


class GenerateImageTool(Tool):
    """Generate images with an OpenAI-compatible image endpoint."""

    def __init__(
        self,
        *,
        api_key: str | None,
        api_base: str | None,
        provider_name: str | None,
        model: str,
        output_dir: Path,
    ):
        self.api_key = api_key
        self.api_base = api_base
        self.provider_name = (provider_name or "").strip().lower()
        self.model = model
        self.output_dir = output_dir

    @property
    def name(self) -> str:
        return "generate_image"

    @property
    def description(self) -> str:
        return (
            "Generate one or more images from a prompt and save them to the assistant workspace. "
            "Use this for posters, illustrations, covers, concept images, style drafts, and visual ideation."
        )

    @property
    def parameters(self) -> dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "Detailed image prompt in Chinese or English.",
                    "minLength": 1,
                },
                "size": {
                    "type": "string",
                    "enum": ["1024x1024", "1024x1536", "1536x1024", "2K", "auto"],
                    "description": "Output image size.",
                },
                "quality": {
                    "type": "string",
                    "enum": ["low", "medium", "high", "auto"],
                    "description": "Rendering quality.",
                },
                "count": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 4,
                    "description": "Number of images to request.",
                },
                "watermark": {
                    "type": "boolean",
                    "description": "Whether to keep the provider watermark when supported.",
                },
            },
            "required": ["prompt"],
        }

    async def execute(
        self,
        prompt: str,
        size: str = "auto",
        quality: str = "auto",
        count: int = 1,
        watermark: bool = True,
        **kwargs: Any,
    ) -> str:
        if not self.model:
            return "Error: 当前未配置专用生图模型。请在管理台为该助手单独设置 imageModel 和 imageProvider。"
        if not self.api_key:
            return "Error: image generation is not configured. Please set a compatible API key first."

        try:
            from openai import OpenAI
        except ImportError:
            return "Error: openai package is required for image generation."

        self.output_dir.mkdir(parents=True, exist_ok=True)

        def _call_images() -> Any:
            client = OpenAI(api_key=self.api_key, base_url=self.api_base)
            request: dict[str, Any] = {
                "model": self.model,
                "prompt": prompt,
                "n": count,
            }
            if size != "auto":
                request["size"] = size

            if self.provider_name in {"volcengine", "byteplus"}:
                request["size"] = "2K" if size == "auto" else size
                request["response_format"] = "url"
                request["extra_body"] = {"watermark": watermark}
            else:
                request["quality"] = quality

            return client.images.generate(**request)

        try:
            response = await asyncio.to_thread(_call_images)
        except Exception as exc:
            return f"Error generating image: {exc}"

        saved: list[str] = []
        remote_urls: list[str] = []
        for index, item in enumerate(getattr(response, "data", []) or [], start=1):
            b64_data = getattr(item, "b64_json", None)
            image_url = getattr(item, "url", None)
            if b64_data:
                filename = self.output_dir / f"image_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{index}.png"
                filename.write_bytes(base64.b64decode(b64_data))
                saved.append(str(filename))
                continue
            if image_url:
                filename = self.output_dir / f"image_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{index}.png"
                try:
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        result = await client.get(image_url)
                        result.raise_for_status()
                    filename.write_bytes(result.content)
                    saved.append(str(filename))
                except Exception:
                    remote_urls.append(str(image_url))

        if saved:
            paths = "\n".join(f"- {path}" for path in saved)
            if remote_urls:
                urls = "\n".join(f"- {url}" for url in remote_urls)
                return f"Image generation completed.\nSaved files:\n{paths}\nRemote-only URLs:\n{urls}"
            return f"Image generation completed.\nSaved files:\n{paths}"

        if remote_urls:
            urls = "\n".join(f"- {url}" for url in remote_urls)
            return f"Image generation completed.\nRemote URLs:\n{urls}"

        return "Error: image generation returned no output."
