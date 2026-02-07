# Implementation Plan: Playwright Integration

## Overview

This implementation plan integrates Playwright into the Next.js application for end-to-end testing with visual regression capabilities. The integration will work alongside the existing Jest unit testing framework and support both local development and CI/CD environments.

## Tasks

- [x] 1. Install Playwright and configure project structure
  - Install @playwright/test and fast-check as dev dependencies
  - Run `pnpm create playwright` to initialize Playwright (or manually create config)
  - Create `e2e/` directory structure with subdirectories: `tests/`, `fixtures/`, `screenshots/`
  - Create `.gitkeep` file in `e2e/screenshots/` to track the directory
  - _Requirements: 1.1, 1.4_

- [x] 2. Create Playwright configuration file
  - [x] 2.1 Create `playwright.config.ts` with Next.js-specific settings
    - Configure testDir to point to `./e2e/tests`
    - Set baseURL to `http://localhost:3000`
    - Configure three browser projects: Chromium, Firefox, WebKit
    - Configure webServer to auto-start Next.js dev server
    - Set up reporters: HTML, JSON, and list
    - Configure screenshot, video, and trace settings
    - Set appropriate timeouts and retry logic for CI vs local
    - _Requirements: 1.2, 1.3, 1.5, 6.1, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.5, 9.1, 9.2, 9.3_

  - [ ]* 2.2 Write property test for configuration validation
    - **Property 1: Package Dependency Completeness**
    - **Validates: Requirements 1.1**

- [x] 3. Create test helper utilities
  - Create `e2e/fixtures/test-helpers.ts` with reusable test utilities
  - Implement navigation helpers (navigateToPage, waitForPageLoad)
  - Implement element helpers (waitForElement, isElementVisible)
  - Implement visual testing helpers (takeScreenshot, compareScreenshot)
  - _Requirements: 3.5_

- [x] 4. Create example E2E tests for key pages
  - [x] 4.1 Create home page test (`e2e/tests/home.spec.ts`)
    - Test that home page renders with correct title
    - Test that main sections (nav, main, footer) are visible
    - Add visual regression test with screenshot comparison
    - _Requirements: 3.1, 4.1, 4.2_

  - [x] 4.2 Create navigation test (`e2e/tests/navigation.spec.ts`)
    - Test navigation from home to music page
    - Test navigation from home to shows page
    - Test navigation from home to about page
    - Test browser back button functionality
    - _Requirements: 3.2_

  - [x] 4.3 Create music page test (`e2e/tests/music.spec.ts`)
    - Test that music page loads and displays content
    - Test that music-related elements are visible
    - Add visual regression test for music page
    - _Requirements: 3.3, 4.1, 4.2_

  - [x] 4.4 Create shows page test (`e2e/tests/shows.spec.ts`)
    - Test that shows page loads and displays content
    - Test that show-related elements are visible
    - Add visual regression test for shows page
    - _Requirements: 3.4, 4.1, 4.2_

  - [ ]* 4.5 Write property test for test directory isolation
    - **Property 2: Test Directory Isolation**
    - **Validates: Requirements 2.1**

- [x] 5. Checkpoint - Run initial tests and verify setup
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update package.json with Playwright scripts
  - Add `test:e2e` script for running all Playwright tests
  - Add `test:e2e:headed` script for headed mode
  - Add `test:e2e:ui` script for UI mode
  - Add `test:e2e:debug` script for debug mode
  - Add `test:e2e:chromium` script for Chromium-only tests
  - Add `test:e2e:report` script for viewing reports
  - Add `playwright:install` script for installing browsers
  - Add `test:all` script to run both Jest and Playwright tests
  - _Requirements: 2.4, 5.1, 5.2, 5.3, 5.4, 5.5, 10.1_

- [x] 7. Create CI/CD workflow for Playwright
  - Create `.github/workflows/playwright.yml` workflow file
  - Configure workflow to run on push and pull requests
  - Add steps for: checkout, setup Node.js, setup pnpm, install dependencies
  - Add step to install Playwright browsers
  - Add step to run Playwright tests
  - Configure artifact upload for test reports and screenshots on failure
  - Set artifact retention to 30 days
  - _Requirements: 6.1, 6.2, 6.3, 7.4_

- [x] 8. Create E2E testing documentation
  - [x] 8.1 Create `e2e/README.md` with comprehensive documentation
    - Add overview section explaining Playwright and its purpose
    - Add getting started section with installation instructions
    - Add section on running tests (all scripts)
    - Add section on writing new E2E tests with examples
    - Add section on visual regression testing and updating baselines
    - Add section on debugging failed tests with Playwright tools
    - Add section on CI integration and how tests run automatically
    - Add section for AI agents explaining programmatic test execution
    - Add section explaining relationship between Jest unit tests and Playwright E2E tests
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 10.6_

- [x] 9. Configure visual regression testing
  - Ensure screenshot directory structure is set up correctly
  - Configure Playwright to store baselines in `e2e/screenshots/`
  - Verify that screenshot comparison works with `toHaveScreenshot()`
  - Document the process for updating baselines with `--update-snapshots`
  - Ensure baseline screenshots are tracked in git (not in .gitignore)
  - _Requirements: 4.3, 4.4, 4.5_

- [x] 10. Verify Jest and Playwright separation
  - [x] 10.1 Test that running Jest doesn't execute Playwright tests
    - Run `pnpm test` and verify no Playwright tests are executed
    - Check test output to confirm only Jest tests ran
    - _Requirements: 2.2_

  - [x] 10.2 Test that running Playwright doesn't execute Jest tests
    - Run `pnpm test:e2e` and verify no Jest tests are executed
    - Check test output to confirm only Playwright tests ran
    - _Requirements: 2.3_

  - [x] 10.3 Verify configuration isolation
    - Confirm Jest uses `jest.config.js` and Playwright uses `playwright.config.ts`
    - Verify no configuration conflicts when running both test suites
    - _Requirements: 2.5_

- [x] 11. Test AI agent integration
  - [x] 11.1 Verify JSON output format
    - Run tests with `--reporter=json` flag
    - Verify JSON output is created in `playwright-report/results.json`
    - Verify JSON structure matches expected schema
    - _Requirements: 10.4_

  - [x] 11.2 Test programmatic execution
    - Run tests via npm script and capture exit code
    - Verify exit code is 0 for passing tests
    - Create a failing test and verify exit code is non-zero
    - Verify error messages are clear and actionable
    - _Requirements: 10.2, 10.3_

  - [x] 11.3 Test selective test execution
    - Run a specific test file using file path argument
    - Run a specific test suite using grep pattern
    - Verify that only selected tests execute
    - _Requirements: 10.5_

- [x] 12. Final checkpoint - Comprehensive testing
  - Run all Playwright tests in all browsers
  - Run Jest tests to ensure no regression
  - Run both test suites together with `pnpm test:all`
  - Verify all documentation is complete and accurate
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Example tests validate specific user flows and configurations
- The integration maintains clear separation between Jest (unit) and Playwright (E2E) tests
- Visual regression testing provides automated UI change detection
- CI/CD integration ensures tests run on every commit
- AI agent support enables programmatic test execution and result interpretation
