import { expect, test } from '@playwright/test';

test.describe('Music Page', () => {
  test('should load music page and display content', async ({ page }) => {
    await page.goto('/music');
    
    // Verify page loaded with article content (use first() since there are multiple)
    await expect(page.locator('article').first()).toBeVisible();
    
    // Verify page has the music heading
    await expect(page.locator('h1')).toContainText(/About The Custard Screams|Music/i);
  });

  test('should display music-related elements', async ({ page }) => {
    await page.goto('/music');
    
    // Wait for article content to be visible (use first() since there are multiple)
    await expect(page.locator('article').first()).toBeVisible();
    
    // Verify Bandcamp iframes are present
    const iframes = page.locator('iframe[title*="Bandcamp"]');
    await expect(iframes.first()).toBeVisible();
  });


});
