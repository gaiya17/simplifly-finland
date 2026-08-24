import { test, expect } from '@playwright/test';

/**
 * 11. API INTEGRATION TESTS
 * Verifies that the public API endpoints are responding correctly.
 */
test.describe('API Integration', () => {

  test('GET /api/homepage returns successful config', async ({ request }) => {
    const response = await request.get('/api/homepage');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    // Check basic structure
    expect(data).toHaveProperty('hero');
    expect(data).toHaveProperty('featuredDestinations');
    expect(data).toHaveProperty('featuredResorts');
  });

  test('GET /api/tours/categories returns array', async ({ request }) => {
    const response = await request.get('/api/tours/categories');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GET /api/resorts/categories returns array', async ({ request }) => {
    const response = await request.get('/api/resorts/categories');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('GET /api/blogs returns array', async ({ request }) => {
    const response = await request.get('/api/blogs');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/inquiries rejects missing fields', async ({ request }) => {
    const response = await request.post('/api/inquiries', {
      data: {
        // Missing required fields
        firstName: 'Test'
      }
    });
    
    // Assuming backend validates and returns 400
    expect(response.status()).toBe(400);
  });

});
