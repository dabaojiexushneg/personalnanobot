import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd());
const webRoot = join(root, "web");
const port = Number(process.env.NANOBOT_FRONTEND_TEST_PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function sendJson(response, payload, status = 200) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function sendFile(response, path) {
  if (!existsSync(path)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("not found");
    return;
  }
  response.writeHead(200, { "content-type": mimeTypes[extname(path)] || "application/octet-stream" });
  createReadStream(path).pipe(response);
}

const mockUser = { id: "admin-1", username: "admin", role: "admin", enabled: true };

const overview = {
  default_assistant_id: "consult",
  started_assistant_id: "consult",
  user: mockUser,
  security: {
    auth_enabled: true,
    dev_mode: false,
    bootstrap_required: false,
    csrf_enabled: true,
    upload_max_file_mb: 10,
    upload_max_total_mb: 30,
  },
  dashboard: {
    traces_total: 2,
    traces_failed: 0,
    avg_duration_ms: 812,
    trace_total_tokens: 3280,
    tasks_total: 1,
    tasks_enabled: 1,
    knowledge_docs: 1,
    knowledge_chunks: 4,
  },
  assistants: [
    {
      id: "consult",
      name: "AI 咨询助手",
      description: "日常问答和知识库检索",
      enabled: true,
      tool_names: ["web_search", "read_file", "copy_file"],
      enabled_skills: ["summarize"],
      disabled_skills: [],
      routing: { aliases: ["咨询"], keywords: ["建议"] },
      mcp_servers: {},
    },
    {
      id: "developer",
      name: "AI 开发助手",
      description: "代码实现、调试和工程方案",
      enabled: true,
      tool_names: ["read_file", "exec", "web_search"],
      enabled_skills: ["github"],
      disabled_skills: [],
      routing: { aliases: ["开发"], keywords: ["代码"] },
      mcp_servers: {},
    },
  ],
  channels: {
    weixin: { enabled: true, running: false },
    qq: { enabled: true, running: false },
  },
  channel_targets: [],
  mcp_servers: [
    { name: "filesystemRepo", transport: "stdio", valid: true },
    { name: "fetchWeb", transport: "stdio", valid: true },
  ],
  skills: [{ name: "summarize" }, { name: "github" }],
  metrics: {},
};

const ragStatus = {
  backend: "milvus",
  connected: true,
  collection_name: "knowledge_chunks",
  embedding_model: "all-MiniLM-L6-v2",
  vector_dimension: 384,
  knowledge_docs: 1,
  knowledge_chunks: 4,
};

const docs = [
  {
    id: "doc-1",
    document_id: "doc-1",
    title: "个人生活账号助手演示知识库",
    filename: "demo_personal_life_account_knowledge.md",
    chunk_count: 4,
    created_at: "2026-05-18T10:00:00+08:00",
  },
];

const tasks = [
  {
    id: "task-1",
    name: "每日生活账号巡检",
    assistant_id: "consult",
    prompt: "生成账号巡检摘要",
    task_kind: "knowledge_digest",
    collaboration_mode: "inherit",
    schedule_kind: "manual",
    enabled: true,
    last_status: "completed",
    next_run_at: "",
  },
];

const traces = [
  {
    id: "trace-1",
    assistant_id: "consult",
    channel: "web",
    status: "completed",
    request_content: "请根据知识库告诉我宽带扣费规则",
    response_content: "家庭宽带每月 12 日扣费。",
    started_at: "2026-05-18T10:05:00+08:00",
    duration_ms: 812,
  },
];

const traceDetail = {
  ...traces[0],
  events: [
    {
      event_type: "knowledge_hit",
      content: "家庭宽带每月 12 日扣费，超过 120 元需要提醒。",
      metadata: { retrieval: ["bm25", "vector"], score: 0.92 },
      created_at: "2026-05-18T10:05:01+08:00",
    },
  ],
};

const dailyTokenUsage = [
  { date: "2026-05-12", trace_count: 173, prompt_tokens: 532400, completion_tokens: 181880, total_tokens: 714280 },
  { date: "2026-05-13", trace_count: 191, prompt_tokens: 628820, completion_tokens: 220210, total_tokens: 849030 },
  { date: "2026-05-14", trace_count: 166, prompt_tokens: 518600, completion_tokens: 173950, total_tokens: 692550 },
  { date: "2026-05-15", trace_count: 232, prompt_tokens: 794000, completion_tokens: 270460, total_tokens: 1064460 },
  { date: "2026-05-16", trace_count: 138, prompt_tokens: 493400, completion_tokens: 153720, total_tokens: 647120 },
  { date: "2026-05-17", trace_count: 207, prompt_tokens: 669300, completion_tokens: 261410, total_tokens: 930710 },
  { date: "2026-05-18", trace_count: 179, prompt_tokens: 291880, completion_tokens: 90330, total_tokens: 382210 },
];

function handleApi(url, response) {
  if (url.pathname === "/api/health") return sendJson(response, { status: "ok" });
  if (url.pathname === "/api/auth/bootstrap-status") return sendJson(response, { bootstrap_required: false, auth_enabled: true, dev_mode: false });
  if (url.pathname === "/api/auth/me") return sendJson(response, { user: mockUser, csrf_token: "csrf-token", security: overview.security });
  if (url.pathname === "/api/overview") return sendJson(response, overview);
  if (url.pathname === "/api/rag/status") return sendJson(response, ragStatus);
  if (url.pathname === "/api/knowledge/documents") return sendJson(response, docs);
  if (url.pathname === "/api/tasks") return sendJson(response, tasks);
  if (url.pathname === "/api/traces") return sendJson(response, traces);
  if (url.pathname === "/api/traces/trace-1") return sendJson(response, traceDetail);
  if (url.pathname === "/api/token-usage/daily") return sendJson(response, dailyTokenUsage);
  if (url.pathname === "/api/users") return sendJson(response, [mockUser]);
  return sendJson(response, { detail: "not found" }, 404);
}

createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(url, response);
    return;
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    sendFile(response, join(webRoot, "index.html"));
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    const relative = normalize(url.pathname.replace(/^\/assets\//, ""));
    sendFile(response, join(webRoot, relative));
    return;
  }

  sendJson(response, { detail: "not found" }, 404);
}).listen(port, "127.0.0.1", () => {
  console.log(`nanobot frontend test server listening on http://127.0.0.1:${port}`);
});
