import { test, expect } from '@playwright/test';

/**
 * 4. SRI LANKA TOURS TESTS
 * Verifies landing, categories, detail page tabs (itinerary, includes, payment).
 */
test.describe('Sri Lanka Tours', () => {

  // ── 4.1 Landing Page ──
  test.describe('Landing Page', () => {
    test('page loads with correct title', async ({ page }) => {
      await page.goto('/sri-lanka-tours');
      await expect(page).toHaveTitle(/Sri Lanka/i);
    });

    test('tour categories are displayed', async ({ page }) => {
      await page.goto('/sri-lanka-tours');
      await page.waitForLoadState('networkidle');
      const categoryLinks = page.locator('a[href*="/sri-lanka-tours/"]');
      const count = await categoryLinks.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ── 4.3 All Tours Page ──
  test.describe('All Tours Page', () => {
    test('page loads and shows tours', async ({ page }) => {
      await page.goto('/sri-lanka-tours/all');
      await page.waitForLoadState('networkidle');
      const tourCards = page.locator('a[href*="/sri-lanka-tours/"]');
      const count = await tourCards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ── 4.4–4.9 Tour Detail Page ──
  test.describe('Tour Detail Page', () => {
    // Helper to navigate to the first tour detail page
    async function goToFirstTour(page: any) {
      await page.goto('/sri-lanka-tours/all');
      await page.waitForLoadState('networkidle');
      const tourLink = page.locator('a[href*="/sri-lanka-tours/"]').filter({
        has: page.locator('img')
      }).first();
      if (await tourLink.isVisible()) {
        await tourLink.click();
        await page.waitForLoadState('networkidle');
        return true;
      }
      return false;
    }

    test('hero section shows tour title, duration, price', async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      await expect(page.locator('h1').first()).toBeVisible();
      // Should show duration info (Nights/Days)
      await expect(page.getByText(/Night/i).first()).toBeVisible();
    });

    test('tab navigation is visible with all tabs', async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      await expect(page.getByText(/Itinerary/i).first()).toBeVisible();
      await expect(page.getByText(/What's Included/i).first()).toBeVisible();
      await expect(page.getByText(/Insightful Tips/i).first()).toBeVisible();
      await expect(page.getByText(/Terms & Conditions/i).first()).toBeVisible();
      await expect(page.getByText(/Payment & Cancellation/i).first()).toBeVisible();
    });

    // ── 4.5 Itinerary Tab ──
    test('itinerary tab shows day cards', async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      // Click Itinerary tab
      await page.getByText(/Itinerary/i).first().click();
      await page.waitForTimeout(500);

      // Should show day numbers
      await expect(page.getByText(/DAY/i).first()).toBeVisible();
    });

    // ── 4.6 What's Included Tab ──
    test("What's Included tab shows correct items", async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      // Click What's Included tab
      await page.getByText(/What's Included/i).first().click();
      await page.waitForTimeout(500);

      // Verify Included items
      await expect(page.getByText(/Meet & assistance at the Airport/i)).toBeVisible();
      await expect(page.getByText(/Map of Sri Lanka/i)).toBeVisible();
      await expect(page.getByText(/Free upgrades on availability/i)).toBeVisible();
      await expect(page.getByText(/Accommodation on HB Basis/i)).toBeVisible();
      await expect(page.getByText(/English Speaking Chauffer Driver/i)).toBeVisible();
      await expect(page.getByText(/Sightseeing visits and Entrance Fees/i)).toBeVisible();

      // Verify Not Included items
      await expect(page.getByText(/Not Included/i).first()).toBeVisible();
      await expect(page.getByText(/Airfare and VISA charges/i)).toBeVisible();
      await expect(page.getByText(/Lunches/i).first()).toBeVisible();
      await expect(page.getByText(/Video and Camera permits/i)).toBeVisible();
      await expect(page.getByText(/Travel Insurance/i)).toBeVisible();
    });

    // ── 4.7 Insightful Tips Tab ──
    test('Insightful Tips tab renders tips', async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      await page.getByText(/Insightful Tips/i).first().click();
      await page.waitForTimeout(500);

      await expect(page.getByText(/Climate/i).first()).toBeVisible();
      await expect(page.getByText(/Temple Dress Code/i)).toBeVisible();
    });

    test('ETA link is clickable in tips', async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      await page.getByText(/Insightful Tips/i).first().click();
      await page.waitForTimeout(500);

      const etaLink = page.locator('a[href="https://eta.gov.lk/slvisa/"]');
      await expect(etaLink).toBeVisible();
    });

    // ── 4.8 Terms & Conditions Tab ──
    test('Terms & Conditions tab shows clauses', async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      await page.getByText(/Terms & Conditions/i).first().click();
      await page.waitForTimeout(500);

      await expect(page.getByText(/Booking & Confirmation/i)).toBeVisible();
      await expect(page.getByText(/Passport & Visas/i)).toBeVisible();
      await expect(page.getByText(/Insurance/i).first()).toBeVisible();
      await expect(page.getByText(/Alterations to Itinerary/i)).toBeVisible();
    });

    // ── 4.9 Payment & Cancellation Tab ──
    test('Payment & Cancellation tab shows correct percentages', async ({ page }) => {
      const found = await goToFirstTour(page);
      if (!found) return;

      await page.getByText(/Payment & Cancellation/i).first().click();
      await page.waitForTimeout(500);

      // Payment Schedule
      await expect(page.getByText(/50% deposit/i)).toBeVisible();
      await expect(page.getByText(/Remaining 50%/i)).toBeVisible();
      await expect(page.getByText(/60 days/i).first()).toBeVisible();

      // Cancellation Terms
      await expect(page.getByText(/61\+ days before arrival/i)).toBeVisible();
      await expect(page.getByText(/30 – 60 days/i).or(page.getByText(/30 - 60 days/i))).toBeVisible();
      await expect(page.getByText(/29 days or less/i)).toBeVisible();
      await expect(page.getByText(/Full Refund/i)).toBeVisible();
      await expect(page.getByText(/50% Cancellation/i)).toBeVisible();
      await expect(page.getByText(/100% No Refund/i)).toBeVisible();
    });
  });

  // ── 4.10 Tour Inquiry Form ──
  test.describe('Tour Inquiry Form', () => {
    test('inquiry form is present on tour detail page', async ({ page }) => {
      await page.goto('/sri-lanka-tours/all');
      await page.waitForLoadState('networkidle');
      const tourLink = page.locator('a[href*="/sri-lanka-tours/"]').filter({
        has: page.locator('img')
      }).first();
      if (await tourLink.isVisible()) {
        await tourLink.click();
        await page.waitForLoadState('networkidle');

        // Inquiry form should be present
        const form = page.locator('form');
        await expect(form.first()).toBeVisible();
      }
    });
  });
});
