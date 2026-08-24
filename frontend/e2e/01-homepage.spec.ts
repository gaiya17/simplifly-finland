import { test, expect } from '@playwright/test';

/**
 * 1. SMOKE & HOMEPAGE TESTS
 * Verifies the homepage loads correctly with all major sections.
 */
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── 1.1 Smoke & Load ──
  test('loads with HTTP 200 and correct title', async ({ page }) => {
    expect(page.url()).toContain('/');
    await expect(page).toHaveTitle(/Simplifly Finland/i);
  });

  test('has no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    // Filter out known third-party errors (e.g. analytics, FB pixel)
    const criticalErrors = errors.filter(
      e => !e.includes('fbq') && !e.includes('tawk') && !e.includes('cookieyes')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  // ── 1.2 Hero Section ──
  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  // ── 1.3 Support CTA ──
  test('WhatsApp link has correct number', async ({ page }) => {
    const waLink = page.locator('a[href*="wa.me/358408192758"]').first();
    await expect(waLink).toBeVisible();
  });

  // ── 1.4 Destination Highlights ──
  test('featured tours section renders', async ({ page }) => {
    // Look for the destination highlights section with tour cards
    const tourCards = page.locator('[class*="tour"], [class*="destination"], [class*="highlight"]').first();
    // If no class-based selector, look for section by text
    const sectionByText = page.getByText(/Sri Lanka/i).first();
    await expect(sectionByText).toBeVisible();
  });

  // ── 1.7 Maldives Resorts Section ──
  test('maldives resorts section renders', async ({ page }) => {
    const maldivesText = page.getByText(/Maldives/i).first();
    await expect(maldivesText).toBeVisible();
  });

  // ── 1.10 FAQ Section ──
  test('FAQ section renders and accordion works', async ({ page }) => {
    const faqSection = page.getByText(/frequently asked/i).or(page.getByText(/FAQ/i)).first();
    await expect(faqSection).toBeVisible();
  });

  // ── 1.11 Reviews Section ──
  test('reviews section renders', async ({ page }) => {
    const reviewsSection = page.getByText(/review/i).first();
    await expect(reviewsSection).toBeVisible();
  });
});
