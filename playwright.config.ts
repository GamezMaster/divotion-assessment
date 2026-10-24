import { defineConfig, devices } from '@playwright/test'

/**
 * Minimal Playwright config for a single meaningful end-to-end flow
 * (persistence across a real browser reload). Chromium only, to keep the
 * toolchain proportionate to this assignment. Vitest remains the primary
 * test runner; these specs live under `e2e/` and are run via `npm run e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Build once and serve the production preview for the test run.
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
