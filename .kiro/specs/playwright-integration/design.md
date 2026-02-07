# Design Document: Playwright Integration

## Overview

This design document outlines the integration of Playwright into the existing Next.js application. Playwright will provide end-to-end testing capabilities with visual regression testing, working alongside the existing Jest unit testing framework. The integration will support local development, CI/CD environments, and AI agent automation.

### Key Design Decisions

1. **Separate Test Directories**: Playwright tests will live in `e2e/` directory at the project root, while Jest tests remain in `src/__tests__/`
2. **Browser Coverage**: Configure Chromium (primary), Firefox, and WebKit for cross-browser testing
3. **Visual Testing Strategy**: Use Playwright's built-in screenshot comparison with baseline images stored in `e2e/screenshots/`
4. **CI Integration**: Configure for GitHub Actions with artifact upload on failure
5. **AI Agent Support**: Provide clear npm scripts and JSON output format for programmatic test execution

## Architecture

### Directory Structure

```
project-root/
├── e2e/                          # Playwright E2E tests
│   ├── tests/                    # Test files
│   │   ├── home.spec.ts
│   │   ├── navigation.spec.ts
│   │   ├── music.spec.ts
│   │   └── shows.spec.ts
│   ├── fixtures/                 # Test fixtures and helpers
│   │   └── test-helpers.ts
│   ├── screenshots/              # Visual regression baselines
│   │   └── .gitkeep
│   └── README.md                 # E2E testing documentation
├── playwright.config.ts          # Playwright configuration
├── src/__tests__/                # Jest unit tests (existing)
└── package.json                  # Updated with Playwright scripts
```

### Test Separation Strategy

- **Jest**: Component-level unit tests, utility function tests, isolated logic testing
- **Playwright**: Full page rendering, user interactions, navigation flows, visual regression
- **No Overlap**: Each test type has distinct responsibilities to avoid duplication

## Components and Interfaces

### 1. Playwright Configuration (`playwright.config.ts`)

**Purpose**: Central configuration for all Playwright test execution

**Key Settings**:
```typescript
{
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
}
```

**Configuration Rationale**:
- **Parallel Execution**: Enabled for faster test runs
- **Retries in CI**: 2 retries to handle flaky tests in CI environments
- **Single Worker in CI**: Prevents resource contention in containerized environments
- **Multiple Reporters**: HTML for humans, JSON for AI agents, list for console output
- **Trace on Retry**: Captures detailed debugging info only when needed
- **Web Server**: Automatically starts Next.js dev server before tests

### 2. Test Helpers (`e2e/fixtures/test-helpers.ts`)

**Purpose**: Reusable utilities for common test operations

**Interface**:
```typescript
export interface TestHelpers {
  // Navigation helpers
  navigateToPage(page: Page, path: string): Promise<void>;
  waitForPageLoad(page: Page): Promise<void>;
  
  // Visual testing helpers
  takeScreenshot(page: Page, name: string): Promise<void>;
  compareScreenshot(page: Page, name: string): Promise<void>;
  
  // Element helpers
  waitForElement(page: Page, selector: string): Promise<void>;
  isElementVisible(page: Page, selector: string): Promise<boolean>;
  
  // Accessibility helpers
  checkA11y(page: Page): Promise<void>;
}
```

### 3. Example Test Structure

**Home Page Test** (`e2e/tests/home.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should render home page with all sections', async ({ page }) => {
    await page.goto('/');
    
    // Verify page title
    await expect(page).toHaveTitle(/The Custard Screams/);
    
    // Verify main sections are present
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
  
  test('should match visual snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('home-page.png');
  });
});
```

**Navigation Test** (`e2e/tests/navigation.spec.ts`):
```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to music page
    await page.click('a[href="/music"]');
    await expect(page).toHaveURL('/music');
    
    // Navigate to shows page
    await page.click('a[href="/live-shows"]');
    await expect(page).toHaveURL('/live-shows');
    
    // Navigate back to home
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });
});
```

### 4. NPM Scripts

**Package.json additions**:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:chromium": "playwright test --project=chromium",
    "test:e2e:report": "playwright show-report",
    "playwright:install": "playwright install --with-deps",
    "test:all": "pnpm test && pnpm test:e2e"
  }
}
```

### 5. CI/CD Configuration

**GitHub Actions Integration** (`.github/workflows/playwright.yml`):
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
    - uses: pnpm/action-setup@v2
      with:
        version: 10
    - name: Install dependencies
      run: pnpm install
    - name: Install Playwright Browsers
      run: pnpm playwright:install
    - name: Run Playwright tests
      run: pnpm test:e2e
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Data Models

### Test Result Output (JSON Format)

**Purpose**: Machine-readable test results for AI agent consumption

**Schema**:
```typescript
interface PlaywrightTestResult {
  status: 'passed' | 'failed' | 'timedOut' | 'skipped';
  duration: number;
  errors: TestError[];
  attachments: TestAttachment[];
}

interface TestError {
  message: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
  snippet: string;
}

interface TestAttachment {
  name: string;
  path: string;
  contentType: string;
}

interface TestSuiteResult {
  suites: TestSuite[];
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
}
```

### Visual Regression Baseline

**Storage**: `e2e/screenshots/` directory with subdirectories per browser
**Naming Convention**: `{test-name}-{browser}.png`
**Update Process**: Run `playwright test --update-snapshots` to regenerate baselines

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Package Dependency Completeness

*For any* valid Playwright installation, the package.json file should contain all required Playwright dependencies including @playwright/test and any necessary browser binaries.

**Validates: Requirements 1.1**

### Property 2: Test Directory Isolation

*For any* test file in the Playwright test directory (e2e/), it should not be located in the Jest test directory (src/__tests__/), and vice versa - ensuring complete separation of test frameworks.

**Validates: Requirements 2.1**

## Error Handling

### Configuration Errors

**Missing Configuration File**:
- **Error**: Playwright config file not found
- **Handling**: Provide clear error message directing user to run initialization
- **Recovery**: User runs `pnpm playwright:install` or creates config manually

**Invalid Configuration**:
- **Error**: Configuration file has syntax errors or missing required fields
- **Handling**: Playwright will fail with validation error pointing to the issue
- **Recovery**: User fixes configuration based on error message

### Test Execution Errors

**Server Not Running**:
- **Error**: Cannot connect to baseURL (http://localhost:3000)
- **Handling**: Playwright's webServer config will attempt to start the dev server automatically
- **Recovery**: If auto-start fails, user must manually start the server

**Browser Not Installed**:
- **Error**: Playwright browsers not installed
- **Handling**: Clear error message indicating missing browsers
- **Recovery**: User runs `pnpm playwright:install` to install browsers

**Test Timeout**:
- **Error**: Test exceeds configured timeout
- **Handling**: Test fails with timeout error and captures screenshot/video
- **Recovery**: User investigates slow operations or increases timeout in config

### Visual Regression Errors

**Missing Baseline**:
- **Error**: No baseline screenshot exists for comparison
- **Handling**: First run creates baseline automatically
- **Recovery**: User reviews and commits baseline if acceptable

**Visual Difference Detected**:
- **Error**: Screenshot doesn't match baseline
- **Handling**: Test fails with diff image showing changes
- **Recovery**: User either fixes the bug or updates baseline with `--update-snapshots`

### CI/CD Errors

**Artifact Upload Failure**:
- **Error**: Cannot upload test artifacts to CI
- **Handling**: CI job continues but artifacts are lost
- **Recovery**: User checks CI permissions and storage limits

**Flaky Test Failure**:
- **Error**: Test fails intermittently
- **Handling**: Automatic retry (up to 2 times in CI)
- **Recovery**: If still failing, user investigates race conditions or timing issues

## Testing Strategy

### Dual Testing Approach

This integration maintains a clear separation between two complementary testing strategies:

**Unit Tests (Jest)**:
- Component rendering in isolation
- Utility function logic
- Hook behavior
- State management
- Fast execution, no browser required
- Located in `src/__tests__/`

**E2E Tests (Playwright)**:
- Full page rendering in real browsers
- User interaction flows
- Navigation between pages
- Visual regression testing
- Cross-browser compatibility
- Located in `e2e/tests/`

### Property-Based Testing Configuration

While Playwright tests are primarily example-based (testing specific user flows), we will configure property-based testing for configuration validation:

**Property Test Library**: Use `fast-check` for TypeScript property-based testing
**Minimum Iterations**: 100 iterations per property test
**Property Test Location**: `e2e/tests/config-validation.spec.ts`

**Property Test Examples**:

1. **Package Dependency Validation**:
   - **Property**: For any valid package.json, all Playwright dependencies should be present
   - **Tag**: `Feature: playwright-integration, Property 1: Package Dependency Completeness`
   - **Implementation**: Generate various package.json structures and verify Playwright deps exist

2. **Test Directory Isolation**:
   - **Property**: For any test file path, it should belong to exactly one test framework
   - **Tag**: `Feature: playwright-integration, Property 2: Test Directory Isolation`
   - **Implementation**: Generate various file paths and verify they don't overlap between e2e/ and src/__tests__/

### Example-Based Testing

The majority of Playwright tests will be example-based, testing specific user flows:

**Test Categories**:

1. **Page Rendering Tests**:
   - Home page loads and displays correctly
   - Music page loads and displays content
   - Shows page loads and displays content
   - About page loads and displays content

2. **Navigation Tests**:
   - Navigation between all pages works
   - Browser back/forward buttons work
   - Direct URL navigation works
   - Navigation preserves scroll position (if applicable)

3. **Visual Regression Tests**:
   - Home page visual snapshot
   - Music page visual snapshot
   - Shows page visual snapshot
   - Navigation component visual snapshot

4. **Interaction Tests**:
   - Links are clickable
   - Forms submit correctly (if applicable)
   - Modals open and close (if applicable)
   - Responsive design works across viewports

5. **Configuration Tests**:
   - Playwright config file exists and is valid
   - Required npm scripts exist
   - Browser projects are configured
   - Reporters are configured correctly

### Test Execution Strategy

**Local Development**:
```bash
# Run all tests in headless mode
pnpm test:e2e

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Run tests in UI mode (interactive debugging)
pnpm test:e2e:ui

# Run specific browser
pnpm test:e2e:chromium

# Debug specific test
pnpm test:e2e:debug
```

**CI/CD Pipeline**:
```bash
# Install browsers
pnpm playwright:install

# Run all tests (headless, with retries)
pnpm test:e2e

# Upload artifacts on failure
# (handled by GitHub Actions workflow)
```

**AI Agent Execution**:
```bash
# Run tests and get JSON output
pnpm test:e2e --reporter=json

# Run specific test file
pnpm test:e2e e2e/tests/home.spec.ts

# Check exit code for pass/fail
echo $?  # 0 = pass, non-zero = fail
```

### Test Maintenance

**Updating Visual Baselines**:
```bash
# Update all snapshots
pnpm test:e2e --update-snapshots

# Update snapshots for specific test
pnpm test:e2e home.spec.ts --update-snapshots
```

**Debugging Failed Tests**:
1. Check test output for error messages
2. Review screenshots in `test-results/` directory
3. Watch video recordings of failed tests
4. Use trace viewer: `pnpm playwright show-trace trace.zip`
5. Run in UI mode for interactive debugging: `pnpm test:e2e:ui`

### Coverage Goals

**E2E Test Coverage**:
- All main pages (home, music, shows, about)
- All navigation paths between pages
- Critical user interactions
- Visual regression for key pages
- Cross-browser compatibility (Chromium, Firefox, WebKit)

**Not Covered by E2E Tests**:
- Component-level logic (covered by Jest)
- Utility functions (covered by Jest)
- Edge cases in isolated functions (covered by Jest)
- Performance testing (separate tooling)
- Load testing (separate tooling)

## Documentation Structure

### E2E Testing README (`e2e/README.md`)

**Sections**:

1. **Overview**: What Playwright is and why we use it
2. **Getting Started**: How to install and run tests
3. **Writing Tests**: How to create new E2E tests
4. **Visual Testing**: How to work with screenshot comparisons
5. **Debugging**: How to debug failing tests
6. **CI Integration**: How tests run in CI/CD
7. **AI Agent Usage**: How AI agents can use Playwright tests
8. **Relationship with Jest**: When to use E2E vs unit tests

### Example Documentation Content

**For Developers**:
```markdown
## Running Tests

# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see the browser)
pnpm test:e2e:headed

# Run in UI mode (interactive)
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e e2e/tests/home.spec.ts
```

**For AI Agents**:
```markdown
## AI Agent Integration

Playwright tests can be run programmatically to verify UI changes:

# Run tests and get JSON output
pnpm test:e2e --reporter=json

# Check exit code
$? == 0  # Tests passed
$? != 0  # Tests failed

# Parse JSON output
cat playwright-report/results.json

# Interpret results
- status: "passed" | "failed" | "timedOut" | "skipped"
- errors: Array of error messages with file locations
- attachments: Screenshots, videos, traces for debugging
```

## Implementation Notes

### Dependencies to Install

```json
{
  "devDependencies": {
    "@playwright/test": "^1.48.0",
    "fast-check": "^3.22.0"
  }
}
```

### Configuration Best Practices

1. **Parallel Execution**: Enable `fullyParallel: true` for faster test runs
2. **Retries**: Use retries in CI (2) but not locally (0) to catch flaky tests
3. **Workers**: Limit to 1 worker in CI to avoid resource contention
4. **Timeouts**: Set reasonable timeouts (30s default, 120s for server start)
5. **Artifacts**: Only capture on failure to save disk space
6. **Trace**: Only on first retry to balance debugging needs with performance

### Visual Testing Best Practices

1. **Baseline Storage**: Commit baselines to git for version control
2. **Update Process**: Review visual diffs carefully before updating baselines
3. **Threshold**: Configure pixel difference threshold if needed
4. **Viewport**: Test multiple viewport sizes for responsive design
5. **Animations**: Disable animations in tests for consistent screenshots

### CI/CD Best Practices

1. **Browser Installation**: Always install browsers in CI before running tests
2. **Artifact Upload**: Upload on failure for debugging
3. **Retention**: Keep artifacts for 30 days
4. **Caching**: Cache node_modules and Playwright browsers
5. **Parallelization**: Run different browser projects in parallel jobs if needed
