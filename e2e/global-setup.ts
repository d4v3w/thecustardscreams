import { chromium, type FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Sets cookie consent in localStorage to prevent banner from appearing in tests
 */
async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the site
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';
  await page.goto(baseURL);
  
  // Set cookie consent in localStorage
  await page.evaluate(() => {
    localStorage.setItem('custard-screams-cookie-consent', JSON.stringify({
      categories: { essential: true, analytics: false, marketing: false },
      timestamp: Date.now(),
      version: 2,
      method: 'reject-all'
    }));
  });
  
  // Save storage state for reuse
  await page.context().storageState({ path: 'e2e/.auth/storage.json' });
  
  await browser.close();
}

export default globalSetup;
