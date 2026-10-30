import { defineConfig, devices } from '@playwright/test';

// Viewport y modos de HANDOFF.md §13.2: 390×844, probado en claro y oscuro.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'mobile-light',
      use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, colorScheme: 'light' },
    },
    {
      name: 'mobile-dark',
      use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, colorScheme: 'dark' },
    },
  ],
});
