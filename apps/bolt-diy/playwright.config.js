import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    process.env.CI ? ["github"] : ["list"],
  ],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: !!process.env.CI,
    actionTimeout: 30000,
    navigationTimeout: 30000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "Desktop Chrome",
      settings: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: [
            "--disable-dev-shm-usage",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
          ],
        },
      },
    },
    {
      name: "Desktop Firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Desktop Safari",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
    {
      name: "Tablet iPad",
      use: { ...devices["iPad Pro"] },
    },
    // Visual regression testing projects
    {
      name: "Visual Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: "**/*.visual.spec.ts",
    },
    {
      name: "Accessibility",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/*.a11y.spec.ts",
    },
  ],

  webServer: {
    command: process.env.CI ? "npm run build && npm run preview" : "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NODE_ENV: "test",
    },
  },

  // Global setup for authentication, database seeding, etc.
  globalSetup: "./tests/global-setup.ts",
  globalTeardown: "./tests/global-teardown.ts",

  // Test timeout
  timeout: 60000,
  expect: {
    // Visual regression threshold
    threshold: 0.2,
    toHaveScreenshot: {
      mode: "css",
      animations: "disabled",
      caret: "hide",
    },
  },

  // Dependencies between test projects
  dependencies: [{ name: "Desktop Chrome" }],

  // Metadata for test analytics
  metadata: {
    source: "playwright",
    project: "bolt-diy",
    environment: process.env.NODE_ENV || "test",
  },
});
