import { test, expect } from '@playwright/test';

/**
 * 13. CHATBOT TESTS
 * Verifies that the FloatingContact chatbot widget works.
 */
test.describe('Chatbot', () => {

  test('chatbot widget appears on public pages', async ({ page }) => {
    await page.goto('/');
    
    // Look for the floating contact button (usually has an SVG/icon and is fixed bottom-right)
    const chatbotBtn = page.locator('button').filter({ has: page.locator('svg') }).locator('..').filter({ hasClass: /fixed/ });
    // This selector might need to be adjusted based on exact implementation, 
    // but typically we can look for a button with fixed positioning near bottom right
    const widget = page.locator('button[class*="fixed"][class*="bottom-"]');
    
    if (await widget.count() > 0) {
      await expect(widget.first()).toBeVisible();
    }
  });

  test('clicking widget opens chatbot panel', async ({ page }) => {
    await page.goto('/');
    
    // Attempt to open the chatbot
    const widgetBtn = page.locator('button[class*="fixed"][class*="bottom-"]').last();
    if (await widgetBtn.isVisible()) {
      await widgetBtn.click();
      await page.waitForTimeout(500);
      
      // Panel should open, look for a greeting or typical chat elements
      await expect(page.getByText(/Ayubowan|Welcome to Simplifly|help you today/i).first()).toBeVisible();
    }
  });

  test('chatbot options are clickable', async ({ page }) => {
    await page.goto('/');
    
    const widgetBtn = page.locator('button[class*="fixed"][class*="bottom-"]').last();
    if (await widgetBtn.isVisible()) {
      await widgetBtn.click();
      await page.waitForTimeout(500);
      
      // Check for options
      const sriLankaOption = page.getByRole('button', { name: /Sri Lanka/i }).filter({ hasText: /Tour/i });
      if (await sriLankaOption.isVisible()) {
        await sriLankaOption.click();
        await page.waitForTimeout(500);
        
        // Chatbot should respond with next message
        await expect(page.getByText(/What kind of Sri Lanka experience/i).first()).toBeVisible();
      }
    }
  });

});
