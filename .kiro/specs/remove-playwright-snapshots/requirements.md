# Remove Playwright Snapshot Tests - Requirements

## Overview
Remove all Playwright snapshot tests from the project as they are too costly to maintain during rapid development. Snapshot tests don't provide real value since HTML structure changes don't prove pages look or work correctly. Playwright will remain for interactive development testing only.

## User Stories

### 1. As a developer, I want snapshot tests removed so I don't waste time updating snapshots
**Acceptance Criteria:**
- 1.1 All `toHaveScreenshot()` assertions are removed from test files
- 1.2 All snapshot baseline directories (`*-snapshots/`) are deleted
- 1.3 Tests still validate functional behavior (navigation, interactions, content)
- 1.4 No snapshot-related scripts remain in package.json

### 2. As a developer, I want Playwright tests to focus on behavior so they provide real value
**Acceptance Criteria:**
- 2.1 Tests verify page loads successfully
- 2.2 Tests verify interactive elements work (clicks, navigation)
- 2.3 Tests verify content is present and accessible
- 2.4 Tests do not compare visual appearance or HTML structure

### 3. As a developer, I want clean test output without snapshot warnings
**Acceptance Criteria:**
- 3.1 No snapshot-related warnings in test output
- 3.2 Test runs complete faster without snapshot generation
- 3.3 Git repository is cleaner without large snapshot image files

## Out of Scope
- Removing Playwright entirely (keeping for development testing)
- Adding new test types to replace snapshots
- Modifying Playwright configuration beyond snapshot removal
- Changing test infrastructure or CI/CD pipelines

## Success Metrics
- All tests pass without snapshot assertions
- Test execution time reduced
- No snapshot directories in repository
- Developers can modify HTML/CSS without test failures
