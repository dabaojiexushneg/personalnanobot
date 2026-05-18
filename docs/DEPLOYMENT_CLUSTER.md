# AI 助手集群部署说明

本文对应当前仓库中的多助手集群版本，包含：

- Web 控制台
- QQ / 微信双渠道
- 文档知识库与检索问答
- 自动化任务中心
- 登录鉴权、权限控制、Trace 监控

## 1. 环境准备

建议使用 Windows PowerShell，在项目根目录执行：

```powershell
cd D:\agent\nanobot
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -U pip
pip install -e ".[dev,weixin]"
```

如果需要 PDF 文档入库，请确认已安装 `pymupdf`。

如果要启用更完整的 RAG 组件栈，建议直接安装：

```powershell
pip install -e ".[dev,weixin,rag]"
```

## 2. 初始化配置

建议将运行配置放在项目内：

```powershell
nanobot onboard --config .\.runtime\config.json --workspace .\.runtime\workspace
```

重点检查 [D:\agent\nanobot\.runtime\config.json](D:\agent\nanobot\.runtime\config.json)：

- `providers`：填写各模型 API Key
- `cluster.enabled = true`
- `cluster.dataRoot`：建议使用 `D:/agent/nanobot/.runtime/cluster`
- `channels.qq` / `channels.weixin`：按账号完成配置
- `cluster.web.authEnabled = true`

当前控制台默认会自动创建一个管理员账号，来自：

- `cluster.web.adminUsername`
- `cluster.web.adminPassword`

首次登录后，建议立刻在“登录鉴权 / 权限”面板新增运营账号，并修改默认管理员密码。

## 3. 启动方式

开发和日常运行推荐：

```powershell
cd D:\agent\nanobot
.\.venv\Scripts\Activate.ps1
nanobot cluster serve --config .\.runtime\config.json --with-channels
```

可选模式：

```powershell
nanobot cluster serve --config .\.runtime\config.json --web-only
nanobot cluster run --config .\.runtime\config.json
```

## 4. Web 控制台功能

启动后打开控制台地址：

- `http://127.0.0.1:8000`
或你的配置中自定义的 host / port。

控制台包含以下模块：

- 主对话工作台：多助手聊天、文件上传、语音识别、渠道同步发送
- 助手配置：模型、工具、Skills、MCP 管理
- 知识库 / RAG：上传 `txt/md/pdf/docx`，自动切片并参与检索
- 自动化任务中心：支持手动任务与间隔任务
- 对话 Trace / Tool 日志：查看每轮请求、工具事件、响应耗时
- 登录鉴权 / 权限：`admin / operator / viewer`

## 5. 角色权限说明

- `viewer`：只读查看概览、知识库、任务、Trace
- `operator`：可聊天、上传文档、运行任务、发渠道消息
- `admin`：可管理助手配置和用户账号

## 6. 知识库说明

支持上传：

- `.txt`
- `.md`
- `.pdf`
- `.docx`

上传后文档会保存到：

- `D:\agent\nanobot\.runtime\cluster\knowledge_uploads`

切片与索引信息会写入控制平面数据库：

- `D:\agent\nanobot\.runtime\cluster\control_plane.sqlite3`

当前项目默认使用：

- SQLite 文档存储
- 自动切片
- Hybrid RAG 主链路：BM25 + 向量检索 + 融合排序

另外已经预留了可选增强型 RAG 组件：

- `Chroma`：本地向量库 / 向量检索
- `sentence-transformers`：Embedding / rerank
- `rank-bm25`：关键词稀疏检索

这些依赖安装后，可通过接口查看当前环境是否已就绪：

- `GET /api/rag/libraries`

说明：

- 当前仓库已经把这些常用 RAG 库加入 `rag` 可选依赖组
- 文档上传入库后，会同时写入 SQLite 切片索引和 Chroma 向量索引
- 在线问答时默认走 Hybrid RAG：`BM25 稀疏检索 + Chroma 向量检索 + 融合排序`

## 7. 自动化任务说明

当前任务中心支持两种模式：

- `manual`：手动运行
- `interval`：按分钟间隔轮询执行

服务启动后，Web 进程内会启动一个轻量调度循环，每 15 秒检查一次到期任务。

另外也支持独立任务 Worker：

```powershell
nanobot cluster worker --config .\.runtime\config.json
```

推荐生产 / 面试演示方式：

- Web 控制台：`nanobot cluster serve --config .\.runtime\config.json --with-channels`
- 独立任务 Worker：`nanobot cluster worker --config .\.runtime\config.json`

当前调度器已加入 SQLite 租约锁：

- 多个 Web / Worker 实例同时运行时，同一个任务只会被一个实例 claim
- 长任务执行期间会自动续租，避免重复执行

如果任务配置了：

- `target_channel`
- `target_chat_id`

执行结果会在完成后主动同步到对应渠道。

## 8. 运行监控与排障

你可以从控制台直接查看：

- Trace 总数
- 失败数
- 平均耗时
- 任务总数
- 知识库文档数

常见排查顺序：

1. 先看 “对话 Trace / Tool 日志”
2. 再看终端日志
3. 检查 `providers` 模型配置与渠道登录态
4. 检查 `control_plane.sqlite3` 中是否已有对应记录

## 9. 自检命令

```powershell
python -m compileall nanobot web tests\cluster
node --check web\app.js
pytest tests\cluster\test_control_store.py tests\cluster\test_cluster_service.py
```

如果本地没有安装 `pytest` 或 `node`，跳过对应命令即可。
