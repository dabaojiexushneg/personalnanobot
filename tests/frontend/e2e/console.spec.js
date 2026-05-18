import { expect, test } from "@playwright/test";

test("loads the React console shell with mocked platform data", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("nanobot个人生活账号助手")).toBeVisible();
  await expect(page.getByText("AI 咨询助手 · consult")).toBeVisible();
  await expect(page.getByRole("heading", { name: /RAG 知识库/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /自动化任务中心/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Traces & Events/ })).toBeVisible();
  await expect(page.getByText("MILVUS · 已连接").first()).toBeVisible();
  await expect(page.getByText("每日生活账号巡检")).toBeVisible();
});

test("opens trace details from the trace card", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "查看详情" }).first().click();

  await expect(page.getByText("knowledge_hit")).toBeVisible();
  await expect(page.getByText("家庭宽带每月 12 日扣费，超过 120 元需要提醒。")).toBeVisible();
});

test("console dashboard visual baseline @visual", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /RAG 知识库/ })).toBeVisible();

  await expect(page).toHaveScreenshot("console-dashboard.png", {
    fullPage: true,
    animations: "disabled",
  });
});
