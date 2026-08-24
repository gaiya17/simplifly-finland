import { test, expect } from '@playwright/test';

/**
 * 12. ERROR HANDLING TESTS
 * Verifies that 404 pages and invalid routes are handled gracefully.
 */
test.describe('Error Handling', () => {

  test('invalid main route shows 404 page', async ({ page }) => {
    // Navigate to a random non-existent page
    const response = await page.goto('/this-page-does-not-exist');
    
    // In Next.js App Router, it usually returns 404 status
    expect(response?.status()).toBe(404);
    
    // Look for typical 404 text
    await expect(page.getByText(/404/i).or(page.getByText(/not found/i)).first()).toBeVisible();
  });

  test('invalid tour route is handled gracefully', async ({ page }) => {
    // Navigating to a non-existent tour should show a not found UI, not crash
    await page.goto('/sri-lanka-tours/invalid-category/invalid-tour');
    await page.waitForLoadState('networkidle');
    
    // The page should either show "Not Found" or "Tour not found"
    await expect(page.getByText(/not found/i).first()).toBeVisible();
  });

  test('invalid resort route is handled gracefully', async ({ page }) => {
    await page.goto('/maldives-resorts/invalid-category/invalid-resort');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText(/not found/i).first()).toBeVisible();
  });

});
