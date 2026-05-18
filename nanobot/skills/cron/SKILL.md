---
name: cron
description: 创建提醒、一次性计划任务和循环任务。适用于用户要求稍后提醒、周期性执行、定时检查或定时报告的场景。
---

# Cron

使用 `cron` 工具创建提醒或定时任务。

## 三种模式

1. **提醒**：到点后直接给用户发送消息。
2. **任务**：消息内容是任务描述，到点后由 agent 执行并返回结果。
3. **一次性任务**：在指定时间运行一次，完成后自动删除。

## 示例

固定提醒：

```text
cron(action="add", message="该休息一下了！", every_seconds=1200)
```

动态任务，每次触发时由 agent 执行：

```text
cron(action="add", message="检查 HKUDS/nanobot 的 GitHub stars 并报告", every_seconds=600)
```

一次性计划任务，需要基于当前时间计算 ISO datetime：

```text
cron(action="add", message="提醒我参加会议", at="<ISO datetime>")
```

带时区的 Cron：

```text
cron(action="add", message="早会提醒", cron_expr="0 9 * * 1-5", tz="America/Vancouver")
```

列出和删除任务：

```text
cron(action="list")
cron(action="remove", job_id="abc123")
```

## 时间表达式换算

| 用户说法 | 参数 |
| --- | --- |
| 每 20 分钟 | `every_seconds: 1200` |
| 每小时 | `every_seconds: 3600` |
| 每天早上 8 点 | `cron_expr: "0 8 * * *"` |
| 工作日下午 5 点 | `cron_expr: "0 17 * * 1-5"` |
| 温哥华时间每天早上 9 点 | `cron_expr: "0 9 * * *", tz: "America/Vancouver"` |
| 指定某个时间 | `at: ISO datetime string`，需要根据当前时间计算 |

## 时区

使用 `cron_expr` 时，可以通过 `tz` 指定 IANA 时区。不指定 `tz` 时，默认使用服务器本地时区。
