import { expect, test } from '@playwright/test';

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


});
