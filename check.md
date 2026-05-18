# nanobot个人生活账号助手 - 模拟面试资料

## 给 ChatGPT 的模拟面试提示词

你现在扮演一名 AI 应用层产品 / 后端 / Agent 工程方向的高级面试官。下面是我的项目资料，请你基于资料对我进行真实模拟面试。

面试方式：

- 每次只问 1 个问题，等我回答后再追问。
- 先问项目整体、业务价值和技术选型，再逐步深入到后端、RAG、Agent、MCP、Skills、自动化任务、前端工作台、多渠道文件处理、安全和工程化。
- 如果我回答太空泛，请继续追问实现细节、边界情况、失败场景、取舍原因。
- 请按真实面试标准评价我的回答，并帮我把回答改得更口语、更工程化。
- 请重点围绕这个岗位职责提问：AI 应用层产品开发、大模型能力落地、后端 API 与数据库、AI Agent / 自动化工作流、前端数据闭环、自然语言驱动开发。

---

## 0. 当前新增改动速览（面试开场可用）

如果面试官问：“你最近又改了什么？”可以先这样概括：

> 最近这轮我主要做的是把项目从“功能能跑”继续往“可解释、可控、可演示”收口。RAG 不再每轮默认检索，而是用户明确说“根据知识库 / 查询知识库 / 参考文档”时才触发，并且按助手和资料集合做过滤，避免上下文污染；Milvus 入库增加了 `content_hash` 去重。前端 React 工作台继续完善了默认 12 栅格布局、自动补位、边界归一化和四边缩放；文件工具这块明确了 workspace、media 上传目录和 Desktop 的安全边界，支持任意附件先暂存、再根据用户文字指令用 `copy_file` 处理。最后，任务中心、多 Agent 协同和 Trace 也更适合面试展示，可以直接看到 Planner、Workers、Summary 和 RAG 证据。

这段适合 30 秒快速说清楚：

- RAG：显式触发、Milvus 去重、助手级过滤、Trace 证据。
- 前端：React Grid Layout、自动补位、四边缩放、布局持久化。
- 附件：任意格式 pending media、下一条文字指令合并处理。
- 安全：文件工具限制在 workspace / media / Desktop 等受控路径。
- 演示：RAG、任务中心、多 Agent 协同、Trace 可以串成完整闭环。

---

## 1. 项目一句话介绍

`nanobot个人生活账号助手` 是一个面向个人生活账号管理和多渠道自动化的 AI 应用工作台。它不是单纯的聊天页面，而是把多助手集群、Milvus RAG 知识库、MCP 工具扩展、Skills、自动化任务中心、Trace 可观测、多渠道消息入口、文件处理能力和 React 可拖拽控制台整合到一起的完整 AI 应用系统。

面试时可以这样说：

> 我做的是一个个人生活账号助手控制台，目标是把大模型能力落到具体业务场景里。它支持多助手分工、RAG 私有知识库、QQ/微信/Web 多渠道接入、自动化任务、MCP 工具调用和 Trace 观测。前端也不是普通聊天框，而是 React 化的可拖拽工作台，可以管理助手、知识库、任务、Trace 和用户。

---

## 2. 项目适配岗位职责的回答

如果面试官问：“这个项目和我们岗位职责匹配度怎么样？”

可以这样回答：

> 我觉得匹配度挺高的。这个项目不是只调一个模型 API，而是围绕 AI 应用落地做了一套完整闭环。后端用 FastAPI 做控制台 API、用户、任务、Trace 和知识库接口；AI 层做了多助手运行时、RAG、MCP 工具、Skills 和自动化任务；前端用 React 做了一个可拖拽的管理控制台，把模型输出、知识库、任务和 Trace 都展示出来。  
>  
> 另外我在开发过程中也大量使用自然语言驱动开发，比如先描述拖拽、RAG、附件处理这些需求，再逐步让代码实现、测试和修复，这和岗位里提到的 AI 应用开发、Agent 工作流、后端服务和 Vibe Coding 都比较贴合。

---

## 3. 技术栈总览

### 后端

- Python 3.11+
- FastAPI：Web 控制台 API
- aiohttp：OpenAI-style API
- Pydantic v2：配置建模和数据校验
- SQLite：控制面数据、用户、任务、Trace、会话和记忆
- Argon2：密码哈希
- Loguru：日志
- croniter：Cron 调度解析
- pytest：自动化测试

### AI 与 Agent

- OpenAI-compatible provider abstraction
- 支持 DashScope / OpenAI / Anthropic / OpenRouter / Gemini / Ollama / VolcEngine / DeepSeek 等 provider
- AgentLoop：模型调用、上下文构建、工具调用、迭代执行
- 多助手集群：咨询、生图、开发、投资、社区、写作、专家等助手
- 多 Agent 协作：Planner -> Workers -> Summary
- Tool Registry：文件、搜索、网页、Shell、图片生成、MCP 等工具注册

### RAG

- Milvus：向量数据库
- pymilvus：Milvus Python 客户端
- sentence-transformers：embedding，默认 `all-MiniLM-L6-v2`，维度 384
- rank-bm25：关键词检索
- BM25 + Vector Search + RRF 混合召回
- 支持知识文档上传、解析、分块、预览、删除、检索和引用

### MCP 与 Skills

- MCP 支持 stdio / SSE / streamableHttp
- MCP 支持全局配置和助手级配置
- MCP 支持工具白名单和连通性探测
- Skills 位于 `nanobot/skills/`
- Skills 用于封装可复用提示词、工作流和能力说明

### 前端

- React 18
- React DOM
- React Grid Layout
- esbuild
- HTML / CSS
- Web Speech API：语音识别
- localStorage：布局持久化
- AbortController：前端暂停生成

### 多渠道

- Web 控制台
- OpenAI-style API
- QQ
- 微信
- 其他渠道适配器：Telegram、Slack、Discord、飞书、钉钉、企业微信、WebSocket 等

---

## 4. 当前项目目录重点

```text
nanobot/
├─ nanobot/
│  ├─ agent/                # AgentLoop、上下文、工具系统、Skills 加载
│  ├─ agent/tools/          # 文件、Shell、MCP、网页、图片等工具
│  ├─ channels/             # QQ、微信等渠道接入
│  ├─ cluster/              # 控制台、多助手、RAG、任务、Trace、MCP 管理
│  ├─ config/               # 配置 schema
│  ├─ providers/            # 模型 provider 抽象
│  └─ skills/               # 内置 skills
├─ web/
│  ├─ react-src/main.jsx    # React 控制台主入口
│  ├─ react-console.css     # React 控制台样式
│  ├─ react-console.js      # esbuild 打包产物
│  └─ index.html            # 页面入口
├─ docs/rag/
│  ├─ demo_personal_life_account_knowledge.md
│  ├─ MILVUS_RAG_DEMO_GUIDE.md
│  ├─ ASSISTANT_RAG_CATALOG.md
│  └─ assistant_rag_sources.json
├─ tests/                   # 测试
├─ README.md
└─ check.md
```

---

## 5. 核心架构

项目可以分为 6 层：

1. 接入层：Web 控制台、OpenAI-style API、QQ、微信等渠道。
2. 控制层：FastAPI WebApp、AssistantCluster、ClusterControlStore。
3. 助手运行层：AssistantRuntime、AgentLoop、memory、session、workspace。
4. 能力层：Tools、MCP、Skills、RAG、多 Agent 协作、图片生成。
5. 存储层：SQLite 控制面 + Milvus 知识库。
6. 可观测层：Trace、Trace Events、Token 用量、任务运行记录、日志和 Metrics。

面试表达：

> 这个项目的核心架构是把大模型对话拆成可管理的几个层次：入口统一接入，控制层负责路由和权限，运行层负责助手执行，能力层负责 RAG、工具和 MCP，存储层保存业务状态和知识库，最后用 Trace 做可观测。这样它就不是一个黑盒聊天机器人，而是一个能调试、能扩展、能运行任务的 AI 应用系统。

---

## 6. 多助手集群

项目内置多个助手：

- AI 咨询助手：日常问题、方案建议。
- AI 生图助手：图片生成、提示词和视觉任务。
- AI 开发助手：代码、调试、工程问题。
- AI 投资助手：投资教育和风险提示。
- AI 社区助手：社群运营、活动和反馈整理。
- AI 写作助手：文章、脚本、文案、润色。
- AI 智能专家：复杂方案、架构、综合分析。

每个助手可以独立配置：

- name / id / description
- persona_prompt
- provider / model
- image_provider / image_model
- tool_names
- enabled_skills / disabled_skills
- mcp_servers
- workspace
- daily_token_limit
- routing aliases / keywords

设计取舍：

> 我没有把所有能力都塞进一个超大助手，而是做成多助手隔离。因为不同任务需要不同 prompt、不同工具权限和不同模型。比如生图助手应该优先调用图片工具，开发助手才需要文件和代码工具，投资助手需要更强风险提示。这样权限边界更清楚，也减少上下文污染。

---

## 7. 最近修复的助手路由问题

之前出现过一个问题：前端选择了生图助手，但对话过程中可能又触发咨询助手、写作助手或 RAG 上下文，导致“我明明选了生图助手，系统却让其他助手也参与判断”。

已做的修复思路：

- Web 显式传入 `assistant_id` 时，后端把 `collaboration_mode` 设为 `off`，避免显式选择助手时又自动协作。
- 前端在点击、启用、对话后同步 `selectedAssistantId` 和 `startedAssistantId`，避免一次对话后 UI 又回到默认咨询助手。
- RAG 上下文改为显式触发：只有用户明确说“根据知识库 / 查询知识库 / 参考文档 / 基于资料”时才检索，避免普通聊天和生图任务被生活知识库污染。
- RAG 触发后按 `assistant_id` 和 `collection_key` 做过滤，避免不同助手的知识片段互相串场。

面试表达：

> 这里我主要解决的是“显式选择优先级”和“知识库触发边界”的问题。用户已经选了生图助手，就应该尊重这个选择，而不是再自动路由、多 Agent 协作或默认塞 RAG 上下文。现在显式 `assistant_id` 优先，协同会关闭；RAG 也只有用户明确要求查知识库时才触发，并按助手和资料集合过滤。这样体验上更可控，也更容易排查。

---

## 8. Milvus RAG 实现

### 8.1 上传流程

RAG 上传链路：

1. 用户在 Web 控制台选择知识文档。
2. 后端校验文件大小和扩展名。
3. 抽取文本。
4. 按 chunk 切分，默认 chunk size 约 700，overlap 约 120。
5. 生成 embedding。
6. 计算 `content_hash`，对重复内容做去重。
7. 写入 Milvus collection：`knowledge_chunks`。
8. 保存 `assistant_id`、`collection_key`、`source_name` 等元数据，方便后续过滤和引用。
9. 前端刷新文档列表和 RAG 状态。

### 8.2 支持解析

- 文本类：txt、md、json、csv 等。
- PDF：通过 PyMuPDF 抽取。
- DOCX：解析 `word/document.xml`。
- 编码兼容：UTF-8、UTF-8-SIG、GB18030。

### 8.3 检索流程

1. 先判断用户是否显式要求知识库，比如“根据知识库”“查询知识库”“参考文档”“基于资料”。
2. 未触发时不检索，普通聊天直接进入 AgentLoop，避免无关知识污染。
3. 触发后按 `assistant_id`、`collection_key` 做 metadata filter。
4. 对用户 query 做分词。
5. 用 BM25 做关键词召回。
6. 用 embedding + Milvus 做向量召回。
7. 用 RRF 融合排序。
8. 截取与 query 相关的句子，前端高亮 query 相关片段。
9. 把 top-k 片段注入模型上下文。
10. Trace 记录 `knowledge_hit`，包含来源、召回方式、分数、助手和阶段。

### 8.4 为什么 RAG 改成显式触发

面试表达：

> 我一开始也可以让每轮对话都检索知识库，但后来发现这会带来两个问题：第一，普通闲聊或生图请求可能被生活账号知识污染；第二，每轮检索会增加延迟和成本。所以我改成显式触发，用户说“根据知识库”或“参考上传文档”时才查。这样牺牲了一点自动性，但换来了更清晰的用户意图、更低的噪音和更稳定的 Trace。

### 8.5 为什么 BM25 + 向量

面试表达：

> 我这里不是只做向量检索，而是混合检索。向量检索适合语义相似，BM25 更适合账号名、金额、日期、服务名这种精确词。比如用户问“家庭宽带哪天扣费、超过多少钱提醒”，BM25 能抓到扣费、金额、提醒这些关键词，向量检索能补充语义相关内容，最后用 RRF 融合排名，整体比单一路径更稳。

---

## 9. RAG 演示知识库

演示用知识文档：

- `docs/rag/demo_personal_life_account_knowledge.md`

它是一份虚构的“个人生活账号助手演示知识库”，内容包括：

- 家庭宽带扣费日期、套餐名、超额提醒规则。
- 云盘会员续费时间、检查策略。
- 音乐会员、视频会员的登录和续费提醒。
- 出行、家庭网络、订阅服务等生活账号维护规则。

演示时可以说：

> 我上传的是一份个人生活账号管理的演示知识库，里面有宽带扣费、会员续费、异地登录提醒这些规则。上传后系统会抽取文本、切 chunk、生成向量并写入 Milvus。然后我问“家庭宽带每月哪天扣费，超过多少钱要提醒我”，系统能从知识库中检索出相关句子，并在结果里高亮 query 相关内容。

---

## 10. RAG 面试演示流程

现场演示按这个流程：

1. 打开 Web 控制台。
2. 看「RAG 知识库」卡片，确认 `MILVUS · 已连接`。
3. 上传 `docs/rag/demo_personal_life_account_knowledge.md`。
4. 标题填写「个人生活账号助手演示知识库」。
5. 限定助手可以填 `consult`，也可以留空。
6. 点击「上传知识」。
7. 上传过程中展示“上传中”状态，完成后文档卡片出现。
8. 点击「预览」看 chunk 内容。
9. 在检索框输入：`家庭宽带每月哪天扣费，超过多少钱要提醒我？`
10. 点击「检索」。
11. 展示检索结果中 query 相关句子的截取和高亮。
12. 在主聊天框问：`请根据知识库告诉我：视频会员出现异地登录提醒时应该怎么处理？`
13. 打开 Trace，看 RAG 命中证据。
14. 点击删除，展示“删除中”状态和文档列表刷新。

演示重点：

- 不是把文档直接塞给模型，而是文档入库、chunk、embedding、Milvus、BM25、向量检索、RRF 融合。
- 前端不是展示整段无关文本，而是截取 query 相关句子并高亮。
- Trace 能看到回答依据。

---

## 11. 素材生成能力怎么回答

如果面试官问：“你素材生成能力怎么样？”

可以这样说：

> 这个项目里我做过两类素材生成。第一类是基于 RAG 的知识素材，比如我上传了一份个人生活账号演示知识库，系统可以根据里面的宽带扣费、会员续费、异地登录提醒规则，生成面向用户的提醒话术、处理建议和摘要。第二类是通过不同助手生成内容，比如写作助手可以生成小红书文案、公众号脚本，生图助手可以生成图片提示词或调用图片生成工具。  
>  
> 技术上不是简单让模型自由发挥，而是结合助手 persona、私有知识库、工具能力和 Trace，把素材生成做成可追踪、可复用的流程。

更口语版本：

> 我做过。比如这个项目里我上传了一份个人生活账号知识库，里面有宽带扣费、会员续费、异地登录这些规则。然后助手可以基于这些资料生成提醒文案、处理建议、运营内容，写作助手还能生成文章和脚本，生图助手可以生成图片提示词或调用图片工具。核心不是单纯让模型编，而是结合 RAG、助手角色和工具来生成更贴业务的素材。

---

## 12. 自动化任务中心

任务中心支持：

- 手动执行
- interval 定时
- cron 调度
- 重试
- 退避
- 任务运行记录
- 条件执行
- 任务级多 Agent 协作模式

任务类型：

- generic：通用任务。
- report：报告。
- knowledge_digest：知识摘要。
- channel_push：渠道推送。
- image_generation：图片生成任务。

条件执行：

- `require_rag_connected`：要求 RAG 已连接。
- `require_channel_online`：要求渠道在线。
- `min_success_gap_minutes`：距离上次成功至少 N 分钟。

面试表达：

> 自动化任务中心不是简单 setInterval，而是做了任务状态、执行记录、条件判断、重试退避和协作模式。比如我可以创建一个每天早上 9 点的知识摘要任务，要求 RAG 正常、渠道在线才执行。如果失败，会记录 task run 并按配置重试。

### 自动化任务演示案例

演示任务：每天生成个人账号巡检摘要。

Prompt 示例：

```text
请基于知识库生成一份个人生活账号巡检摘要：
1. 检查近期需要关注的扣费、续费和安全提醒。
2. 输出 3 条最重要的事项。
3. 每条包含：事项、原因、建议动作。
4. 语言简短，适合发到微信提醒。
```

演示流程：

1. 打开「自动化任务中心」。
2. 创建任务名称：`每日生活账号巡检`。
3. 类型选择 `knowledge_digest` 或 `generic`。
4. 开启 `依赖 RAG`。
5. 调度方式先选 `manual`，方便现场立即运行。
6. 点击运行。
7. 打开 Trace 或任务记录，展示执行结果。
8. 再说明实际生产可以改成 cron，比如每天 09:00 执行。

---

## 13. 多 Agent 协作

协作流程：

```text
Planner -> Workers -> Summary
```

用途：

- 复杂问题拆解。
- 多角度分析。
- 方案设计。
- 研究和总结。
- 自动化任务中的复杂报告。

触发模式：

- `off`：关闭。
- `auto`：自动判断。
- `always`：强制协作。
- `inherit`：任务继承全局配置。

已做优化：

- 显式选择助手时关闭自动协作，避免用户选了生图助手却触发其他助手。
- 媒体类任务避免无意义协作。
- 单个 worker 失败不让整次任务直接崩掉。

面试表达：

> 我理解多 Agent 不应该滥用，所以项目里是可配置的。简单任务直接单助手完成，复杂任务才进入 Planner、Workers、Summary。这样既能体现协作能力，又不会每次都浪费 token 或产生答非所问。

---

## 14. MCP 和 Skills

### MCP

MCP 相关文件：

- `nanobot/agent/tools/mcp.py`
- `nanobot/cluster/mcp.py`
- `nanobot/config/schema.py`
- `.runtime/mcp/package.json`

当前配置过的 MCP 包括：

- filesystemRepo
- filesystemConfig
- filesystemCluster
- fetchWeb
- gitRepo
- timeShanghai
- timeUtc
- memoryGraph
- sequentialThinking
- puppeteerBrowser

项目支持：

- stdio
- SSE
- streamableHttp
- MCP 连通性探测
- MCP 工具白名单
- 全局 MCP 和助手级 MCP 合并

面试表达：

> MCP 在这个项目里是外部工具生态接入层。比如 filesystem、git、web fetch、memory、time 这些能力可以通过 MCP 暴露给助手。项目不只是能连 MCP，还做了配置校验、探测、工具白名单和助手级隔离。

### Skills

Skills 目录：

- `nanobot/skills/clawhub/SKILL.md`
- `nanobot/skills/cron/SKILL.md`
- `nanobot/skills/github/SKILL.md`
- `nanobot/skills/memory/SKILL.md`
- `nanobot/skills/skill-creator/SKILL.md`
- `nanobot/skills/summarize/SKILL.md`
- `nanobot/skills/tmux/SKILL.md`
- `nanobot/skills/weather/SKILL.md`

面试表达：

> Skills 更像是可复用的能力说明和工作流模板，MCP 更像是外部工具协议。一个解决“怎么做”的提示词流程，一个解决“能调什么工具”的能力接入。

---

## 15. 多渠道附件处理与文件复制

这是最近比较重要的一轮修复。

### 需求

用户在 QQ 或微信里发文件、图片、视频、PDF、Word、压缩包等任意非文字附件时，AI 不应该马上回答。它应该先暂存附件，等用户发送文字指令后再处理。

例如：

1. 用户先发一个图片或文件。
2. 助手不立即回复。
3. 用户再说：“把刚才这个文件复制到桌面。”
4. 助手使用 `copy_file` 把附件复制到桌面。

### 已做的逻辑

- `runtime.py` 增加 `_should_defer_non_text`：
  - 如果本轮只有媒体/附件，没有有效文字指令，则进入 pending media，不立即回复。
- `_extract_instruction_text`：
  - 去掉 QQ / 微信的媒体标记。
  - 去掉 `Received files:` 这类文件列表标记。
  - 判断是否存在真正的人类文字指令。
- `_queue_pending_media` / `_consume_pending_media`：
  - 将先发来的附件暂存。
  - 等下一条文字指令进来时合并处理。
- `_merge_upload_context`：
  - 把附件路径注入上下文，明确提示模型可以用 `copy_file` 处理任意类型附件。
  - 如果用户要求保存到桌面，优先复制到系统桌面目录。
- QQ / 微信渠道：
  - 支持更多文件字段名和媒体结构。
  - 不只支持 Word/PDF，而是任意格式附件都可以进入文件链路。
- 配置：
  - `allowed_upload_extensions` 支持 `*`，允许任意格式附件上传。
- 文件工具：
  - `copy_file` 支持任意二进制文件复制，不要求 read_file 能读懂内容。

### 面试表达

> 我最近修了一个很实际的交互问题：用户在微信或 QQ 先发图片、视频、压缩包这类附件时，AI 不应该马上尬答，而是等用户说“把这个放桌面”或者“帮我分析这个文件”之后再处理。我做了 pending media 机制，先把附件路径暂存，下一条文字指令来了再合并到上下文。文件复制走 `copy_file`，所以不局限于 Word 或 PDF，任意二进制附件都能安全复制。

### 边界说明

- 如果是图片/PDF/文本，可以尝试读取或解析。
- 如果是视频、压缩包、安装包等不可解析格式，不能强行读内容，但可以复制、移动或作为附件处理。
- 复制到桌面不是无限制控制电脑，而是在工具允许的路径和权限范围内安全执行。
- 集群助手默认强制 `restrict_to_workspace=True`，文件工具只放开助手 workspace、受控 media 上传目录和用户 Desktop 等必要路径。
- 桌面目录由系统识别，测试或特殊部署可以用 `NANOBOT_DESKTOP_DIR` 指定。

---

## 16. 前端 React 工作台

当前前端已经从原生 HTML/CSS/JS 控制台迁移为 React 控制台。

核心文件：

- `web/react-src/main.jsx`
- `web/react-console.css`
- `web/react-console.js`
- `web/index.html`

使用：

- React 18
- React Grid Layout
- esbuild
- localStorage
- AbortController
- Web Speech API

### 当前工作台卡片

- 助手集群
- 会话主面板
- Inspector 配置
- 系统与插件状态
- RAG 知识库
- 自动化任务中心
- Traces & Events
- 用户管理

### 布局能力

- 默认页面按 12 列网格布局。
- 默认布局是左侧助手/状态、中间主会话/RAG/任务/Trace、右侧 Inspector/用户管理，打开页面就能形成控制台工作台。
- 卡片有统一最小宽高。
- 支持四边缩放：`resizeHandles={["n", "e", "s", "w"]}`。
- 使用 `preventCollision` 避免卡片重叠。
- 使用 `compactType={null}` 避免拖动后被自动压缩到意外位置。
- 使用 `normalizeLayout` 对拖动和缩放后的布局做边界归一化，避免卡片被挤出可视区域。
- 拖动释放后由网格算法自动寻找位置和补位，缩小时内部列表/详情区用滚动条承接内容。
- 使用 localStorage 保存布局，key：`nanobot-react-grid-layout-v13`。
- 标题栏作为拖拽 handle，避免输入框和按钮被误拖。

面试表达：

> 前端这块一开始是原生 JS，后来需求变成每个卡片都能拖放、四边缩放、边界限制、不能重叠、自动补位，还要保存布局。继续手写碰撞算法成本很高，所以我迁移成 React + React Grid Layout。现在每个业务面板都是 React 组件，布局交给网格系统处理，同时用 `normalizeLayout` 做边界归一化，业务 API 仍然复用原来的 FastAPI。

### Vibe Coding 怎么讲

如果面试官问：“前端 React 化算不算 Vibe Coding？”

可以这样回答：

> 算是有用到这类方式。我先用自然语言把需求描述清楚，比如卡片拖拽、四边缩放、不能重叠、布局持久化、语音识别和暂停生成，然后再让 AI 辅助改代码、跑构建、根据截图继续修 bug。但我不是完全盲改，关键地方我会看源码和运行效果，比如 React Grid Layout 的 `preventCollision`、`resizeHandles`、localStorage 布局 key，以及后端接口是否兼容。

---

## 17. 前端暂停生成

需求：用户发送消息后，如果模型生成时间太长，需要能暂停本次生成。

实现：

- 前端使用 `AbortController` 中断当前 `/api/chat` 请求。
- 前端维护 `chatSending` 状态。
- 正在生成时按钮显示“暂停生成”。
- 后端维护 `active_chat_tasks`。
- 新增 `/api/chat/stop`。
- 后端取消任务后返回取消状态，并在 Trace 中记录为 cancelled。

面试表达：

> 这个功能解决的是 AI 应用常见的可控性问题。用户不是发出去就只能等，前端可以通过 AbortController 停止请求，后端也记录 active task 并取消执行，Trace 里能看到 cancelled 状态。这样体验和可观测都更完整。

---

## 18. Web 语音识别

控制台聊天输入支持语音识别。

实现点：

- 使用浏览器 `SpeechRecognition / webkitSpeechRecognition`。
- 不支持的浏览器禁用按钮并提示。
- 识别结果写入聊天输入框。
- 识别过程中显示状态。
- 和发送、暂停生成共存。

面试表达：

> 语音识别这块我没有额外接云服务，而是先用浏览器 Web Speech API，适合本地演示。它的边界是依赖浏览器和麦克风权限，所以我在 UI 上做了支持检测和状态提示。

---

## 19. Trace 与可观测性

Trace 记录：

- request_content
- response_content
- assistant_id
- channel
- media_count
- status
- error_message
- started_at / completed_at
- duration_ms
- prompt_tokens
- completion_tokens
- total_tokens

Trace Events 记录：

- RAG 命中
- 工具调用
- 多 Agent 协作阶段
- 任务执行
- 渠道发送
- 错误信息

面试表达：

> AI 应用不能只看最终回答，不然出了问题不知道是模型错、检索错、工具错还是渠道错。Trace 就是为了解决这个问题，它能看到一次请求的知识命中、工具调用、耗时、token 和错误原因。

---

## 20. 安全设计

项目已有基础安全闭环：

- admin / viewer 角色。
- Argon2id 密码哈希。
- Session Cookie。
- CSRF token。
- 非 dev_mode 禁止关闭鉴权。
- 上传大小限制。
- 知识文档文本长度限制。
- 工具白名单。
- 助手 workspace 隔离。
- MCP 工具白名单。
- 文件处理路径控制。
- `restrict_to_workspace=True` 约束 Shell / 文件工具的默认工作目录。
- 文件复制只允许在 workspace、media 上传目录、Desktop 等显式允许位置之间流转。

面试表达：

> 我做这个项目时比较注意 AI 工具调用的边界。不是所有助手都能用所有工具，也不是用户发什么路径都能读写。助手有工具白名单，MCP 有 enabled_tools，上传有大小和类型限制，集群运行时还会强制 workspace 约束。像“复制到桌面”这种能力也不是放开整块磁盘，而是在 workspace、media 和 Desktop 这些明确允许的路径之间执行。

---

## 21. 数据存储划分

### SQLite

用于结构化控制面：

- users
- auth_sessions
- tasks
- task_runs
- traces
- trace_events
- assistant memory
- sessions

### Milvus

用于知识库：

- 文档元数据
- chunk
- keywords
- content
- vector
- assistant_scope
- content_hash
- collection_key
- source_name / source_url

面试表达：

> SQLite 负责事务型控制面数据，Milvus 负责向量和知识库检索，两者职责分开。这样比把所有东西都塞进一个数据库更清晰。

---

## 22. 项目演示完整流程

### 演示 1：整体控制台

展示：

- 顶部导航。
- 助手集群。
- 会话主面板。
- Inspector。
- RAG 知识库。
- 自动化任务。
- Trace。
- 用户管理。

讲法：

> 这是项目的主控制台，可以统一管理助手、对话、知识库、任务和 Trace。前端是 React + React Grid Layout，卡片可以拖拽、缩放、保存布局。

### 演示 2：助手选择和对话

操作：

1. 选择咨询助手。
2. 发送一个普通问题。
3. 点击“暂停生成”展示可控性。
4. 选择生图助手，说明它不会再被 RAG 或协作错误干扰。

讲法：

> 显式选择助手时，会优先尊重用户选择，不再让系统自动切到其他助手。

### 演示 3：RAG

按第 10 节流程演示。

讲法：

> 这里展示的是知识库从上传到检索到回答引用的完整链路。

### 演示 4：自动化任务

创建“每日生活账号巡检”任务。

讲法：

> 这个任务可以基于知识库定期生成账号巡检摘要，后续也可以推送到微信或 QQ。

### 演示 5：Trace

打开最新一次请求。

讲法：

> 这里可以看到模型回答、耗时、token、知识命中和工具事件。

### 演示 6：文件复制链路

如果环境允许，可以演示：

1. 在 QQ 或微信发送一个文件。
2. 助手先不回复。
3. 再发送：“把刚才这个文件复制到桌面。”
4. 助手调用 `copy_file`。

讲法：

> 这个演示体现的是多渠道附件延迟处理和本地文件工具能力。

---

## 23. 高频面试问题与推荐回答

### Q1：你这个项目解决了什么问题？

> 它解决的是个人生活账号管理场景下，AI 怎么从单纯聊天变成可管理的工作台。它可以接多渠道消息、用 RAG 回答私有知识、用不同助手处理不同任务、用自动化任务定时执行，还能通过 Trace 观察每次请求发生了什么。

### Q2：你的知识库搭建能力如何？

> 我在项目里搭了 Milvus RAG。演示时上传的是一份个人生活账号知识库，里面有宽带扣费、会员续费、异地登录提醒等规则。技术上做了文本抽取、chunk 分块、`content_hash` 去重、embedding、Milvus 入库、BM25 检索、向量检索和 RRF 融合。现在 RAG 不是每轮默认检索，而是用户明确说“根据知识库 / 参考文档”时才触发，并按助手和资料集合过滤。效果上可以根据问题检索到相关句子，在前端展示引用和高亮，再注入给助手回答。

### Q3：RAG 为什么会答非所问，你怎么优化？

> 常见原因是 top-k 返回太多无关 chunk、用户其实没有要求查知识库，或者不同助手的资料混在一起。我做了几个优化：一是 RAG 改成显式触发，普通聊天不自动检索；二是按 `assistant_id` 和 `collection_key` 过滤，减少知识串场；三是检索层用 BM25 + 向量 + RRF 提高召回质量；四是前端展示时不再整段铺开，而是按 query 截取相关句子并高亮。后续还可以加 reranker、引用去重和更细的 chunk 策略。

### Q4：有做过智能体项目吗？

> 做过，就是这个 nanobot 个人生活账号助手。它是偏个人生活账号管理和自动化的 AI Agent 项目，里面有咨询、生图、开发、写作等多个助手。每个助手有自己的 prompt、模型、工具、Skills、MCP 和 workspace。它能接 Web、QQ、微信，也能通过 RAG 查私有知识，通过自动化任务定时生成摘要或提醒。

### Q5：项目里 Agent 具体解决什么问题？

> 它主要解决“不同任务用不同能力”的问题。比如咨询助手负责日常问答，生图助手负责图片任务，开发助手负责代码和文件工具，写作助手负责文案。复杂任务还可以走 Planner、Workers、Summary 的多 Agent 协作。这样比一个大而全助手更清晰，也更容易控制工具权限。

### Q6：为什么用 MCP？

> MCP 是为了把外部工具能力标准化接进来。比如 filesystem、git、web fetch、memory、time 这些能力可以通过 MCP 注册给 Agent。项目里还做了 MCP 配置校验、连通性探测和工具白名单，避免工具暴露过多。

### Q7：前端为什么 React 化？

> 一开始原生 JS 可以做简单拖拽，但后面需求变成卡片自由拖放、四边缩放、边界约束、不能重叠、自动补位、布局持久化，这已经是仪表盘网格系统了。所以我改成 React + React Grid Layout，把碰撞和缩放交给成熟库，业务面板拆成组件，再用 `normalizeLayout` 做边界归一化，维护成本更低。

### Q8：文件复制到桌面怎么实现？

> QQ 或微信收到附件后，渠道层先把文件保存成本地路径。如果这一轮只有附件没有文字指令，runtime 会先暂存，不让 AI 立即回答。等用户说“复制到桌面”时，系统把 pending media 合并进上下文，并提示模型优先用 `copy_file` 复制到桌面目录。这个逻辑支持任意格式，不只 Word 或 PDF。

### Q9：怎么避免 AI 乱用工具？

> 我做了几层限制。每个助手有自己的 `tool_names` 白名单，MCP 有 `enabled_tools`，集群运行时强制 `restrict_to_workspace=True`，文件工具只允许 workspace、media 上传目录和 Desktop 等明确路径，上传也有大小和类型校验。这样不是所有助手都能随便读写文件或执行命令。

### Q10：自动化任务和普通 cron 有什么区别？

> 普通 cron 只是到点执行。这里的任务中心还包含 AI prompt、助手选择、RAG 条件、渠道在线条件、重试退避、任务运行记录和 Trace。它更像一个轻量 AI workflow。

### Q11：Trace 为什么重要？

> AI 应用出错时不能只看最终回答。Trace 能告诉我用了哪个助手、检索了哪些知识、调用了哪些工具、耗时多少、token 多少、哪里失败。这样才能定位问题。

### Q12：项目目前还有哪些不足？

> 我会坦诚说有几个可以继续优化的点：RAG 还可以加 reranker 和更好的中文 embedding；前端拖拽交换规则还可以做得更精细，比如服务端保存布局和多断点布局；任务中心如果生产化可以接分布式队列；安全上可以增加审计日志、限流和更细粒度知识库 ACL。

---

## 24. 面试官可能追问的细节

### RAG 追问

- chunk size 和 overlap 为什么这么选？
- BM25 中文怎么分词？
- RRF 为什么比直接加权分数稳？
- 为什么 RAG 不再默认每轮检索？
- 显式触发词怎么判断，会不会漏召回？
- 如何处理重复文档？
- 文档删除时 Milvus 怎么同步？
- 如何避免不同助手知识库互相污染？
- `assistant_id`、`collection_key`、`content_hash` 分别解决什么问题？
- 如何评估 RAG 效果？

### Agent 追问

- AgentLoop 一次请求怎么执行？
- 工具调用最多迭代多少轮？
- 多 Agent 协作什么时候触发？
- 如何避免多 Agent 浪费 token？
- 显式选择助手和自动路由冲突时谁优先？
- 生图助手为什么要跳过 RAG？

### MCP 追问

- MCP 和普通内置工具有什么区别？
- stdio 和 SSE 的使用场景区别？
- MCP 工具超时怎么处理？
- 如何限制 MCP 工具权限？

### 前端追问

- 为什么不用继续手写拖拽？
- React Grid Layout 的核心配置是什么？
- 怎么避免拖动输入框时误触发拖拽？
- 布局怎么持久化？
- 缩放后内容溢出怎么处理？
- `normalizeLayout` 解决什么边界问题？
- 为什么要升级 localStorage 布局 key？

### 文件处理追问

- 为什么附件不应该立即回复？
- pending media 存在哪里？
- 任意格式文件怎么支持？
- copy_file 和 read_file 的区别是什么？
- 微信和 QQ 的文件字段差异怎么兼容？

---

## 25. 项目亮点总结

1. 多助手隔离：不同助手有独立 prompt、模型、工具、Skills、MCP、workspace。
2. Milvus 混合 RAG：支持文档上传、chunk、`content_hash` 去重、embedding、BM25、向量检索、RRF 融合。
3. 多 Agent 协作：Planner、Workers、Summary，支持自动和任务级配置。
4. 自动化任务中心：支持 cron、interval、manual、条件执行、重试和记录。
5. MCP 扩展：支持 stdio/SSE/streamableHttp、连通性探测和工具白名单。
6. 多渠道接入：Web、QQ、微信等统一消息模型。
7. 附件延迟处理：任意格式附件先暂存，等用户文字指令后再处理。
8. 文件复制能力：通过 `copy_file` 安全复制微信/QQ 收到的任意附件到桌面等位置。
9. React 控制台：React Grid Layout 拖放、四边缩放、防重叠、自动补位、布局持久化。
10. 生成可控性：前端支持暂停生成，后端取消任务并写入 Trace。
11. 语音识别：Web Speech API 输入。
12. 可观测性：Trace、Events、Token、耗时、RAG 证据、多 Agent 协同视图、任务运行记录。
13. 安全闭环：Argon2、CSRF、角色、上传限制、工具白名单、workspace/media/Desktop 路径边界。

---

## 26. 简历项目描述模板

项目名称：nanobot个人生活账号助手

项目描述：

基于 Python FastAPI 和 React 构建的个人 AI 应用工作台，集成多助手集群、Milvus RAG 知识库、MCP 工具扩展、Skills、自动化任务中心、多渠道消息接入和 Trace 可观测能力。系统支持不同助手独立配置模型、Prompt、工具、Skills、MCP、工作区和 token 配额；RAG 模块支持文档上传、文本抽取、chunk、`content_hash` 去重、Milvus 入库、BM25 + 向量混合检索、RRF 融合、显式触发和助手级过滤；前端基于 React Grid Layout 实现卡片拖拽、四边缩放、防重叠、自动补位、边界归一化和布局持久化。

个人职责：

- 设计多助手运行时，实现助手级模型、工具、Skills、MCP、workspace 和 memory 隔离。
- 实现 Milvus RAG 知识库，支持上传、解析、分块、去重、embedding、显式触发、助手级过滤、混合检索、预览、删除和检索结果高亮。
- 实现自动化任务中心，支持手动、间隔、Cron、条件执行、重试退避和任务运行记录。
- 接入 MCP 配置校验、连通性探测和工具白名单。
- 构建 Trace & Events，可观察 RAG 命中、工具调用、多 Agent 阶段、模型输出、token 和耗时。
- 将 Web 控制台 React 化，基于 React Grid Layout 实现拖拽、缩放、防重叠、自动补位、边界归一化和布局持久化。
- 优化 QQ/微信附件链路，实现任意格式附件延迟回复和 `copy_file` 在 workspace/media/Desktop 安全边界内复制到桌面。
- 增加前端暂停生成和语音识别，提升 AI 对话可控性。

---

## 27. 最后 30 秒总结

面试最后可以这样总结：

> 这个项目对我来说最大的价值，是把大模型能力真正落到了一个完整 AI 应用里。它有后端 API、数据库、RAG、Agent、MCP、自动化任务、多渠道接入、前端控制台和 Trace 可观测。  
>  
> 我重点做了三块：第一是多助手和 Agent 运行时，让不同任务有不同角色和工具边界；第二是 Milvus RAG，把个人生活账号知识变成显式触发、可过滤、可引用、可追踪的私有知识库；第三是 React 控制台，把助手、知识库、任务、Trace 和用户管理做成可拖拽、可缩放、可自动补位的工作台。  
>  
> 所以它不只是一个聊天 demo，而是一个更接近真实业务落地的 AI 应用工程项目。
