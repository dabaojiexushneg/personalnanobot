# 助手级 RAG 资料库规划

更新时间：2026-04-26

本文件用于把项目的 RAG 从“通用知识库”升级为“按助手职责分层的专业知识库”。推荐做法是：Milvus 仍作为统一向量数据库，但按助手、主题和来源类型划分逻辑资料库，通过 metadata 控制检索范围、引用展示、更新周期和风险边界。

## 设计原则

- 优先使用官方文档、权威机构、产品文档和长期稳定资料，少用零散博客。
- 每个助手默认只检索自己的资料库，必要时再允许跨库检索。
- 高风险领域必须保留来源引用，并在回答中明确“不构成专业建议”。
- 入库前保存 `source_url`、`source_name`、`assistant_id`、`collection_key`、`priority`、`tags`、`license_note`、`retrieved_at`。
- 同一来源按章节分块，避免把整页网页作为一个 chunk；建议 chunk 大小 600-1000 中文字，overlap 80-150 字。
- Milvus 可以复用一个 collection，也可以按助手拆 collection；面试展示建议先采用“一个物理 collection + metadata 过滤”的方案，工程复杂度更可控。

## 推荐 Metadata Schema

```json
{
  "assistant_id": "consult",
  "collection_key": "consult_prompt_ops",
  "source_name": "OpenAI Prompt Engineering Guide",
  "source_url": "https://platform.openai.com/docs/guides/prompt-engineering",
  "source_type": "official_docs",
  "priority": "P0",
  "tags": ["prompt", "reasoning", "general_consulting"],
  "language": "en",
  "refresh_days": 30,
  "license_note": "public documentation; store excerpts and URL attribution",
  "retrieved_at": "2026-04-26"
}
```

## 总览

| 助手 | 建议 RAG 库 | 目标 |
| --- | --- | --- |
| `consult` AI 咨询助手 | `consult_prompt_ops`、`consult_answer_quality`、`consult_safety_boundaries` | 提升通用咨询的结构化分析、追问、边界提醒能力 |
| `image` AI 生图助手 | `image_prompting`、`image_model_guides`、`image_style_reference` | 提升生图意图识别、提示词改写、模型参数解释能力 |
| `developer` AI 开发助手 | `developer_api_docs`、`developer_architecture`、`developer_rag_agent`、`developer_repo_ops` | 提升代码、架构、API、RAG 工程化回答质量 |
| `investment` AI 投资助手 | `investment_education`、`investment_risk`、`investment_market_data_docs` | 只做投资教育、风险解释和资料整理，不做确定性荐股 |
| `community` AI 社区助手 | `community_moderation`、`community_health`、`community_growth_ops` | 支持社群规则、内容治理、活动运营和社区健康度分析 |
| `writer` AI 写作助手 | `writer_plain_language`、`writer_tech_style`、`writer_public_style` | 提升文案、技术写作、公开材料和面试材料表达质量 |
| `expert` AI 智能专家 | `expert_ai_risk`、`expert_cloud_architecture`、`expert_agent_systems`、`expert_rag_patterns` | 支持高阶架构评审、AI 风险治理、Agent/RAG 方案比较 |

## `consult` AI 咨询助手

### `consult_prompt_ops`

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)：用于沉淀角色设定、上下文约束、引用格式和回答质量策略。
- [Google Gemini Prompt Design Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)：用于补充清晰指令、结构化输出、约束设计和迭代优化方法。
- [Anthropic Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)：用于补充长上下文、任务拆解和稳健提示词写法。

### `consult_answer_quality`

- OpenAI / Google / Anthropic 的 prompt 与 structured output 文档章节：用于让咨询助手输出“结论、依据、风险、下一步”的固定结构。
- 项目自身 README、SECURITY、PROGRESS、面试文档：用于回答项目相关问题时优先引用本地事实。

### `consult_safety_boundaries`

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)：用于回答涉及 AI 风险、可信 AI、模型治理的话题。
- 项目 SECURITY.md：用于登录、Cookie、CSRF、开发模式等项目安全边界回答。

## `image` AI 生图助手

### `image_prompting`

- [OpenAI Image Generation Guide](https://platform.openai.com/docs/guides/image-generation)：用于生图参数、图片输入、编辑和输出策略。
- [Google Gemini Prompt Design Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)：用于图像生成提示词结构、约束和示例驱动提示。
- 项目内生图路由说明：用于识别“图片生成类请求”并转交 Doubao-Seedream-4.0。

### `image_model_guides`

- [Doubao Seedream 4.0](https://research.doubao.com/en/seedream4_0)：用于记录当前项目接入的图像模型定位、能力边界和多图生成说明。
- 火山引擎/豆包模型 API 文档：用于补齐实际 API 参数、错误码和计费说明。

### `image_style_reference`

- 可入库一份项目自建的风格词典：包括产品海报、写实摄影、扁平插画、UI mockup、品牌视觉等风格模板。
- 不建议直接爬取大量第三方图片站；优先保存文本化风格模板和授权明确的示例描述。

## `developer` AI 开发助手

### `developer_api_docs`

- [GitHub REST API Docs](https://docs.github.com/en/rest)：用于自动化、Issue、PR、仓库信息、CI/CD 相关回答。
- [Google Developer Documentation Style Guide](https://developers.google.com/style)：用于技术文档、README、接口说明的写作规范。
- 项目自身 `docs/`、`README.md`、`pyproject.toml`：用于回答本项目代码结构、启动、测试和打包问题。

### `developer_architecture`

- [Azure Architecture Center - Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/)：用于回答缓存、网关、重试、隔离、队列等架构模式。
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)：用于可靠性、安全、成本、运维和性能取舍。

### `developer_rag_agent`

- [LangChain RAG Agent Guide](https://docs.langchain.com/oss/python/langchain/rag)：用于解释 indexing、retrieval、RAG agent 和链式检索。
- [LlamaIndex RAG Introduction](https://docs.llamaindex.ai/en/stable/understanding/rag/)：用于补充 RAG 数据连接器、索引、检索和查询编排。
- [Milvus Overview](https://milvus.io/docs/overview.md)：用于解释向量数据库、collection、index、metadata filter 和混合检索。

### `developer_repo_ops`

- 项目内 `tests/`、CI workflow、启动脚本、compose 文件：用于回答“怎么启动、怎么测、怎么部署、怎么回滚”。
- 建议后续补一份 `docs/DEV_RUNBOOK.md`，作为开发助手的本地高优先级知识源。

## `investment` AI 投资助手

### `investment_education`

- [Investor.gov Diversification](https://www.investor.gov/introduction-investing/investing-basics/glossary/diversification)：用于解释分散投资、风险暴露和基础投资概念。
- [FINRA Asset Allocation and Diversification](https://www.finra.org/investors/investing/investing-basics/asset-allocation-diversification)：用于解释资产配置、风险承受能力和长期投资教育。

### `investment_risk`

- SEC / Investor.gov 投资者教育页面：用于风险提示、欺诈识别、投资基础知识。
- FINRA 投资者保护与教育页面：用于合规边界、适当性、风险类型说明。

### `investment_market_data_docs`

- 只入库“数据字段说明、指标解释、风险披露”，不要把实时行情作为静态 RAG 文档。
- 实时价格、汇率和新闻必须走联网/API 查询，不应依赖 Milvus 静态知识库。

风险边界：投资助手应默认输出“教育性信息 + 风险提示 + 用户自行决策”，禁止伪装成持牌投顾。

## `community` AI 社区助手

### `community_moderation`

- [Discourse Moderation Guide](https://meta.discourse.org/t/discourse-moderation-guide/63116)：用于社区版主管理、帖子处理、举报、封禁和用户沟通。
- [GitHub Community Code of Conduct](https://docs.github.com/en/site-policy/github-terms/github-community-code-of-conduct/)：用于社区行为准则、违规处理和协作边界。

### `community_health`

- [GitHub Community Health Files](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)：用于 CONTRIBUTING、CODE_OF_CONDUCT、Issue 模板等开源社区健康度建设。
- [Mozilla Community Participation Guidelines](https://www.mozilla.org/about/governance/policies/participation/)：用于开放社区参与、行为边界和治理规则。

### `community_growth_ops`

- 项目自己的用户反馈、FAQ、渠道 trace、任务中心运行记录：用于生成社群答疑、公告、活动复盘和运营建议。
- 建议保留“内部运营资料”和“公开社区治理资料”的来源标签，避免把内部敏感内容暴露到外部回答。

## `writer` AI 写作助手

### `writer_plain_language`

- [Plain Language Guide](https://www.plainlanguage.gov/guidelines/)：用于简明表达、面向公众的解释和降低理解门槛。
- [GOV.UK Style Guide](https://www.gov.uk/guidance/style-guide)：用于政府/公共服务风格、清晰术语和一致表达。

### `writer_tech_style`

- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)：用于技术产品、帮助文档、UI 文案和专业语气。
- [Google Developer Documentation Style Guide](https://developers.google.com/style)：用于开发者文档、API 说明和技术教程。

### `writer_public_style`

- 项目 README、progress.md、面试文档：用于生成 GitHub 项目介绍、面试讲稿、版本日志和演示脚本。
- 建议将“项目定位、架构亮点、技术难点、风险边界、未来规划”做成固定模板入库。

## `expert` AI 智能专家

### `expert_ai_risk`

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)：用于 AI 风险识别、治理、可信度和生命周期管理。
- OpenAI / Anthropic / Google 的安全、提示词和生产最佳实践文档：用于模型边界、工具调用安全和 prompt injection 风险。

### `expert_cloud_architecture`

- [Azure Architecture Center - Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/)：用于系统设计模式、容错、隔离和分布式设计。
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)：用于可靠性、安全、成本、性能和运维成熟度评审。

### `expert_agent_systems`

- OpenAI Agents / tools / MCP 官方文档：用于解释 Agent 编排、工具调用、Trace 和安全边界。
- 项目自身多 agent 协同实现文档与 Trace 数据：用于回答本项目 `planner -> workers -> summary` 的实现与限制。

### `expert_rag_patterns`

- [LangChain RAG Agent Guide](https://docs.langchain.com/oss/python/langchain/rag)
- [LlamaIndex RAG Introduction](https://docs.llamaindex.ai/en/stable/understanding/rag/)
- [Milvus Overview](https://milvus.io/docs/overview.md)

这些资料适合让智能专家回答“为什么这么设计 RAG”、“混合召回有什么价值”、“怎么做 RAG 质量评测”、“如何避免知识库污染”等面试级问题。

## 建议入库顺序

1. P0：项目本地文档、Milvus/LangChain/LlamaIndex、OpenAI/Google/Anthropic prompt 文档。
2. P0：developer / expert / consult 的资料库，因为它们最能提升面试演示质量。
3. P1：image / writer 的资料库，用于改善产品体验和内容生成质量。
4. P1：investment / community 的权威资料库，必须同时落地风险边界和引用展示。
5. P2：内部 FAQ、用户反馈、渠道 Trace、任务中心历史输出，用于项目私有知识沉淀。

## 后续工程落地建议

- 增加 `rag_sources` 配置入口，读取 `assistant_rag_sources.json` 后按助手注册资料库。
- 入库任务走任务中心，支持定时刷新、失败重试、来源校验和入库报告。
- 检索时默认按 `assistant_id` 过滤；多 agent 协同时允许 planner 显式声明跨库检索。
- Trace 页展示 `collection_key`、`source_name`、`score`、`chunk_id` 和引用 URL。
- 为 RAG 增加最小评测集：每个助手 5-10 个标准问题，记录命中来源和人工评分。
