import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import GridLayout, { WidthProvider } from "react-grid-layout";

const ResponsiveGrid = WidthProvider(GridLayout);

const roles = { viewer: 1, admin: 2 };
const layoutKey = "nanobot-react-grid-layout-v13";
const GRID_COLS = 12;
const DEFAULT_GRID_ROW_HEIGHT = 42;
const GRID_MARGIN = [12, 12];
const DEFAULT_GRID_ROWS = 15;
const CARD_MIN_W = 2;
const CARD_MIN_H = 3;
const REQUIRED_CARD_IDS = ["assistants", "chat", "inspector", "status", "rag", "task", "trace", "users"];

function buildDefaultLayout(rows = DEFAULT_GRID_ROWS) {
  const topH = clamp(Math.floor(rows * 0.60), 8, Math.max(8, rows - CARD_MIN_H));
  const bottomH = Math.max(CARD_MIN_H, rows - topH);
  return [
    { i: "assistants", x: 0, y: 0, w: 2, h: topH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "chat", x: 2, y: 0, w: 8, h: topH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "inspector", x: 10, y: 0, w: 2, h: topH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "status", x: 0, y: topH, w: 2, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "rag", x: 2, y: topH, w: 3, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "task", x: 5, y: topH, w: 3, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "trace", x: 8, y: topH, w: 2, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
    { i: "users", x: 10, y: topH, w: 2, h: bottomH, minW: CARD_MIN_W, minH: CARD_MIN_H },
  ];
}

const emptyAssistant = {
  id: "",
  name: "",
  description: "",
  persona_prompt: "",
  prompt_change_note: "",
  provider: "auto",
  model: "",
  image_provider: "",
  image_model: "",
  tool_names: [],
  enabled_skills: [],
  disabled_skills: [],
  routing: { aliases: [], keywords: [] },
  mcp_servers: {},
  enabled: true,
};

function csv(value) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value || "");
}

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function fmtTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  } catch {
    return String(value);
  }
}

function fmtNum(value) {
  return Number(value || 0).toLocaleString("zh-CN");
}

function chLabel(value) {
  const key = String(value || "").trim().toLowerCase();
  return { qq: "QQ", weixin: "微信" }[key] || String(value || "-");
}

function knowledgeDocId(doc) {
  return doc?.document_id || doc?.id || "";
}

function tokenizeQuery(text) {
  const raw = String(text || "").toLowerCase();
  const tokens = [];
  for (const match of raw.matchAll(/[A-Za-z0-9_]+|[\u4e00-\u9fff]+/g)) {
    const token = match[0].trim();
    if (!token) continue;
    if (!tokens.includes(token)) tokens.push(token);
    if (/^[\u4e00-\u9fff]+$/.test(token)) {
      for (const size of [2, 3, 4]) {
        if (token.length < size) continue;
        for (let index = 0; index <= token.length - size; index += 1) {
          const piece = token.slice(index, index + size);
          if (!tokens.includes(piece)) tokens.push(piece);
        }
      }
    }
  }
  return tokens
    .filter(token => token.length >= 2 && !["多少", "哪天", "什么", "应该", "需要", "这个", "一个"].includes(token))
    .sort((a, b) => b.length - a.length);
}

function splitEvidenceSentences(content) {
  return String(content || "")
    .replace(/\r\n/g, "\n")
    .split(/(?<=[。！？!?；;])\s*|\n+|(?:^|\n)\s*[-*]\s+/)
    .map(item => item.replace(/^[-*\s]+/, "").trim())
    .filter(Boolean);
}

function pickEvidenceSnippet(content, query) {
  const tokens = tokenizeQuery(query);
  const sentences = splitEvidenceSentences(content);
  if (!sentences.length) return String(content || "").slice(0, 180);
  if (!tokens.length) return sentences.slice(0, 2).join(" ");

  const ranked = sentences
    .map((sentence, index) => {
      const lowered = sentence.toLowerCase();
      const hits = tokens.filter(token => lowered.includes(token));
      const numberBoost = /\d/.test(sentence) && tokens.some(token => /扣费|续费|费用|金额|超过|提醒|宽带/.test(token)) ? 2 : 0;
      return { sentence, index, score: hits.length * 3 + numberBoost + Math.max(0, 2 - index * 0.05) };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = ranked.slice(0, 2).sort((a, b) => a.index - b.index).map(item => item.sentence);
  return (selected.length ? selected : sentences.slice(0, 2)).join(" ");
}

function HighlightedText({ text, query, terms }) {
  const sourceTerms = Array.isArray(terms) && terms.length ? terms : tokenizeQuery(query);
  const tokens = sourceTerms
    .map(term => String(term || "").trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .slice(0, 12);
  if (!tokens.length) return <>{text}</>;
  const parts = [];
  let cursor = 0;
  const escaped = tokens.map(token => token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  for (const match of String(text || "").matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) parts.push(String(text).slice(cursor, start));
    parts.push(<mark key={`${start}-${match[0]}`}>{match[0]}</mark>);
    cursor = start + match[0].length;
  }
  if (cursor < String(text || "").length) parts.push(String(text).slice(cursor));
  return <>{parts}</>;
}

function shouldShowQueryRewrite(queryPlan) {
  const original = String(queryPlan?.original_query || "").trim();
  const rewritten = String(queryPlan?.rewritten_query || "").trim();
  if (!original || !rewritten) return false;
  const normalize = value => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (normalize(original) === normalize(rewritten)) return false;
  const rewriteTerms = Array.isArray(queryPlan?.rewrite_terms) ? queryPlan.rewrite_terms : [];
  if (rewriteTerms.some(term => String(term || "").trim())) return true;
  const expanded = Array.isArray(queryPlan?.expanded_terms) ? queryPlan.expanded_terms : [];
  const originalTokens = new Set(tokenizeQuery(original));
  return expanded.some(term => {
    const token = String(term || "").trim().toLowerCase();
    return token && !originalTokens.has(token) && !normalize(original).includes(token);
  });
}

function can(user, role) {
  return (roles[user?.role || "viewer"] || 0) >= (roles[role] || 0);
}

function readLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(layoutKey) || "null");
    if (isUsableSavedLayout(saved)) return normalizeLayout(saved, DEFAULT_GRID_ROWS);
  } catch {
    // Ignore broken local layout and fall back to defaults.
  }
  return sanitizeLayout(buildDefaultLayout(DEFAULT_GRID_ROWS));
}

function isUsableSavedLayout(source) {
  if (!Array.isArray(source) || source.length !== REQUIRED_CARD_IDS.length) return false;
  const ids = source.map(item => item?.i);
  if (new Set(ids).size !== REQUIRED_CARD_IDS.length) return false;
  if (!REQUIRED_CARD_IDS.every(id => ids.includes(id))) return false;
  const bounded = boundLayoutToGrid(source, DEFAULT_GRID_ROWS);
  return !layoutHasOverlap(bounded);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeLayout(source, maxRows = DEFAULT_GRID_ROWS) {
  return (Array.isArray(source) ? source : buildDefaultLayout(maxRows)).map(item => {
    const minW = CARD_MIN_W;
    const minH = CARD_MIN_H;
    const w = clamp(Number(item.w || minW), minW, GRID_COLS);
    const h = clamp(Number(item.h || minH), minH, Math.max(minH, maxRows));
    const x = clamp(Number(item.x || 0), 0, Math.max(0, GRID_COLS - w));
    const y = clamp(Number(item.y || 0), 0, Math.max(0, maxRows - h));
    return { ...item, x, y, w, h, minW, minH, maxW: GRID_COLS, maxH: maxRows };
  });
}

function prepareLayoutForFit(source, maxRows = DEFAULT_GRID_ROWS) {
  return (Array.isArray(source) ? source : buildDefaultLayout(maxRows)).map((item, index) => {
    const minW = CARD_MIN_W;
    const minH = CARD_MIN_H;
    const w = clamp(Number(item.w || minW), minW, GRID_COLS);
    const h = clamp(Number(item.h || minH), minH, Math.max(minH, maxRows));
    const x = clamp(Number(item.x || 0), 0, Math.max(0, GRID_COLS - w));
    const y = Math.max(0, Number(item.y || 0));
    return { ...item, x, y, w, h, minW, minH, maxW: GRID_COLS, maxH: maxRows, _index: index };
  });
}

function horizontalOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x;
}

function fillLayoutToBounds(source, maxRows) {
  return source.map(item => {
    const nextBelowY = source.reduce((limit, other) => {
      if (other.i === item.i || !horizontalOverlap(item, other) || other.y < item.y + item.h) return limit;
      return Math.min(limit, other.y);
    }, maxRows);
    const targetH = Math.max(item.minH, nextBelowY - item.y);
    return { ...item, h: Math.max(item.h, targetH) };
  });
}

function boundLayoutToGrid(source, maxRows = DEFAULT_GRID_ROWS) {
  return prepareLayoutForFit(source, maxRows)
    .map(item => {
      const w = clamp(item.w, item.minW, GRID_COLS);
      const h = clamp(item.h, item.minH, Math.max(item.minH, maxRows));
      const x = clamp(item.x, 0, Math.max(0, GRID_COLS - w));
      const y = clamp(item.y, 0, Math.max(0, maxRows - h));
      return {
        ...item,
        x,
        y,
        w,
        h,
        maxW: GRID_COLS,
        maxH: maxRows,
      };
    })
    .sort((a, b) => a._index - b._index)
    .map(({ _index, ...item }) => item);
}

function normalizeLayout(source, maxRows = DEFAULT_GRID_ROWS, activeId = "") {
  const items = prepareLayoutForFit(source, maxRows);

  for (let pass = 0; pass < 8; pass += 1) {
    let overflow = Math.max(0, ...items.map(item => item.y + item.h - maxRows));
    if (!overflow) break;

    const shrinkables = [...items].sort((a, b) => {
      const activeA = a.i === activeId ? 1 : 0;
      const activeB = b.i === activeId ? 1 : 0;
      if (activeA !== activeB) return activeA - activeB;
      return (b.y + b.h) - (a.y + a.h);
    });

    for (const item of shrinkables) {
      if (!overflow) break;
      const room = item.h - item.minH;
      if (room <= 0) continue;
      const cut = Math.min(room, overflow);
      item.h -= cut;
      overflow -= cut;
    }

    if (overflow) {
      for (const item of [...items].sort((a, b) => (b.y + b.h) - (a.y + a.h))) {
        item.y = clamp(item.y, 0, Math.max(0, maxRows - item.h));
      }
    }
  }

  return fillLayoutToBounds(items, maxRows)
    .map(item => {
      const h = clamp(item.h, item.minH, Math.max(item.minH, maxRows));
      const y = clamp(item.y, 0, Math.max(0, maxRows - h));
      const x = clamp(item.x, 0, Math.max(0, GRID_COLS - item.w));
      return {
        ...item,
        x,
        y,
        h,
        maxW: GRID_COLS,
        maxH: maxRows,
      };
    })
    .sort((a, b) => a._index - b._index)
    .map(({ _index, ...item }) => item);
}

function getOverlapArea(a, b) {
  const width = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const height = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return width > 0 && height > 0 ? width * height : 0;
}

function layoutHasOverlap(source) {
  if (!Array.isArray(source)) return false;
  for (let outer = 0; outer < source.length; outer += 1) {
    for (let inner = outer + 1; inner < source.length; inner += 1) {
      if (getOverlapArea(source[outer], source[inner]) > 0) return true;
    }
  }
  return false;
}

function swapCardSlots(source, startLayout, activeId, targetId, maxRows) {
  const activeStart = startLayout.find(item => item.i === activeId);
  const targetStart = startLayout.find(item => item.i === targetId);
  if (!activeStart || !targetStart) return boundLayoutToGrid(source, maxRows);

  const swapped = startLayout.map(item => {
    if (item.i === activeId) {
      return { ...item, x: targetStart.x, y: targetStart.y, w: targetStart.w, h: targetStart.h };
    }
    if (item.i === targetId) {
      return { ...item, x: activeStart.x, y: activeStart.y, w: activeStart.w, h: activeStart.h };
    }
    return item;
  });
  return boundLayoutToGrid(swapped, maxRows);
}

function sameLayout(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((item, index) => {
    const other = b[index];
    return other && item.i === other.i && item.x === other.x && item.y === other.y && item.w === other.w && item.h === other.h;
  });
}

function toErrorMessage(error) {
  if (!error) return "请求失败";
  if (typeof error === "string") return error;
  if (error.name === "AbortError") return "请求超时，请稍后重试";
  return error.message || "请求失败";
}

function JsonBlock({ value }) {
  return <pre className="code-font react-json">{JSON.stringify(value || {}, null, 2)}</pre>;
}

function Field({ label, children }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

function Empty({ children }) {
  return <div className="trace-empty">{children || "暂无数据"}</div>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [security, setSecurity] = useState(null);
  const [overview, setOverview] = useState(null);
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);
  const [startedAssistantId, setStartedAssistantId] = useState("consult");
  const [assistantVersions, setAssistantVersions] = useState([]);
  const [assistantForm, setAssistantForm] = useState(emptyAssistant);
  const [channelSyncEnabled, setChannelSyncEnabled] = useState(true);
  const [targetChannel, setTargetChannel] = useState("weixin");
  const [sessionId, setSessionId] = useState(() => `web:${crypto.randomUUID()}`);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [pendingUploads, setPendingUploads] = useState([]);
  const [deferredUploads, setDeferredUploads] = useState([]);
  const [ragStatus, setRagStatus] = useState(null);
  const [knowledgeDocs, setKnowledgeDocs] = useState([]);
  const [knowledgeDetail, setKnowledgeDetail] = useState(null);
  const [knowledgeSearchResults, setKnowledgeSearchResults] = useState([]);
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState("");
  const [ragBusy, setRagBusy] = useState({ upload: false, deleteId: "", previewId: "", search: false });
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(defaultTaskForm());
  const [taskRuns, setTaskRuns] = useState([]);
  const [traces, setTraces] = useState([]);
  const [traceDetail, setTraceDetail] = useState(null);
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState(defaultUserForm());
  const [mcpDiagnostics, setMcpDiagnostics] = useState(null);
  const [layout, setLayout] = useState(readLayout);
  const [gridRows, setGridRows] = useState(DEFAULT_GRID_ROWS);
  const [gridPixelHeight, setGridPixelHeight] = useState(0);
  const [gridRowHeight, setGridRowHeight] = useState(DEFAULT_GRID_ROW_HEIGHT);
  const [layoutEdited, setLayoutEdited] = useState(() => Boolean(localStorage.getItem(layoutKey)));
  const dashboardRef = useRef(null);
  const activeLayoutItemRef = useRef("");
  const dragStartLayoutRef = useRef([]);
  const swappedPairRef = useRef("");
  const swappedLayoutRef = useRef([]);
  const ignoreNextLayoutChangeRef = useRef(false);
  const chatFileRef = useRef(null);
  const chatAbortRef = useRef(null);
  const knowledgeFileRef = useRef(null);
  const rowHeightPixels = useMemo(
    () => (gridRows * gridRowHeight) + ((gridRows - 1) * GRID_MARGIN[1]),
    [gridRows, gridRowHeight],
  );
  const gridHeight = Math.max(gridPixelHeight, rowHeightPixels);

  const api = useCallback(async (path, options = {}) => {
    const { timeoutMs = 0, ...requestOptions } = options;
    const headers = new Headers(requestOptions.headers || {});
    if (!(requestOptions.body instanceof FormData)) headers.set("Content-Type", "application/json");
    if (csrfToken && requestOptions.method && requestOptions.method !== "GET") headers.set("X-CSRF-Token", csrfToken);
    const controller = timeoutMs ? new AbortController() : null;
    const timeoutId = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;
    let response;
    try {
      response = await fetch(path, {
        credentials: "same-origin",
        ...requestOptions,
        headers,
        signal: controller?.signal || requestOptions.signal,
      });
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
    if (!response.ok) {
      let detail = response.statusText;
      try {
        const payload = await response.json();
        detail = payload.detail || detail;
      } catch {
        // Keep HTTP status text.
      }
      throw new Error(detail);
    }
    if (response.status === 204) return null;
    return response.json();
  }, [csrfToken]);

  const addMessage = useCallback((role, content, meta = "", media = [], usage = null, citations = []) => {
    setMessages(items => [
      ...items,
      { id: crypto.randomUUID(), role, content, meta, media, usage, citations, at: new Date().toISOString() },
    ]);
  }, []);

  const loadOverview = useCallback(async () => {
    const data = await api("/api/overview", { timeoutMs: 8000 });
    setOverview(data);
    setSecurity(data.security || null);
    setAssistants(data.assistants || []);
    if (!selectedAssistantId) {
      setStartedAssistantId(data.started_assistant_id || data.default_assistant_id || "consult");
    }
    const channels = Object.keys(data.channels || {});
    if (channels.includes("weixin")) setTargetChannel("weixin");
    else if (channels[0]) setTargetChannel(channels[0]);
    if (!selectedAssistantId) {
      const id = data.started_assistant_id || data.default_assistant_id || data.assistants?.[0]?.id || null;
      setSelectedAssistantId(id);
    }
    return data;
  }, [api, selectedAssistantId]);

  const loadPlatform = useCallback(async (user = currentUser) => {
    const [rag, docs, taskList, traceList] = await Promise.all([
      api("/api/rag/status", { timeoutMs: 8000 }).catch(() => null),
      api("/api/knowledge/documents", { timeoutMs: 8000 }).catch(() => []),
      api("/api/tasks", { timeoutMs: 8000 }).catch(() => []),
      api("/api/traces", { timeoutMs: 8000 }).catch(() => []),
    ]);
    setRagStatus(rag);
    setKnowledgeDocs(docs);
    setTasks(taskList);
    setTraces(traceList);
    if (can(user, "admin")) {
      setUsers(await api("/api/users", { timeoutMs: 8000 }).catch(() => []));
    }
  }, [api, currentUser]);

  const bootstrapSession = useCallback(async () => {
    setLoading(true);
    setAuthError("");
    try {
      const boot = await api("/api/auth/bootstrap-status", { suppressAuthOverlay: true }).catch(() => null);
      if (boot?.bootstrap_required) {
        setAuthMode("bootstrap");
        setCurrentUser(null);
        return;
      }
      const me = await api("/api/auth/me", { suppressAuthOverlay: true });
      setCurrentUser(me.user);
      setCsrfToken(me.csrf_token || "");
      setSecurity(me.security || null);
      setAuthMode("app");
      try {
        await loadOverview();
        await loadPlatform(me.user);
      } catch (error) {
        setAuthError(`控制台数据加载失败：${toErrorMessage(error)}`);
      }
    } catch {
      setCurrentUser(null);
      setAuthMode("login");
      setAuthError("请先登录控制台。");
    } finally {
      setLoading(false);
    }
  }, [api, loadOverview, loadPlatform]);

  useEffect(() => {
    bootstrapSession();
  }, []);

  useEffect(() => {
    if (authMode !== "app") return undefined;
    const target = dashboardRef.current;
    if (!target) return undefined;
    const measure = () => {
      const styles = window.getComputedStyle(target);
      const verticalPadding = parseFloat(styles.paddingTop || "0") + parseFloat(styles.paddingBottom || "0");
      const rect = target.getBoundingClientRect();
      const viewportAvailable = window.innerHeight - rect.top - verticalPadding - 12;
      const availableHeight = Math.max(520, viewportAvailable, target.clientHeight - verticalPadding);
      const rows = Math.max(
        DEFAULT_GRID_ROWS,
        Math.floor((availableHeight + GRID_MARGIN[1]) / (DEFAULT_GRID_ROW_HEIGHT + GRID_MARGIN[1])),
      );
      const fittedRowHeight = (availableHeight - ((rows - 1) * GRID_MARGIN[1])) / rows;
      setGridPixelHeight(availableHeight);
      setGridRowHeight(Math.max(38, fittedRowHeight));
      setGridRows(rows);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [authMode]);

  useEffect(() => {
    setLayout(current => {
      const next = layoutEdited ? normalizeLayout(current, gridRows) : sanitizeLayout(buildDefaultLayout(gridRows), gridRows);
      return sameLayout(current, next) ? current : next;
    });
  }, [gridRows, layoutEdited]);

  useEffect(() => {
    const assistant = assistants.find(item => item.id === selectedAssistantId);
    setAssistantForm(assistantToForm(assistant || null));
    if (assistant?.id && currentUser) {
      api(`/api/assistants/${encodeURIComponent(assistant.id)}/versions`)
        .then(setAssistantVersions)
        .catch(() => setAssistantVersions([]));
    } else {
      setAssistantVersions([]);
    }
  }, [api, assistants, currentUser, selectedAssistantId]);

  useEffect(() => {
    if (!currentUser) return undefined;
    const timer = window.setInterval(() => {
      api("/api/traces", { timeoutMs: 8000 }).then(setTraces).catch(() => {});
    }, 8000);
    return () => window.clearInterval(timer);
  }, [api, currentUser]);

  async function handleLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setAuthError("");
    try {
      const payload = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: String(form.get("username") || "").trim(),
          password: String(form.get("password") || ""),
        }),
      });
      setCurrentUser(payload.user);
      setCsrfToken(payload.csrf_token || "");
      setSecurity(payload.security || null);
      setAuthMode("app");
      try {
        await loadOverview();
        await loadPlatform(payload.user);
      } catch (error) {
        setAuthError(`控制台数据加载失败：${toErrorMessage(error)}`);
      }
    } catch (error) {
      setAuthError(toErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleBootstrap(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setAuthError("");
    try {
      const payload = await api("/api/auth/bootstrap", {
        method: "POST",
        body: JSON.stringify({
          username: String(form.get("username") || "").trim(),
          password: String(form.get("password") || ""),
        }),
      });
      setCurrentUser(payload.user);
      setCsrfToken(payload.csrf_token || "");
      setSecurity(payload.security || null);
      setAuthMode("app");
      try {
        await loadOverview();
        await loadPlatform(payload.user);
      } catch (error) {
        setAuthError(`控制台数据加载失败：${toErrorMessage(error)}`);
      }
    } catch (error) {
      setAuthError(toErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout network failures.
    }
    setCurrentUser(null);
    setCsrfToken("");
    setAuthMode("login");
  }

  function commitLayout(nextLayout, activeId = activeLayoutItemRef.current) {
    const bounded = normalizeLayout(nextLayout, gridRows, activeId);
    setLayout(current => (sameLayout(current, bounded) ? current : bounded));
    try {
      localStorage.setItem(layoutKey, JSON.stringify(bounded));
    } catch {
      // Ignore local storage failures.
    }
  }

  function onLayoutChange(nextLayout) {
    if (ignoreNextLayoutChangeRef.current) {
      ignoreNextLayoutChangeRef.current = false;
      return;
    }
    if (activeLayoutItemRef.current) return;
    commitLayout(nextLayout);
  }

function findSwapTarget(nextLayout, activeId, activeDragItem, event) {
  if (!activeId) return "";

  if (event && typeof event.clientX === "number" && typeof event.clientY === "number") {
    const candidates = [...document.querySelectorAll("[data-card-id]")]
      .filter(element => element.dataset.cardId && element.dataset.cardId !== activeId)
      .map(element => {
        const rect = element.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
        return { id: element.dataset.cardId, inside, distance };
      })
      .filter(item => item.inside)
      .sort((a, b) => a.distance - b.distance);
    if (candidates[0]?.id) {
      return candidates[0].id;
    }
  }

  const activeRect = activeDragItem || nextLayout.find(item => item.i === activeId);
  const startLayout = dragStartLayoutRef.current.length ? dragStartLayoutRef.current : nextLayout;
  if (activeRect) {
      let bestTarget = "";
      let bestArea = 0;
      for (const item of startLayout) {
        if (item.i === activeId) continue;
        const area = getOverlapArea(activeRect, item);
        if (area > bestArea) {
          bestArea = area;
          bestTarget = item.i;
        }
      }
      if (bestArea > 0) return bestTarget;
    }

    return "";
  }

  function swapImmediately(activeId, targetId) {
    if (!activeId || !targetId) return;

    const pairKey = `${activeId}->${targetId}`;
    if (swappedPairRef.current === pairKey) return;

    setLayout(current => {
      const startLayout = dragStartLayoutRef.current.length ? dragStartLayoutRef.current : current;
      const swapped = swapCardSlots(current, startLayout, activeId, targetId, gridRows);
      try {
        localStorage.setItem(layoutKey, JSON.stringify(swapped));
      } catch {
        // Ignore local storage failures.
      }
      swappedLayoutRef.current = swapped;
      dragStartLayoutRef.current = swapped;
      swappedPairRef.current = pairKey;
      ignoreNextLayoutChangeRef.current = true;
      return sameLayout(current, swapped) ? current : swapped;
    });
  }

  function markLayoutEdited(nextLayout, oldItem, newItem) {
    activeLayoutItemRef.current = newItem?.i || oldItem?.i || "";
    dragStartLayoutRef.current = sanitizeLayout(nextLayout || layout, gridRows);
    swappedPairRef.current = "";
    swappedLayoutRef.current = [];
    setLayoutEdited(true);
  }

  function onLayoutInteraction(nextLayout, oldItem, newItem, placeholder, event) {
    activeLayoutItemRef.current = newItem?.i || oldItem?.i || activeLayoutItemRef.current;
    const targetId = findSwapTarget(nextLayout, activeLayoutItemRef.current, placeholder || newItem, event);
    if (targetId) swapImmediately(activeLayoutItemRef.current, targetId);
  }

  function onLayoutInteractionStop(nextLayout, oldItem, newItem) {
    const activeId = newItem?.i || oldItem?.i || activeLayoutItemRef.current;
    const swappedDuringDrag = swappedLayoutRef.current.length > 0;
    const finalLayout = swappedDuringDrag
      ? swappedLayoutRef.current
      : (layoutHasOverlap(nextLayout) && dragStartLayoutRef.current.length ? dragStartLayoutRef.current : nextLayout);
    ignoreNextLayoutChangeRef.current = true;
    commitLayout(finalLayout, activeId);
    activeLayoutItemRef.current = "";
    dragStartLayoutRef.current = [];
    swappedPairRef.current = "";
    swappedLayoutRef.current = [];
  }

  async function saveAssistant(event) {
    event.preventDefault();
    try {
      const payload = formToAssistant(assistantForm);
      const exists = assistants.some(item => item.id === payload.id);
      const saved = await api(exists ? `/api/assistants/${encodeURIComponent(payload.id)}` : "/api/assistants", {
        method: exists ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      await loadOverview();
      setSelectedAssistantId(saved.id);
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }

  async function deleteAssistant() {
    if (!selectedAssistantId || !window.confirm(`确认删除助手 ${selectedAssistantId} 吗？`)) return;
    try {
      await api(`/api/assistants/${encodeURIComponent(selectedAssistantId)}`, { method: "DELETE" });
      setSelectedAssistantId(null);
      await loadOverview();
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }

  async function sendChat(event) {
    event.preventDefault();
    if (chatSending) return;
    const content = chatInput.trim();
    const currentUploads = [...pendingUploads];
    if (!content && !currentUploads.length) return;
    // AbortController 绑定本次 /api/chat；点击“暂停生成”时用它立刻中断前端等待。
    const controller = new AbortController();
    chatAbortRef.current = controller;
    setChatSending(true);
    addMessage("user", [content, currentUploads.length ? `上传文件：${currentUploads.map(item => item.name).join("，")}` : ""].filter(Boolean).join("\n"), "用户");
    setChatInput("");
    setPendingUploads([]);
    try {
      const result = await api("/api/chat", {
        method: "POST",
        signal: controller.signal,
        body: JSON.stringify({
          assistant_id: selectedAssistantId,
          content,
          session_id: sessionId,
          channel: "web",
          chat_id: "web",
          uploaded_paths: currentUploads.map(item => item.path),
          sync_enabled: can(currentUser, "admin") && channelSyncEnabled && !content.startsWith("/"),
          sync_channel: targetChannel,
        }),
      });
      if (result.assistant_id) {
        setSelectedAssistantId(result.assistant_id);
        setStartedAssistantId(result.assistant_id);
      }
      if (result.changed_binding && result.assistant_id) setStartedAssistantId(result.assistant_id);
      if (result.deferred) {
        setDeferredUploads(items => mergeUploads(items, currentUploads));
        await loadOverview();
        setTraces(await api("/api/traces").catch(() => []));
        return;
      }
      setDeferredUploads([]);
      const quotaText = result.quota?.daily_token_limit
        ? `\n\n今日配额：${fmtNum(result.quota.daily_token_usage)} / ${fmtNum(result.quota.daily_token_limit)} tokens`
        : "";
      addMessage("assistant", `${result.content || ""}${quotaText}`.trim(), `${result.assistant_name || "助手"} · ${result.assistant_id || ""}`, result.media || [], result.usage || null, result.citations || []);
      if (result.channel_sync?.status === "sent") {
        addMessage("assistant", `已同步发送到 ${chLabel(result.channel_sync.channel)} 绑定账号`, "渠道发送");
      } else if (result.channel_sync?.status === "error") {
        addMessage("assistant", result.channel_sync.message || "渠道同步发送失败", "渠道发送失败");
      }
      await loadOverview();
      setTraces(await api("/api/traces").catch(() => []));
    } catch (error) {
      if (error.name === "AbortError") {
        addMessage("assistant", "已暂停本次生成。", "系统");
      } else {
        addMessage("assistant", toErrorMessage(error), "系统错误");
      }
    } finally {
      if (chatAbortRef.current === controller) chatAbortRef.current = null;
      setChatSending(false);
    }
  }

  async function stopChatGeneration() {
    const controller = chatAbortRef.current;
    if (!controller) return;
    // 双保险：先 abort 当前 fetch，再请求后端取消 active_chat_tasks 中的生成 task。
    controller.abort();
    try {
      await api("/api/chat/stop", {
        method: "POST",
        timeoutMs: 3000,
        body: JSON.stringify({
          session_id: sessionId,
          channel: "web",
        }),
      });
    } catch {
      // The local abort already stopped the UI wait; ignore stop endpoint races.
    }
  }

  async function uploadChatFiles(files) {
    if (!files.length) return;
    const data = new FormData();
    data.append("session_id", sessionId);
    files.forEach(file => data.append("files", file));
    try {
      const payload = await api("/api/uploads", { method: "POST", body: data });
      setPendingUploads(items => [...items, ...(payload.files || [])]);
    } catch (error) {
      addMessage("assistant", toErrorMessage(error), "上传失败");
    }
  }

  async function uploadKnowledge(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const files = Array.from(knowledgeFileRef.current?.files || []);
    if (!files.length) {
      window.alert("请先选择至少一个知识库文件。");
      return;
    }
    const data = new FormData();
    data.append("title", String(form.get("title") || "").trim());
    data.append("assistant_scope", String(form.get("assistant_scope") || "").trim());
    files.forEach(file => data.append("files", file));
    setRagBusy(state => ({ ...state, upload: true }));
    try {
      await api("/api/knowledge/upload", { method: "POST", body: data });
      formElement.reset();
      if (knowledgeFileRef.current) knowledgeFileRef.current.value = "";
      await loadOverview();
      setRagStatus(await api("/api/rag/status").catch(() => null));
      setKnowledgeDocs(await api("/api/knowledge/documents").catch(() => []));
    } catch (error) {
      window.alert(toErrorMessage(error));
    } finally {
      setRagBusy(state => ({ ...state, upload: false }));
    }
  }

  async function searchKnowledge(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query = String(form.get("query") || "").trim();
    if (!query) return;
    setKnowledgeSearchQuery(query);
    setRagBusy(state => ({ ...state, search: true }));
    try {
      const payload = await api("/api/knowledge/search", {
        method: "POST",
        body: JSON.stringify({ query, assistant_id: "", limit: 6 }),
      });
      setKnowledgeSearchResults(payload.items || []);
    } catch (error) {
      window.alert(toErrorMessage(error));
    } finally {
      setRagBusy(state => ({ ...state, search: false }));
    }
  }

  async function saveTask(event) {
    event.preventDefault();
    try {
      await api("/api/tasks", { method: "POST", body: JSON.stringify(taskFormPayload(taskForm, selectedAssistantId)) });
      setTaskForm(defaultTaskForm());
      setTasks(await api("/api/tasks").catch(() => []));
      await loadOverview();
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }

  async function runTask(taskId) {
    try {
      const result = await api(`/api/tasks/${encodeURIComponent(taskId)}/run`, { method: "POST" });
      addMessage("assistant", result.content || result.skip_reason || "任务执行完成", `任务中心 · ${result.assistant_id || ""}`, result.media || []);
      setTasks(await api("/api/tasks").catch(() => []));
      setTraces(await api("/api/traces").catch(() => []));
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }

  async function saveUser(event) {
    event.preventDefault();
    try {
      await api("/api/users", { method: "POST", body: JSON.stringify({ ...userForm, password: userForm.password || null }) });
      setUserForm(defaultUserForm());
      setUsers(await api("/api/users").catch(() => []));
    } catch (error) {
      window.alert(toErrorMessage(error));
    }
  }

  if (authMode !== "app") {
    return (
      <AuthScreen
        mode={authMode}
        loading={loading}
        error={authError}
        onLogin={handleLogin}
        onBootstrap={handleBootstrap}
      />
    );
  }

  return (
    <div className="react-console">
      {security?.dev_mode ? <div className="dev-banner"><strong>开发模式</strong><span> 当前控制台运行在非生产模式。</span></div> : null}
      {authError ? <div className="dev-banner warning"><strong>提示</strong><span> {authError}</span></div> : null}
      <Topbar
        currentUser={currentUser}
        defaultAssistant={overview?.default_assistant_id}
        sessionId={sessionId}
        onRefresh={async () => {
          try {
            setAuthError("");
            await loadOverview();
            await loadPlatform();
          } catch (error) {
            setAuthError(`刷新失败：${toErrorMessage(error)}`);
          }
        }}
        onLogout={logout}
      />
      <main className="react-dashboard" ref={dashboardRef}>
        <ResponsiveGrid
          className="layout"
          layout={layout}
          cols={GRID_COLS}
          rowHeight={gridRowHeight}
          margin={GRID_MARGIN}
          containerPadding={[0, 0]}
          draggableHandle=".drag-handle"
          draggableCancel=".react-resizable-handle,button,input,textarea,select,label,a,.ops-content,.assistant-card,.chat-actions,.panel-actions"
          isDraggable
          isResizable
          isBounded
          maxRows={gridRows}
          autoSize={false}
          style={{ height: gridHeight }}
          resizeHandles={["n", "e", "s", "w"]}
          compactType={null}
          preventCollision
          allowOverlap={false}
          onLayoutChange={onLayoutChange}
          onDrag={onLayoutInteraction}
          onDragStop={onLayoutInteractionStop}
          onResizeStop={onLayoutInteractionStop}
          onDragStart={markLayoutEdited}
          onResizeStart={markLayoutEdited}
        >
          <Card key="assistants" cardId="assistants">
            <AssistantsCard
              assistants={assistants}
              selectedId={selectedAssistantId}
              startedId={startedAssistantId}
              onSelect={id => {
                setSelectedAssistantId(id);
                setStartedAssistantId(id);
              }}
              onNew={() => {
                setSelectedAssistantId(null);
                setAssistantForm(emptyAssistant);
              }}
              onStart={id => {
                setStartedAssistantId(id);
                setSelectedAssistantId(id);
              }}
            />
          </Card>
          <Card key="chat" cardId="chat">
            <ChatCard
              assistant={assistants.find(item => item.id === selectedAssistantId)}
              messages={messages}
              input={chatInput}
              setInput={setChatInput}
              onSubmit={sendChat}
              onStop={stopChatGeneration}
              isSending={chatSending}
              onUpload={uploadChatFiles}
              fileRef={chatFileRef}
              pendingUploads={pendingUploads}
              setPendingUploads={setPendingUploads}
              deferredUploads={deferredUploads}
              channelSyncEnabled={channelSyncEnabled}
              setChannelSyncEnabled={setChannelSyncEnabled}
              targetChannel={targetChannel}
              setTargetChannel={setTargetChannel}
              channels={Object.keys(overview?.channels || {})}
              canSync={can(currentUser, "admin")}
              onClear={() => {
                setMessages([]);
                setSessionId(`web:${crypto.randomUUID()}`);
                setPendingUploads([]);
                setDeferredUploads([]);
              }}
            />
          </Card>
          <Card key="inspector" cardId="inspector">
            <InspectorCard
              form={assistantForm}
              setForm={setAssistantForm}
              versions={assistantVersions}
              onSubmit={saveAssistant}
              onReset={() => setAssistantForm(assistantToForm(assistants.find(item => item.id === selectedAssistantId) || null))}
              onDelete={deleteAssistant}
              canAdmin={can(currentUser, "admin")}
              onMcpCheck={async mode => {
                try {
                  const payload = await api(`/api/mcp/${mode}`, {
                    method: "POST",
                    body: JSON.stringify({ mcp_servers: safeJson(assistantForm.mcp_servers_text, {}) }),
                  });
                  setMcpDiagnostics(payload);
                } catch (error) {
                  setMcpDiagnostics({ servers: [{ name: "MCP", valid: false, issues: [toErrorMessage(error)], warnings: [] }] });
                }
              }}
              mcpDiagnostics={mcpDiagnostics}
            />
          </Card>
          <Card key="status" cardId="status">
            <StatusCard overview={overview} ragStatus={ragStatus} security={security} />
          </Card>
          <Card key="rag" cardId="rag">
            <RagCard
              status={ragStatus}
              docs={knowledgeDocs}
              detail={knowledgeDetail}
              results={knowledgeSearchResults}
              searchQuery={knowledgeSearchQuery}
              busy={ragBusy}
              onUpload={uploadKnowledge}
              onSearch={searchKnowledge}
              fileRef={knowledgeFileRef}
              onOpen={async id => {
                setRagBusy(state => ({ ...state, previewId: id || "" }));
                try {
                  if (!id) throw new Error("知识文档 ID 为空，请刷新后重试");
                  setKnowledgeDetail(await api(`/api/knowledge/documents/${encodeURIComponent(id)}`));
                } catch (error) {
                  setKnowledgeDocs(await api("/api/knowledge/documents").catch(() => []));
                  setRagStatus(await api("/api/rag/status").catch(() => null));
                  setKnowledgeDetail(null);
                  window.alert(`${toErrorMessage(error)}。已刷新知识文档列表。`);
                } finally {
                  setRagBusy(state => ({ ...state, previewId: "" }));
                }
              }}
              onDelete={async id => {
                setRagBusy(state => ({ ...state, deleteId: id || "" }));
                try {
                  if (!id) throw new Error("知识文档 ID 为空，请刷新后重试");
                  if (!window.confirm("确认删除这份知识文档吗？")) return;
                  await api(`/api/knowledge/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
                } catch (error) {
                  if (!String(toErrorMessage(error)).includes("not found")) {
                    window.alert(toErrorMessage(error));
                  }
                } finally {
                  setKnowledgeDocs(await api("/api/knowledge/documents").catch(() => []));
                  setRagStatus(await api("/api/rag/status").catch(() => null));
                  setKnowledgeDetail(null);
                  setRagBusy(state => ({ ...state, deleteId: "" }));
                }
              }}
              canAdmin={can(currentUser, "admin")}
              security={security}
            />
          </Card>
          <Card key="task" cardId="task">
            <TaskCard
              tasks={tasks}
              runs={taskRuns}
              form={taskForm}
              setForm={setTaskForm}
              onSubmit={saveTask}
              onReset={() => setTaskForm(defaultTaskForm())}
              onEdit={setTaskFormFromTask(setTaskForm)}
              onRun={runTask}
              onRuns={async id => setTaskRuns(await api(`/api/tasks/${encodeURIComponent(id)}/runs`).catch(() => []))}
              onDelete={async id => {
                if (!window.confirm("确认删除这个任务吗？")) return;
                await api(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
                setTasks(await api("/api/tasks").catch(() => []));
              }}
              canAdmin={can(currentUser, "admin")}
            />
          </Card>
          <Card key="trace" cardId="trace">
            <TraceCard
              traces={traces}
              detail={traceDetail}
              onOpen={async id => setTraceDetail(await api(`/api/traces/${encodeURIComponent(id)}`))}
            />
          </Card>
          <Card key="users" cardId="users">
            <UsersCard
              users={users}
              form={userForm}
              setForm={setUserForm}
              onSubmit={saveUser}
              onReset={() => setUserForm(defaultUserForm())}
              onEdit={user => setUserForm({ id: user.id, username: user.username, password: "", role: user.role || "viewer", enabled: user.enabled !== false })}
              onDelete={async id => {
                if (!window.confirm("确认删除这个账号吗？")) return;
                await api(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" });
                setUsers(await api("/api/users").catch(() => []));
              }}
              canAdmin={can(currentUser, "admin")}
            />
          </Card>
        </ResponsiveGrid>
      </main>
      {loading ? <div className="overlay active"><div className="spinner" /><div>正在加载控制台...</div></div> : null}
    </div>
  );
}

function AuthScreen({ mode, loading, error, onLogin, onBootstrap }) {
  const isBootstrap = mode === "bootstrap";
  return (
    <div className="overlay active">
      <div className={`auth-card ${loading ? "loading-mode" : ""}`}>
        {loading ? (
          <>
            <div className="spinner" />
            <div>正在加载控制台...</div>
          </>
        ) : (
          <form id={isBootstrap ? "bootstrapForm" : "loginForm"} onSubmit={isBootstrap ? onBootstrap : onLogin}>
            <h2>{isBootstrap ? "初始化管理员" : "欢迎登录 nanobot个人生活账号助手"}</h2>
            <div className="form-group">
              <label>用户名</label>
              <input name="username" type="text" required />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input name="password" type="password" required />
            </div>
            {error ? <div className="error-msg">{error}</div> : null}
            <button type="submit" className="btn-primary">{isBootstrap ? "初始化系统" : "登录"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Topbar({ currentUser, defaultAssistant, sessionId, onRefresh, onLogout }) {
  return (
    <header className="workspace-topbar">
      <div className="topbar-brand">
        <span className="logo">nanobot个人生活账号助手</span>
        <span className="separator">/</span>
        <span className="title">生活账号控制台</span>
      </div>
      <div className="topbar-status">
        <span className="status-pill">默认助手 {defaultAssistant || "-"}</span>
        <span className="status-pill">Session {sessionId}</span>
        <span className="status-pill">React Dashboard</span>
        <button className="btn-icon" type="button" onClick={onRefresh}>刷新</button>
      </div>
      <div className="topbar-user">
        <span className="role-badge">{currentUser?.role || "viewer"}</span>
        <span className="user-avatar">{currentUser?.username || "User"}</span>
        <button className="btn-text" type="button" onClick={onLogout}>退出</button>
      </div>
    </header>
  );
}

const Card = React.forwardRef(function Card(
  { children, className = "", cardId = "", style, ...props },
  ref,
) {
  return (
    <div ref={ref} className={`grid-card-wrap ${className}`.trim()} data-card-id={cardId} style={style} {...props}>
      {children}
    </div>
  );
});

function AssistantsCard({ assistants, selectedId, startedId, onSelect, onNew, onStart }) {
  const ordered = useMemo(() => [...assistants].sort((a, b) => (a.id === "consult" ? -1 : b.id === "consult" ? 1 : 0)), [assistants]);
  return (
    <aside className="panel-column left-column">
      <div className="panel-header drag-handle">
        <h3>助手集群</h3>
        <div className="panel-actions"><button className="btn-icon" type="button" onClick={onNew}>+</button></div>
      </div>
      <div className="assistant-list">
        {ordered.length ? ordered.map((assistant, index) => (
          <article
            className={`assistant-card ${assistant.id === selectedId ? "active" : ""}`}
            key={assistant.id}
            onClick={() => onSelect(assistant.id)}
          >
            <div className="assistant-row-main">
              <div className="assistant-row-top">
                <span className="assistant-row-index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{assistant.name}</strong>
              </div>
              <div className="assistant-row-meta">
                <span className="status-pill">{assistant.id}</span>
                <span className={`status-pill ${assistant.enabled ? "enabled" : "disabled"}`}>{assistant.enabled ? "READY" : "DISABLED"}</span>
              </div>
            </div>
            <button
              className={`assistant-toggle ${assistant.id === startedId ? "assistant-toggle-stop" : "assistant-toggle-start"}`}
              type="button"
              onClick={event => {
                event.stopPropagation();
                onStart(assistant.id);
              }}
            >
              {assistant.id === startedId ? "终止" : "启用"}
            </button>
          </article>
        )) : <Empty>暂无助手</Empty>}
      </div>
    </aside>
  );
}

function ChatCard(props) {
  const {
    assistant, messages, input, setInput, onSubmit, onStop, isSending, onUpload, fileRef,
    pendingUploads, setPendingUploads, deferredUploads, channelSyncEnabled,
    setChannelSyncEnabled, targetChannel, setTargetChannel, channels,
    canSync, onClear,
  } = props;
  const channelOptions = channels.length ? channels : ["weixin", "qq"];
  const recognitionRef = useRef(null);
  const speechBaseTextRef = useRef("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechListening, setSpeechListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("");

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechSupported(false);
      setSpeechStatus("当前浏览器不支持语音识别");
      return undefined;
    }

    const recognition = new Recognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    setSpeechSupported(true);
    setSpeechStatus("语音待命");

    recognition.onstart = () => {
      setSpeechListening(true);
      setSpeechStatus("语音识别中");
    };
    recognition.onresult = event => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      setInput([speechBaseTextRef.current.trim(), transcript.trim()].filter(Boolean).join("\n"));
    };
    recognition.onerror = () => {
      setSpeechStatus("语音识别失败，请检查麦克风权限");
    };
    recognition.onend = () => {
      setSpeechListening(false);
      setSpeechStatus("语音待命");
    };

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }
    };
  }, [setInput]);

  function toggleSpeechRecognition() {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      if (speechListening) {
        recognition.stop();
      } else {
        speechBaseTextRef.current = input;
        recognition.start();
      }
    } catch {
      setSpeechStatus("语音识别启动失败，请稍后重试");
    }
  }

  return (
    <section className="panel-column middle-column">
      <div className="chat-header drag-handle">
        <div className="chat-title"><span className="badge">{assistant ? `${assistant.name} · ${assistant.id}` : "当前助手"}</span></div>
        <div className="chat-actions">
          <span className="sync-status">
            <select value={targetChannel} onChange={event => setTargetChannel(event.target.value)} aria-label="同步发送渠道">
              {channelOptions.map(item => <option value={item} key={item}>{chLabel(item)}</option>)}
            </select>
            <span>{channelSyncEnabled ? "当前启用" : "当前停用"}</span>
          </span>
          <button className={`assistant-toggle ${channelSyncEnabled ? "assistant-toggle-stop" : "assistant-toggle-start"}`} type="button" disabled={!canSync} onClick={() => setChannelSyncEnabled(!channelSyncEnabled)}>
            {channelSyncEnabled ? "终止" : "启用"}
          </button>
          <button className="btn-text" type="button" onClick={() => {
            if (isSending) onStop();
            onClear();
          }}>清空对话</button>
        </div>
      </div>
      <div className="chat-log">
        {messages.length ? messages.map(message => <Message key={message.id} message={message} />) : <div className="message assistant"><span className="meta">系统</span><div className="message-content">控制台已就绪。</div></div>}
      </div>
      <UploadChips pendingUploads={pendingUploads} setPendingUploads={setPendingUploads} deferredUploads={deferredUploads} />
      <form className="chat-form" onSubmit={onSubmit}>
        <div className="input-wrapper">
          <label className="btn-icon" title="上传文件">
            附件
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={event => {
                onUpload(Array.from(event.target.files || []));
                event.target.value = "";
              }}
            />
          </label>
          <textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (!isSending) event.currentTarget.form?.requestSubmit();
            }
          }} placeholder="输入消息... (Enter 发送，Shift+Enter 换行)" />
          <button
            className={`btn-icon voice-btn ${speechListening ? "active" : ""}`}
            type="button"
            disabled={!speechSupported}
            title={speechSupported ? "语音识别" : "当前浏览器不支持语音识别"}
            onClick={toggleSpeechRecognition}
          >
            {speechListening ? "停止识别" : "语音识别"}
          </button>
          {isSending ? (
            <button className="btn-icon chat-stop-btn" type="button" onClick={onStop}>暂停生成</button>
          ) : (
            <button className="btn-icon" type="submit">发送</button>
          )}
        </div>
        {isSending ? <div className="speech-status active">正在生成回复，可以点击“暂停生成”终止本次请求。</div> : null}
        {speechStatus ? <div className={`speech-status ${speechListening ? "active" : ""}`}>{speechStatus}</div> : null}
      </form>
    </section>
  );
}

function Message({ message }) {
  return (
    <div className={`message ${message.role === "user" ? "user" : "assistant"}`}>
      <span className="meta">{message.meta || (message.role === "user" ? "用户" : "助手")}</span>
      <div className="message-content">{message.content}</div>
      {message.usage ? <div className="message-usage">输入 {fmtNum(message.usage.prompt_tokens)} · 输出 {fmtNum(message.usage.completion_tokens)} · 总计 {fmtNum(message.usage.total_tokens)} tokens</div> : null}
      {message.citations?.length ? (
        <div className="message-citations">
          {message.citations.map((item, index) => (
            <div className="message-citation-card" key={`${item.chunk_id || item.document_id || index}`}>
              <strong>{item.title || item.filename || item.document_id || "知识来源"}</strong>
              <div className="message-citation-meta">{(item.retrieval || []).join(" + ") || "vector"} · {Number(item.score || 0).toFixed(3)}</div>
            </div>
          ))}
        </div>
      ) : null}
      {message.media?.length ? (
        <div className="message-media-grid">
          {message.media.map((src, index) => <div className="message-media-card" key={src || index}><img src={src} alt="" /></div>)}
        </div>
      ) : null}
    </div>
  );
}

function UploadChips({ pendingUploads, deferredUploads, setPendingUploads }) {
  const groups = [];
  if (deferredUploads.length) groups.push({ title: "已暂存附件，等待文字指令", items: deferredUploads, deferred: true });
  if (pendingUploads.length) groups.push({ title: "本轮待发送附件", items: pendingUploads, deferred: false });
  if (!groups.length) return null;
  return (
    <div className="upload-list has-items">
      {groups.map(group => (
        <div className="upload-group" key={group.title}>
          <div className="upload-group-title">{group.title}</div>
          <div className="upload-group-list">
            {group.items.map(file => (
              <div className={`upload-chip ${group.deferred ? "upload-chip-deferred" : ""}`} key={file.path}>
                <span className="upload-chip-name">{file.name}</span>
                {group.deferred ? <span className="upload-chip-state">待命中</span> : <button className="upload-chip-remove" type="button" onClick={() => setPendingUploads(items => items.filter(item => item.path !== file.path))}>移除</button>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InspectorCard({ form, setForm, versions, onSubmit, onReset, onDelete, canAdmin, onMcpCheck, mcpDiagnostics }) {
  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  return (
    <aside className="panel-column right-column">
      <div className="panel-header drag-handle"><h3>Inspector 配置</h3></div>
      <div className="config-body expanded">
        <div className="config-mode-indicator">编辑模式</div>
        <form className="inspector-form" onSubmit={onSubmit}>
          <div className="form-section">
            <h4>基础信息</h4>
            <Field label="ID"><input value={form.id} onChange={e => set("id", e.target.value)} required /></Field>
            <Field label="名称"><input value={form.name} onChange={e => set("name", e.target.value)} required /></Field>
            <Field label="描述"><textarea value={form.description} onChange={e => set("description", e.target.value)} /></Field>
            <Field label="系统设定"><textarea className="code-font" value={form.persona_prompt} onChange={e => set("persona_prompt", e.target.value)} /></Field>
            <div className="form-group checkbox"><input type="checkbox" checked={form.enabled} onChange={e => set("enabled", e.target.checked)} /><label>启用该助手</label></div>
          </div>
          <div className="form-section">
            <h4>模型参数</h4>
            <div className="form-group-row">
              <Field label="提供商"><input value={form.provider} onChange={e => set("provider", e.target.value)} /></Field>
              <Field label="模型"><input value={form.model} onChange={e => set("model", e.target.value)} /></Field>
            </div>
            <div className="form-group-row">
              <Field label="Temperature"><input type="number" step="0.1" value={form.temperature} onChange={e => set("temperature", e.target.value)} /></Field>
              <Field label="Max Tokens"><input type="number" value={form.max_tokens} onChange={e => set("max_tokens", e.target.value)} /></Field>
            </div>
            <Field label="每日 Token 限制"><input type="number" value={form.daily_token_limit} onChange={e => set("daily_token_limit", e.target.value)} /></Field>
          </div>
          <div className="form-section">
            <h4>生图配置</h4>
            <div className="form-group-row">
              <Field label="提供商"><input value={form.image_provider} onChange={e => set("image_provider", e.target.value)} /></Field>
              <Field label="模型"><input value={form.image_model} onChange={e => set("image_model", e.target.value)} /></Field>
            </div>
          </div>
          <div className="form-section">
            <h4>工具与能力</h4>
            <Field label="工具集"><input value={form.tool_names_text} onChange={e => set("tool_names_text", e.target.value)} /></Field>
            <Field label="已启用 Skills"><input value={form.enabled_skills_text} onChange={e => set("enabled_skills_text", e.target.value)} /></Field>
            <Field label="已禁用 Skills"><input value={form.disabled_skills_text} onChange={e => set("disabled_skills_text", e.target.value)} /></Field>
            <div className="form-group-row">
              <Field label="最大迭代次数"><input type="number" value={form.max_tool_iterations} onChange={e => set("max_tool_iterations", e.target.value)} /></Field>
              <Field label="最大结果字符"><input type="number" value={form.max_tool_result_chars} onChange={e => set("max_tool_result_chars", e.target.value)} /></Field>
            </div>
          </div>
          <div className="form-section">
            <h4>路由机制</h4>
            <Field label="别名"><input value={form.aliases_text} onChange={e => set("aliases_text", e.target.value)} /></Field>
            <Field label="关键词"><input value={form.keywords_text} onChange={e => set("keywords_text", e.target.value)} /></Field>
          </div>
          <div className="form-section">
            <h4>MCP</h4>
            <textarea className="code-font" rows="6" value={form.mcp_servers_text} onChange={e => set("mcp_servers_text", e.target.value)} />
            <div className="mcp-actions">
              <button className="btn-xs" type="button" onClick={() => set("mcp_servers_text", JSON.stringify(filesystemMcpTemplate(), null, 2))}>FS 模板</button>
              <button className="btn-xs" type="button" onClick={() => onMcpCheck("validate")} disabled={!canAdmin}>校验</button>
              <button className="btn-xs" type="button" onClick={() => onMcpCheck("probe")} disabled={!canAdmin}>探测</button>
            </div>
            {mcpDiagnostics ? <McpDiagnostics payload={mcpDiagnostics} /> : null}
          </div>
          <div className="form-section">
            <h4>版本控制</h4>
            <Field label="变更日志"><input value={form.prompt_change_note} onChange={e => set("prompt_change_note", e.target.value)} /></Field>
            <div className="version-list">
              {versions.length ? versions.slice(0, 5).map(item => <div className="trace-block" key={item.version}><strong>v{item.version}</strong><p>{fmtTime(item.changed_at)} · {item.change_note || "未填写变更说明"}</p></div>) : <Empty>选择助手后可查看 Prompt 版本历史。</Empty>}
            </div>
          </div>
          <div className="form-actions bottom-sticky">
            <button className="btn-primary full-width" type="submit" disabled={!canAdmin}>保存配置</button>
            <button className="btn-secondary full-width" type="button" onClick={onReset}>重置</button>
            <button className="btn-danger full-width" type="button" onClick={onDelete} disabled={!canAdmin}>删除助手</button>
          </div>
        </form>
      </div>
    </aside>
  );
}

function McpDiagnostics({ payload }) {
  const items = payload.servers || [];
  return (
    <div className="status-item code-font mcp-box">
      {items.length ? items.map(item => (
        <div className="trace-block" key={item.name}>
          <div className="ops-line"><strong>{item.name}</strong><span className={`status-pill ${item.valid && (!("reachable" in item) || item.reachable) ? "enabled" : "disabled"}`}>{item.valid ? ("reachable" in item ? (item.reachable ? "可达" : "不可达") : "已校验") : "无效配置"}</span></div>
          <p>Transport：{item.transport || "-"} · Timeout：{item.tool_timeout || 0}s</p>
          {item.issues?.length ? <p className="danger-text">{item.issues.join("；")}</p> : null}
          {item.warnings?.length ? <p>{item.warnings.join("；")}</p> : null}
        </div>
      )) : <Empty>当前没有 MCP server 配置。</Empty>}
    </div>
  );
}

function StatusCard({ overview, ragStatus, security }) {
  const channels = overview?.channels || {};
  const skills = overview?.skills || [];
  const mcp = overview?.mcp_servers || [];
  return (
    <div className="ops-card">
      <h4 className="drag-handle">系统与插件状态</h4>
      <div className="ops-content">
        <div className="status-section-label"><strong>渠道状态</strong><span>当前已配置并运行的外部消息入口</span></div>
        <div className="status-item">
          {Object.keys(channels).length ? Object.entries(channels).map(([name, item]) => <p key={name}><strong>{chLabel(name)}</strong> 启用：{item.enabled ? "是" : "否"} · 运行中：{item.running ? "是" : "否"}</p>) : <p>暂无渠道状态</p>}
        </div>
        <div className="status-section-label"><strong>RAG</strong><span>Milvus 与知识库状态</span></div>
        <div className="status-item">
          {ragStatus ? <p><strong>{String(ragStatus.backend || "rag").toUpperCase()} · {ragStatus.connected ? "已连接" : "未连接"}</strong><br />Collection：{ragStatus.collection_name || "-"}<br />文档 {ragStatus.knowledge_docs || 0} · Chunk {ragStatus.knowledge_chunks || 0}</p> : <p>正在读取 RAG 状态...</p>}
        </div>
        <div className="status-section-label"><strong>Skills</strong><span>本地技能包</span></div>
        <div className="status-item">{skills.length ? skills.slice(0, 16).map(item => <span className="status-pill" key={item.name || item}>{item.name || item}</span>) : "暂无 Skills"}</div>
        <div className="status-section-label"><strong>MCP</strong><span>外部工具服务</span></div>
        <div className="status-item code-font mcp-box">{mcp.length ? mcp.map(item => <p key={item.name}><strong>{item.name}</strong> · {item.transport} · {item.valid ? "有效" : "无效"}</p>) : "暂无 MCP server"}</div>
        <div className="status-section-label"><strong>上传限制</strong></div>
        <div className="status-item">单文件 {security?.upload_max_file_mb || 10} MB · 总计 {security?.upload_max_total_mb || 30} MB</div>
      </div>
    </div>
  );
}

function RagCard({ status, docs, detail, results, searchQuery, busy, onUpload, onSearch, fileRef, onOpen, onDelete, canAdmin, security }) {
  const isUploading = Boolean(busy?.upload);
  const isSearching = Boolean(busy?.search);
  const deletingId = busy?.deleteId || "";
  const previewId = busy?.previewId || "";
  return (
    <div className="ops-card rag-card">
      <h4 className="drag-handle">RAG 知识库 <span className="badge">单文件 {security?.upload_max_file_mb || 10} MB</span></h4>
      <div className="ops-content flex-split">
        <div className="rag-forms">
          <div id="ragStatus" className="status-indicator">
            {status ? <div className="status-item"><strong>{String(status.backend || "rag").toUpperCase()} · {status.connected ? "已连接" : "未连接"}</strong><p>Collection：{status.collection_name || "-"}<br />Embedding：{status.embedding_model || "-"} · 维度 {status.vector_dimension || 0}<br />文档 {status.knowledge_docs || 0} · Chunk {status.knowledge_chunks || 0}</p>{status.last_error ? <p className="danger-text">{status.last_error}</p> : null}</div> : <Empty>正在读取 Milvus RAG 状态...</Empty>}
          </div>
          <form onSubmit={onUpload}>
            <input name="title" type="text" placeholder="文档标题" />
            <input name="assistant_scope" type="text" placeholder="限定助手 (可选)" />
            <input ref={fileRef} type="file" multiple disabled={isUploading} />
            <button className="btn-secondary btn-sm" type="submit" disabled={!canAdmin || isUploading}>{isUploading ? "上传中..." : "上传知识"}</button>
            {isUploading ? <div className="inline-status">正在抽取文本、切分 chunk 并写入 Milvus...</div> : null}
          </form>
          <form onSubmit={onSearch}>
            <input name="query" type="text" placeholder="检索内容" disabled={isSearching} />
            <button className="btn-secondary btn-sm" type="submit" disabled={isSearching}>{isSearching ? "检索中..." : "检索"}</button>
          </form>
          <div className="list-container">
            {isSearching ? <Empty>正在执行 query 改写、Hybrid 召回和 rerank...</Empty> : (results.length ? results.map(item => {
              const evidence = Array.isArray(item.evidence_sentences) && item.evidence_sentences.length
                ? item.evidence_sentences
                : [pickEvidenceSnippet(item.content, searchQuery)];
              const terms = Array.isArray(item.matched_terms) ? item.matched_terms : [];
              const citation = item.citation || {};
              const queryPlan = item.query_plan || {};
              return (
                <div className="trace-block" key={item.chunk_id}>
                  <strong>{item.title || item.filename}</strong>
                  <p>
                    {(item.retrieval || []).join(" + ") || "vector"}
                    {" · "}综合 {Number(item.score || 0).toFixed(3)}
                    {" · "}rerank {Number(item.rerank_score || 0).toFixed(3)}
                  </p>
                  {shouldShowQueryRewrite(queryPlan) ? <p className="rag-query-plan">改写：{queryPlan.rewritten_query}</p> : null}
                  {evidence.map((sentence, index) => (
                    <p className="evidence-snippet" key={`${item.chunk_id}-evidence-${index}`}>
                      <HighlightedText text={sentence} query={searchQuery} terms={terms} />
                    </p>
                  ))}
                  <p className="rag-citation">引用：{citation.title || item.title || item.filename} · Chunk {citation.chunk_index ?? item.chunk_index}</p>
                </div>
              );
            }) : <Empty>输入问题后可查看检索结果。</Empty>)}
          </div>
        </div>
        <div className="rag-data">
          <div className="list-container">
            {docs.length ? docs.map(doc => {
              const id = knowledgeDocId(doc);
              return (
              <div className="trace-block" key={id || doc.filename || doc.title}>
                <strong>{doc.title || doc.filename}</strong>
                <p>{deletingId === id ? "删除中..." : `Chunk ${doc.chunk_count || 0} · ${fmtTime(doc.created_at)}`}</p>
                <div className="mini-actions">
                  <button className="mini-action" type="button" disabled={!id || previewId === id || Boolean(deletingId)} onClick={() => onOpen(id)}>{previewId === id ? "预览中..." : "预览"}</button>
                  <button className="mini-action danger-text" type="button" disabled={!canAdmin || !id || deletingId === id || Boolean(previewId)} onClick={() => onDelete(id)}>{deletingId === id ? "删除中..." : "删除"}</button>
                </div>
              </div>
              );
            }) : <Empty>还没有知识文档。</Empty>}
          </div>
          <div className="detail-box">
            {detail ? <JsonBlock value={detail} /> : <Empty>选择一份知识文档即可查看 chunk 预览与助手范围。</Empty>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard(props) {
  const { tasks, runs, form, setForm, onSubmit, onReset, onEdit, onRun, onRuns, onDelete, canAdmin } = props;
  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  return (
    <div className="ops-card task-card">
      <h4 className="drag-handle">自动化任务中心</h4>
      <div className="ops-content flex-split">
        <form className="ops-form" onSubmit={onSubmit}>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="任务名称" required />
          <input value={form.assistant_id} onChange={e => set("assistant_id", e.target.value)} placeholder="指定助手 ID" />
          <textarea value={form.prompt} onChange={e => set("prompt", e.target.value)} placeholder="任务 Prompt" rows="2" />
          <div className="form-group-row">
            <input value={form.task_kind} onChange={e => set("task_kind", e.target.value)} placeholder="任务类型" />
            <input value={form.collaboration_mode} onChange={e => set("collaboration_mode", e.target.value)} placeholder="协同模式(auto/always)" />
          </div>
          <div className="form-group-row">
            <input value={form.schedule_kind} onChange={e => set("schedule_kind", e.target.value)} placeholder="调度类型(cron/interval)" />
            <input type="number" value={form.interval_minutes} onChange={e => set("interval_minutes", e.target.value)} placeholder="间隔(分钟)" />
          </div>
          <input value={form.cron_expression} onChange={e => set("cron_expression", e.target.value)} placeholder="Cron 表达式" />
          <div className="checkbox-grid">
            <div className="checkbox"><input type="checkbox" checked={form.require_rag_connected} onChange={e => set("require_rag_connected", e.target.checked)} /><label>依赖 RAG</label></div>
            <div className="checkbox"><input type="checkbox" checked={form.require_channel_online} onChange={e => set("require_channel_online", e.target.checked)} /><label>依赖渠道</label></div>
            <div className="checkbox"><input type="checkbox" checked={form.enabled} onChange={e => set("enabled", e.target.checked)} /><label>启用任务</label></div>
          </div>
          <div className="form-group-row">
            <input type="number" value={form.min_success_gap_minutes} onChange={e => set("min_success_gap_minutes", e.target.value)} placeholder="最小成功间隔(分)" />
            <input type="number" value={form.max_retries} onChange={e => set("max_retries", e.target.value)} placeholder="最大重试" />
            <input type="number" value={form.retry_backoff_seconds} onChange={e => set("retry_backoff_seconds", e.target.value)} placeholder="退避(秒)" />
          </div>
          <div className="mcp-actions">
            <button className="btn-primary btn-sm" type="submit" disabled={!canAdmin}>保存任务</button>
            <button className="btn-secondary btn-sm" type="button" onClick={onReset}>重置</button>
          </div>
        </form>
        <div id="taskList" className="list-container">
          {tasks.length ? tasks.map(task => (
            <div className="trace-block" key={task.id}>
              <div className="ops-line"><strong>{task.name}</strong><span className={`status-pill ${task.enabled ? "enabled" : "disabled"}`}>{task.last_status || "idle"}</span></div>
              <p>{task.assistant_id} · {task.schedule_kind} · 下次 {fmtTime(task.next_run_at)}</p>
              <div className="mini-actions">
                <button className="mini-action" type="button" onClick={() => onEdit(task)}>编辑</button>
                <button className="mini-action" type="button" onClick={() => onRun(task.id)} disabled={!canAdmin}>运行</button>
                <button className="mini-action" type="button" onClick={() => onRuns(task.id)}>记录</button>
                <button className="mini-action danger-text" type="button" onClick={() => onDelete(task.id)} disabled={!canAdmin}>删除</button>
              </div>
            </div>
          )) : <Empty>当前没有任务。</Empty>}
          {runs.length ? <div className="trace-block"><strong>最近运行记录</strong>{runs.slice(0, 5).map(run => <p key={run.id}>{fmtTime(run.started_at)} · {run.status} · {run.result}</p>)}</div> : null}
        </div>
      </div>
    </div>
  );
}

function TraceCard({ traces, detail, onOpen }) {
  return (
    <div className="ops-card trace-card">
      <h4 className="drag-handle">Traces & Events</h4>
      <div className="ops-content flex-split">
        <div className="list-container narrow-list">
          {traces.length ? traces.map(trace => (
            <div className="trace-block" key={trace.id}>
              <div className="ops-line"><strong>{trace.assistant_id}</strong><span className={`status-pill ${trace.status === "completed" ? "enabled" : "disabled"}`}>{trace.status}</span></div>
              <p>{chLabel(trace.channel)} · {fmtTime(trace.started_at)} · {trace.duration_ms} ms</p>
              <p className="list-preview">{trace.request_content || "-"}</p>
              <button className="mini-action" type="button" onClick={() => onOpen(trace.id)}>查看详情</button>
            </div>
          )) : <Empty>暂无 Trace 记录。</Empty>}
        </div>
        <div className="detail-box trace-detail code-font">
          {detail ? <TraceDetail detail={detail} /> : <Empty>选择一条 Trace 查看详情。</Empty>}
        </div>
      </div>
    </div>
  );
}

function TraceDetail({ detail }) {
  const events = detail.events || [];
  return (
    <div>
      <div className="trace-block">
        <strong>{detail.assistant_id} · {detail.status}</strong>
        <p>{detail.request_content}</p>
        <pre>{detail.response_content || "-"}</pre>
      </div>
      {events.map(event => (
        <div className="trace-event" key={event.id || `${event.event_type}-${event.created_at}`}>
          <div className="trace-event-meta"><strong>{event.event_type}</strong><span>{fmtTime(event.created_at)}</span></div>
          <pre>{event.content || "-"}</pre>
        </div>
      ))}
    </div>
  );
}

function UsersCard({ users, form, setForm, onSubmit, onReset, onEdit, onDelete, canAdmin }) {
  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  return (
    <div className="ops-card user-card">
      <h4 className="drag-handle">用户管理</h4>
      <div className="ops-content flex-split">
        <form className="ops-form" onSubmit={onSubmit}>
          <input value={form.username} onChange={e => set("username", e.target.value)} placeholder="用户名" required />
          <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="密码 (留空不改)" />
          <select value={form.role} onChange={e => set("role", e.target.value)}>
            <option value="viewer">viewer</option>
            <option value="admin">admin</option>
          </select>
          <div className="checkbox"><input type="checkbox" checked={form.enabled} onChange={e => set("enabled", e.target.checked)} /><label>账号启用</label></div>
          <div className="mcp-actions">
            <button className="btn-primary btn-sm" type="submit" disabled={!canAdmin}>保存用户</button>
            <button className="btn-secondary btn-sm" type="button" onClick={onReset}>重置</button>
          </div>
        </form>
        <div className="list-container">
          {users.length ? users.map(user => (
            <div className="trace-block" key={user.id}>
              <div className="ops-line"><strong>{user.username}</strong><span className={`status-pill ${user.enabled ? "enabled" : "disabled"}`}>{user.role}</span></div>
              <p>最后登录：{fmtTime(user.last_login_at)}</p>
              <div className="mini-actions">
                <button className="mini-action" type="button" onClick={() => onEdit(user)}>编辑</button>
                {user.username !== "admin" ? <button className="mini-action danger-text" type="button" onClick={() => onDelete(user.id)} disabled={!canAdmin}>删除</button> : null}
              </div>
            </div>
          )) : <Empty>当前没有额外账号。</Empty>}
        </div>
      </div>
    </div>
  );
}

function assistantToForm(assistant) {
  const source = assistant || emptyAssistant;
  return {
    ...emptyAssistant,
    ...source,
    image_provider: source.image_provider || "",
    image_model: source.image_model || "",
    temperature: source.temperature ?? "",
    max_tokens: source.max_tokens ?? "",
    max_tool_iterations: source.max_tool_iterations ?? "",
    max_tool_result_chars: source.max_tool_result_chars ?? "",
    daily_token_limit: source.daily_token_limit ?? "",
    tool_names_text: csv(source.tool_names),
    enabled_skills_text: csv(source.enabled_skills),
    disabled_skills_text: csv(source.disabled_skills),
    aliases_text: csv(source.routing?.aliases),
    keywords_text: csv(source.routing?.keywords),
    mcp_servers_text: JSON.stringify(source.mcp_servers || {}, null, 2),
  };
}

function formToAssistant(form) {
  const numberOrNull = value => value === "" || value === null || value === undefined ? null : Number(value);
  return {
    id: String(form.id || "").trim(),
    name: String(form.name || "").trim(),
    description: form.description || "",
    persona_prompt: form.persona_prompt || "",
    prompt_change_note: form.prompt_change_note || "",
    provider: form.provider || "auto",
    model: form.model || "",
    image_provider: form.image_provider || null,
    image_model: form.image_model || null,
    enabled: form.enabled !== false,
    tool_names: parseCsv(form.tool_names_text),
    enabled_skills: parseCsv(form.enabled_skills_text),
    disabled_skills: parseCsv(form.disabled_skills_text),
    routing: { aliases: parseCsv(form.aliases_text), keywords: parseCsv(form.keywords_text) },
    mcp_servers: safeJson(form.mcp_servers_text, {}),
    temperature: numberOrNull(form.temperature),
    max_tokens: numberOrNull(form.max_tokens),
    max_tool_iterations: numberOrNull(form.max_tool_iterations),
    max_tool_result_chars: numberOrNull(form.max_tool_result_chars),
    daily_token_limit: numberOrNull(form.daily_token_limit),
  };
}

function safeJson(value, fallback) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return fallback;
  }
}

function filesystemMcpTemplate() {
  return {
    filesystem: {
      type: "stdio",
      command: "mcp-server-filesystem",
      args: ["./"],
      toolTimeout: 30,
      enabledTools: ["*"],
    },
  };
}

function defaultTaskForm() {
  return {
    id: "",
    name: "",
    assistant_id: "",
    prompt: "",
    task_kind: "generic",
    collaboration_mode: "inherit",
    schedule_kind: "manual",
    cron_expression: "",
    interval_minutes: "",
    require_rag_connected: false,
    require_channel_online: false,
    min_success_gap_minutes: "",
    max_retries: "",
    retry_backoff_seconds: "60",
    target_channel: "",
    target_chat_id: "",
    enabled: true,
  };
}

function taskFormPayload(form, selectedAssistantId) {
  return {
    ...form,
    id: form.id || null,
    assistant_id: form.assistant_id || selectedAssistantId || "consult",
    interval_minutes: Number(form.interval_minutes || 0),
    min_success_gap_minutes: Number(form.min_success_gap_minutes || 0),
    max_retries: Number(form.max_retries || 0),
    retry_backoff_seconds: Number(form.retry_backoff_seconds || 60),
  };
}

function setTaskFormFromTask(setTaskForm) {
  return task => setTaskForm({
    id: task.id || "",
    name: task.name || "",
    assistant_id: task.assistant_id || "",
    prompt: task.prompt || "",
    task_kind: task.task_kind || "generic",
    collaboration_mode: task.collaboration_mode || "inherit",
    schedule_kind: task.schedule_kind || "manual",
    cron_expression: task.cron_expression || "",
    interval_minutes: task.interval_minutes || "",
    require_rag_connected: Boolean(task.require_rag_connected),
    require_channel_online: Boolean(task.require_channel_online),
    min_success_gap_minutes: task.min_success_gap_minutes || "",
    max_retries: task.max_retries || "",
    retry_backoff_seconds: task.retry_backoff_seconds || "60",
    target_channel: task.target_channel || "",
    target_chat_id: task.target_chat_id || "",
    enabled: task.enabled !== false,
  });
}

function defaultUserForm() {
  return { id: "", username: "", password: "", role: "viewer", enabled: true };
}

function mergeUploads(existing, incoming) {
  const map = new Map(existing.map(item => [item.path, item]));
  incoming.forEach(item => map.set(item.path, item));
  return Array.from(map.values());
}

createRoot(document.getElementById("root")).render(<App />);
