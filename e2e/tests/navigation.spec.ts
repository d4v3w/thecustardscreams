import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to music page directly', async ({ page }) => {
    // Navigate directly to music page
    await page.goto('/music');
    
    // Verify URL
    await expect(page).toHaveURL('/music');
    
    // Verify music page content is visible
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('should navigate to shows page directly', async ({ page }) => {
    // Navigate directly to shows page
    await page.goto('/live-shows');
    
    // Verify URL
    await expect(page).toHaveURL('/live-shows');
    
    // Verify shows page content is visible
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.goto('/music');
    
    // Click on home link or navigate directly
    await page.goto('/');
    
    // Verify URL changed back to home
    await expect(page).toHaveURL('/');
  });

  test('should use browser back button', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to music page
    await page.goto('/music');
    await expect(page).toHaveURL('/music');
    
    // Use browser back button
    await page.goBack();
    
    // Verify we're back on home page
    await expect(page).toHaveURL('/');
  });
});

