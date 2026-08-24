import { test, expect } from '@playwright/test';

/**
 * 10. RESPONSIVE DESIGN TESTS
 * Verifies layout adjustments across mobile, tablet, and desktop viewports.
 * Uses Playwright's project configurations for viewports.
 */
test.describe('Responsive Design', () => {

  test('homepage renders without horizontal scroll', async ({ page }) => {
    await page.goto('/');
    
    // Evaluate if document width exceeds viewport width
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });

  test('navigation adjusts based on viewport', async ({ page, isMobile }) => {
    await page.goto('/');
    
    const desktopNav = page.locator('nav.hidden.lg\\:flex');
    const mobileHamburger = page.locator('header button.lg\\:hidden');
    
    if (isMobile) {
      // On mobile, desktop nav should be hidden, hamburger visible
      await expect(desktopNav).toBeHidden();
      await expect(mobileHamburger).toBeVisible();
    } else {
      // On desktop, desktop nav visible, hamburger hidden
      await expect(desktopNav).toBeVisible();
      await expect(mobileHamburger).toBeHidden();
    }
  });

  test('tour grid stacks correctly on smaller screens', async ({ page, isMobile }) => {
    await page.goto('/sri-lanka-tours/all');
    await page.waitForLoadState('networkidle');
    
    const firstCard = page.locator('a[href*="/sri-lanka-tours/"]').filter({
      has: page.locator('img')
    }).first();
    
    if (await firstCard.isVisible()) {
      const box = await firstCard.boundingBox();
      const viewportSize = page.viewportSize();
      
      if (box && viewportSize) {
        if (isMobile) {
          // Card should take up most of the screen width on mobile (e.g. > 80%)
          expect(box.width).toBeGreaterThan(viewportSize.width * 0.8);
        } else {
          // Card should take up less width on desktop (part of a grid)
          expect(box.width).toBeLessThan(viewportSize.width * 0.5);
        }
      }
    }
  });

});
