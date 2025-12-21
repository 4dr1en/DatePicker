import { defineConfig, devices } from '@playwright/experimental-ct-vue';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/',
  testMatch: /.*\.e2e\.spec\.ts/,
  snapshotPathTemplate: '{testDir}/{testFileDir}/__snapshots__/{arg}{-projectName}{-snapshotSuffix}{ext}',
  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,

    /* Screenshot settings for consistency */
    screenshot: 'only-on-failure',

    /* Viewport size for consistency between headed and headless */
    viewport: { width: 1280, height: 720 },

    /* Wait for fonts and animations to load */
    actionTimeout: 10000,

    /* Run headless in CI, headed locally for debugging */
    headless: !!process.env.CI,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 9'] },
    },
  ],
});
