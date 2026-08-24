import { test, expect } from '@playwright/test';

/**
 * 2. NAVIGATION TESTS
 * Verifies header, footer, mobile menu, and dropdown menus.
 */
test.describe('Navigation', () => {

  // ── 2.1 Desktop Header ──
  test.describe('Desktop Header', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('logo links to homepage', async ({ page }) => {
      const logo = page.locator('header a[href="/"]').first();
      await expect(logo).toBeVisible();
    });

    test('nav links are present and correct', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav.getByRole('link', { name: /Maldives/i }).first()).toBeVisible();
      await expect(nav.getByRole('link', { name: /Sri Lanka/i }).first()).toBeVisible();
      await expect(nav.getByRole('link', { name: /Special Offers/i })).toBeVisible();
      await expect(nav.getByRole('link', { name: /Who We Are/i })).toBeVisible();
      await expect(nav.getByRole('link', { name: /Gallery/i })).toBeVisible();
      await expect(nav.getByRole('link', { name: /Blog/i })).toBeVisible();
    });

    test('Maldives Resorts link navigates correctly', async ({ page }) => {
      await page.locator('nav').getByRole('link', { name: /Maldives/i }).first().click();
      await expect(page).toHaveURL(/maldives-resorts/);
    });

    test('Sri Lanka Tours link navigates correctly', async ({ page }) => {
      await page.locator('nav').getByRole('link', { name: /Sri Lanka/i }).first().click();
      await expect(page).toHaveURL(/sri-lanka-tours/);
    });

    test('Special Offers link navigates correctly', async ({ page }) => {
      await page.getByRole('link', { name: /Special Offers/i }).first().click();
      await expect(page).toHaveURL(/special-offers/);
    });

    test('Who We Are link navigates correctly', async ({ page }) => {
      await page.locator('nav').getByRole('link', { name: /Who We Are/i }).click();
      await expect(page).toHaveURL(/who-we-are/);
    });

    test('Gallery link navigates correctly', async ({ page }) => {
      await page.locator('nav').getByRole('link', { name: /Gallery/i }).click();
      await expect(page).toHaveURL(/gallery/);
    });

    test('Blog link navigates correctly', async ({ page }) => {
      await page.locator('nav').getByRole('link', { name: /Blog/i }).click();
      await expect(page).toHaveURL(/blog/);
    });

    test('WhatsApp CTA button has correct link', async ({ page }) => {
      const waButton = page.locator('header a[href*="wa.me/358408192758"]');
      await expect(waButton).toBeVisible();
    });
  });

  // ── 2.3 Header Scroll Behavior ──
  test.describe('Header Scroll', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('header changes style on scroll', async ({ page }) => {
      await page.goto('/');
      const header = page.locator('header');

      // Initially transparent
      await expect(header).toBeVisible();

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(500);

      // Header should now have opaque background (class changes)
      const classes = await header.getAttribute('class');
      expect(classes).toContain('backdrop-blur');
    });
  });

  // ── 2.4 Mobile Navigation ──
  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('hamburger icon is visible on mobile', async ({ page }) => {
      const hamburger = page.locator('button').filter({ has: page.locator('svg') }).first();
      // On mobile the nav should be hidden, hamburger visible
      const desktopNav = page.locator('nav.hidden.lg\\:flex');
      await expect(hamburger).toBeVisible();
    });

    test('clicking hamburger opens mobile menu', async ({ page }) => {
      // Click the hamburger button (the lg:hidden button)
      const hamburger = page.locator('header button.lg\\:hidden');
      await hamburger.click();

      // Mobile menu overlay should appear
      await page.waitForTimeout(500);
      // Look for the close button (X) which indicates menu is open
      const closeBtn = page.locator('[class*="fixed"]').getByRole('button').first();
      await expect(closeBtn).toBeVisible();
    });

    test('mobile menu has all navigation links', async ({ page }) => {
      const hamburger = page.locator('header button.lg\\:hidden');
      await hamburger.click();
      await page.waitForTimeout(500);

      // Check for key links in mobile menu
      const mobileMenu = page.locator('[class*="fixed"][class*="inset"]');
      await expect(mobileMenu.getByText(/Maldives/i).first()).toBeVisible();
      await expect(mobileMenu.getByText(/Sri Lanka/i).first()).toBeVisible();
      await expect(mobileMenu.getByText(/Who We Are/i).first()).toBeVisible();
    });
  });

  // ── 2.5 Footer ──
  test.describe('Footer', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
    });

    test('footer is visible', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('footer has navigation links', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer.getByRole('link', { name: /Who We Are/i })).toBeVisible();
      await expect(footer.getByRole('link', { name: /Sri Lanka/i }).first()).toBeVisible();
      await expect(footer.getByRole('link', { name: /Maldives/i }).first()).toBeVisible();
    });

    test('footer has office addresses', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer.getByText(/Finland/i).first()).toBeVisible();
      await expect(footer.getByText(/Sri Lanka/i).first()).toBeVisible();
      await expect(footer.getByText(/Maldives/i).first()).toBeVisible();
    });

    test('footer has privacy policy and terms links', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer.getByRole('link', { name: /Privacy/i })).toBeVisible();
      await expect(footer.getByRole('link', { name: /Terms/i })).toBeVisible();
    });
  });
});
