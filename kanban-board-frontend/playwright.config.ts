import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3010", trace: "on-first-retry" },
  webServer: {
    command: "npx next dev --turbopack --port 3010",
    url: "http://localhost:3010",
    reuseExistingServer: true,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
