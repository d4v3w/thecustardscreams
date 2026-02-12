import { expect, test } from '@playwright/test';

/**
 * Integration tests for navigation race condition fix
 * Feature: navigation-hash-sync-race-condition-fix
 * Requirements: 2.1, 2.2, 6.2, 7.4
 * 
 * Tests verify that navigation works reliably after programmatic scrolls complete,
 * ensuring the programmaticScrollRef flag is cleared at the right time.
 * 
 * Test Coverage:
 * - Test 1: Verifies navigation works reliably across 5 iterations (Req 2.1, 2.2, 7.4)
 * - Test 2: Verifies rapid navigation clicks don't cause stuck behavior (Req 2.2, 7.1)
 * - Test 3: Verifies manual scroll after programmatic scroll updates hash correctly (Req 6.2, 7.4)
 */

test.describe('Navigation Race Condition Fix', () => {
  test('should navigate reliably after programmatic scroll completes - 5 iterations', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('load');
    
    // Dismiss cookie consent if present
    try {
      const rejectButton = page.getByRole('button', { name: /Reject all/i });
      if (await rejectButton.isVisible({ timeout: 2000 })) {
        await rejectButton.click();
        await page.waitForTimeout(500);
      }
    } catch {
      // Cookie consent not present or already dismissed
    }
    
    // Test sequence: shows -> music -> about -> home
    // Repeat 5 times to verify no race condition occurs
    const sequence = [
      { id: 'shows', ariaLabel: 'Upcoming and past live shows' },
      { id: 'music', ariaLabel: 'Music streaming and downloads' },
      { id: 'about', ariaLabel: 'About the band' },
      { id: 'home', ariaLabel: 'Home section with band introduction' },
    ];
    
    // Repeat navigation sequence 5 times to ensure reliability
    for (let iteration = 1; iteration <= 5; iteration++) {
      for (const section of sequence) {
        // Click the navigation button using exact aria-label
        await page.locator(`button[aria-label="${section.ariaLabel}"]`).click();
        
        // Wait for URL hash to update
        await page.waitForURL(`**/#${section.id}`, { timeout: 3000 });
        
        // Wait for section to be in viewport (scroll complete)
        await expect(page.locator(`section#${section.id}`)).toBeInViewport({ timeout: 3000 });
        
        // Wait for programmaticScrollRef flag to clear (100ms after scroll stops)
        await page.waitForTimeout(150);
      }
    }
    
    // If we got here without timing out, the race condition is fixed
    expect(page.url()).toContain('#home');
  });
  
  
  test('should handle rapid navigation clicks without getting stuck', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('load');
    
    // Dismiss cookie consent if present
    try {
      const rejectButton = page.getByRole('button', { name: /Reject all/i });
      if (await rejectButton.isVisible({ timeout: 2000 })) {
        await rejectButton.click();
        await page.waitForTimeout(500);
      }
    } catch {
      // Cookie consent not present or already dismissed
    }
    
    // Define sections to navigate through rapidly
    const sections = [
      { id: 'shows', ariaLabel: 'Upcoming and past live shows' },
      { id: 'music', ariaLabel: 'Music streaming and downloads' },
      { id: 'about', ariaLabel: 'About the band' },
      { id: 'home', ariaLabel: 'Home section with band introduction' },
    ];
    
    // Click through all sections rapidly (minimal wait between clicks)
    for (const section of sections) {
      await page.locator(`button[aria-label="${section.ariaLabel}"]`).click();
      
      // Only wait for URL to update, don't wait for scroll to complete
      await page.waitForURL(`**/#${section.id}`, { timeout: 2000 });
      
      // Small delay between clicks (50ms) to simulate rapid clicking
      await page.waitForTimeout(50);
    }
    
    // After rapid clicks, verify the last section is visible
    const lastSection = sections[sections.length - 1];
    await expect(page.locator(`section#${lastSection?.id}`)).toBeInViewport({ timeout: 3000 });
    
    // Verify URL is correct
    expect(page.url()).toContain(`#${lastSection?.id}`);
  });
  
  
  test('should navigate correctly after manual scroll', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    await page.waitForLoadState('load');
    
    // Dismiss cookie consent if present to avoid interference
    try {
      const rejectButton = page.getByRole('button', { name: /Reject all/i });
      if (await rejectButton.isVisible({ timeout: 2000 })) {
        await rejectButton.click();
        await page.waitForTimeout(500);
      }
    } catch {
      // Cookie consent not present or already dismissed
    }
    
    // STEP 1: Click nav item to trigger programmatic scroll
    await page.locator('button[aria-label="Music streaming and downloads"]').click();
    await page.waitForURL('**/#music', { timeout: 3000 });
    await expect(page.locator('section#music')).toBeInViewport({ timeout: 3000 });
    
    // STEP 2: Wait for scroll completion (programmaticScrollRef flag to clear)
    // Flag clears 100ms after scrolling stops, so 150ms is safe
    await page.waitForTimeout(150);
    
    // Verify we're at music section
    expect(page.url()).toContain('#music');
    
    // STEP 3: Simulate manual scroll (fire scroll events)
    // Mouse wheel simulates user scrolling down to shows section
    await page.mouse.wheel(0, 800);
    
    // Wait for scroll to settle and debounce timer (150ms) to complete
    await page.waitForTimeout(300);
    
    // STEP 4: Verify hash updates correctly via IntersectionObserver
    // This confirms IntersectionObserver is working after programmatic scroll
    // and that the programmaticScrollRef flag was properly cleared
    await page.waitForURL('**/#shows', { timeout: 2000 });
    expect(page.url()).toContain('#shows');
    
    // STEP 5: Verify IntersectionObserver updates work
    // Shows section should be in viewport after manual scroll
    await expect(page.locator('section#shows')).toBeInViewport();
    
    // BONUS: Verify navigation still works after manual scroll
    // Click to navigate to about section (programmatic scroll again)
    await page.locator('button[aria-label="About the band"]').click();
    await page.waitForURL('**/#about', { timeout: 3000 });
    await expect(page.locator('section#about')).toBeInViewport({ timeout: 3000 });
    
    // Verify navigation worked after manual scroll
    expect(page.url()).toContain('#about');
  });
});
