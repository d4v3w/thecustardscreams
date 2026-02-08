# Fix Playwright E2E Tests After Layout Changes

## Overview
After making layout improvements (footer padding, navigation sizing, section alignment, modal ARIA labels), the Playwright E2E tests are failing. We need to fix the test selectors and update visual snapshots to reflect the new layout.

## Problem Statement
The layout improvements changed:
1. Footer padding from `p-2` to `p-4 md:p-6`
2. Bottom navigation padding from `px-2 py-2` to `px-4 py-3`
3. Section alignment from mixed `justify-start/center` to consistent `justify-center`
4. Added ARIA labels to modal dialogs

These changes caused:
- Carousel tests to fail due to ambiguous "Shows" text selector (now matches 9 elements)
- Visual snapshot tests to fail due to different page heights and spacing

## User Stories

### 1. Carousel Test Selector Fix
**As a** developer running E2E tests  
**I want** carousel tests to use unambiguous selectors  
**So that** tests reliably find the correct navigation element

**Acceptance Criteria:**
- 1.1 All carousel tests use `getByRole('button', { name: 'Upcoming and past live shows' })` instead of `locator('text=Shows')`
- 1.2 All 6 carousel tests pass successfully
- 1.3 Tests work in both Chromium and Firefox browsers

### 2. Visual Snapshot Updates
**As a** developer maintaining visual regression tests  
**I want** snapshots to reflect the current layout  
**So that** visual tests pass with the improved design

**Acceptance Criteria:**
- 2.1 Home page snapshot updated for Chromium (expected height change from 4850px to 4658px)
- 2.2 Home page snapshot updated for Firefox (expected height change from 4850px to 4658px)
- 2.3 Music page snapshot updated for Chromium (expected height change from 1267px to 720px)
- 2.4 Music page snapshot updated for Firefox (expected height change from 1267px to 1387px)
- 2.5 Shows page snapshot updated for Chromium (expected height change from 2845px to 952px)
- 2.6 Shows page snapshot updated for Firefox (expected height change from 2844px to 2462px)

### 3. Test Suite Verification
**As a** developer ensuring code quality  
**I want** all tests to pass after fixes  
**So that** CI/CD pipeline succeeds

**Acceptance Criteria:**
- 3.1 All Jest unit tests pass (94 tests)
- 3.2 All Playwright E2E tests pass for Chromium
- 3.3 All Playwright E2E tests pass for Firefox
- 3.4 Webkit tests can be skipped (missing system dependencies)

## Technical Notes

### Current Test Failures
- **Carousel tests (12 failures)**: 6 in Chromium, 6 in Firefox - all due to ambiguous selector
- **Visual snapshot tests (6 failures)**: 3 in Chromium, 3 in Firefox - all due to layout changes
- **Webkit tests (19 failures)**: System dependency issues, not related to our changes

### Snapshot Update Command
The correct command to update snapshots is:
```bash
pnpm exec playwright test --project=chromium --update-snapshots
pnpm exec playwright test --project=firefox --update-snapshots
```

Or using the provided script:
```bash
bash update-snapshots.sh
```

### Files Modified in Layout Changes
- `src/components/Footer.tsx` - Padding increased
- `src/components/navigation/BottomNav.tsx` - Padding increased
- `src/app/_components/ShowsSection.tsx` - Alignment changed to center
- `src/app/_components/AboutSection.tsx` - Alignment changed to center
- `src/components/ClientDialog.tsx` - Added ARIA label
- `src/components/carousel/ImageLightbox.tsx` - Added ARIA label

## Out of Scope
- Fixing Webkit browser tests (requires system library installation)
- Making additional layout changes
- Modifying test framework or configuration

## Success Criteria
- All Jest tests pass (94/94)
- All Chromium E2E tests pass (19/19)
- All Firefox E2E tests pass (19/19)
- Visual snapshots accurately reflect current layout
- No test flakiness or intermittent failures
