import { describe, expect, it } from "vitest";

import {
  buildDefaultLayout,
  can,
  chLabel,
  formToAssistant,
  isUsableSavedLayout,
  layoutHasOverlap,
  mergeUploads,
  normalizeLayout,
  parseCsv,
  pickEvidenceSnippet,
  shouldShowQueryRewrite,
  summarizeTokenUsage,
  taskFormPayload,
  tokenizeQuery,
} from "./main.jsx";

describe("console layout helpers", () => {
  it("builds a complete non-overlapping default dashboard layout", () => {
    const layout = buildDefaultLayout();
    expect(layout.map(item => item.i)).toEqual([
      "assistants",
      "chat",
      "inspector",
      "status",
      "rag",
      "task",
      "trace",
      "users",
    ]);
    expect(layoutHasOverlap(layout)).toBe(false);
    expect(isUsableSavedLayout(layout)).toBe(true);
  });

  it("normalizes overflowing cards back inside the grid", () => {
    const layout = buildDefaultLayout().map(item => (
      item.i === "users" ? { ...item, y: 99, h: 99 } : item
    ));
    const normalized = normalizeLayout(layout);
    expect(layoutHasOverlap(normalized)).toBe(false);
    expect(normalized.every(item => item.x >= 0 && item.x + item.w <= 12)).toBe(true);
    expect(normalized.every(item => item.y >= 0 && item.y + item.h <= 15)).toBe(true);
  });
});

describe("RAG evidence helpers", () => {
  it("tokenizes Chinese query terms into useful n-grams", () => {
    expect(tokenizeQuery("家庭宽带每月哪天扣费，超过多少钱提醒？")).toEqual(
      expect.arrayContaining(["家庭宽带", "宽带", "扣费", "提醒"]),
    );
  });

  it("picks the most relevant evidence sentence instead of dumping the whole chunk", () => {
    const content = "音乐会员每月 3 日续费。家庭宽带每月 12 日扣费，超过 120 元需要提醒。视频会员异地登录时先确认设备。";
    expect(pickEvidenceSnippet(content, "家庭宽带超过多少钱提醒")).toContain("家庭宽带每月 12 日扣费");
  });

  it("shows query rewrite only when the rewrite materially changes the query", () => {
    expect(shouldShowQueryRewrite({
      original_query: "宽带扣费",
      rewritten_query: "家庭宽带 扣费 日期 金额",
      rewrite_terms: ["家庭宽带"],
    })).toBe(true);
    expect(shouldShowQueryRewrite({
      original_query: "宽带扣费",
      rewritten_query: "宽带扣费",
      rewrite_terms: [],
    })).toBe(false);
  });
});

describe("form and permission helpers", () => {
  it("parses CSV values and assistant form payloads", () => {
    expect(parseCsv("read_file, copy_file, , web_search")).toEqual(["read_file", "copy_file", "web_search"]);
    expect(formToAssistant({
      id: "dev",
      name: "开发助手",
      tool_names_text: "read_file, exec",
      enabled_skills_text: "github",
      disabled_skills_text: "",
      aliases_text: "开发, code",
      keywords_text: "代码, 调试",
      mcp_servers_text: "{\"gitRepo\":{\"type\":\"stdio\"}}",
      temperature: "0.35",
      max_tokens: "4096",
      max_tool_iterations: "",
      max_tool_result_chars: "",
      daily_token_limit: "1000",
    })).toMatchObject({
      id: "dev",
      tool_names: ["read_file", "exec"],
      enabled_skills: ["github"],
      routing: { aliases: ["开发", "code"], keywords: ["代码", "调试"] },
      temperature: 0.35,
      max_tokens: 4096,
      daily_token_limit: 1000,
    });
  });

  it("normalizes task payloads and upload lists", () => {
    expect(taskFormPayload({
      name: "巡检",
      assistant_id: "",
      interval_minutes: "30",
      min_success_gap_minutes: "",
      max_retries: "2",
      retry_backoff_seconds: "",
    }, "consult")).toMatchObject({
      assistant_id: "consult",
      interval_minutes: 30,
      min_success_gap_minutes: 0,
      max_retries: 2,
      retry_backoff_seconds: 60,
    });
    expect(mergeUploads([{ path: "a.png", name: "old" }], [{ path: "a.png", name: "new" }, { path: "b.pdf" }])).toEqual([
      { path: "a.png", name: "new" },
      { path: "b.pdf" },
    ]);
  });

  it("maps channel labels and enforces role hierarchy", () => {
    expect(chLabel("weixin")).toBe("微信");
    expect(chLabel("qq")).toBe("QQ");
    expect(can({ role: "admin" }, "viewer")).toBe(true);
    expect(can({ role: "viewer" }, "admin")).toBe(false);
  });

  it("summarizes daily token usage for the status card", () => {
    expect(summarizeTokenUsage([
      { trace_count: 2, prompt_tokens: 120, completion_tokens: 30, total_tokens: 150 },
      { trace_count: 1, prompt_tokens: 50, completion_tokens: 25, total_tokens: 75 },
    ])).toEqual({
      trace_count: 3,
      prompt_tokens: 170,
      completion_tokens: 55,
      total_tokens: 225,
    });
  });
});
