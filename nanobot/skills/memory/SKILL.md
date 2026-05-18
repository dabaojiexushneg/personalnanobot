---
name: memory
description: 两层记忆系统，包含由 Dream 自动维护的知识文件和可检索历史记录。适用于需要理解机器人身份、用户偏好、长期项目事实或检索过往事件的场景。
always: true
---

# 记忆技能

## 结构

- `SOUL.md`：机器人个性和沟通风格。**由 Dream 管理。不要编辑。**
- `USER.md`：用户资料和偏好。**由 Dream 管理。不要编辑。**
- `memory/MEMORY.md`：长期事实，例如项目背景和重要事件。**由 Dream 管理。不要编辑。**
- `memory/history.jsonl`：追加写入的 JSONL 历史记录，不会默认加载进上下文。优先用内置 `grep` 工具检索。

## 检索过往事件

`memory/history.jsonl` 是 JSONL 格式，每一行都是一个 JSON 对象，包含 `cursor`、`timestamp`、`content`。

- 做宽泛搜索时，先用 `grep(..., path="memory", glob="*.jsonl", output_mode="count")` 或默认的 `files_with_matches` 模式缩小范围。
- 需要精确匹配行时，使用 `output_mode="content"`，并配合 `context_before` / `context_after` 查看上下文。
- 搜索字面量时间戳或 JSON 片段时，使用 `fixed_strings=true`。
- 历史很长时，用 `head_limit` / `offset` 分页查看。
- 只有内置搜索无法表达需求时，才把 `exec` 作为兜底方案。

示例，将 `keyword` 替换为实际关键词：

```text
grep(pattern="keyword", path="memory/history.jsonl", case_insensitive=true)
grep(pattern="2026-04-02 10:00", path="memory/history.jsonl", fixed_strings=true)
grep(pattern="keyword", path="memory", glob="*.jsonl", output_mode="count", case_insensitive=true)
grep(pattern="oauth|token", path="memory", glob="*.jsonl", output_mode="content", case_insensitive=true)
```

## 重要规则

- **不要编辑 `SOUL.md`、`USER.md` 或 `MEMORY.md`。** 它们会由 Dream 自动维护。
- 如果发现信息过期，等 Dream 下次运行时会自动修正。
- 用户可以通过 `/dream-log` 查看 Dream 的活动记录。
