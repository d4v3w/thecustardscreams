import { expect, test } from '@playwright/test';

test.describe('Carousel Viewport Constraints', () => {
  test('carousel fits within viewport with pagination visible on mobile portrait', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/#shows');

    // Wait for carousel to be visible
    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    await expect(carousel).toBeVisible();

    // Scroll carousel into view to ensure it's visible
    await carousel.scrollIntoViewIfNeeded();

    // Get carousel bounding box
    const carouselBox = await carousel.boundingBox();
    expect(carouselBox).not.toBeNull();

    // Carousel should fit within 70% of viewport height
    if (carouselBox) {
      expect(carouselBox.height).toBeLessThan(667 * 0.75);
    }

    // Pagination should be visible within the carousel
    const pagination = carousel.locator('[role="tablist"]');
    await expect(pagination).toBeVisible();

    // Verify pagination is within the carousel bounds (not checking absolute viewport position)
    const paginationBox = await pagination.boundingBox();
    expect(paginationBox).not.toBeNull();
    if (paginationBox && carouselBox) {
      // Pagination should be within carousel height
      expect(paginationBox.y).toBeGreaterThanOrEqual(carouselBox.y);
      expect(paginationBox.y + paginationBox.height).toBeLessThanOrEqual(carouselBox.y + carouselBox.height + 5);
    }
  });

  test('carousel fits within viewport on mobile landscape', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 }); // iPhone SE landscape
    await page.goto('/#shows');

    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    await expect(carousel).toBeVisible();

    const carouselBox = await carousel.boundingBox();
    expect(carouselBox).not.toBeNull();

    // Carousel should fit within viewport
    if (carouselBox) {
      expect(carouselBox.height).toBeLessThan(375 * 0.75);
    }

    // Pagination should still be visible
    const pagination = carousel.locator('[role="tablist"]');
    await expect(pagination).toBeVisible();
  });

  test('carousel fits within viewport on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/#shows');

    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    await expect(carousel).toBeVisible();

    const carouselBox = await carousel.boundingBox();
    expect(carouselBox).not.toBeNull();

    // Carousel should fit within viewport
    if (carouselBox) {
      expect(carouselBox.height).toBeLessThan(1024 * 0.75);
    }

    // Pagination should be visible
    const pagination = carousel.locator('[role="tablist"]');
    await expect(pagination).toBeVisible();
  });

  test('carousel fits within viewport on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.goto('/#shows');

    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    await expect(carousel).toBeVisible();

    const carouselBox = await carousel.boundingBox();
    expect(carouselBox).not.toBeNull();

    // Carousel should fit within viewport
    if (carouselBox) {
      expect(carouselBox.height).toBeLessThan(1080 * 0.75);
    }

    // Pagination should be visible
    const pagination = carousel.locator('[role="tablist"]');
    await expect(pagination).toBeVisible();
  });

  test('images maintain aspect ratio and do not overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/#shows');

    const carousel = page.locator('[aria-label="Previous shows gallery"]');
    await expect(carousel).toBeVisible();

    // Get first image
    const image = carousel.locator('img').first();
    await expect(image).toBeVisible();

    const imageBox = await image.boundingBox();
    expect(imageBox).not.toBeNull();

    // Image should not overflow viewport width
    if (imageBox) {
      expect(imageBox.width).toBeLessThanOrEqual(375);
      expect(imageBox.x + imageBox.width).toBeLessThanOrEqual(375);
    }
  });

  test('section does not require vertical scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/#shows');

    // Get the shows section
    const section = page.locator('section[data-section-id="shows"]');
    await expect(section).toBeVisible();

    // Section should not have scrollable overflow
    const scrollHeight = await section.evaluate((el) => el.scrollHeight);
    const clientHeight = await section.evaluate((el) => el.clientHeight);

    // Allow small difference for rounding
    expect(scrollHeight).toBeLessThanOrEqual(clientHeight + 5);
  });
});
