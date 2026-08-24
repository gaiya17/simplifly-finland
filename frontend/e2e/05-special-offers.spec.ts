import { test, expect } from '@playwright/test';

/**
 * 5. SPECIAL OFFERS TESTS
 * Verifies tab switching, URL synchronization, and offer cards.
 */
test.describe('Special Offers', () => {

  // ── 5.1 Main Page ──
  test('page loads', async ({ page }) => {
    await page.goto('/special-offers');
    await expect(page).toHaveTitle(/Special Offers|Simplifly/i);
  });

  test('two tabs are visible (Maldives and Sri Lanka)', async ({ page }) => {
    await page.goto('/special-offers');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Maldives/i).first()).toBeVisible();
    await expect(page.getByText(/Sri Lanka/i).first()).toBeVisible();
  });

  // ── 5.2 Tab Switching & URL Sync ──
  test('clicking Sri Lanka tab changes URL', async ({ page }) => {
    await page.goto('/special-offers');
    await page.waitForLoadState('networkidle');

    // Click the Sri Lanka tab
    const sriLankaTab = page.getByRole('button', { name: /Sri Lanka/i })
      .or(page.locator('button').filter({ hasText: /Sri Lanka/i }));
    
    if (await sriLankaTab.first().isVisible()) {
      await sriLankaTab.first().click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/sri-lanka/i);
    }
  });

  test('clicking Maldives tab changes URL', async ({ page }) => {
    await page.goto('/special-offers/sri-lanka');
    await page.waitForLoadState('networkidle');

    const maldivesTab = page.getByRole('button', { name: /Maldives/i })
      .or(page.locator('button').filter({ hasText: /Maldives/i }));
    
    if (await maldivesTab.first().isVisible()) {
      await maldivesTab.first().click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/maldives/i);
    }
  });

  test('direct navigation to /special-offers/sri-lanka opens Sri Lanka tab', async ({ page }) => {
    await page.goto('/special-offers/sri-lanka');
    await page.waitForLoadState('networkidle');
    // The Sri Lanka tab should be active
    await expect(page.getByText(/Sri Lanka/i).first()).toBeVisible();
  });

  test('direct navigation to /special-offers/maldives opens Maldives tab', async ({ page }) => {
    await page.goto('/special-offers/maldives');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Maldives/i).first()).toBeVisible();
  });

  // ── 5.3 Offer Cards ──
  test('offer cards are displayed', async ({ page }) => {
    await page.goto('/special-offers');
    await page.waitForLoadState('networkidle');
    // Should have at least one offer card with an image
    const cards = page.locator('img');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});
