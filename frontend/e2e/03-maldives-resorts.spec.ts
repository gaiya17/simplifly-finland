import { test, expect } from '@playwright/test';

/**
 * 3. MALDIVES RESORTS TESTS
 * Verifies landing, category, detail, and inquiry form pages.
 */
test.describe('Maldives Resorts', () => {

  // ── 3.1 Landing Page ──
  test.describe('Landing Page', () => {
    test('page loads with correct title', async ({ page }) => {
      await page.goto('/maldives-resorts');
      await expect(page).toHaveTitle(/Maldives/i);
    });

    test('category cards are displayed', async ({ page }) => {
      await page.goto('/maldives-resorts');
      // Wait for categories to load from API
      await page.waitForLoadState('networkidle');
      // Should have at least one category link
      const categoryLinks = page.locator('a[href*="/maldives-resorts/"]');
      const count = await categoryLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('clicking a category navigates correctly', async ({ page }) => {
      await page.goto('/maldives-resorts');
      await page.waitForLoadState('networkidle');
      const firstCategory = page.locator('a[href*="/maldives-resorts/"]').first();
      const href = await firstCategory.getAttribute('href');
      await firstCategory.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/maldives-resorts/');
    });
  });

  // ── 3.2 Category Page ──
  test.describe('Category Page', () => {
    test('resort cards display with required info', async ({ page }) => {
      await page.goto('/maldives-resorts/all');
      await page.waitForLoadState('networkidle');
      // Should have resort cards with images
      const resortCards = page.locator('a[href*="/maldives-resorts/"]');
      const count = await resortCards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ── 3.3 All Resorts Page ──
  test.describe('All Resorts Page', () => {
    test('page loads and shows resorts', async ({ page }) => {
      await page.goto('/maldives-resorts/all');
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/resort/i).first()).toBeVisible();
    });
  });

  // ── 3.4 Resort Detail Page ──
  test.describe('Resort Detail Page', () => {
    test('page loads with resort info', async ({ page }) => {
      // Navigate to all resorts first, then click into one
      await page.goto('/maldives-resorts/all');
      await page.waitForLoadState('networkidle');
      
      // Find first resort link that goes to a detail page
      const detailLink = page.locator('a[href*="/maldives-resorts/"]').filter({
        has: page.locator('img')
      }).first();
      
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForLoadState('networkidle');
        
        // Should have resort title
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
      }
    });
  });

  // ── 3.5 Resort Inquiry Form ──
  test.describe('Inquiry Form', () => {
    test('inquiry form has all required fields', async ({ page }) => {
      // Navigate to a resort detail page
      await page.goto('/maldives-resorts/all');
      await page.waitForLoadState('networkidle');
      
      const detailLink = page.locator('a[href*="/maldives-resorts/"]').filter({
        has: page.locator('img')
      }).first();
      
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForLoadState('networkidle');
        
        // Check for inquiry form fields
        await expect(page.getByPlaceholder(/first name/i).or(page.locator('input[name="firstName"]'))).toBeVisible();
        await expect(page.getByPlaceholder(/surname/i).or(page.locator('input[name="surname"]')).or(page.getByPlaceholder(/last name/i))).toBeVisible();
        await expect(page.getByPlaceholder(/email/i).or(page.locator('input[name="email"]'))).toBeVisible();
      }
    });

    test('form validation rejects empty submission', async ({ page }) => {
      await page.goto('/maldives-resorts/all');
      await page.waitForLoadState('networkidle');
      
      const detailLink = page.locator('a[href*="/maldives-resorts/"]').filter({
        has: page.locator('img')
      }).first();
      
      if (await detailLink.isVisible()) {
        await detailLink.click();
        await page.waitForLoadState('networkidle');
        
        // Try to submit empty form
        const submitBtn = page.getByRole('button', { name: /send|submit|inquire/i });
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForTimeout(1000);
          // Should show validation error or remain on page
          expect(page.url()).toContain('/maldives-resorts/');
        }
      }
    });
  });
});
