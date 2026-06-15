import { test, expect } from '@playwright/test';

test.describe('CarbonWise User Flow', () => {
  test('should complete the carbon footprint calculator', async ({ page }) => {
    // 1. Visit the home page
    await page.goto('/');
    
    // Check that we're on the home page
    await expect(page.locator('h1')).toContainText('Carbon Footprint');
    
    // 2. Click "Calculate Footprint" CTA
    await page.click('.btn-hero-cta');
    
    // We should be on the calculator page (hash routing)
    expect(page.url()).toContain('#/calculator');
    await expect(page.locator('h2').first()).toContainText('Transport');
    
    // 3. Fill out the form (we can just click Next on each tab as defaults are fine for a basic test)
    // Click Next to Home
    await page.click('button:has-text("Next")');
    await expect(page.locator('h2').first()).toContainText('Home Energy');
    
    // Click Next to Diet
    await page.click('button:has-text("Next")');
    await expect(page.locator('h2').first()).toContainText('Diet');
    
    // Click Next to Shopping
    await page.click('button:has-text("Next")');
    await expect(page.locator('h2').first()).toContainText('Shopping');
    
    // 4. Submit the form
    await page.click('button:has-text("Calculate Results")');
    
    // 5. Verify we are redirected to Dashboard
    await page.waitForURL('**/#/dashboard');
    expect(page.url()).toContain('#/dashboard');
    
    // 6. Verify Dashboard content renders
    await expect(page.locator('h1')).toContainText('Your Personal Dashboard');
    await expect(page.locator('canvas').first()).toBeVisible();
    
    // The total score should be visible
    const statsCards = page.locator('.stats-card');
    await expect(statsCards.first()).toBeVisible();
  });
});
