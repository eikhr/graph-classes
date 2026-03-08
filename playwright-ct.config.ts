import { resolve } from "path";

import { defineConfig, devices } from "@playwright/experimental-ct-react";

const isCI = !!process.env["CI"];

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.ct.{ts,tsx}",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: "list",
  use: {
    trace: "on-first-retry",
    ctViteConfig: {
      resolve: {
        alias: {
          "@": resolve(__dirname, "./src"),
        },
      },
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
