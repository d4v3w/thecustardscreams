# E2E Testing with Playwright

## Overview

This directory contains end-to-end (E2E) tests for The Custard Screams website using [Playwright](https://playwright.dev/). Playwright enables automated browser testing across Chromium, Firefox, and WebKit, providing comprehensive coverage for UI functionality and visual regression testing.

## Why Playwright?

- **Cross-browser testing**: Test on Chromium, Firefox, and WebKit
- **Visual regression**: Capture and compare screenshots to detect UI changes
- **Real browser testing**: Tests run in actual browsers, not simulated environments
- **Debugging tools**: Built-in UI mode, trace viewer, and video recording
- **CI/CD ready**: Designed for automated testing in continuous integration

## Relationship with Jest

This project uses two complementary testing strategies:

**Jest (Unit Tests)** - Located in `src/__tests__/`:
- Component rendering in isolation
- Utility function logic
- Hook behavior
- Fast execution, no browser required

**Playwright (E2E Tests)** - Located in `e2e/tests/`:
- Full page rendering in real browsers
- User interaction flows
- Navigation between pages
- Visual regression testing
- Cross-browser compatibility

## Getting Started

### Installation

Install Playwright browsers (only needed once):

```bash
pnpm playwright:install
```

### Running Tests

```bash
# Run all E2E tests (headless mode)
pnpm test:e2e

# Run tests in headed mode (see the browser)
pnpm test:e2e:headed

# Run tests in UI mode (interactive debugging)
pnpm test:e2e:ui

# Run tests in debug mode (step through tests)
pnpm test:e2e:debug

# Run tests in specific browser only
pnpm test:e2e:chromium

# View test report
pnpm test:e2e:report

# Run both Jest and Playwright tests
pnpm test:all
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Interact with elements
    await page.click('button');
    
    // Make assertions
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Using Test Helpers

```typescript
import { navigateToPage, waitForElement } from '../fixtures/test-helpers';

test('should use helpers', async ({ page }) => {
  await navigateToPage(page, '/music');
  await waitForElement(page, '.music-player');
});
```

### Visual Regression Testing

```typescript
test('should match visual snapshot', async ({ page }) => {
  await page.goto('/');
  
  // Compare against baseline screenshot
  await expect(page).toHaveScreenshot('page-name.png', {
    fullPage: true,
    maxDiffPixels: 100,
  });
});
```

## Visual Regression Testing

### How It Works

1. **First run**: Playwright captures baseline screenshots
2. **Subsequent runs**: Compares current screenshots against baselines
3. **Differences detected**: Test fails and shows visual diff
4. **Intentional changes**: Update baselines with `--update-snapshots`

### Updating Baselines

When you make intentional UI changes:

```bash
# Update all snapshots
pnpm test:e2e --update-snapshots

# Update snapshots for specific test
pnpm test:e2e home.spec.ts --update-snapshots
```

**Important**: Review visual diffs carefully before updating baselines to ensure changes are intentional.

### Baseline Storage

- Baselines are stored in `e2e/screenshots/`
- Organized by browser (chromium, firefox, webkit)
- Committed to git for version control

## Debugging Failed Tests

### 1. Check Test Output

The console output shows which test failed and why:

```
Error: expect(locator).toBeVisible()
Expected: visible
Received: hidden
```

### 2. Review Screenshots

Failed tests automatically capture screenshots:

```
test-results/
  home-page-should-render/
    test-failed-1.png
```

### 3. Watch Video Recordings

Videos are recorded for failed tests:

```
test-results/
  home-page-should-render/
    video.webm
```

### 4. Use Trace Viewer

Traces provide detailed debugging information:

```bash
pnpm playwright show-trace test-results/trace.zip
```

### 5. Run in UI Mode

Interactive debugging with time-travel:

```bash
pnpm test:e2e:ui
```

## CI Integration

Tests run automatically in GitHub Actions on every push and pull request.

### CI Configuration

- Runs in headless mode
- Uses single worker to avoid resource contention
- Retries flaky tests up to 2 times
- Uploads test artifacts (screenshots, videos, reports) on failure
- Artifacts retained for 30 days

### Viewing CI Results

1. Go to GitHub Actions tab
2. Click on the workflow run
3. Download artifacts if tests failed
4. Review screenshots and videos to debug issues

## AI Agent Integration

Playwright tests can be run programmatically by AI agents to verify UI changes.

### Running Tests Programmatically

```bash
# Run tests and get JSON output
pnpm test:e2e --reporter=json

# Check exit code
echo $?  # 0 = passed, non-zero = failed

# Parse JSON results
cat playwright-report/results.json
```

### JSON Output Format

```json
{
  "status": "passed" | "failed" | "timedOut" | "skipped",
  "duration": 1234,
  "errors": [
    {
      "message": "Error message",
      "location": { "file": "test.spec.ts", "line": 10 }
    }
  ],
  "attachments": [
    {
      "name": "screenshot",
      "path": "test-results/screenshot.png",
      "contentType": "image/png"
    }
  ]
}
```

### Running Specific Tests

```bash
# Run specific test file
pnpm test:e2e e2e/tests/home.spec.ts

# Run tests matching pattern
pnpm test:e2e --grep "navigation"
```

## Test Organization

```
e2e/
├── tests/              # Test files
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── music.spec.ts
│   └── shows.spec.ts
├── fixtures/           # Test helpers and utilities
│   └── test-helpers.ts
├── screenshots/        # Visual regression baselines
└── README.md          # This file
```

## Best Practices

### 1. Test User Flows, Not Implementation

❌ Bad:
```typescript
test('should call handleClick', async ({ page }) => {
  // Testing implementation details
});
```

✅ Good:
```typescript
test('should navigate to music page when clicking music link', async ({ page }) => {
  // Testing user behavior
});
```

### 2. Use Meaningful Selectors

❌ Bad:
```typescript
await page.click('.btn-123');
```

✅ Good:
```typescript
await page.click('button[aria-label="Play music"]');
```

### 3. Wait for Elements Properly

❌ Bad:
```typescript
await page.waitForTimeout(1000); // Arbitrary wait
```

✅ Good:
```typescript
await page.waitForSelector('.music-player', { state: 'visible' });
```

### 4. Keep Tests Independent

Each test should be able to run independently without relying on other tests.

### 5. Use Test Helpers

Reuse common operations through test helpers to keep tests DRY.

## Troubleshooting

### Tests Fail Locally But Pass in CI

- Check if you have the latest browsers installed: `pnpm playwright:install`
- Ensure your dev server is running on port 3000
- Clear browser cache and try again

### Visual Tests Fail with Small Differences

- Adjust `maxDiffPixels` threshold in test
- Disable animations in tests for consistency
- Ensure fonts are loaded before taking screenshots

### Tests Timeout

- Increase timeout in `playwright.config.ts`
- Check if server is slow to start
- Investigate slow network requests

### Browser Not Found

Run `pnpm playwright:install` to install browsers.

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)

## Support

For questions or issues:
1. Check this README
2. Review Playwright documentation
3. Check test output and artifacts
4. Use UI mode for interactive debugging
