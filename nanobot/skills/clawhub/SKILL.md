---
name: clawhub
description: 从 ClawHub 公共技能注册表中搜索、安装和更新 agent skills。适用于用户想查找技能、安装技能、列出可用技能或更新技能的场景。
homepage: https://clawhub.ai
metadata: {"nanobot":{"emoji":"🦞"}}
---

# ClawHub 技能

ClawHub 是面向 AI Agent 的公共技能注册表，支持用自然语言进行向量搜索。

## 什么时候使用

当用户提出以下需求时使用本技能：

- 查找某类技能，例如“找一个网页抓取技能”
- 搜索可用 skills
- 安装某个 skill
- 查看当前有哪些 skills
- 更新已安装的 skills

## 搜索技能

```bash
npx --yes clawhub@latest search "web scraping" --limit 5
```

## 安装技能

```bash
npx --yes clawhub@latest install <slug> --workdir ~/.nanobot/workspace
```

将 `<slug>` 替换为搜索结果中的技能名称。该命令会把技能安装到 `~/.nanobot/workspace/skills/`，nanobot 会从这里加载工作区技能。安装时必须带上 `--workdir`。

## 更新技能

```bash
npx --yes clawhub@latest update --all --workdir ~/.nanobot/workspace
```

## 查看已安装技能

```bash
npx --yes clawhub@latest list --workdir ~/.nanobot/workspace
```

## 注意事项

- 需要 Node.js，`npx` 会随 Node.js 一起安装。
- 搜索和安装不需要 API Key。
- 只有发布技能时才需要登录：`npx --yes clawhub@latest login`。
- `--workdir ~/.nanobot/workspace` 很关键；不指定时，技能可能会安装到当前目录，而不是 nanobot 工作区。
- 安装完成后，提醒用户开启一个新会话，让 nanobot 重新加载技能。
