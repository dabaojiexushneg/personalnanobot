# nanobot Skills

该目录存放 nanobot 内置 skills，用于扩展 agent 的能力。

## Skill 格式

每个 skill 都是一个独立目录，目录中必须包含 `SKILL.md`：

- YAML frontmatter：声明 `name`、`description` 和可选 metadata。
- Markdown 正文：给 agent 的使用说明、流程和注意事项。

当 skill 需要引用较大的本地文档或日志时，优先使用 nanobot 内置的 `grep` / `glob` 工具缩小搜索范围，再读取完整文件。

建议：

- 宽泛搜索先用 `grep(output_mode="count")` 或默认的 `files_with_matches`。
- 大文件分页使用 `head_limit` / `offset`。
- 需要发现目录结构时使用 `glob(entry_type="dirs")`。

## 来源说明

这些 skills 借鉴了 [OpenClaw](https://github.com/openclaw/openclaw) 的 skill system。Skill 格式和 metadata 结构保持兼容，方便后续复用和迁移。

## 当前内置 Skills

| Skill | 说明 |
| --- | --- |
| `github` | 使用 `gh` CLI 操作 GitHub |
| `weather` | 使用 wttr.in 和 Open-Meteo 查询天气 |
| `summarize` | 总结 URL、本地文件和 YouTube 视频 |
| `tmux` | 远程控制 tmux 会话 |
| `clawhub` | 从 ClawHub 注册表搜索和安装 skills |
| `skill-creator` | 创建和维护新的 skills |
