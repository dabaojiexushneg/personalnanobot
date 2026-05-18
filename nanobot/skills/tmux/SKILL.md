---
name: tmux
description: 通过 tmux 远程控制交互式 CLI，会话可发送按键、抓取 pane 输出和监控长时间运行的交互程序。适用于需要真实 TTY、并行运行 coding agent 或观察交互式命令输出的场景。
metadata: {"nanobot":{"emoji":"🧵","os":["darwin","linux"],"requires":{"bins":["tmux"]}}}
---

# tmux 会话控制技能

只有在需要交互式 TTY 时才使用 tmux。对于普通长时间但非交互式任务，优先使用 `exec` 的后台模式。

## 快速开始：隔离 socket

```bash
SOCKET_DIR="${NANOBOT_TMUX_SOCKET_DIR:-${TMPDIR:-/tmp}/nanobot-tmux-sockets}"
mkdir -p "$SOCKET_DIR"
SOCKET="$SOCKET_DIR/nanobot.sock"
SESSION=nanobot-python

tmux -S "$SOCKET" new -d -s "$SESSION" -n shell
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- 'PYTHON_BASIC_REPL=1 python3 -q' Enter
tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
```

启动 session 后，始终把监控命令输出给用户：

```text
查看方式：
  tmux -S "$SOCKET" attach -t "$SESSION"
  tmux -S "$SOCKET" capture-pane -p -J -t "$SESSION":0.0 -S -200
```

## Socket 约定

- 使用 `NANOBOT_TMUX_SOCKET_DIR` 环境变量。
- 默认 socket 路径：`"$NANOBOT_TMUX_SOCKET_DIR/nanobot.sock"`。

## Pane 定位和命名

- target 格式：`session:window.pane`，默认 `:0.0`。
- session 名称保持简短，避免空格。
- 查看会话：`tmux -S "$SOCKET" list-sessions`。
- 查看所有 pane：`tmux -S "$SOCKET" list-panes -a`。

## 查找会话

- 当前 socket 上列出 session：`{baseDir}/scripts/find-sessions.sh -S "$SOCKET"`。
- 扫描全部 socket：`{baseDir}/scripts/find-sessions.sh --all`，会使用 `NANOBOT_TMUX_SOCKET_DIR`。

## 安全发送输入

- 优先使用字面量发送：

```bash
tmux -S "$SOCKET" send-keys -t target -l -- "$cmd"
```

- 控制键示例：

```bash
tmux -S "$SOCKET" send-keys -t target C-c
```

## 观察输出

- 抓取最近历史：

```bash
tmux -S "$SOCKET" capture-pane -p -J -t target -S -200
```

- 等待指定提示或文本：

```bash
{baseDir}/scripts/wait-for-text.sh -t session:0.0 -p 'pattern'
```

- 可以 attach 查看；退出 attach 用 `Ctrl+b d`。

## Python REPL 注意事项

启动 Python REPL 时设置：

```bash
PYTHON_BASIC_REPL=1
```

非 basic REPL 可能会破坏 `send-keys` 流程。

## Windows / WSL

tmux 支持 macOS 和 Linux。Windows 上请使用 WSL，并在 WSL 内安装 tmux。本 skill 已限制为 `darwin` / `linux`，并要求 PATH 中存在 `tmux`。

## 编排多个 Coding Agent

tmux 适合并行运行多个 coding agent：

```bash
SOCKET="${TMPDIR:-/tmp}/codex-army.sock"

for i in 1 2 3 4 5; do
  tmux -S "$SOCKET" new-session -d -s "agent-$i"
done

tmux -S "$SOCKET" send-keys -t agent-1 "cd /tmp/project1 && codex --yolo 'Fix bug X'" Enter
tmux -S "$SOCKET" send-keys -t agent-2 "cd /tmp/project2 && codex --yolo 'Fix bug Y'" Enter

for sess in agent-1 agent-2; do
  if tmux -S "$SOCKET" capture-pane -p -t "$sess" -S -3 | grep -q "❯"; then
    echo "$sess: DONE"
  else
    echo "$sess: Running..."
  fi
done

tmux -S "$SOCKET" capture-pane -p -t agent-1 -S -500
```

提示：

- 并行修复时使用不同 git worktree，避免分支冲突。
- 新 clone 先执行 `pnpm install` 等依赖安装。
- 通过 shell prompt，例如 `❯` 或 `$`，判断任务是否完成。
- Codex 非交互运行通常需要 `--yolo` 或 `--full-auto`。

## 清理

- 删除一个 session：

```bash
tmux -S "$SOCKET" kill-session -t "$SESSION"
```

- 删除某个 socket 上所有 session：

```bash
tmux -S "$SOCKET" list-sessions -F '#{session_name}' | xargs -r -n1 tmux -S "$SOCKET" kill-session -t
```

- 删除整个私有 socket server：

```bash
tmux -S "$SOCKET" kill-server
```

## 辅助脚本：wait-for-text.sh

`{baseDir}/scripts/wait-for-text.sh` 会轮询 pane 输出，直到匹配 regex 或固定字符串，或直到超时。

```bash
{baseDir}/scripts/wait-for-text.sh -t session:0.0 -p 'pattern' [-F] [-T 20] [-i 0.5] [-l 2000]
```

参数：

- `-t` / `--target`：pane target，必填。
- `-p` / `--pattern`：要匹配的 regex，必填；加 `-F` 表示固定字符串。
- `-T`：超时时间，单位秒，默认 15。
- `-i`：轮询间隔，默认 0.5 秒。
- `-l`：搜索的历史行数，默认 1000。
