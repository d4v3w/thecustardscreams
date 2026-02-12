import { expect, test } from '@playwright/test';

test.describe('Shows Page', () => {
  test('should load shows page and display content', async ({ page }) => {
    await page.goto('/live-shows');
    
    // Verify page loaded with article content (use first() since there are multiple)
    await expect(page.locator('article').first()).toBeVisible();
    
    // Verify page has the shows heading
    await expect(page.locator('h1')).toContainText(/Live Shows|Gigs|Events/i);
  });

  test('should display show-related elements', async ({ page }) => {
    await page.goto('/live-shows');
    
    // Wait for article content to be visible (use first() since there are multiple)
    await expect(page.locator('article').first()).toBeVisible();
    
    // Verify the page has loaded with shows content
    const hasHeading = await page.locator('h2').filter({ hasText: /Upcoming shows/i }).count() > 0;
    expect(hasHeading).toBeTruthy();
  });


});
