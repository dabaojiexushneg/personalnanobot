# nanobot个人生活账号助手项目进度记录

本文档记录 `nanobot个人生活账号助手` 从早期 Demo 到当前多助手 AI 应用工作台的主要功能演进。版本号统一采用 `demo0.0.x`，用于项目展示、面试答辩、阶段复盘和 GitHub 更新说明。

> 说明：本文档按功能阶段整理，不完全等同于 Git 提交历史；重点描述每个阶段的产品能力、工程改动和可展示成果。

## demo0.0.30 - 多 Agent 协同与 Trace 可解释性增强

### Added

- 新增多 agent 协同执行流程：`Planner -> Workers -> Summary`。
- 新增任务中心协同模式：`inherit / off / auto / always`。
- 新增 Trace 协同执行视图，分开展示 `Planner`、`Workers`、`Summary`。
- 新增协同执行容错：单个 worker 失败不会中断整体任务。
- 新增 summary 模型失败时的降级汇总能力。

### Changed

- 任务中心执行链路接入多 agent 协同模式。
- Trace 中的 RAG 证据增加执行阶段和助手来源信息。
- README 更新为更完整的 GitHub 项目说明文档。

### Fixed

- 修复模型额度异常导致最终结果被错误文本污染的问题。
- 修复协同执行中单个 worker 报错影响整体输出的问题。

### Verified

- `pytest tests/cluster/test_cluster_runtime.py tests/cluster/test_control_store.py tests/cluster/test_webapp_api.py`
- `ruff check`
- `node --check web/app.js`

## demo0.0.29 - 任务中心 Cron 与条件流完善

### Added

- 新增 Cron 调度支持。
- 新增任务条件流：
  - 要求 RAG 已连接
  - 要求渠道在线
  - 距离上次成功执行至少 N 分钟
- 新增最近一次阻塞原因展示。
- 新增任务失败重试次数和退避秒数配置。

### Changed

- 任务中心从简单 prompt 执行器升级为轻量 AI 工作流入口。
- 任务列表增加下次执行时间、最近状态、条件判定和阻塞摘要。

### Fixed

- 修复任务条件不满足时仍可能进入执行链路的问题。
- 修复任务跳过后运行记录不够清晰的问题。

## demo0.0.28 - Trace / Tool 日志体验升级

### Added

- 新增 Trace 详情中的 RAG 证据卡片。
- 新增 token 用量展示。
- 新增工具事件流折叠与滚动显示。
- 新增响应耗时、媒体数量、执行状态展示。

### Changed

- Trace 详情页限制长文本高度，超过后使用滚动条。
- 主对话工作台在每条助手回复后显示 token 使用情况。

### Fixed

- 修复 Trace 详情展开过长导致页面难以阅读的问题。
- 修复工具事件和长响应内容挤压页面布局的问题。

## demo0.0.27 - 前端工作台产品化改造

### Added

- 新增更接近正式产品的工作台式前端布局。
- 新增助手列表、主对话工作台、右侧配置区和运行状态区域。
- 新增中文化控制台文案。

### Changed

- 前端从卡片堆叠式 Demo 页面改为更克制的产品控制台。
- 助手列表改为更紧凑的行式布局。
- 自动化任务中心移动到登录鉴权模块下方。

### Fixed

- 修复助手列表文字重叠和对齐不一致问题。
- 修复新消息遮挡 Workbench 顶部信息的问题。
- 移除不必要的面试展示面板，降低页面噪音。

## demo0.0.26 - MCP 能力接入与管理

### Added

- 新增 MCP 配置校验能力。
- 新增 MCP 可达性探测能力。
- 新增前端 MCP 模板按钮。
- 新增已安装 MCP 列表展示。
- 安装并配置常用 MCP server，包括 filesystem、memory、fetch、git、time、sequential-thinking 等。

### Changed

- 助手配置支持独立 MCP server。
- 控制台可查看 MCP 来源、传输方式、工具白名单和配置异常。

### Fixed

- 修复 MCP 安装后前端无法看到已加载状态的问题。
- 修复部分 MCP 启动日志造成误判的问题。

## demo0.0.25 - Milvus RAG 基础能力增强

### Added

- 新增 `/api/rag/status` 状态接口。
- 新增 RAG 状态前端展示。
- 新增知识文档详情预览。
- 新增检索结果解释信息：融合分、向量分、关键词分、召回类型。

### Changed

- RAG 后端统一使用 Milvus。
- 文档、chunk、向量索引和检索数据迁移到 Milvus。

### Fixed

- 修复真实 Milvus 写入后立即读取不稳定的问题。
- 增加 Milvus 写入后的 flush 处理。

## demo0.0.24 - SQLite / Chroma RAG 替换为 Milvus

### Added

- 新增 `MilvusKnowledgeStore`。
- 新增 Milvus collection 初始化、写入、检索、删除能力。
- 新增 RAG 配置项：
  - `uri`
  - `token`
  - `collectionName`
  - `embeddingModel`

### Changed

- RAG 从 `SQLite + Chroma` 迁移为 `Milvus`。
- 控制面 SQLite 不再承担 RAG 文档和 chunk 真相源。

### Fixed

- 清理 RAG 层旧 SQLite/Chroma 依赖。
- 修复知识库删除后检索仍可能返回旧结果的问题。

## demo0.0.23 - Web 控制台安全升级

### Added

- 新增首次启动管理员初始化流程。
- 新增 CSRF 防护。
- 新增登录 Cookie 安全配置：
  - `HttpOnly`
  - `Secure`
  - `SameSite`
  - `Path`
- 新增 Argon2id 密码哈希。

### Changed

- 移除固定默认管理员密码。
- `auth_enabled=false` 只允许在显式开发模式下使用。

### Fixed

- 修复旧 SHA-256 密码哈希强度不足的问题。
- 修复未登录状态下部分页面可能先显示主界面的问题。

## demo0.0.22 - 登录加载态与会话治理

### Added

- 新增启动前清理 Web session 逻辑。
- 新增停止时清理 Web session 逻辑。
- 新增登录中加载动画。
- 新增初始化管理员时加载态。

### Changed

- 页面加载时先等待鉴权结果，再展示登录页或主界面。
- 登录成功后等待主要数据加载完成再进入控制台。

### Fixed

- 修复刷新前端后可能绕过登录页的问题。
- 修复旧 session 导致前端直接进入控制台的问题。

## demo0.0.21 - 一键启动与停止脚本

### Added

- 新增 `start-all.ps1`。
- 新增 `stop-all.ps1`。
- 新增 `.cmd` 包装脚本，支持双击启动。
- 新增 WSL2、Docker Desktop、Milvus 检测和启动流程。
- 新增启动后自动打开浏览器能力。
- 新增日志输出和日志前缀。

### Changed

- 启动脚本改为等待服务健康检查通过后再完成启动。
- 停止脚本输出实际停止的 PID 和服务名称。

### Fixed

- 修复旧进程占用 `8711 / 8900` 导致页面卡死的问题。
- 修复 PowerShell `$PID` 只读变量冲突问题。
- 修复 `Failed to stop process 0` 噪音输出。

## demo0.0.20 - OpenAI-style API 增强

### Added

- 新增多消息上下文支持。
- 新增基础流式输出。
- 新增 `/v1/models`。
- 新增 usage 统计。
- 新增同 session 串行处理。

### Changed

- API 定位从完整 OpenAI 兼容改为 OpenAI-style compatibility layer。
- 错误处理和返回结构更贴近外部接入需求。

### Fixed

- 修复 `aiohttp AppKey` warning。
- 修复固定持久会话导致上下文不清晰的问题。

## demo0.0.19 - 任务中心基础版本

### Added

- 新增自动化任务中心。
- 支持手动任务。
- 支持 interval 任务。
- 支持任务运行记录。
- 支持任务结果同步到 QQ / 微信。

### Changed

- Web 控制台启动后自动运行后台任务调度器。
- 任务执行统一复用 `cluster.chat()`。

### Fixed

- 修复后台任务异常被静默吞掉的问题。
- 增加任务执行失败记录。

## demo0.0.18 - QQ / 微信渠道联调

### Added

- 新增 QQ 渠道配置和启动能力。
- 新增微信二维码登录和会话恢复能力。
- 新增渠道状态展示。
- 新增渠道同步发送能力。

### Changed

- 前端渠道选择保持用户当前选择。
- 渠道发送失败时给出更明确的绑定提示。

### Fixed

- 修复选择微信后自动跳回 QQ 的问题。
- 修复 `allowFrom` 为空导致渠道启动失败的问题。
- 修复未建立渠道会话时同步发送提示不清楚的问题。

## demo0.0.17 - 生图模型编排

### Added

- 新增 `generate_image` 工具。
- 新增文本模型和生图模型分离配置。
- 新增 `qwen3.5-plus` 判断请求、`Doubao-Seedream-4.0` 生成图片的链路。

### Changed

- `consult` 助手也可处理生图请求。
- 生图结果以 media 形式返回前端和渠道。

### Fixed

- 修复普通咨询助手无法触发生图工具的问题。
- 修复生成图片后渠道同步不携带媒体的问题。

## demo0.0.16 - 多助手集群基础完成

### Added

- 新增多助手配置：
  - 咨询助手
  - 生图助手
  - 开发助手
  - 投资助手
  - 社区助手
  - 写作助手
  - 智能专家
- 新增助手启用、停用、编辑、删除。
- 新增助手路由规则、别名和关键词。

### Changed

- 单助手运行模式升级为多助手集群模式。
- 每个助手拥有独立工作区和运行时。

### Fixed

- 修复助手配置保存后运行时未刷新问题。
- 修复部分助手启动失败时前端展示不清楚的问题。

## demo0.0.15 - Prompt 版本化与成本治理

### Added

- 新增 `promptVersion`。
- 新增 `promptChangeNote`。
- 新增助手 Prompt 版本历史。
- 新增 `dailyTokenLimit`。
- 新增控制台 token 汇总。

### Changed

- 助手配置从单次覆盖改为可追踪版本变更。
- 主对话区展示每次响应的 token 使用量。

### Fixed

- 修复 token 使用量只存在后端但前端不可见的问题。

## demo0.0.14 - AI Evals 基础评测

### Added

- 新增 `evals/` 目录。
- 新增基础评测数据集。
- 新增评测运行器。
- 新增 JSON 和 Markdown 报告导出。

### Changed

- 项目从纯功能测试扩展到 AI 效果回归。

### Verified

- 基础样例覆盖普通问答、RAG、工具调用、生图请求识别等场景。

## demo0.0.13 - 工程化质量门槛

### Added

- 新增 `python -m build` 构建检查。
- 新增 `pip-audit` 依赖安全扫描。
- 新增更完整的 CI 检查。
- 新增根目录 README 和 SECURITY 文档。

### Changed

- CI 从局部 lint 升级为构建、测试、安全扫描组合。

### Fixed

- 修复缺失 README 导致 package build 失败的问题。

## demo0.0.12 - 文件上传与知识库上传治理

### Added

- 新增上传大小限制。
- 新增上传扩展名白名单。
- 新增分块落盘。
- 新增知识库空文档、重复文档、超长文档处理。

### Changed

- 上传链路从一次性内存读取改为更稳的处理流程。

### Fixed

- 修复大文件上传可能导致内存压力过高的问题。
- 修复知识库上传失败后临时文件残留问题。

## demo0.0.11 - 控制面数据模型收敛

### Added

- 新增控制面 SQLite 表：
  - 用户
  - 会话
  - 任务
  - Trace
  - Token 统计

### Changed

- 明确 SQLite 是控制面真相源。
- 明确 Milvus 是 RAG 真相源。

### Fixed

- 修复运行态数据和影子文件边界不清晰的问题。

## demo0.0.10 - Web 控制台初版

### Added

- 新增 Web 控制台。
- 新增助手列表。
- 新增主对话工作台。
- 新增助手配置面板。
- 新增渠道和能力状态区域。

### Changed

- 从 CLI 优先交互升级为 Web 控制台管理。

### Fixed

- 修复前端刷新后状态丢失的问题。

## demo0.0.9 - Trace 基础能力

### Added

- 新增对话 Trace。
- 新增工具事件记录。
- 新增输入、输出、状态、耗时记录。

### Changed

- 每次请求都可以回放执行过程。

### Fixed

- 修复异常请求缺少失败记录的问题。

## demo0.0.8 - RAG 原型

### Added

- 新增知识文档上传。
- 新增文档分块。
- 新增基础知识检索。
- 新增关键词检索原型。

### Changed

- 助手回答前可注入知识库上下文。

### Fixed

- 修复无知识命中时提示词结构不稳定的问题。

## demo0.0.7 - Provider 抽象

### Added

- 新增统一模型 provider 配置。
- 支持 OpenAI-compatible provider。
- 支持 DashScope、OpenAI、Anthropic、OpenRouter、Ollama 等 provider。

### Changed

- 助手运行时不再强绑定单一模型厂商。

### Fixed

- 修复模型切换时配置分散的问题。

## demo0.0.6 - AgentLoop 与工具调用

### Added

- 新增 `AgentLoop`。
- 新增基础工具注册和调用流程。
- 新增文件读取、目录浏览、网络搜索等工具能力。

### Changed

- 从简单 LLM 调用升级为可使用工具的 agent 执行模式。

### Fixed

- 修复工具输出过长导致上下文不可控的问题。

## demo0.0.5 - 会话与记忆

### Added

- 新增会话管理。
- 新增助手记忆存储。
- 新增 history、memory、preference 等基础结构。

### Changed

- 多轮对话开始具备上下文延续能力。

### Fixed

- 修复不同会话之间上下文串扰的问题。

## demo0.0.4 - CLI 与配置初始化

### Added

- 新增 `nanobot onboard`。
- 新增配置文件生成流程。
- 新增 `nanobot status`。
- 新增基础 CLI 命令。

### Changed

- 项目从脚本式启动升级为 CLI 管理。

### Fixed

- 修复首次启动缺少配置目录的问题。

## demo0.0.3 - OpenAI-style API 原型

### Added

- 新增 HTTP API 服务。
- 新增 `/health`。
- 新增 `/v1/chat/completions` 原型。

### Changed

- 项目开始支持外部系统通过 API 调用。

### Fixed

- 修复 API 请求超时缺少错误响应的问题。

## demo0.0.2 - 基础助手运行时

### Added

- 新增基础助手配置。
- 新增模型调用封装。
- 新增工作区路径。
- 新增最小对话流程。

### Changed

- 从单文件实验代码整理为项目结构。

### Fixed

- 修复模型配置缺失时错误提示不清晰的问题。

## demo0.0.1 - 项目初始化

### Added

- 初始化项目目录结构。
- 初始化 Python 包配置。
- 初始化基础文档和许可证。
- 建立最小可运行 AI 助手原型。

### Notes

- 本阶段目标是证明核心方向可行：用户输入 -> 模型响应 -> 命令行输出。
