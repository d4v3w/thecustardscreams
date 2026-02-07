import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Test helper utilities for Playwright E2E tests
 */

/**
 * Navigate to a page and wait for it to load
 */
export async function navigateToPage(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await waitForPageLoad(page);
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  // Use 'load' instead of 'networkidle' to avoid timeout issues with external resources
  await page.waitForLoadState('load');
}

/**
 * Wait for an element to be visible
 */
export async function waitForElement(page: Page, selector: string): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible' });
}

/**
 * Check if an element is visible
 */
export async function isElementVisible(page: Page, selector: string): Promise<boolean> {
  try {
    const element = await page.locator(selector);
    return await element.isVisible();
  } catch {
    return false;
  }
}

/**
 * Take a screenshot with a specific name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `e2e/screenshots/${name}`, fullPage: true });
}

/**
 * Compare screenshot against baseline
 */
export async function compareScreenshot(page: Page, name: string): Promise<void> {
  await expect(page).toHaveScreenshot(name);
}
