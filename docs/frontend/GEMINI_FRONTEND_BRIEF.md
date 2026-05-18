# Gemini 前端重构输入文档

本文件用于把当前 `nanobot` 项目的前端代码信息整理给 Gemini，目标是让 Gemini 在不破坏后端接口和现有功能的前提下，重新生成一个更成熟、更专业的产品级控制台前端。

## 1. 项目定位

`nanobot` 是一个 AI 多助手工作台，前端不是普通聊天页，而是一个“AI 应用工程控制台”。页面需要同时承载：

- 多 AI 助手管理
- Web 对话工作台
- QQ / 微信渠道同步发送
- Milvus RAG 知识库上传、检索、状态展示
- MCP server 配置、校验、探测
- 自动化任务中心
- Trace / Tool / Token / RAG 引用观测
- 登录鉴权、首次管理员初始化、用户管理
- 多 agent 协同执行视图

面试展示时，这个前端要体现“工程化、可观测、可配置、可扩展”，不要做成卡牌堆叠式玩具页面。

## 2. 当前前端技术栈

当前前端是无构建版本：

- HTML：`web/index.html`
- CSS：`web/styles.css`
- JavaScript：`web/app.js`
- 静态资源挂载：FastAPI 将 `web/` 挂到 `/assets`
- 页面入口：`GET /` 返回 `web/index.html`
- JS 加载：`<script src="/assets/app.js" defer></script>`

当前没有 React、Vue、Vite、Tailwind、TypeScript 或打包流程。Gemini 如果重写，优先保持无构建三件套，避免引入新的工程复杂度。除非明确同步修改后端静态资源服务和构建脚本，否则不要改成框架项目。

## 3. 当前前端文件

### `web/index.html`

职责：

- 定义页面 DOM 骨架
- 所有功能依赖固定 `id`
- 登录弹层、首次管理员初始化、主控制台、助手列表、对话区、配置区、状态区、知识库、Trace、用户管理、任务中心都在同一个 HTML 文件内

当前主要结构：

```text
body
├─ #loadingOverlay                      全局启动/登录加载遮罩
├─ #authOverlay                         登录/初始化管理员弹层
│  ├─ #bootstrapPanel                   首次启动初始化管理员
│  └─ #loginForm                        登录表单
└─ #appShell                            控制台主体
   ├─ #devBanner                        开发模式提示
   ├─ .workspace-topbar                 顶部状态栏
   ├─ .hero                             顶部产品说明区
   └─ main.layout
      ├─ #assistantsSection             助手集群
      ├─ #chatSection                   主对话工作台
      ├─ #configSection                 助手配置面板
      ├─ #statusSection                 渠道/Skills/MCP 状态
      └─ #platformSection               登录鉴权、任务中心、RAG、Trace
```

### `web/styles.css`

职责：

- 当前页面全部视觉样式
- 包含多轮迭代后的残留样式
- 文件较长，约 3966 行
- 里面有历史遗留的 `.shell-sidebar`、`.workspace-tabs`、多版 `Product pass` 样式；其中部分 DOM 已经不再使用，但 CSS 仍残留

当前视觉方向：

- 接近 Linear 风格
- 浅色背景
- 紧凑控制台布局
- 细边框、低饱和蓝灰色、状态 pill、控制台感

当前主要问题：

- CSS 历史样式堆积过多，可维护性差
- 多个布局规则重复覆盖，容易出现对齐错乱
- 聊天气泡、助手列表、右侧配置区在窄屏下仍容易拥挤
- 有一些已经删除 DOM 的样式还留着，例如 sidebar / tabs 相关样式

### `web/app.js`

职责：

- 全部前端状态管理
- 调用后端 `/api/*`
- 渲染助手列表、聊天消息、RAG、MCP、Trace、任务、用户
- 登录、CSRF、文件上传、语音识别、渠道同步发送

当前特点：

- 原生 JavaScript
- 单文件，约 126 个长行
- 没有模块拆分
- 通过 `document.getElementById` 绑定 DOM
- 通过 `fetch` 调后端，`credentials: "same-origin"`
- 非 GET 请求自动附带 `X-CSRF-Token`
- 每 5 秒自动刷新 overview 和 traces

## 4. 必须保留的核心 DOM id

Gemini 重写 HTML 时，以下 `id` 必须保留，否则 `web/app.js` 会直接报错。除非同步重写 JS，否则不要改名。

### 全局与登录

```text
loadingOverlay
loadingText
appShell
authOverlay
authCard
authLoadingPanel
authLoadingText
loginForm
loginUsername
loginPassword
loginError
bootstrapPanel
bootstrapForm
bootstrapUsername
bootstrapPassword
bootstrapError
devBanner
```

### 顶部状态

```text
defaultAssistant
heroDefaultAssistant
currentUser
heroCurrentUser
sessionId
heroSessionId
```

### 助手列表与助手配置

```text
assistantList
assistantForm
assistantId
assistantName
assistantDescription
assistantPersona
assistantPromptVersion
assistantPromptChangeNote
assistantDailyTokenLimit
assistantModel
assistantProvider
assistantImageModel
assistantImageProvider
assistantTools
assistantSkills
assistantDisabledSkills
assistantAliases
assistantKeywords
assistantMcp
assistantTemperature
assistantMaxTokens
assistantMaxIterations
assistantContextWindow
assistantResultChars
assistantReasoningEffort
assistantEnabled
assistantVersionList
newAssistantBtn
deleteAssistantBtn
resetAssistantBtn
toggleConfigBtn
configBody
configMode
currentAssistantBadge
```

### MCP

```text
mcpFilesystemTemplateBtn
mcpHttpTemplateBtn
mcpValidateBtn
mcpProbeBtn
mcpDiagnostics
mcpCatalog
```

### 对话工作台

```text
chatSection
chatLog
chatForm
chatInput
clearChatBtn
voiceBtn
speechStatus
fileInput
uploadList
pendingMediaStatus
channelBadge
targetChannel
channelSyncStatus
channelSyncToggleBtn
```

### 状态区

```text
refreshBtn
channelStatus
skillsCatalog
```

### RAG 知识库

```text
knowledgeLimitsTag
ragStatus
knowledgeUploadForm
knowledgeTitle
knowledgeScope
knowledgeFiles
knowledgeSearchForm
knowledgeQuery
knowledgeSearchResults
knowledgeList
knowledgeDetail
```

### Trace

```text
traceList
traceDetail
dashboardBadge
```

### 登录鉴权与用户管理

```text
authRoleBadge
logoutBtn
userForm
userId
userUsername
userPassword
userRole
userEnabled
userResetBtn
userList
```

### 自动化任务中心

```text
taskForm
taskId
taskName
taskAssistantId
taskPrompt
taskKind
taskCollaborationMode
taskScheduleKind
taskCronExpression
taskSchedulePreview
taskIntervalMinutes
taskRequireRag
taskRequireChannel
taskMinSuccessGap
taskMaxRetries
taskRetryBackoff
taskTargetChannel
taskTargetChatId
taskEnabled
taskResetBtn
taskList
```

## 5. 当前页面功能区说明

### 5.1 登录 / 首次初始化管理员

前端启动后必须先显示 `#loadingOverlay`，调用：

- `GET /api/auth/bootstrap-status`
- `GET /api/auth/me`

逻辑：

- 如果后端要求初始化管理员，显示 `#bootstrapPanel`，隐藏登录表单。
- 如果已有管理员但未登录，显示登录表单。
- 登录成功后不要立刻露出控制台，需要显示“正在登录并加载控制台”的加载状态，直到 overview、RAG、任务、Trace 等基础数据加载完成。
- `auth_enabled=false` 只允许开发模式，前端必须展示 `#devBanner`。

### 5.2 助手集群

当前助手有 7 个默认角色：

```text
consult      AI 咨询助手
image        AI 生图助手
developer    AI 开发助手
investment   AI 投资助手
community    AI 社区助手
writer       AI 写作助手
expert       AI 智能专家
```

设计要求：

- `AI 咨询助手` 放第一位。
- 每一行要对齐，不能因为标签长短导致错位。
- 不显示“负责图像...”这类描述小字。
- 每个助手行只保留：序号、助手名称、助手 ID pill、READY/DISABLED 状态、启用/终止按钮。
- 当前正在对话的助手或选中助手要有轻量高亮。

### 5.3 主对话工作台

核心能力：

- 用户输入消息
- Enter 发送，Shift+Enter 换行
- 文件上传
- 语音识别
- 显示助手回答
- 显示 token 用量
- 显示 RAG 引用
- 显示图片结果
- 可同步发送到 QQ / 微信

重点设计要求：

- 新消息不能遮挡后面的文字。
- `chatLog` 必须是稳定滚动区域，消息从上到下自然排列。
- 输入框固定在对话区底部，但不能盖住消息。
- 助手消息和用户消息视觉上要区分清楚。
- token 用量放在每条助手回复末尾，弱化但可见。
- RAG 引用用小型来源卡片展示。

### 5.4 渠道同步发送

前端字段：

- `targetChannel`
- `channelSyncStatus`
- `channelSyncToggleBtn`

逻辑：

- 支持 `qq` 和 `weixin`。
- 启用后，主对话发送会把内容同步发到对应渠道。
- 如果渠道未绑定可发送账号，后端会返回 `channel_sync.status = "error"`，前端需要显示错误消息。

### 5.5 助手配置面板

能力：

- 新增助手
- 编辑助手基本信息
- 编辑模型配置
- 编辑生图模型配置
- 编辑工具列表
- 编辑 Skills
- 编辑 routing aliases / keywords
- 编辑 MCP JSON
- 查看 Prompt 版本历史
- 启用/禁用助手
- 删除助手

设计要求：

- 这是偏管理后台的表单，不要做成花哨卡片。
- 建议用“分组表单 + 折叠高级配置”的方式。
- MCP JSON 区域要宽一点，错误提示要清楚。

### 5.6 RAG 知识库

能力：

- 显示 Milvus / RAG 状态
- 上传知识文档
- 设置文档标题
- 设置助手范围
- 检索知识库
- 查看文档详情
- 删除文档

接口返回会包含：

- backend
- connected
- collection_name
- embedding_model
- vector_dimension
- knowledge_docs
- knowledge_chunks
- bm25_available
- last_error
- libraries

设计要求：

- 明确展示“Milvus 已连接 / 未连接”。
- 上传区、检索区、文档列表、文档详情要区分。
- 文档详情和检索结果需要滚动，不要撑爆页面。

### 5.7 Trace / Tool / Token / 协同执行视图

Trace 是面试展示重点。

能力：

- 最近 Trace 列表
- 单条 Trace 详情
- 用户输入
- 助手输出
- 工具/事件流
- RAG evidence
- 多 agent 协同视图

多 agent 事件类型包括：

```text
collaboration_start
collaboration_plan
collaboration_worker_result
collaboration_summary
collaboration_summary_fallback
```

设计要求：

- Trace 详情不要一次展开太多内容。
- 事件详情最多显示约 10 行，超过加滚动条。
- 协同执行视图要把 `Planner / Workers / Summary` 分开展示。
- Worker 失败时要显示失败原因，但不要让整个页面显得崩溃。

### 5.8 自动化任务中心

能力：

- 创建任务
- 编辑任务
- 手动执行任务
- 删除任务
- 查看任务运行记录
- 支持手动 / interval / cron
- 支持条件流：
  - 仅在 RAG 已连接时执行
  - 仅在目标渠道在线时执行
  - 最近 N 分钟未成功执行才运行
- 支持协同模式：
  - inherit
  - off
  - auto
  - always

设计要求：

- 自动化任务中心要放在登录鉴权下面。
- 任务列表要展示最近一次阻塞原因。
- 条件命中原因需要可视化。
- Cron 表达式要有即时预览。

### 5.9 用户管理 / 权限

角色：

```text
viewer    只能查看
operator  可以对话、上传、任务操作
admin     可以管理用户、助手配置、MCP
```

前端通过 `can(role)` 做按钮禁用和区域保护。后端仍然有权限校验，前端只是体验层保护。

## 6. 后端 API 清单

所有请求默认 same-origin，非 GET 请求要带 CSRF。

### 鉴权

```text
GET  /api/auth/bootstrap-status
POST /api/auth/bootstrap
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### 总览

```text
GET /api/overview
```

返回关键字段：

```json
{
  "default_assistant_id": "consult",
  "started_assistant_id": "consult",
  "assistants": [],
  "channels": {},
  "channel_targets": [],
  "mcp_servers": [],
  "skills": [],
  "dashboard": {},
  "user": {},
  "security": {},
  "metrics": {}
}
```

### 助手

```text
GET    /api/assistants
GET    /api/assistants/{assistant_id}
GET    /api/assistants/{assistant_id}/versions
POST   /api/assistants
PUT    /api/assistants/{assistant_id}
DELETE /api/assistants/{assistant_id}
```

`POST /api/assistants` 请求体：

```json
{
  "id": "consult",
  "name": "AI 咨询助手",
  "enabled": true,
  "description": "",
  "persona_prompt": "",
  "provider": "auto",
  "model": "",
  "image_provider": null,
  "image_model": null,
  "workspace": "",
  "tool_names": [],
  "enabled_skills": [],
  "disabled_skills": [],
  "max_tokens": null,
  "temperature": null,
  "reasoning_effort": null,
  "max_tool_iterations": null,
  "context_window_tokens": null,
  "max_tool_result_chars": null,
  "provider_retry_mode": null,
  "prompt_version": 1,
  "prompt_updated_at": null,
  "prompt_change_note": "",
  "daily_token_limit": null,
  "mcp_servers": {},
  "routing": {
    "aliases": [],
    "keywords": []
  }
}
```

### 对话与渠道

```text
POST /api/chat
POST /api/channel-send
POST /api/uploads
GET  /api/files?path=...
GET  /api/channels
```

`POST /api/chat` 请求体：

```json
{
  "assistant_id": "consult",
  "content": "你好",
  "session_id": "web:uuid",
  "channel": "web",
  "chat_id": "web",
  "uploaded_paths": [],
  "sync_enabled": false,
  "sync_channel": "weixin"
}
```

`POST /api/chat` 返回常见字段：

```json
{
  "assistant_id": "consult",
  "assistant_name": "AI 咨询助手",
  "content": "回答内容",
  "content_style": "chat",
  "media": [],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  },
  "citations": [],
  "quota": {},
  "deferred": false,
  "channel_sync": {
    "status": "sent",
    "channel": "weixin",
    "content": "",
    "media_count": 0
  }
}
```

### MCP / Skills

```text
GET  /api/skills
POST /api/mcp/validate
POST /api/mcp/probe
```

MCP 请求体：

```json
{
  "mcp_servers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "D:\\agent\\nanobot"]
    }
  }
}
```

### RAG / Knowledge

```text
GET    /api/rag/libraries
GET    /api/rag/status
GET    /api/knowledge/documents
GET    /api/knowledge/documents/{document_id}
POST   /api/knowledge/upload
POST   /api/knowledge/search
DELETE /api/knowledge/documents/{document_id}
```

`POST /api/knowledge/upload` 是 `multipart/form-data`：

```text
title
assistant_scope
files[]
```

`POST /api/knowledge/search` 请求体：

```json
{
  "query": "怎么配置 Milvus？",
  "assistant_id": "consult",
  "limit": 4
}
```

### 用户

```text
GET    /api/users
POST   /api/users
DELETE /api/users/{user_id}
```

### 任务中心

```text
GET    /api/tasks
POST   /api/tasks
DELETE /api/tasks/{task_id}
POST   /api/tasks/{task_id}/run
GET    /api/tasks/{task_id}/runs
```

`POST /api/tasks` 请求体：

```json
{
  "id": null,
  "name": "早报摘要",
  "assistant_id": "consult",
  "prompt": "生成今日摘要",
  "task_kind": "report",
  "collaboration_mode": "auto",
  "schedule_kind": "cron",
  "cron_expression": "0 9 * * 1-5",
  "interval_minutes": 60,
  "enabled": true,
  "require_rag_connected": true,
  "require_channel_online": false,
  "min_success_gap_minutes": 30,
  "max_retries": 1,
  "retry_backoff_seconds": 60,
  "target_channel": "weixin",
  "target_chat_id": ""
}
```

### Trace

```text
GET /api/traces?limit=50
GET /api/traces/{trace_id}
```

Trace detail 常见字段：

```json
{
  "id": "trace-id",
  "assistant_id": "consult",
  "channel": "web",
  "status": "completed",
  "started_at": "",
  "duration_ms": 0,
  "request_content": "",
  "response_content": "",
  "usage": {},
  "citations": [],
  "events": [
    {
      "event_type": "message",
      "content": "",
      "created_at": "",
      "metadata": {}
    }
  ]
}
```

## 7. 当前 JS 状态模型

`web/app.js` 的核心 `state`：

```js
{
  assistants: [],
  assistantVersions: [],
  selectedAssistantId: null,
  startedAssistantId: "consult",
  channelSyncEnabled: false,
  targetChannelSelection: "",
  configExpanded: false,
  isComposing: false,
  isSending: false,
  pendingUploads: [],
  deferredUploads: [],
  recognition: null,
  isRecognizing: false,
  speechBaseText: "",
  channels: [],
  sessionId: `web:${crypto.randomUUID()}`,
  currentUser: null,
  csrfToken: "",
  security: null,
  dashboard: null,
  ragStatus: null,
  mcpDiagnostics: null,
  knowledgeDocuments: [],
  selectedKnowledgeId: null,
  selectedKnowledgeDetail: null,
  knowledgeSearchResults: [],
  tasks: [],
  selectedTaskId: null,
  taskRuns: [],
  traces: [],
  selectedTraceId: null,
  users: [],
  bootstrapRequired: false
}
```

## 8. 主要渲染函数

如果 Gemini 重写 JS，建议保留这些概念：

```text
api()                         fetch 包装，处理 JSON、CSRF、401
bootstrapSession()            启动时加载登录状态和平台数据
loadOverview()                加载助手、渠道、MCP、Skills、dashboard
refreshPlatformData()         并行加载 RAG、知识文档、任务、Trace、用户
renderAssistants()            渲染左侧助手列表
renderContent()               渲染普通文本/代码块
bubble()                      生成聊天气泡
appendMessage()               追加消息并滚动
renderRagStatus()             渲染 Milvus RAG 状态
renderMcpDiagnostics()        渲染 MCP 校验/探测结果
renderKnowledgeDocuments()    渲染知识文档列表
renderKnowledgeSearchResults()渲染知识检索结果
renderTasks()                 渲染任务中心列表
renderTraceDetail()           渲染 Trace 详情
renderCollaborationTrace()    渲染多 agent 协同视图
renderUsers()                 渲染用户列表
applyRoleGuards()             根据用户角色禁用按钮
```

## 9. 角色权限对前端的影响

当前权限等级：

```js
const roles = { viewer: 1, operator: 2, admin: 3 };
```

前端行为：

- viewer：可以查看 overview、RAG 状态、Trace、知识文档、任务列表。
- operator：可以发起对话、上传附件、上传知识库、创建/运行任务。
- admin：可以编辑助手、管理 MCP、管理用户。

重写 UI 时需要清楚显示当前用户角色，并对无权限操作做禁用或隐藏。

## 10. 推荐的新页面信息架构

不要再做“大量卡牌堆砌”。推荐做成成熟产品后台：

```text
顶部栏
├─ 产品名：nanobot个人生活账号助手
├─ 当前用户 / 角色
├─ 默认助手
├─ Session ID
└─ 刷新 / 退出登录

主体三栏
├─ 左栏：助手集群
│  ├─ 助手列表
│  └─ 新增助手
├─ 中栏：工作台
│  ├─ 状态 rail：Flow / Evidence / Dispatch
│  ├─ 对话消息流
│  ├─ 上传文件状态
│  ├─ 输入框
│  └─ 渠道同步发送
└─ 右栏：Inspector
   ├─ 助手配置
   ├─ MCP 配置
   └─ Prompt 版本

下方运营区
├─ 登录鉴权 / 用户管理
├─ 自动化任务中心
├─ RAG 知识库
└─ Trace / 协同执行视图
```

如果页面高度不够，下方运营区可以做成分段面板或横向 tabs，但不要恢复左侧导航栏。用户之前明确要求“把前端那个导航去掉”。

## 11. 视觉设计目标

建议 Gemini 按以下方向生成：

- 风格：成熟 SaaS 控制台，Linear / Vercel / Stripe Dashboard 的克制感。
- 背景：浅灰蓝，不要大面积米黄色，不要强烈渐变。
- 字体：中文优先，系统字体即可；不要花哨艺术字体。
- 信息密度：中高，但要留白，像工程控制台。
- 边框：1px 低对比度边框。
- 圆角：8-14px，避免过圆。
- 主色：蓝灰 / 靛蓝 / 中性色，状态色用绿色、红色、黄色。
- 动效：只保留加载 spinner、轻微 hover、状态切换，不要炫技。
- 响应式：桌面优先，宽屏三栏；窄屏改成单列堆叠。

## 12. 重要交互约束

- 首屏必须先显示加载中，不能在鉴权未完成前露出控制台。
- 登录成功后继续显示加载动画，直到核心数据加载完成。
- 聊天消息不能覆盖后续内容。
- `chatLog`、`traceDetail`、`taskList`、`knowledgeList` 都要有明确滚动边界。
- Trace 详情超过 10 行必须滚动。
- 助手列表每行必须对齐。
- 不显示助手描述小字。
- `AI 咨询助手` 固定排第一。
- 不要出现左侧导航栏。
- 不要出现“面试展示”独立板块。
- 自动化任务中心放在登录鉴权/用户管理下面。
- RAG 状态要明确展示 Milvus 是否连接。
- 对失败状态要使用明确但克制的错误 UI。

## 13. Gemini 可直接使用的重写提示词

下面这段可以直接丢给 Gemini：

```text
你是资深前端产品设计师和工程师。请基于以下约束，重写一个成熟产品级 AI 控制台前端，项目是 nanobot：一个 AI 多助手工作台，支持多助手管理、Web 对话、QQ/微信渠道同步、Milvus RAG、MCP、自动化任务、Trace、登录鉴权和多 agent 协同执行视图。

技术约束：
1. 保持无构建三件套：web/index.html、web/styles.css、web/app.js。
2. 不要引入 React/Vue/Vite/Tailwind。
3. 必须保留本文档列出的所有 DOM id，因为现有 app.js 依赖这些 id。
4. 可以重排 HTML 结构和 CSS，但不能破坏登录、CSRF、RAG、Trace、任务中心、用户管理、MCP 和聊天功能。
5. 所有 API 均为 same-origin 的 /api/*，非 GET 请求需要 X-CSRF-Token，credentials 使用 same-origin。

产品目标：
1. 做成成熟 SaaS 控制台，不要卡牌堆砌。
2. 不要左侧导航栏。
3. 不要“面试展示”板块。
4. 顶部是控制台状态栏，中间是三栏工作区：左侧助手集群，中间主对话工作台，右侧配置 Inspector。
5. 下方运营区依次是登录鉴权/用户管理、自动化任务中心、RAG 知识库、Trace 观测。
6. 助手列表中 AI 咨询助手必须排第一；每行完全对齐；不要显示助手描述小字。
7. 聊天消息不能遮挡文字，输入区不能覆盖消息流。
8. Trace 详情最多显示约 10 行，超过加滚动条。
9. 多 agent 协同视图需要分开展示 Planner、Workers、Summary。
10. 登录页和登录后加载必须有 loading，控制台数据加载完成前不能露出主页面。

视觉方向：
成熟、克制、专业，接近 Linear / Vercel / Stripe Dashboard 的后台产品感。浅灰蓝背景、低对比边框、细腻状态 pill、中高信息密度、清晰滚动边界。不要强烈渐变，不要花哨装饰，不要大卡片海。

请输出完整的 index.html、styles.css、app.js 修改方案。如果你只改样式，也要说明哪些 DOM id 被保留。
```

## 14. 建议 Gemini 输出格式

建议要求 Gemini 分三段输出：

```text
1. index.html 完整文件
2. styles.css 完整文件
3. app.js 如果必须修改，则输出完整文件；如果不改 JS，明确说明保留现有 app.js
```

为了降低风险，推荐第一轮只重写 `index.html` 和 `styles.css`，尽量不动 `app.js`。等视觉和布局稳定后，再把 `app.js` 拆成模块。

## 15. 当前最值得重构的点

- 把 `styles.css` 清理成清晰分区：tokens、layout、auth、assistants、chat、inspector、ops、trace、responsive。
- 把 `app.js` 拆成 `api.js`、`state.js`、`render-chat.js`、`render-trace.js`、`render-tasks.js`、`render-rag.js`、`auth.js`。
- 把巨大的 `index.html` 按语义重新组织，但保留 id。
- 给所有列表和详情区设置明确最大高度和滚动。
- 将错误、加载、空状态统一组件化。
- 将状态 pill 统一为 `success / danger / warning / neutral`。
