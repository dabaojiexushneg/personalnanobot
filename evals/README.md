# Nanobot Evals

这套评测脚手架用于给 `nanobot` 的核心 AI 能力做最基础的回归验证，重点覆盖：

- 普通问答
- RAG 问答
- 图片生成意图识别
- 工具/渠道回复的稳定性

## 数据格式

评测集使用 `JSONL`，每行一个样本，字段如下：

- `id`: 样本唯一 ID
- `assistant_id`: 目标助手
- `input`: 用户输入
- `expect_contains`: 响应里至少应包含的关键字数组
- `forbid_contains`: 响应里不应出现的关键字数组

示例见 [datasets/basic_eval_cases.jsonl](</D:/agent/nanobot/evals/datasets/basic_eval_cases.jsonl:1>)。

## 运行方式

先启动控制台后端：

```powershell
.\start-all.ps1 -SkipMilvus
```

再执行：

```powershell
.\.venv\Scripts\python.exe evals\runner.py --dataset evals\datasets\basic_eval_cases.jsonl
```

默认会调用本机 `http://127.0.0.1:8711/api/chat`。

如果需要把结果导出成报告：

```powershell
.\.venv\Scripts\python.exe evals\runner.py `
  --dataset evals\datasets\basic_eval_cases.jsonl `
  --json-out evals\reports\latest_eval_report.json `
  --md-out evals\reports\latest_eval_report.md
```

## 输出

脚本会输出：

- 每条样本的 `PASS / FAIL`
- 失败原因
- 总通过数与通过率
- 可选 JSON 报告
- 可选 Markdown 报告

后续可以继续扩展：

- RAG 引用命中率
- 工具调用率
- 图片请求识别率
- 平均 token / 平均耗时

## RAG 质量评测

RAG 专项评测集见 [datasets/rag_quality_eval_cases.jsonl](</D:/agent/nanobot/evals/datasets/rag_quality_eval_cases.jsonl:1>)，用于验证：

- query 改写后的召回是否命中目标知识文档
- reranker 是否把更相关 chunk 排到第一
- 返回结果是否带有 `evidence_sentences`、`matched_terms` 和 `citation`

运行方式：

```powershell
.\.venv\Scripts\python.exe evals\rag_quality_runner.py `
  --dataset evals\datasets\rag_quality_eval_cases.jsonl `
  --json-out evals\reports\rag_quality_report.json
```

如果控制台开启了登录鉴权，可追加：

```powershell
.\.venv\Scripts\python.exe evals\rag_quality_runner.py `
  --username admin `
  --password "<控制台密码>"
```

专业演示知识库对应的评测集见 [datasets/professional_rag_demo_cases.jsonl](</D:/agent/nanobot/evals/datasets/professional_rag_demo_cases.jsonl:1>)。先把 [demo_professional_life_account_knowledge.md](</D:/agent/nanobot/docs/rag/demo_professional_life_account_knowledge.md:1>) 上传到 RAG 知识库，再运行：

```powershell
.\.venv\Scripts\python.exe evals\rag_quality_runner.py `
  --dataset evals\datasets\professional_rag_demo_cases.jsonl `
  --json-out evals\reports\professional_rag_demo_report.json
```
