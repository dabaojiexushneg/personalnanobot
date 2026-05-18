---
name: github
description: 使用 GitHub CLI `gh` 与 GitHub 交互。适用于处理 issue、PR、CI 运行、workflow 日志、仓库 API 查询和结构化 JSON 输出的场景。
metadata: {"nanobot":{"emoji":"🐙","requires":{"bins":["gh"]},"install":[{"id":"brew","kind":"brew","formula":"gh","bins":["gh"],"label":"安装 GitHub CLI (brew)"},{"id":"apt","kind":"apt","package":"gh","bins":["gh"],"label":"安装 GitHub CLI (apt)"}]}}
---

# GitHub 操作技能

使用 `gh` CLI 操作 GitHub。不在 git 仓库目录中时，始终显式指定 `--repo owner/repo`；也可以直接使用 GitHub URL。

## Pull Requests

查看某个 PR 的 CI 状态：

```bash
gh pr checks 55 --repo owner/repo
```

列出最近的 workflow 运行：

```bash
gh run list --repo owner/repo --limit 10
```

查看一次运行，并定位失败步骤：

```bash
gh run view <run-id> --repo owner/repo
```

只查看失败步骤日志：

```bash
gh run view <run-id> --repo owner/repo --log-failed
```

## 高级 API 查询

`gh api` 适合获取普通子命令不直接提供的数据。

获取 PR 的指定字段：

```bash
gh api repos/owner/repo/pulls/55 --jq '.title, .state, .user.login'
```

## JSON 输出

大多数命令支持 `--json` 结构化输出，也可以用 `--jq` 过滤：

```bash
gh issue list --repo owner/repo --json number,title --jq '.[] | "\(.number): \(.title)"'
```
