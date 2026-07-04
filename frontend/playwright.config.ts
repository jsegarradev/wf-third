import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:4200';

/**
 * Playwright drives the actually-running app (real backend + frontend) end-to-end. At scaffold time only a trivial
 * smoke spec ships; the real feature e2e is added with the first feature. Start the app yourself
 * (`ng serve --proxy-config proxy.conf.json`) before running `npx playwright test`.
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    reporter: 'list',
    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
