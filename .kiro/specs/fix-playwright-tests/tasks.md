# Implementation Plan: Fix Playwright E2E Tests After Layout Changes

## Overview

This plan addresses the remaining Playwright E2E test failures after layout improvements. The carousel test selectors have already been fixed. The remaining work is to update visual snapshots for 3 pages across 2 browsers (Chromium and Firefox) to reflect the new layout dimensions.

## Tasks

- [x] 1. Verify current test state
  - Run Jest tests to confirm all 94 unit tests pass
  - Run Playwright tests to identify which snapshot tests are failing
  - Document current failure count and specific failing tests
  - _Requirements: 3.1_

- [x] 2. Update Chromium visual snapshots
  - [x] 2.1 Update home page snapshot for Chromium
    - Run `pnpm exec playwright test home.spec.ts --project=chromium --update-snapshots`
    - Verify new snapshot reflects layout changes (height ~4658px)
    - _Requirements: 2.1_
  
  - [x] 2.2 Update music page snapshot for Chromium
    - Run `pnpm exec playwright test music.spec.ts --project=chromium --update-snapshots`
    - Verify new snapshot reflects layout changes (height ~720px)
    - _Requirements: 2.3_
  
  - [x] 2.3 Update shows page snapshot for Chromium
    - Run `pnpm exec playwright test shows.spec.ts --project=chromium --update-snapshots`
    - Verify new snapshot reflects layout changes (height ~952px)
    - _Requirements: 2.5_

- [x] 3. Update Firefox visual snapshots
  - [x] 3.1 Update home page snapshot for Firefox
    - Run `pnpm exec playwright test home.spec.ts --project=firefox --update-snapshots`
    - Verify new snapshot reflects layout changes (height ~4658px)
    - _Requirements: 2.2_
  
  - [x] 3.2 Update music page snapshot for Firefox
    - Run `pnpm exec playwright test music.spec.ts --project=firefox --update-snapshots`
    - Verify new snapshot reflects layout changes (height ~1387px)
    - _Requirements: 2.4_
  
  - [x] 3.3 Update shows page snapshot for Firefox
    - Run `pnpm exec playwright test shows.spec.ts --project=firefox --update-snapshots`
    - Verify new snapshot reflects layout changes (height ~2462px)
    - _Requirements: 2.6_

- [x] 4. Verify all Chromium tests pass
  - Run `pnpm exec playwright test --project=chromium` without update flag
  - Confirm all 19 Chromium E2E tests pass
  - Verify no flaky or intermittent failures
  - _Requirements: 3.2_

- [ ] 5. Verify all Firefox tests pass
  - Run `pnpm exec playwright test --project=firefox` without update flag
  - Confirm all 19 Firefox E2E tests pass
  - Verify no flaky or intermittent failures
  - _Requirements: 3.3_

- [ ] 6. Final verification checkpoint
  - Run complete test suite: `pnpm test` (Jest) and `pnpm exec playwright test` (E2E)
  - Confirm Jest: 94/94 passing
  - Confirm Chromium E2E: 19/19 passing
  - Confirm Firefox E2E: 19/19 passing
  - Manually inspect updated snapshot images to ensure they look correct
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: 3.1, 3.2, 3.3_

## Notes

- No code changes are required—only snapshot baseline updates
- Carousel test selectors have already been fixed in `e2e/tests/carousel-lightbox.spec.ts`
- Webkit tests are intentionally excluded (missing system dependencies)
- The `update-snapshots.sh` script can be used as an alternative to manual commands
- All snapshot files should be committed to version control after verification
- Each snapshot update command targets a specific test file and browser project
- Visual inspection of updated snapshots is important to ensure correctness

## Success Criteria

- ✅ All Jest unit tests pass (94/94)
- ✅ All Chromium E2E tests pass (19/19)
- ✅ All Firefox E2E tests pass (19/19)
- ✅ Visual snapshots accurately reflect current layout
- ✅ No test flakiness or intermittent failures
- ✅ Updated snapshot files committed to version control
