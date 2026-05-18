import { defineConfig, devices } from "@playwright/test";

const localBrowserChannel = process.platform === "win32" ? "msedge" : undefined;

export default defineConfig({
  testDir: "tests/frontend/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.03,
    },
  },
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node tests/frontend/mock-console-server.mjs",
    url: "http://127.0.0.1:4173/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: localBrowserChannel,
        viewport: { width: 1440, height: 960 },
      },
    },
  ],
});
