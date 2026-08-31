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
    expect(Math.abs(homeTop ?? Infinity)).toBeLessThan(30);
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
    expect(Math.abs(showsTop ?? Infinity)).toBeLessThan(30);
  });

  // Reported after the first round of fixes: pressing every nav item one
  // after another (a few ms apart) - or mashing a single item repeatedly -
  // while the page was still scrolling into position could leave navigation
  // "stuck", where nothing further worked. Also reported: visible judder
  // while a single nav item is pressed repeatedly mid-scroll.

  async function clickAllNavItemsRapidly(page: Page) {
    const labels = [
      'Music streaming and downloads',
      'Upcoming and past live shows',
      'About the band',
      'Home section with band introduction',
    ];
    for (const label of labels) {
      await navButton(page, label).click();
      await page.waitForTimeout(20); // "several ms apart"
    }
  }

  test('navigation keeps responding after pressing every nav item rapidly, several ms apart', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    await clickAllNavItemsRapidly(page);
    await page.waitForTimeout(2000);

    // The reported failure: after a burst like this, nothing further
    // worked. A fresh click must still take effect.
    await navButton(page, 'Upcoming and past live shows').click();
    await page.waitForTimeout(1500);

    await expect(page).toHaveURL(/#shows$/);
    const showsTop = await sectionOffsetTop(page, 'shows');
    expect(Math.abs(showsTop ?? Infinity)).toBeLessThan(30);
  });

  test('navigation keeps responding after clicking one nav item rapidly 6 times', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    const about = navButton(page, 'About the band');
    for (let i = 0; i < 6; i++) {
      await about.click();
      await page.waitForTimeout(20);
    }
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/#about$/);
    const aboutTop = await sectionOffsetTop(page, 'about');
    expect(Math.abs(aboutTop ?? Infinity)).toBeLessThan(30);

    // A different section must still be reachable right after the mashing.
    await navButton(page, 'Home section with band introduction').click();
    await page.waitForTimeout(1500);

    await expect(page).toHaveURL(/#home$/);
    const homeTop = await sectionOffsetTop(page, 'home');
    expect(Math.abs(homeTop ?? Infinity)).toBeLessThan(30);
  });

  test('mashing one nav item mid-scroll does not repeatedly restart the scroll animation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    // Count real scrollIntoView invocations on the target section - each
    // one restarts the native smooth-scroll animation and is what produced
    // the reported judder.
    await page.evaluate(() => {
      (window as any).__scrollIntoViewCalls = 0;
      const el = document.querySelector('[data-section-id="about"]') as HTMLElement;
      const original = el.scrollIntoView.bind(el);
      el.scrollIntoView = ((...args: Parameters<typeof original>) => {
        (window as any).__scrollIntoViewCalls++;
        return original(...args);
      }) as typeof el.scrollIntoView;
    });

    const about = navButton(page, 'About the band');
    for (let i = 0; i < 6; i++) {
      await about.click();
      await page.waitForTimeout(20);
    }
    await page.waitForTimeout(2000);

    const calls = await page.evaluate(() => (window as any).__scrollIntoViewCalls);
    // Only the first press of a still in-flight target should actually
    // trigger a scroll; the rest are no-ops on an already-headed-there scroll.
    expect(calls).toBe(1);
  });
});

test.describe('Footer reachability on the single-page home layout', () => {
  // Reported: the "Cookie Settings" link at the bottom of the home page
  // didn't work. Root cause: the footer trails the last scroll-snap
  // section (About) but had no snap point of its own, so with
  // scroll-snap-type: y mandatory on body, the browser always snapped
  // back to About and never let the page scroll far enough to bring the
  // footer fully into view - the link was there, just unreachable.

  test('the footer and its Cookie Settings link are reachable by scrolling to the bottom', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    await page.evaluate(() => {
      document.body.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
    await page.waitForTimeout(500);

    const cookieSettingsLink = page.getByRole('button', { name: 'Open cookie preferences', exact: true });
    await expect(cookieSettingsLink).toBeInViewport();

    await cookieSettingsLink.click();
    await expect(page.getByRole('dialog', { name: 'Cookie Preferences' })).toBeVisible();
  });

  test('navigation still works normally after opening cookie settings from the footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    await page.evaluate(() => {
      document.body.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
    });
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Open cookie preferences', exact: true }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.waitForTimeout(300);

    await page.locator('nav').getByRole('button', { name: 'Home section with band introduction', exact: true }).click();
    await page.waitForTimeout(1500);

    await expect(page).toHaveURL(/#home$/);
    const homeTop = await page.evaluate(
      () => document.querySelector('[data-section-id="home"]')?.getBoundingClientRect().top,
    );
    expect(Math.abs(homeTop ?? Infinity)).toBeLessThan(30);
  });
});

