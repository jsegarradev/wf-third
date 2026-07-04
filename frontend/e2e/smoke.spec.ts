import { expect, test } from '@playwright/test';

/**
 * Trivial boot smoke test: the app loads and the shell renders. Real feature e2e (data tables, sorting, etc.) is added
 * with the first feature — an empty skeleton has nothing else to assert.
 */
test('app boots and renders the shell', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-root')).toBeVisible();
    await expect(page.locator('.app-shell__title')).toContainText('wf-third');
});
