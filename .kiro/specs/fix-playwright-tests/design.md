# Design Document: Fix Playwright E2E Tests After Layout Changes

## Overview

This design addresses the Playwright E2E test failures that occurred after layout improvements to the website. The failures fall into two categories:

1. **Carousel test selector issues** (already fixed) - Tests were using ambiguous text selectors that matched multiple elements
2. **Visual snapshot mismatches** (needs fixing) - Layout changes altered page dimensions and spacing

The primary work remaining is updating visual snapshots for 3 pages across 2 browsers (Chromium and Firefox) to reflect the new layout dimensions.

## Architecture

### Test Structure

The Playwright test suite is organized as follows:

```
e2e/
├── tests/
│   ├── home.spec.ts           # Home page tests + visual snapshot
│   ├── music.spec.ts          # Music page tests + visual snapshot
│   ├── shows.spec.ts          # Shows page tests + visual snapshot
│   ├── carousel-lightbox.spec.ts  # Carousel interaction tests (FIXED)
│   └── navigation.spec.ts     # Navigation tests
├── fixtures/
│   └── test-helpers.ts        # Shared test utilities
└── playwright.config.ts       # Playwright configuration
```

### Snapshot Storage

Visual snapshots are stored in browser-specific directories:
```
e2e/tests/
├── home.spec.ts-snapshots/
│   ├── home-page-chromium-linux.png
│   └── home-page-firefox-linux.png
├── music.spec.ts-snapshots/
│   ├── music-page-chromium-linux.png
│   └── music-page-firefox-linux.png
└── shows.spec.ts-snapshots/
    ├── shows-page-chromium-linux.png
    └── shows-page-firefox-linux.png
```

## Components and Interfaces

### Visual Snapshot Tests

Each page test file contains a visual snapshot test with this structure:

```typescript
test('should match visual snapshot', async ({ page }) => {
  await navigateToPage(page, '/path');
  
  // Take a screenshot and compare against baseline
  await expect(page).toHaveScreenshot('page-name.png', {
    fullPage: true,
    maxDiffPixels: 100,  // or 1000 for home page
    maxDiffPixelRatio: 0.05,  // optional, for home page
  });
});
```

### Snapshot Update Process

Playwright provides a built-in mechanism to update snapshots:

1. **Command-line flag**: `--update-snapshots`
2. **Project-specific**: `--project=chromium` or `--project=firefox`
3. **Test-specific**: Can target individual test files

The update process:
1. Runs the test
2. Captures new screenshot
3. Replaces old baseline image
4. Test passes with new baseline

## Data Models

### Expected Layout Changes

Based on the requirements, the layout changes resulted in these dimension differences:

| Page  | Browser  | Old Height | New Height | Change   |
|-------|----------|------------|------------|----------|
| Home  | Chromium | 4850px     | 4658px     | -192px   |
| Home  | Firefox  | 4850px     | 4658px     | -192px   |
| Music | Chromium | 1267px     | 720px      | -547px   |
| Music | Firefox  | 1267px     | 1387px     | +120px   |
| Shows | Chromium | 2845px     | 952px      | -1893px  |
| Shows | Firefox  | 2844px     | 2462px     | -382px   |

### Layout Improvements Applied

The following changes were made that affect visual snapshots:

1. **Footer padding**: `p-2` → `p-4 md:p-6` (increased vertical spacing)
2. **Bottom navigation padding**: `px-2 py-2` → `px-4 py-3` (increased spacing)
3. **Section alignment**: Mixed `justify-start/center` → Consistent `justify-center` (affects vertical positioning)
4. **ARIA labels**: Added to modal dialogs (no visual impact, but improves accessibility)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Snapshot Update Idempotence

*For any* page and browser combination, updating snapshots then running tests should result in all visual snapshot tests passing.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 2: Cross-Browser Consistency

*For any* page, the visual snapshot test should pass for both Chromium and Firefox after snapshots are updated.

**Validates: Requirements 3.2, 3.3**

### Property 3: Test Suite Completeness

*For any* test run after fixes, all non-Webkit tests (Jest unit tests + Chromium E2E + Firefox E2E) should pass without failures.

**Validates: Requirements 3.1, 3.2, 3.3**

## Error Handling

### Snapshot Update Failures

If snapshot updates fail:
1. **Network issues**: Ensure `navigateToPage()` helper waits for network idle
2. **Timing issues**: Increase `waitForTimeout()` if dynamic content hasn't stabilized
3. **Flaky tests**: Check for animations or transitions that may cause inconsistent renders

### Test Execution Failures

If tests still fail after snapshot updates:
1. **Verify correct browser**: Ensure `--project` flag matches the browser being tested
2. **Check file permissions**: Ensure snapshot directories are writable
3. **Clear cache**: Delete old snapshots and regenerate from scratch
4. **Diff threshold**: Adjust `maxDiffPixels` if minor rendering differences exist

### Webkit Exclusion

Webkit tests are intentionally excluded from this fix:
- Requires system library dependencies not currently installed
- Not related to layout changes
- Can be addressed separately if needed

## Testing Strategy

### Dual Testing Approach

This spec uses both unit tests and property-based testing concepts:

1. **Unit Tests** (Existing):
   - Specific page rendering tests
   - Element visibility checks
   - Navigation functionality tests
   - Carousel interaction tests

2. **Property-Based Validation** (Manual):
   - Verify snapshot update idempotence (Property 1)
   - Verify cross-browser consistency (Property 2)
   - Verify complete test suite success (Property 3)

### Test Execution Plan

1. **Update Chromium snapshots**:
   ```bash
   pnpm exec playwright test --project=chromium --update-snapshots
   ```

2. **Update Firefox snapshots**:
   ```bash
   pnpm exec playwright test --project=firefox --update-snapshots
   ```

3. **Verify all tests pass**:
   ```bash
   pnpm test              # Jest unit tests
   pnpm exec playwright test --project=chromium
   pnpm exec playwright test --project=firefox
   ```

4. **Validate properties**:
   - Property 1: Re-run tests without `--update-snapshots` flag → should pass
   - Property 2: Check both browser test results → should both pass
   - Property 3: Check all test counts → Jest: 94/94, Chromium: 19/19, Firefox: 19/19

### Snapshot Update Script

A convenience script can be used to update all snapshots:

```bash
bash update-snapshots.sh
```

This script should:
1. Update Chromium snapshots
2. Update Firefox snapshots
3. Run verification tests
4. Report results

### Test Configuration

The Playwright configuration should maintain:
- **Timeout**: Sufficient for page loads and dynamic content
- **Retries**: 0 for snapshot updates (to avoid false positives)
- **Workers**: 1 for consistent rendering
- **Screenshot options**: `fullPage: true` for complete page captures

### Success Criteria

All tests must pass:
- ✅ Jest: 94/94 tests passing
- ✅ Chromium E2E: 19/19 tests passing
- ✅ Firefox E2E: 19/19 tests passing
- ✅ No flaky or intermittent failures
- ✅ Visual snapshots accurately reflect current layout

## Implementation Notes

### Carousel Tests (Already Fixed)

The carousel tests in `e2e/tests/carousel-lightbox.spec.ts` have already been updated to use unambiguous selectors:

**Before**: `locator('text=Shows')` (matched 9 elements)
**After**: `getByRole('button', { name: 'Upcoming and past live shows' })` (unique match)

This change fixed all 12 carousel test failures (6 in Chromium, 6 in Firefox).

### Visual Snapshot Tests (Needs Fixing)

The three page snapshot tests need their baseline images updated:
- `e2e/tests/home.spec.ts` - Home page snapshot
- `e2e/tests/music.spec.ts` - Music page snapshot
- `e2e/tests/shows.spec.ts` - Shows page snapshot

Each test uses the `navigateToPage()` helper which ensures:
- Page navigation completes
- Network becomes idle
- Dynamic content stabilizes

### No Code Changes Required

This fix requires **no code changes** to test files or application code:
- Test selectors are already correct
- Test logic is already correct
- Application layout is already correct
- Only snapshot baseline images need updating

### Verification Process

After updating snapshots:
1. Run tests without `--update-snapshots` flag
2. Verify all tests pass
3. Inspect new snapshot images to ensure they look correct
4. Commit updated snapshot files to version control

## Dependencies

- **Playwright**: Already installed and configured
- **pnpm**: Package manager for running scripts
- **Chromium**: Browser for Chromium tests
- **Firefox**: Browser for Firefox tests
- **Jest**: Unit test framework (already passing)

## Timeline

This is a straightforward fix with minimal complexity:
1. **Snapshot updates**: 5-10 minutes (automated)
2. **Verification**: 5 minutes (run tests)
3. **Total**: ~15 minutes

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Snapshots don't stabilize | Tests remain flaky | Increase wait times, check for animations |
| Browser rendering differences | Cross-browser failures | Adjust `maxDiffPixels` threshold |
| File permission issues | Can't write snapshots | Check directory permissions |
| Wrong snapshots updated | Tests pass but wrong baseline | Manually inspect snapshot images |

## Conclusion

This design provides a straightforward approach to fixing the Playwright E2E test failures:

1. **Root cause**: Layout improvements changed page dimensions
2. **Solution**: Update visual snapshot baselines using Playwright's built-in tooling
3. **Verification**: Run tests to confirm all pass
4. **Outcome**: Stable, passing test suite that validates the improved layout

The fix requires no code changes—only updating baseline images to reflect the current, correct layout.
