import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.GITHUB_PAGES === 'true' || process.env.DEPLOY_TARGET === 'github-pages' ? '/portfolio-v2' : '';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }, baseURL: `http://127.0.0.1:4173${basePath}/`, reducedMotion: 'reduce', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: 'npm run serve:export', url: `http://127.0.0.1:4173${basePath}/`, reuseExistingServer: !process.env.CI },
});
