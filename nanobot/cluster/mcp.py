"""Helpers for MCP configuration validation and lightweight probing."""

from __future__ import annotations

import shutil
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import httpx

from nanobot.config.schema import MCPServerConfig

_HTTP_TYPES = {"sse", "streamableHttp"}
_VALID_TYPES = {"stdio", "sse", "streamableHttp"}


def resolve_mcp_transport(server: MCPServerConfig) -> str:
    """Infer MCP transport when the config omits it."""

    if server.type:
        return server.type
    if server.command.strip():
        return "stdio"
    if server.url.strip():
        return "sse" if server.url.rstrip("/").endswith("/sse") else "streamableHttp"
    return "unknown"


def summarize_mcp_server(
    name: str,
    server: MCPServerConfig,
    *,
    source: str,
) -> dict[str, Any]:
    """Return a JSON-friendly MCP server summary with validation details."""

    transport = resolve_mcp_transport(server)
    command = server.command.strip()
    url = server.url.strip()
    issues: list[str] = []
    warnings: list[str] = []

    if transport not in _VALID_TYPES:
        issues.append("未配置可识别的 MCP 传输方式，请至少填写 command 或 url。")
    if transport == "stdio":
        if not command:
            issues.append("stdio 类型 MCP 缺少 command。")
        if url:
            warnings.append("当前使用 stdio，url 将被忽略。")
    elif transport in _HTTP_TYPES:
        if not url:
            issues.append(f"{transport} 类型 MCP 缺少 url。")
        else:
            parsed = urlparse(url)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                issues.append("MCP url 必须是完整的 http(s) 地址。")
        if command:
            warnings.append(f"当前使用 {transport}，command / args 将被忽略。")

    if server.tool_timeout <= 0:
        issues.append("tool_timeout 必须大于 0。")
    if not server.enabled_tools:
        warnings.append("enabled_tools 为空时不会注册任何工具，仅可能暴露资源或提示词。")
    if len(server.enabled_tools) != len(set(server.enabled_tools)):
        warnings.append("enabled_tools 中存在重复项，运行时会自动去重。")

    endpoint = command if transport == "stdio" else url
    return {
        "name": name,
        "transport": transport,
        "endpoint": endpoint,
        "arguments": " ".join(server.args).strip() if transport == "stdio" else "",
        "enabled_tools": list(server.enabled_tools or []),
        "tool_timeout": int(server.tool_timeout),
        "env_count": len(server.env or {}),
        "header_count": len(server.headers or {}),
        "sources": [source],
        "valid": not issues,
        "issues": issues,
        "warnings": warnings,
    }


def normalize_mcp_servers(
    raw_servers: dict[str, Any] | None,
    *,
    source: str,
) -> tuple[list[dict[str, Any]], dict[str, MCPServerConfig]]:
    """Validate raw MCP payloads into configs plus UI summaries."""

    summaries: list[dict[str, Any]] = []
    valid_servers: dict[str, MCPServerConfig] = {}
    for name, raw in (raw_servers or {}).items():
        server_name = str(name).strip()
        if not server_name:
            summaries.append(
                {
                    "name": "(empty)",
                    "transport": "unknown",
                    "endpoint": "",
                    "arguments": "",
                    "enabled_tools": [],
                    "tool_timeout": 0,
                    "env_count": 0,
                    "header_count": 0,
                    "sources": [source],
                    "valid": False,
                    "issues": ["MCP server 名称不能为空。"],
                    "warnings": [],
                }
            )
            continue
        try:
            server = raw if isinstance(raw, MCPServerConfig) else MCPServerConfig.model_validate(raw)
        except Exception as exc:
            summaries.append(
                {
                    "name": server_name,
                    "transport": "unknown",
                    "endpoint": "",
                    "arguments": "",
                    "enabled_tools": [],
                    "tool_timeout": 0,
                    "env_count": 0,
                    "header_count": 0,
                    "sources": [source],
                    "valid": False,
                    "issues": [f"配置解析失败: {exc}"],
                    "warnings": [],
                }
            )
            continue
        summary = summarize_mcp_server(server_name, server, source=source)
        summaries.append(summary)
        if summary["valid"]:
            valid_servers[server_name] = server
    summaries.sort(key=lambda item: item["name"].lower())
    return summaries, valid_servers


async def probe_mcp_servers(
    raw_servers: dict[str, Any] | None,
    *,
    source: str,
) -> dict[str, Any]:
    """Run lightweight MCP reachability checks for UI diagnostics."""

    summaries, valid_servers = normalize_mcp_servers(raw_servers, source=source)
    results: list[dict[str, Any]] = []
    for summary in summaries:
        item = dict(summary)
        item["reachable"] = False
        item["probe_detail"] = ""
        item["probe_mode"] = "none"
        server = valid_servers.get(summary["name"])
        if server is None:
            item["probe_detail"] = "配置无效，未执行探测。"
            results.append(item)
            continue

        transport = item["transport"]
        if transport == "stdio":
            item["probe_mode"] = "command"
            command = server.command.strip()
            resolved = shutil.which(command)
            if not resolved and command:
                candidate = Path(command).expanduser()
                if candidate.exists():
                    resolved = str(candidate.resolve())
            if resolved:
                item["reachable"] = True
                item["probe_detail"] = f"命令可用：{resolved}"
            else:
                item["probe_detail"] = f"命令不可用：{command}"
        elif transport in _HTTP_TYPES:
            item["probe_mode"] = "http"
            try:
                async with httpx.AsyncClient(
                    headers=server.headers or None,
                    follow_redirects=True,
                    timeout=httpx.Timeout(5.0, connect=5.0),
                ) as client:
                    async with client.stream("GET", server.url) as response:
                        item["reachable"] = True
                        item["probe_detail"] = f"HTTP {response.status_code}"
            except Exception as exc:
                item["probe_detail"] = str(exc)
        else:
            item["probe_detail"] = "未识别的 transport，无法探测。"
        results.append(item)
    return {
        "valid": all(item["valid"] for item in results),
        "reachable": all(item["reachable"] for item in results if item["valid"]) if results else False,
        "servers": results,
    }
