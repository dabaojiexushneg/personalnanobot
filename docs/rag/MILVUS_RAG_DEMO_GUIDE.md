# Milvus RAG 演示手册

本文档用于演示 `nanobot个人生活账号助手` 的 Milvus RAG 链路。推荐搭配 [demo_personal_life_account_knowledge.md](./demo_personal_life_account_knowledge.md) 使用。

## 一句话讲清楚 RAG 怎么工作

用户上传知识文档后，系统抽取文本、切成带重叠的 chunk，写入 Milvus；提问时同时走 BM25 关键词检索和向量语义检索，再用 RRF 融合排序，把最相关的片段注入助手上下文，并在回答、引用和 Trace 里展示证据。

## 代码链路

1. Web 上传入口：`web/index.html` 的「RAG 知识库」卡片提交文件。
2. 后端接口：`nanobot/cluster/webapp.py` 的 `/api/knowledge/upload` 接收文件，调用上传限制、文本抽取和重复文档检查。
3. 切块入口：`nanobot/cluster/control.py` 的 `_chunk_text()`，默认每块约 700 字，块间保留 120 字重叠。
4. Milvus 写入：`nanobot/cluster/rag.py` 的 `MilvusKnowledgeStore.create_document()`。
5. Milvus collection：默认 `knowledge_chunks`，同一个 collection 里同时保存文档行和 chunk 行。
6. 检索入口：`MilvusKnowledgeStore.search()` 同时调用 `_bm25_hits()` 和 `_vector_hits()`。
7. 上下文注入：`nanobot/cluster/runtime.py` 的 `_merge_knowledge_context()` 把命中片段放到用户问题前面。
8. 可观测性：`cluster.chat()` 会把命中写入 Trace 的 `knowledge_hit` 事件，并把 citations 返回给前端。

## Milvus 中存了什么

每个上传文档会写入两类记录：

- 文档行：`is_document = 1`，保存标题、文件名、创建人、助手范围、chunk 数、content hash。
- Chunk 行：`is_document = 0`，保存 chunk 内容、关键词 token、向量、chunk index、助手范围。

关键字段：

- `chunk_id`：主键，格式为 `{document_id}:{chunk_index}`。
- `document_id`：同一文档的所有行共用。
- `assistant_scope`：限定哪些助手可以检索到该文档；为空时所有助手可用。
- `content_hash`：用于重复内容识别。
- `keywords`：BM25 或 fallback 关键词检索使用。
- `vector`：sentence-transformers 生成的归一化向量。

## 演示前准备

1. 启动项目：

```powershell
.\start-all.ps1
```

2. 打开控制台：

```text
http://127.0.0.1:8711
```

3. 登录或初始化管理员。

4. 在底部「RAG 知识库」卡片确认状态：

- `MILVUS · 已连接`
- Collection 默认为 `knowledge_chunks`
- Embedding 默认为 `all-MiniLM-L6-v2`
- BM25 显示「可用」或「回退分词」都能演示

如果显示未连接，先确认 Docker / Milvus 是否已经随 `start-all.ps1` 启动。

## 演示步骤

### 第一步：上传演示知识文档

1. 找到底部「RAG 知识库」卡片。
2. 文档标题填写：

```text
个人生活账号助手演示知识库
```

3. 限定助手可以留空，表示所有助手都能检索；也可以填写：

```text
consult
```

4. 选择文件：

```text
docs/rag/demo_personal_life_account_knowledge.md
```

5. 点击「上传知识」。

预期结果：

- 文档列表出现「个人生活账号助手演示知识库」。
- RAG 状态中的文档数和 Chunk 数增加。
- 点击「预览」可以看到 chunk 内容。

### 第二步：直接演示检索

在「检索内容」里输入：

```text
家庭宽带每月哪天扣费，超过多少钱要提醒我？
```

点击「检索」。

讲解重点：

- 结果卡片会显示融合分。
- `召回` 可能是 `bm25`、`vector` 或 `bm25 + vector`。
- 这说明系统不是只做关键词匹配，也不是只做向量检索，而是混合召回后融合排序。

### 第三步：演示助手问答引用知识库

在主聊天框问：

```text
请根据知识库告诉我：视频会员出现异地登录提醒时应该怎么处理？
```

预期回答：

- 助手应提到优先修改密码、退出陌生设备。
- 回答下方出现 RAG 来源卡片。
- 来源标题应指向「个人生活账号助手演示知识库」。

### 第四步：演示 Trace 证据

1. 打开底部「Traces & Events」卡片。
2. 选择刚才那条聊天 Trace。
3. 查看「RAG 证据」区域。

讲解重点：

- Trace 里有 `knowledge_hit`。
- 每条证据包含标题、召回方式、分数、命中内容。
- 这证明回答不是黑盒生成，而是有可追踪的知识证据。

### 第五步：演示助手范围隔离

1. 再上传同一文档或另一份文档时，把限定助手填写为：

```text
developer
```

2. 选中 `consult` 助手检索同一个问题。
3. 再选中 `developer` 助手检索同一个问题。

讲解重点：

- `assistant_scope` 用于控制不同助手能看到哪些知识。
- 适合把生活账号、代码项目、写作资料等分到不同助手。

## 推荐演示问题

```text
云盘会员续费前应该提醒我检查什么？
```

```text
家庭宽带断网时，排查顺序是什么？
```

```text
物业报修漏水时应该准备哪些信息？
```

```text
明天出差前，我应该准备哪些东西？
```

## 面试或汇报时的讲法

可以这样讲：

> 这个项目的 RAG 不是把文档塞进 prompt 这么简单。上传后系统会抽取文本、做 chunk、生成关键词和向量，统一写入 Milvus。查询时先按助手范围过滤，再同时做 BM25 和向量召回，用 RRF 融合排序，最后把 top chunks 注入 Agent 上下文。前端会展示引用，Trace 会保存 evidence，所以能解释回答依据，也能排查召回质量。

## 常见问题

- 上传后没有结果：检查 Milvus 状态、依赖是否安装、文件是否为空、文件扩展名是否被允许。
- 检索命中不准：换更具体的问题，或把知识文档写成更明确的条目化内容。
- BM25 显示回退分词：`rank-bm25` 没安装时会使用 token overlap fallback，仍可演示混合链路中的向量部分。
- 助手回答没引用：先在 RAG 检索框确认能命中，再确认当前选中助手是否在文档的 `assistant_scope` 里。
