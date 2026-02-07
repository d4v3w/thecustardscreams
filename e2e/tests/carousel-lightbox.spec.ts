import { expect, test } from '@playwright/test';

test.describe('Image Carousel with Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display carousel in Previous Shows section', async ({ page }) => {
    // Scroll to shows section
    await page.locator('text=Shows').click();
    await page.waitForTimeout(1000);

    // Check carousel is visible
    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    await expect(carousel).toBeVisible({ timeout: 10000 });

    // Check all three images are present
    const images = carousel.locator('img');
    await expect(images).toHaveCount(3);
  });

  test('should display navigation and pagination', async ({ page }) => {
    await page.locator('text=Shows').click();
    await page.waitForTimeout(1000);

    // Check navigation buttons
    await expect(page.getByLabel('Previous image')).toBeVisible();
    await expect(page.getByLabel('Next image')).toBeVisible();

    // Check pagination dots
    const dots = page.locator('[role="tab"]');
    await expect(dots).toHaveCount(3);
  });

  test('should navigate using next button', async ({ page }) => {
    await page.locator('text=Shows').click();
    await page.waitForTimeout(1000);

    const nextButton = page.getByLabel('Next image');
    const dots = page.locator('[role="tab"]');

    // First dot should be active initially
    await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');

    // Click next
    await nextButton.click();
    await page.waitForTimeout(800);

    // Second dot should be active
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  });

  test('should open and close lightbox', async ({ page }) => {
    await page.locator('text=Shows').click();
    await page.waitForTimeout(1000);

    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    const firstImageButton = carousel.locator('button').first();

    // Click first image
    await firstImageButton.click();
    await page.waitForTimeout(500);

    // Lightbox should be visible
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();

    // Close with button
    const closeButton = page.getByLabel('Close lightbox');
    await closeButton.click();
    await page.waitForTimeout(500);

    // Dialog should be closed
    await expect(dialog).not.toBeVisible();
  });

  test('should close lightbox with Escape key', async ({ page }) => {
    await page.locator('text=Shows').click();
    await page.waitForTimeout(1000);

    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    const firstImageButton = carousel.locator('button').first();

    // Open lightbox
    await firstImageButton.click();
    await page.waitForTimeout(500);

    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Dialog should be closed
    await expect(dialog).not.toBeVisible();
  });

  test('should have proper accessibility labels', async ({ page }) => {
    await page.locator('text=Shows').click();
    await page.waitForTimeout(1000);

    // Check carousel region
    await expect(page.locator('[role="region"][aria-label="Previous shows gallery"]')).toBeVisible();

    // Check navigation buttons
    await expect(page.getByLabel('Previous image')).toBeVisible();
    await expect(page.getByLabel('Next image')).toBeVisible();

    // Check pagination
    await expect(page.getByLabel('Go to image 1 of 3')).toBeVisible();
    await expect(page.getByLabel('Go to image 2 of 3')).toBeVisible();
    await expect(page.getByLabel('Go to image 3 of 3')).toBeVisible();
  });
});
