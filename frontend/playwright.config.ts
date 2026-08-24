import { defineConfig, devices } from '@playwright/test';

/**
 * Simplifly Finland — Playwright E2E Configuration
 * 
 * Tests against the live production site by default.
 * Override with BASE_URL env variable for staging/local.
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL for all tests — override with env var */
    baseURL: process.env.BASE_URL || 'https://simpliflyfinland.com',
    
    /* Collect trace on first retry */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Default timeout for actions */
    actionTimeout: 10000,
    
    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers & viewports */
  projects: [
    // ── Desktop ──
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },

    // ── Tablet ──
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad (gen 7)'],
      },
    },

    // ── Mobile ──
    {
      name: 'Mobile',
      use: { 
        ...devices['iPhone 13'],
      },
    },
  ],

  /* Global timeout per test */
  timeout: 60000,
  
  /* Expect timeout */
  expect: {
    timeout: 10000,
  },
});
