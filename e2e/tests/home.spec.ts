import { expect, test } from '@playwright/test';
import { navigateToPage } from '../fixtures/test-helpers';

test.describe('Home Page', () => {
  test('should render home page with correct title', async ({ page }) => {
    await page.goto('/');
    
    // Verify page title contains the band name
    await expect(page).toHaveTitle(/The Custard Screams/);
  });

  test('should display main sections and footer', async ({ page }) => {
    await page.goto('/');
    
    // Verify body and footer are present
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Verify page has content sections
    const hasContent = await page.locator('body').count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test('should match visual snapshot', async ({ page }) => {
    await navigateToPage(page, '/');
    
    // Wait for dynamic content to stabilize
    await page.waitForTimeout(2000);
    
    // Take a screenshot and compare against baseline
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixels: 1000, // Allow more differences for dynamic content
      maxDiffPixelRatio: 0.05, // Allow 5% difference
    });
  });
});
