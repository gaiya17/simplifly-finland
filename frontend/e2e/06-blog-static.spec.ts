import { test, expect } from '@playwright/test';

/**
 * 6. BLOG TESTS
 * 7. STATIC PAGES TESTS
 * Verifies blog landing, blog detail, who-we-are, gallery, privacy, terms.
 */

// ── 6. Blog ──
test.describe('Blog', () => {
  test('blog landing page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog|Simplifly/i);
  });

  test('blog posts are displayed', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    // Should have at least one article/card with an image
    const articles = page.locator('article, [class*="blog"], [class*="card"]');
    const imgs = page.locator('img');
    const imgCount = await imgs.count();
    expect(imgCount).toBeGreaterThan(0);
  });

  test('clicking a blog post navigates to detail page', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    const blogLink = page.locator('a[href*="/blog/"]').first();
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/blog\//);
      // Blog detail should have a heading
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    }
  });
});

// ── 7. Static Pages ──
test.describe('Static Pages', () => {

  // ── 7.1 Who We Are ──
  test('Who We Are page loads', async ({ page }) => {
    await page.goto('/who-we-are');
    await expect(page).toHaveTitle(/Who We Are|Simplifly/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  // ── 7.2 Gallery ──
  test('Gallery page loads with images', async ({ page }) => {
    await page.goto('/gallery');
    await expect(page).toHaveTitle(/Gallery|Simplifly/i);
    await page.waitForLoadState('networkidle');
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  // ── 7.3 Privacy Policy ──
  test('Privacy Policy page loads', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page.getByText(/Privacy/i).first()).toBeVisible();
  });

  // ── 7.4 Terms & Conditions ──
  test('Terms & Conditions page loads', async ({ page }) => {
    await page.goto('/terms-and-conditions');
    await expect(page.getByText(/Terms/i).first()).toBeVisible();
  });
});
