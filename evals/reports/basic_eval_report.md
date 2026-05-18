# Basic Eval Report

- Suite: `basic_eval_cases`
- Generated At: `2026-04-23T11:30:00+08:00`
- Dataset: `evals/datasets/basic_eval_cases.jsonl`
- Result: `4 / 4 passed (100.0%)`

## Observations

1. 普通问答样本通过，说明主工作台的基础对话链路稳定。
2. RAG 问答样本通过，说明 Milvus 知识检索链路能正常回到回答中。
3. 图片生成意图识别样本通过，说明文本理解模型到生图工具模型的切换有效。
4. 开发类模板样本通过，说明多助手能力边界基本正常。

## Limits

- 当前只是一组最小基础评测。
- 还没有覆盖更细的工具调用率、引用精确率、成本/时延分布等指标。
