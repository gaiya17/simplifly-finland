import { test, expect } from '@playwright/test';

/**
 * 9. SEO & METADATA TESTS
 * Verifies titles, meta tags, and open graph tags.
 */
test.describe('SEO & Metadata', () => {

  test('homepage has correct SEO metadata', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Simplifly Finland — Luxury Travel/i);
    
    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('luxury tour packages');
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('simpliflyfinland.com');
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
  });

  test('tour detail page has dynamic SEO metadata', async ({ page }) => {
    // Navigate to a tour detail page
    await page.goto('/sri-lanka-tours/all');
    await page.waitForLoadState('networkidle');
    const tourLink = page.locator('a[href*="/sri-lanka-tours/"]').filter({
      has: page.locator('img')
    }).first();
    
    if (await tourLink.isVisible()) {
      await tourLink.click();
      await page.waitForLoadState('networkidle');
      
      // Title should contain tour name (which we don't know exactly, but it shouldn't just be the default)
      const title = await page.title();
      expect(title).not.toEqual('Simplifly Finland — Luxury Travel to Sri Lanka & Maldives');
      expect(title).toContain('Simplifly Finland');
      
      // Description should be dynamic
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      
      // OG Image should be set
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toBeTruthy();
    }
  });

  test('resort detail page has dynamic SEO metadata', async ({ page }) => {
    // Navigate to a resort detail page
    await page.goto('/maldives-resorts/all');
    await page.waitForLoadState('networkidle');
    const resortLink = page.locator('a[href*="/maldives-resorts/"]').filter({
      has: page.locator('img')
    }).first();
    
    if (await resortLink.isVisible()) {
      await resortLink.click();
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).not.toEqual('Simplifly Finland — Luxury Travel to Sri Lanka & Maldives');
      expect(title).toContain('Simplifly Finland');
      
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toBeTruthy();
    }
  });

  test('blog detail page has dynamic SEO metadata', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    const blogLink = page.locator('a[href*="/blog/"]').first();
    
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title).not.toEqual('Simplifly Finland — Luxury Travel to Sri Lanka & Maldives');
      
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toBeTruthy();
    }
  });

});
