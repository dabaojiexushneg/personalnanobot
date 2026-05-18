---
name: summarize
description: 使用 summarize CLI 总结 URL、文章、本地文件、播客和 YouTube/视频内容，也可尽力抽取转写文本。适用于用户要求总结链接、解释视频内容或转写视频时。
homepage: https://summarize.sh
metadata: {"nanobot":{"emoji":"🧾","requires":{"bins":["summarize"]},"install":[{"id":"brew","kind":"brew","formula":"steipete/tap/summarize","bins":["summarize"],"label":"安装 summarize (brew)"}]}}
---

# 摘要技能

`summarize` 是一个快速 CLI，可总结 URL、本地文件和 YouTube 链接。

## 什么时候使用

当用户提出以下需求时立即使用：

- “使用 summarize.sh”
- “这个链接/视频讲了什么？”
- “总结这篇文章/这个 URL”
- “转写这个 YouTube/视频”

对于视频转写，优先尝试 best-effort transcript extraction，不需要额外使用 `yt-dlp`。

## 快速开始

```bash
summarize "https://example.com" --model google/gemini-3-flash-preview
summarize "/path/to/file.pdf" --model google/gemini-3-flash-preview
summarize "https://youtu.be/dQw4w9WgXcQ" --youtube auto
```

## YouTube：总结与转写

仅对 URL 做尽力转写：

```bash
summarize "https://youtu.be/dQw4w9WgXcQ" --youtube auto --extract-only
```

如果用户要求完整转写但内容很长，先返回紧凑摘要，再询问用户希望展开哪个章节或时间段。

## 模型与 API Key

按所选 provider 设置 API Key：

- OpenAI：`OPENAI_API_KEY`
- Anthropic：`ANTHROPIC_API_KEY`
- xAI：`XAI_API_KEY`
- Google：`GEMINI_API_KEY`，也支持 `GOOGLE_GENERATIVE_AI_API_KEY`、`GOOGLE_API_KEY`

未指定模型时，默认使用 `google/gemini-3-flash-preview`。

## 常用参数

- `--length short|medium|long|xl|xxl|<chars>`
- `--max-output-tokens <count>`
- `--extract-only`，仅 URL 可用
- `--json`，输出机器可读 JSON
- `--firecrawl auto|off|always`，网页抽取兜底
- `--youtube auto`，设置 `APIFY_API_TOKEN` 后可作为 YouTube 兜底

## 配置

可选配置文件：`~/.summarize/config.json`

```json
{ "model": "openai/gpt-5.2" }
```

可选服务：

- `FIRECRAWL_API_KEY`：用于处理受限网站
- `APIFY_API_TOKEN`：用于 YouTube 兜底
