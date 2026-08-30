import { expect, test, type Page } from '@playwright/test';

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
    
    // Verify URL changed back to home (may include #home hash)
    expect(page.url()).toMatch(/\/(#home)?$/);
  });

  test('should use browser back button', async ({ page }) => {
    await page.goto('/');

    // Navigate to music page
    await page.goto('/music');
    await expect(page).toHaveURL('/music');

    // Use browser back button
    await page.goBack();

    // Verify we're back on home page (may include #home hash)
    expect(page.url()).toMatch(/\/(#home)?$/);
  });
});

test.describe('Single-page section navigation (bottom nav)', () => {
  // Regression coverage for a bug found while auditing scroll behavior:
  // a burst of rapid bottom-nav clicks could leave the URL hash (and the
  // active nav highlight) pointing at a different section than what was
  // actually on screen. See src/hooks/useHashSync.ts for the root cause.

  const navButton = (page: Page, ariaLabel: string) =>
    page.locator('nav').getByRole('button', { name: ariaLabel, exact: true });

  async function sectionOffsetTop(page: Page, sectionId: string) {
    return page.evaluate(
      (id) => document.querySelector(`[data-section-id="${id}"]`)?.getBoundingClientRect().top,
      sectionId,
    );
  }

  test('final scroll position matches the final hash after a rapid click burst', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    // Fire a burst of clicks with no waiting between them - the exact
    // condition that used to desync the hash from the visible section.
    await navButton(page, 'Music streaming and downloads').click();
    await navButton(page, 'About the band').click();
    await navButton(page, 'Upcoming and past live shows').click();
    await navButton(page, 'Home section with band introduction').click();

    // Let the (possibly interrupted) scroll animation settle.
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/#home$/);

    // The section named in the hash must be the one actually in view -
    // i.e. its top must be at (or essentially at) the viewport top.
    const homeTop = await sectionOffsetTop(page, 'home');
    expect(Math.abs(homeTop ?? Infinity)).toBeLessThan(10);
  });

  test('a click issued mid-scroll still lands on its own target, not an earlier one', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    await navButton(page, 'Music streaming and downloads').click();
    await page.waitForTimeout(250); // interrupt while the scroll is still animating
    await navButton(page, 'Upcoming and past live shows').click();

    await page.waitForTimeout(1500);

    await expect(page).toHaveURL(/#shows$/);
    const showsTop = await sectionOffsetTop(page, 'shows');
    expect(Math.abs(showsTop ?? Infinity)).toBeLessThan(10);
  });
});

