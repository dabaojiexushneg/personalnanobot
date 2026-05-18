# 部署与落地说明

## 开发环境故事

当前项目最适合本地开发和面试演示的方式是：

- Windows 主机
- WSL2
- Docker Desktop
- Milvus 跑在 Docker 容器里
- `nanobot` 服务跑在本地 Python 虚拟环境里

这套结构的优点：

- Milvus 依赖单独容器化，方便管理
- Python 代码直接本地运行，调试成本低
- Web 控制台、API、渠道服务能统一由脚本拉起

## 典型启动链路

### 1. 依赖安装

```powershell
uv sync --all-extras
```

### 2. 初始化配置

```powershell
uv run nanobot onboard
```

### 3. 启动项目

```powershell
.\start-all.ps1
```

启动后通常包括：

- Web 控制台
- OpenAI-style API
- 已启用的渠道服务
- Milvus 容器（如果本机已有）

## 部署边界

### 控制面

- 配置文件：`C:\Users\Lenovo\.nanobot\config.json`
- 控制面数据库：`C:\Users\Lenovo\.nanobot\cluster\control_plane.sqlite3`
- Web 控制台默认端口：`8711`

### RAG

- Milvus 默认地址：`http://127.0.0.1:19530`
- 健康检查常见端口：`9091`

### API

- OpenAI-style API 默认端口：`8900`

## 开发模式与生产模式

仓库里已经分离了：

- `docker-compose.yml`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`

推荐说法：

- `dev` 用于本地调试与需要更高权限能力的场景
- `prod` 用于最小权限部署模板

## 常见排障路径

### Web 控制台 8711 不通

优先检查：

- 旧进程是否占端口
- `cluster serve` 是否真正启动成功
- `/api/health` 是否返回 200

### Docker / WSL 集成失败

优先检查：

- `wsl -l -v`
- `docker info`
- Docker Desktop 的 `WSL Integration`

### Milvus 相关异常

优先检查：

- `docker ps`
- `19530 / 9091` 端口
- 控制台里的 `RAG / Milvus` 状态

### QQ / 微信不回消息

优先检查：

- 渠道是否启用
- 账号是否登录
- 是否已有可回复会话
- 控制台 Trace 是否已有入站记录

## 面试时怎么讲部署

建议用一句话概括：

> 我把控制面、本地运行时和向量数据库做了清晰拆分，开发时用 WSL2 + Docker + 本地 Python，既能低成本调试，也能把 Milvus、Web 控制台和渠道服务稳定拉起来。
