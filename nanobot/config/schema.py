"""Configuration schema using Pydantic."""

from pathlib import Path
from typing import Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from pydantic_settings import BaseSettings

from nanobot.cron.types import CronSchedule


class Base(BaseModel):
    """Base model that accepts both camelCase and snake_case keys."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class ChannelsConfig(Base):
    """Configuration for chat channels.

    Built-in and plugin channel configs are stored as extra fields (dicts).
    Each channel parses its own config in __init__.
    Per-channel "streaming": true enables streaming output (requires send_delta impl).
    """

    model_config = ConfigDict(extra="allow")

    send_progress: bool = True  # stream agent's text progress to the channel
    send_tool_hints: bool = False  # stream tool-call hints (e.g. read_file("…"))
    send_max_retries: int = Field(default=3, ge=0, le=10)  # Max delivery attempts (initial send included)
    transcription_provider: str = "groq"  # Voice transcription backend: "groq" or "openai"


class DreamConfig(Base):
    """Dream memory consolidation configuration."""

    _HOUR_MS = 3_600_000

    interval_h: int = Field(default=2, ge=1)  # Every 2 hours by default
    cron: str | None = Field(default=None, exclude=True)  # Legacy compatibility override
    model_override: str | None = Field(
        default=None,
        validation_alias=AliasChoices("modelOverride", "model", "model_override"),
    )  # Optional Dream-specific model override
    max_batch_size: int = Field(default=20, ge=1)  # Max history entries per run
    max_iterations: int = Field(default=10, ge=1)  # Max tool calls per Phase 2

    def build_schedule(self, timezone: str) -> CronSchedule:
        """Build the runtime schedule, preferring the legacy cron override if present."""
        if self.cron:
            return CronSchedule(kind="cron", expr=self.cron, tz=timezone)
        return CronSchedule(kind="every", every_ms=self.interval_h * self._HOUR_MS)

    def describe_schedule(self) -> str:
        """Return a human-readable summary for logs and startup output."""
        if self.cron:
            return f"cron {self.cron} (legacy)"
        hours = self.interval_h
        return f"every {hours}h"


class AgentDefaults(Base):
    """Default agent configuration."""

    workspace: str = "~/.nanobot/workspace"
    model: str = "anthropic/claude-opus-4-5"
    provider: str = (
        "auto"  # Provider name (e.g. "anthropic", "openrouter") or "auto" for auto-detection
    )
    max_tokens: int = 8192
    context_window_tokens: int = 65_536
    context_block_limit: int | None = None
    temperature: float = 0.1
    max_tool_iterations: int = 200
    max_tool_result_chars: int = 16_000
    provider_retry_mode: Literal["standard", "persistent"] = "standard"
    reasoning_effort: str | None = None  # low / medium / high / adaptive - enables LLM thinking mode
    timezone: str = "UTC"  # IANA timezone, e.g. "Asia/Shanghai", "America/New_York"
    unified_session: bool = False  # Share one session across all channels (single-user multi-device)
    disabled_skills: list[str] = Field(default_factory=list)  # Skill names to exclude from loading (e.g. ["summarize", "skill-creator"])
    session_ttl_minutes: int = Field(
        default=0,
        ge=0,
        validation_alias=AliasChoices("idleCompactAfterMinutes", "sessionTtlMinutes"),
        serialization_alias="idleCompactAfterMinutes",
    )  # Auto-compact idle threshold in minutes (0 = disabled)
    dream: DreamConfig = Field(default_factory=DreamConfig)


class AgentsConfig(Base):
    """Agent configuration."""

    defaults: AgentDefaults = Field(default_factory=AgentDefaults)


class ProviderConfig(Base):
    """LLM provider configuration."""

    api_key: str = ""
    api_base: str | None = None
    extra_headers: dict[str, str] | None = None  # Custom headers (e.g. APP-Code for AiHubMix)


class ProvidersConfig(Base):
    """Configuration for LLM providers."""

    custom: ProviderConfig = Field(default_factory=ProviderConfig)  # Any OpenAI-compatible endpoint
    azure_openai: ProviderConfig = Field(default_factory=ProviderConfig)  # Azure OpenAI (model = deployment name)
    anthropic: ProviderConfig = Field(default_factory=ProviderConfig)
    openai: ProviderConfig = Field(default_factory=ProviderConfig)
    openrouter: ProviderConfig = Field(default_factory=ProviderConfig)
    deepseek: ProviderConfig = Field(default_factory=ProviderConfig)
    groq: ProviderConfig = Field(default_factory=ProviderConfig)
    zhipu: ProviderConfig = Field(default_factory=ProviderConfig)
    dashscope: ProviderConfig = Field(default_factory=ProviderConfig)
    vllm: ProviderConfig = Field(default_factory=ProviderConfig)
    ollama: ProviderConfig = Field(default_factory=ProviderConfig)  # Ollama local models
    ovms: ProviderConfig = Field(default_factory=ProviderConfig)  # OpenVINO Model Server (OVMS)
    gemini: ProviderConfig = Field(default_factory=ProviderConfig)
    moonshot: ProviderConfig = Field(default_factory=ProviderConfig)
    minimax: ProviderConfig = Field(default_factory=ProviderConfig)
    mistral: ProviderConfig = Field(default_factory=ProviderConfig)
    stepfun: ProviderConfig = Field(default_factory=ProviderConfig)  # Step Fun (阶跃星辰)
    xiaomi_mimo: ProviderConfig = Field(default_factory=ProviderConfig)  # Xiaomi MIMO (小米)
    aihubmix: ProviderConfig = Field(default_factory=ProviderConfig)  # AiHubMix API gateway
    siliconflow: ProviderConfig = Field(default_factory=ProviderConfig)  # SiliconFlow (硅基流动)
    volcengine: ProviderConfig = Field(default_factory=ProviderConfig)  # VolcEngine (火山引擎)
    volcengine_coding_plan: ProviderConfig = Field(default_factory=ProviderConfig)  # VolcEngine Coding Plan
    byteplus: ProviderConfig = Field(default_factory=ProviderConfig)  # BytePlus (VolcEngine international)
    byteplus_coding_plan: ProviderConfig = Field(default_factory=ProviderConfig)  # BytePlus Coding Plan
    openai_codex: ProviderConfig = Field(default_factory=ProviderConfig, exclude=True)  # OpenAI Codex (OAuth)
    github_copilot: ProviderConfig = Field(default_factory=ProviderConfig, exclude=True)  # Github Copilot (OAuth)
    qianfan: ProviderConfig = Field(default_factory=ProviderConfig)  # Qianfan (百度千帆)


class HeartbeatConfig(Base):
    """Heartbeat service configuration."""

    enabled: bool = True
    interval_s: int = 30 * 60  # 30 minutes
    keep_recent_messages: int = 8


class ApiConfig(Base):
    """OpenAI-compatible API server configuration."""

    host: str = "127.0.0.1"  # Safer default: local-only bind.
    port: int = 8900
    timeout: float = 120.0  # Per-request timeout in seconds.


class GatewayConfig(Base):
    """Gateway/server configuration."""

    host: str = "0.0.0.0"
    port: int = 18790
    heartbeat: HeartbeatConfig = Field(default_factory=HeartbeatConfig)


class WebSearchConfig(Base):
    """Web search tool configuration."""

    provider: str = "duckduckgo"  # brave, tavily, duckduckgo, searxng, jina, kagi
    api_key: str = ""
    base_url: str = ""  # SearXNG base URL
    max_results: int = 5
    timeout: int = 30  # Wall-clock timeout (seconds) for search operations


class WebToolsConfig(Base):
    """Web tools configuration."""

    enable: bool = True
    proxy: str | None = (
        None  # HTTP/SOCKS5 proxy URL, e.g. "http://127.0.0.1:7890" or "socks5://127.0.0.1:1080"
    )
    search: WebSearchConfig = Field(default_factory=WebSearchConfig)


class ExecToolConfig(Base):
    """Shell exec tool configuration."""

    enable: bool = True
    timeout: int = 60
    path_append: str = ""
    sandbox: str = ""  # sandbox backend: "" (none) or "bwrap"
    allowed_env_keys: list[str] = Field(default_factory=list)  # Env var names to pass through to subprocess (e.g. ["GOPATH", "JAVA_HOME"])

class MCPServerConfig(Base):
    """MCP server connection configuration (stdio or HTTP)."""

    type: Literal["stdio", "sse", "streamableHttp"] | None = None  # auto-detected if omitted
    command: str = ""  # Stdio: command to run (e.g. "npx")
    args: list[str] = Field(default_factory=list)  # Stdio: command arguments
    env: dict[str, str] = Field(default_factory=dict)  # Stdio: extra env vars
    url: str = ""  # HTTP/SSE: endpoint URL
    headers: dict[str, str] = Field(default_factory=dict)  # HTTP/SSE: custom headers
    tool_timeout: int = 30  # seconds before a tool call is cancelled
    enabled_tools: list[str] = Field(default_factory=lambda: ["*"])  # Only register these tools; accepts raw MCP names or wrapped mcp_<server>_<tool> names; ["*"] = all tools; [] = no tools


_REPO_ROOT = str(Path(__file__).resolve().parents[2])
_NANOBOT_HOME = "~/.nanobot"
_CLUSTER_HOME = "~/.nanobot/cluster"


def _mcp_stdio(
    command: str,
    args: list[str] | None = None,
    *,
    tool_timeout: int = 30,
    enabled_tools: list[str] | None = None,
) -> MCPServerConfig:
    return MCPServerConfig(
        type="stdio",
        command=command,
        args=args or [],
        tool_timeout=tool_timeout,
        enabled_tools=enabled_tools or ["*"],
    )


def _default_assistant_mcp_servers(profile: str) -> dict[str, MCPServerConfig]:
    """Return MCP servers tailored for one default cluster assistant."""
    catalog = {
        "filesystemRepo": _mcp_stdio("mcp-server-filesystem", [_REPO_ROOT]),
        "filesystemConfig": _mcp_stdio("mcp-server-filesystem", [_NANOBOT_HOME]),
        "filesystemCluster": _mcp_stdio("mcp-server-filesystem", [_CLUSTER_HOME]),
        "fetchWeb": _mcp_stdio("mcp-server-fetch"),
        "gitRepo": _mcp_stdio("mcp-server-git", ["--repository", _REPO_ROOT]),
        "timeShanghai": _mcp_stdio("mcp-server-time", ["--local-timezone", "Asia/Shanghai"]),
        "timeUtc": _mcp_stdio("mcp-server-time", ["--local-timezone", "UTC"]),
        "memoryGraph": _mcp_stdio("mcp-server-memory"),
        "sequentialThinking": _mcp_stdio("mcp-server-sequential-thinking"),
        "puppeteerBrowser": _mcp_stdio("mcp-server-puppeteer", tool_timeout=45),
    }
    profiles = {
        "image": ["fetchWeb", "filesystemCluster", "puppeteerBrowser"],
        "consult": ["fetchWeb", "timeShanghai", "memoryGraph", "filesystemConfig"],
        "developer": ["filesystemRepo", "gitRepo", "fetchWeb", "sequentialThinking", "puppeteerBrowser"],
        "investment": ["fetchWeb", "timeShanghai", "memoryGraph", "sequentialThinking"],
        "community": ["fetchWeb", "timeShanghai", "memoryGraph", "puppeteerBrowser"],
        "writer": ["fetchWeb", "filesystemRepo", "memoryGraph", "sequentialThinking"],
        "expert": ["filesystemRepo", "filesystemConfig", "fetchWeb", "gitRepo", "timeShanghai", "memoryGraph", "sequentialThinking"],
    }
    return {name: catalog[name] for name in profiles.get(profile, [])}


class AssistantRoutingConfig(Base):
    """Message routing hints for a cluster assistant."""

    aliases: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)

#   定义单个助手的配置结构：Prompt、模型、工具、Skills、路由。
class AssistantClusterMemberConfig(Base):
    """Configuration for one assistant in the personal helper cluster."""

    id: str
    name: str
    enabled: bool = True
    description: str = ""
    persona_prompt: str = ""
    prompt_version: int = Field(default=1, ge=1)
    prompt_updated_at: str | None = None
    prompt_change_note: str = ""
    provider: str = "auto"
    model: str = ""
    image_provider: str | None = None
    image_model: str | None = None
    workspace: str = ""
    tool_names: list[str] = Field(default_factory=list)
    enabled_skills: list[str] = Field(default_factory=list)
    disabled_skills: list[str] = Field(default_factory=list)
    max_tokens: int | None = None
    temperature: float | None = None
    reasoning_effort: str | None = None
    max_tool_iterations: int | None = None
    context_window_tokens: int | None = None
    max_tool_result_chars: int | None = None
    provider_retry_mode: Literal["standard", "persistent"] | None = None
    daily_token_limit: int | None = Field(default=None, ge=0)
    mcp_servers: dict[str, MCPServerConfig] = Field(default_factory=dict)
    routing: AssistantRoutingConfig = Field(default_factory=AssistantRoutingConfig)


class ClusterWebConfig(Base):
    """FastAPI-based management console configuration."""

    enabled: bool = True
    host: str = "127.0.0.1"
    port: int = 8711
    title: str = "nanobot个人生活账号助手"
    auth_enabled: bool = True
    dev_mode: bool = False
    admin_username: str = "admin"
    admin_password: str = ""
    session_ttl_minutes: int = 480
    cookie_secure: bool = True
    cookie_path: str = "/"
    cookie_samesite: Literal["strict", "lax", "none"] = "strict"
    csrf_enabled: bool = True
    upload_max_file_mb: int = 10
    upload_max_total_mb: int = 30
    upload_chunk_size_kb: int = 256
    allowed_upload_extensions: list[str] = Field(
        default_factory=lambda: ["*"]
    )
    allowed_knowledge_extensions: list[str] = Field(
        default_factory=lambda: [
            ".txt",
            ".md",
            ".markdown",
            ".pdf",
            ".docx",
            ".json",
            ".csv",
        ]
    )
    max_knowledge_chars: int = 200_000


class ClusterRagConfig(Base):
    """Milvus-backed RAG configuration for the assistant cluster."""

    uri: str = "http://127.0.0.1:19530"
    token: str = ""
    collection_name: str = "knowledge_chunks"
    embedding_model: str = "all-MiniLM-L6-v2"

#   定义多 Agent 协同配置：Planner、Workers、执行模式。

class ClusterCollaborationConfig(Base):
    """Multi-agent collaboration configuration."""

    mode: Literal["off", "auto", "always"] = "auto"
    planner_assistant_id: str = "expert"
    synthesis_assistant_id: str = ""
    worker_assistant_ids: list[str] = Field(
        default_factory=lambda: ["consult", "developer", "writer"]
    )
    max_workers: int = Field(default=3, ge=1, le=8)
    execution_mode: Literal["parallel", "sequential"] = "parallel"
    auto_keywords: list[str] = Field(
        default_factory=lambda: [
            "方案",
            "设计",
            "架构",
            "规划",
            "拆解",
            "调研",
            "比较",
            "评估",
            "分析",
            "综合",
            "多角度",
            "多助手",
            "协同",
        ]
    )
    min_content_length: int = Field(default=24, ge=1, le=500)

#   创建默认助手集群，如咨询、生图、开发、写作、专家。
def build_default_cluster_assistants() -> list[AssistantClusterMemberConfig]:
    """Return the required seven assistant profiles."""
    return [
        AssistantClusterMemberConfig(
            id="image",
            name="AI 生图助手",
            description="负责图像创意拆解、提示词设计、图片生成与画面风格迭代。",
            persona_prompt=(
                "你是 AI 生图助手，擅长把模糊创意转成可执行的图像生成任务。"
                "语气友善、直观、审美明确，优先给出高可用提示词、尺寸建议、构图与风格控制。"
            ),
            provider="dashscope",
            model="qwen3.6-max-preview",
            image_provider="volcengine",
            image_model="doubao-seedream-4-5-251128",
            tool_names=["generate_image", "web_search", "web_fetch", "read_file", "list_dir", "copy_file", "message"],
            enabled_skills=["summarize"],
            max_tokens=4096,
            temperature=0.75,
            reasoning_effort="medium",
            max_tool_iterations=8,
            context_window_tokens=65536,
            max_tool_result_chars=24000,
            provider_retry_mode="persistent",
            daily_token_limit=120000,
            mcp_servers=_default_assistant_mcp_servers("image"),
            prompt_change_note="默认生图助手参数：面向视觉创意、提示词改写和图片生成。",
            routing=AssistantRoutingConfig(
                aliases=["生图", "画图", "image", "img"],
                keywords=["海报", "插画", "配图", "生成图片", "出图", "视觉"],
            ),
        ),
        AssistantClusterMemberConfig(
            id="consult",
            name="AI 咨询助手",
            description="负责日常问题咨询、信息解释、方案建议与生活工作协助。",
            persona_prompt=(
                "你是 AI 咨询助手，擅长把复杂问题解释清楚。"
                "语气亲切、稳重、结论先行，提供直接可执行的建议，不堆砌术语。"
                "如果用户明确要求生成图片、插画、海报、配图、封面、视觉稿、效果图，"
                "必须直接调用 generate_image 工具完成出图，而不是只给提示词或只做文字说明。"
            ),
            provider="dashscope",
            model="qwen3.6-max-preview",
            image_provider="volcengine",
            image_model="doubao-seedream-4-5-251128",
            tool_names=["generate_image", "web_search", "web_fetch", "read_file", "list_dir", "copy_file", "message"],
            enabled_skills=["summarize", "weather"],
            max_tokens=4096,
            temperature=0.55,
            reasoning_effort="medium",
            max_tool_iterations=8,
            context_window_tokens=65536,
            max_tool_result_chars=24000,
            provider_retry_mode="persistent",
            daily_token_limit=160000,
            mcp_servers=_default_assistant_mcp_servers("consult"),
            prompt_change_note="默认咨询助手参数：面向生活问答、RAG 检索和文件处理。",
            routing=AssistantRoutingConfig(
                aliases=["咨询", "help", "assistant"],
                keywords=["怎么做", "请教", "咨询", "建议", "帮我分析"],
            ),
        ),
        AssistantClusterMemberConfig(
            id="developer",
            name="AI 开发助手",
            description="负责软件研发、代码实现、调试、测试与工程方案设计。",
            persona_prompt=(
                "你是 AI 开发助手，输出必须严谨、专业、清晰。"
                "优先给出可运行实现、定位风险、说明边界，不写空话。"
            ),
            provider="dashscope",
            model="qwen3.6-max-preview",
            image_provider="volcengine",
            image_model="doubao-seedream-4-5-251128",
            tool_names=[
                "read_file",
                "write_file",
                "edit_file",
                "copy_file",
                "list_dir",
                "glob",
                "grep",
                "notebook_edit",
                "exec",
                "web_search",
                "web_fetch",
                "spawn",
                "message",
            ],
            enabled_skills=["github", "tmux", "summarize"],
            max_tokens=6144,
            temperature=0.35,
            reasoning_effort="high",
            max_tool_iterations=16,
            context_window_tokens=65536,
            max_tool_result_chars=48000,
            provider_retry_mode="persistent",
            daily_token_limit=220000,
            mcp_servers=_default_assistant_mcp_servers("developer"),
            prompt_change_note="默认开发助手参数：面向代码修改、调试、测试和工程化任务。",
            routing=AssistantRoutingConfig(
                aliases=["开发", "code", "dev", "coder"],
                keywords=["代码", "报错", "bug", "接口", "脚本", "部署", "调试"],
            ),
        ),
        AssistantClusterMemberConfig(
            id="investment",
            name="AI 投资助手",
            description="负责投资信息整理、研究摘要、风险识别与数据对比分析。",
            persona_prompt=(
                "你是 AI 投资助手，语气严谨、合规、克制。"
                "结论必须附带依据、风险提示和不确定性说明，禁止夸张承诺。"
            ),
            provider="dashscope",
            model="qwen3.6-max-preview",
            image_provider="volcengine",
            image_model="doubao-seedream-4-5-251128",
            tool_names=["web_search", "web_fetch", "read_file", "list_dir", "copy_file", "message"],
            enabled_skills=["summarize"],
            max_tokens=4096,
            temperature=0.35,
            reasoning_effort="medium",
            max_tool_iterations=8,
            context_window_tokens=65536,
            max_tool_result_chars=24000,
            provider_retry_mode="persistent",
            daily_token_limit=100000,
            mcp_servers=_default_assistant_mcp_servers("investment"),
            prompt_change_note="默认投资助手参数：面向资料整理、风险提示和研究摘要。",
            routing=AssistantRoutingConfig(
                aliases=["投资", "finance", "fund"],
                keywords=["股票", "基金", "财报", "估值", "币圈", "行情", "投资"],
            ),
        ),
        AssistantClusterMemberConfig(
            id="community",
            name="AI 社区助手",
            description="负责社区运营、活动方案、互动文案、用户反馈整理与氛围建设。",
            persona_prompt=(
                "你是 AI 社区助手，兼顾专业运营能力与自然沟通感。"
                "输出要有传播感、可执行、贴近日常社区语境。"
            ),
            provider="dashscope",
            model="qwen3.6-max-preview",
            image_provider="volcengine",
            image_model="doubao-seedream-4-5-251128",
            tool_names=["web_search", "web_fetch", "read_file", "write_file", "edit_file", "copy_file", "list_dir", "message"],
            enabled_skills=["summarize"],
            max_tokens=4096,
            temperature=0.7,
            reasoning_effort="medium",
            max_tool_iterations=10,
            context_window_tokens=65536,
            max_tool_result_chars=30000,
            provider_retry_mode="persistent",
            daily_token_limit=120000,
            mcp_servers=_default_assistant_mcp_servers("community"),
            prompt_change_note="默认社区助手参数：面向社群运营、活动策划和用户反馈整理。",
            routing=AssistantRoutingConfig(
                aliases=["社区", "community", "运营"],
                keywords=["社群", "社区", "活动", "互动", "拉新", "运营", "用户反馈"],
            ),
        ),
        AssistantClusterMemberConfig(
            id="writer",
            name="AI 写作助手",
            description="负责文章写作、提纲规划、润色改写、品牌表达与多场景文案生成。",
            persona_prompt=(
                "你是 AI 写作助手，擅长结构、语感和表达节奏。"
                "语气友善自然，优先保证内容成稿质量和可直接发布性。"
            ),
            provider="dashscope",
            model="qwen3.6-max-preview",
            image_provider="volcengine",
            image_model="doubao-seedream-4-5-251128",
            tool_names=["web_search", "web_fetch", "read_file", "write_file", "edit_file", "copy_file", "list_dir", "message"],
            enabled_skills=["summarize"],
            max_tokens=6144,
            temperature=0.75,
            reasoning_effort="medium",
            max_tool_iterations=10,
            context_window_tokens=65536,
            max_tool_result_chars=32000,
            provider_retry_mode="persistent",
            daily_token_limit=140000,
            mcp_servers=_default_assistant_mcp_servers("writer"),
            prompt_change_note="默认写作助手参数：面向文章、文案、改写和素材生成。",
            routing=AssistantRoutingConfig(
                aliases=["写作", "writer", "copy"],
                keywords=["写一篇", "润色", "文案", "标题", "文章", "改写", "提纲"],
            ),
        ),
        AssistantClusterMemberConfig(
            id="expert",
            name="AI 智能专家",
            description="负责跨领域复杂问题拆解、系统方案设计与高级决策支持。",
            persona_prompt=(
                "你是 AI 智能专家，语气严谨、专业、面向决策。"
                "先澄清目标与约束，再给出结构化方案、风险与备选路径。"
            ),
            provider="dashscope",
            model="qwen3.6-max-preview",
            image_provider="volcengine",
            image_model="doubao-seedream-4-5-251128",
            tool_names=[
                "read_file",
                "write_file",
                "edit_file",
                "copy_file",
                "list_dir",
                "glob",
                "grep",
                "notebook_edit",
                "exec",
                "web_search",
                "web_fetch",
                "message",
            ],
            enabled_skills=["summarize", "memory"],
            max_tokens=8192,
            temperature=0.45,
            reasoning_effort="high",
            max_tool_iterations=14,
            context_window_tokens=65536,
            max_tool_result_chars=48000,
            provider_retry_mode="persistent",
            daily_token_limit=200000,
            mcp_servers=_default_assistant_mcp_servers("expert"),
            prompt_change_note="默认专家助手参数：面向复杂问题拆解、方案评审和多助手协同规划。",
            routing=AssistantRoutingConfig(
                aliases=["专家", "expert", "advisor"],
                keywords=["方案设计", "系统设计", "架构", "专家", "高级", "复杂问题"],
            ),
        ),
    ]

#   定义整个集群配置，包括默认助手、RAG、Web、协同配置。
class ClusterConfig(Base):
    """Configuration for the assistant cluster runtime."""

    enabled: bool = False
    data_root: str = "~/.nanobot/cluster"
    default_assistant_id: str = "consult"
    auto_route: bool = True
    assistants: list[AssistantClusterMemberConfig] = Field(default_factory=build_default_cluster_assistants)
    web: ClusterWebConfig = Field(default_factory=ClusterWebConfig)
    rag: ClusterRagConfig = Field(default_factory=ClusterRagConfig)
    collaboration: ClusterCollaborationConfig = Field(default_factory=ClusterCollaborationConfig)


class ToolsConfig(Base):
    """Tools configuration."""

    web: WebToolsConfig = Field(default_factory=WebToolsConfig)
    exec: ExecToolConfig = Field(default_factory=ExecToolConfig)
    restrict_to_workspace: bool = False  # restrict all tool access to workspace directory
    mcp_servers: dict[str, MCPServerConfig] = Field(default_factory=dict)
    ssrf_whitelist: list[str] = Field(default_factory=list)  # CIDR ranges to exempt from SSRF blocking (e.g. ["100.64.0.0/10"] for Tailscale)


class Config(BaseSettings):
    """Root configuration for nanobot."""

    agents: AgentsConfig = Field(default_factory=AgentsConfig)
    channels: ChannelsConfig = Field(default_factory=ChannelsConfig)
    providers: ProvidersConfig = Field(default_factory=ProvidersConfig)
    api: ApiConfig = Field(default_factory=ApiConfig)
    gateway: GatewayConfig = Field(default_factory=GatewayConfig)
    tools: ToolsConfig = Field(default_factory=ToolsConfig)
    cluster: ClusterConfig = Field(default_factory=ClusterConfig)

    @property
    def workspace_path(self) -> Path:
        """Get expanded workspace path."""
        return Path(self.agents.defaults.workspace).expanduser()

    def _match_provider(
        self, model: str | None = None
    ) -> tuple["ProviderConfig | None", str | None]:
        """Match provider config and its registry name. Returns (config, spec_name)."""
        from nanobot.providers.registry import PROVIDERS, find_by_name

        forced = self.agents.defaults.provider
        if forced != "auto":
            spec = find_by_name(forced)
            if spec:
                p = getattr(self.providers, spec.name, None)
                return (p, spec.name) if p else (None, None)
            return None, None

        model_lower = (model or self.agents.defaults.model).lower()
        model_normalized = model_lower.replace("-", "_")
        model_prefix = model_lower.split("/", 1)[0] if "/" in model_lower else ""
        normalized_prefix = model_prefix.replace("-", "_")

        def _kw_matches(kw: str) -> bool:
            kw = kw.lower()
            return kw in model_lower or kw.replace("-", "_") in model_normalized

        # Explicit provider prefix wins — prevents `github-copilot/...codex` matching openai_codex.
        for spec in PROVIDERS:
            p = getattr(self.providers, spec.name, None)
            if p and model_prefix and normalized_prefix == spec.name:
                if spec.is_oauth or spec.is_local or p.api_key:
                    return p, spec.name

        # Match by keyword (order follows PROVIDERS registry)
        for spec in PROVIDERS:
            p = getattr(self.providers, spec.name, None)
            if p and any(_kw_matches(kw) for kw in spec.keywords):
                if spec.is_oauth or spec.is_local or p.api_key:
                    return p, spec.name

        # Fallback: configured local providers can route models without
        # provider-specific keywords (for example plain "llama3.2" on Ollama).
        # Prefer providers whose detect_by_base_keyword matches the configured api_base
        # (e.g. Ollama's "11434" in "http://localhost:11434") over plain registry order.
        local_fallback: tuple[ProviderConfig, str] | None = None
        for spec in PROVIDERS:
            if not spec.is_local:
                continue
            p = getattr(self.providers, spec.name, None)
            if not (p and p.api_base):
                continue
            if spec.detect_by_base_keyword and spec.detect_by_base_keyword in p.api_base:
                return p, spec.name
            if local_fallback is None:
                local_fallback = (p, spec.name)
        if local_fallback:
            return local_fallback

        # Fallback: gateways first, then others (follows registry order)
        # OAuth providers are NOT valid fallbacks — they require explicit model selection
        for spec in PROVIDERS:
            if spec.is_oauth:
                continue
            p = getattr(self.providers, spec.name, None)
            if p and p.api_key:
                return p, spec.name
        return None, None

    def get_provider(self, model: str | None = None) -> ProviderConfig | None:
        """Get matched provider config (api_key, api_base, extra_headers). Falls back to first available."""
        p, _ = self._match_provider(model)
        return p

    def get_provider_name(self, model: str | None = None) -> str | None:
        """Get the registry name of the matched provider (e.g. "deepseek", "openrouter")."""
        _, name = self._match_provider(model)
        return name

    def get_api_key(self, model: str | None = None) -> str | None:
        """Get API key for the given model. Falls back to first available key."""
        p = self.get_provider(model)
        return p.api_key if p else None

    def get_api_base(self, model: str | None = None) -> str | None:
        """Get API base URL for the given model. Applies default URLs for gateway/local providers."""
        from nanobot.providers.registry import find_by_name

        p, name = self._match_provider(model)
        if p and p.api_base:
            return p.api_base
        # Only gateways get a default api_base here. Standard providers
        # resolve their base URL from the registry in the provider constructor.
        if name:
            spec = find_by_name(name)
            if spec and (spec.is_gateway or spec.is_local) and spec.default_api_base:
                return spec.default_api_base
        return None

    model_config = ConfigDict(env_prefix="NANOBOT_", env_nested_delimiter="__")
