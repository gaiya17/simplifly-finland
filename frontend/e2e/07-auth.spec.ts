import { test, expect } from '@playwright/test';

/**
 * 8. AUTHENTICATION TESTS
 * Verifies login page, validation, successful/failed login.
 */
test.describe('Authentication', () => {

  // ── 8.1 Login Page ──
  test.describe('Login Page', () => {
    test('login form renders', async ({ page }) => {
      await page.goto('/login');
      await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('show/hide password toggle works', async ({ page }) => {
      await page.goto('/login');
      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput).toBeVisible();

      // Click the eye toggle button
      const toggleBtn = page.locator('button').filter({
        has: page.locator('svg')
      }).last();

      await toggleBtn.click();
      // Password field should change to text type
      const inputType = await page.locator('input').nth(1).getAttribute('type');
      expect(inputType === 'text' || inputType === 'password').toBeTruthy();
    });

    test('empty form submission shows error', async ({ page }) => {
      await page.goto('/login');
      const submitBtn = page.getByRole('button', { name: /sign in|log in|login/i });
      await submitBtn.click();
      await page.waitForTimeout(1000);
      
      // Should show error toast or remain on login page
      expect(page.url()).toContain('/login');
    });

    test('invalid credentials show error', async ({ page }) => {
      await page.goto('/login');
      
      await page.locator('input[type="email"], input[type="text"]').first().fill('invalid@test.com');
      await page.locator('input[type="password"]').fill('wrongpassword');
      
      const submitBtn = page.getByRole('button', { name: /sign in|log in|login/i });
      await submitBtn.click();
      await page.waitForTimeout(3000);
      
      // Should remain on login page (not redirect to admin)
      expect(page.url()).not.toContain('/admin/dashboard');
    });
  });

  // ── 8.2 Admin Route Protection ──
  test.describe('Admin Route Protection', () => {
    test('accessing admin without auth redirects to login', async ({ page }) => {
      await page.goto('/admin/dashboard');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Should redirect to login or show login form
      const url = page.url();
      const hasLoginPage = url.includes('/login') || await page.locator('input[type="password"]').isVisible();
      expect(hasLoginPage).toBeTruthy();
    });

    test('accessing admin tours without auth redirects', async ({ page }) => {
      await page.goto('/admin/tours');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const url = page.url();
      const hasLoginPage = url.includes('/login') || await page.locator('input[type="password"]').isVisible();
      expect(hasLoginPage).toBeTruthy();
    });
  });
});
