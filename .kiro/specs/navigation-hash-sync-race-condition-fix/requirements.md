# Requirements Document: Navigation Hash Sync Race Condition Fix

## Introduction

This bugfix addresses a critical race condition in the navigation-hash-sync feature where navigation works on the first click but then fails to navigate on subsequent clicks until the user manually scrolls the page. The root cause is that boolean flags (`programmaticScrollRef`, `isUpdatingHashRef`) and debounce timers get out of sync, causing the system to incorrectly skip hash updates after the first navigation.

## Problem Statement

**Current Behavior**:
1. User clicks navigation item → Navigation works ✓
2. User clicks another navigation item → Navigation fails ✗
3. User manually scrolls → Navigation works again ✓
4. User clicks navigation item → Navigation fails again ✗

**Root Cause**:
- `programmaticScrollRef` is set to true for 800ms during programmatic scroll
- Scroll animation completes in ~500ms
- IntersectionObserver fires after scroll completes
- `isProgrammaticScroll()` still returns true (flag hasn't cleared yet)
- Hash update is skipped
- Flag clears at 800ms, but no new scroll events occur
- System is stuck until manual scroll triggers IntersectionObserver

## Glossary

- **Programmatic_Scroll_Flag**: Boolean flag (`programmaticScrollRef`) that prevents IntersectionObserver from updating hash during programmatic scrolls
- **Hash_Update_Flag**: Boolean flag (`isUpdatingHashRef`) that prevents handleHashChange from running during scroll-triggered hash updates
- **Debounce_Timer**: Timer that delays hash updates during rapid scrolling (150ms)
- **Flag_Clear_Timer**: Timer that auto-clears programmatic scroll flag (800ms)
- **Race_Condition**: When flag timers don't align with actual scroll completion, causing events to be incorrectly skipped

## Requirements

### Requirement 1: Accurate Scroll Completion Detection

**User Story:** As a developer, I want the system to detect when programmatic scrolls actually complete, so that the programmatic scroll flag is cleared at the right time.

#### Acceptance Criteria

1. WHEN a programmatic scroll is initiated, THEN the system SHALL set the Programmatic_Scroll_Flag to true
2. WHEN the scroll animation completes, THEN the system SHALL clear the Programmatic_Scroll_Flag immediately
3. WHEN the scroll animation is interrupted by user input, THEN the system SHALL clear the Programmatic_Scroll_Flag immediately
4. THE system SHALL NOT rely on fixed timeout durations to clear the Programmatic_Scroll_Flag

### Requirement 2: Eliminate Fixed Timeout Race Conditions

**User Story:** As a user, I want navigation to work reliably every time I click, so that I don't have to manually scroll to "unstick" the navigation.

#### Acceptance Criteria

1. WHEN a programmatic scroll completes, THEN the IntersectionObserver SHALL be able to update the hash immediately
2. WHEN multiple navigation clicks occur in rapid succession, THEN each click SHALL trigger navigation correctly
3. THE system SHALL NOT use fixed 800ms timeouts to clear the Programmatic_Scroll_Flag
4. THE system SHALL detect actual scroll completion rather than estimating duration

### Requirement 3: Simplified Flag Management

**User Story:** As a developer, I want a single, reliable mechanism for preventing infinite loops, so that the system is easier to debug and maintain.

#### Acceptance Criteria

1. THE system SHALL use a single flag to prevent infinite loops between hash changes and scroll events
2. WHEN a hash change triggers a scroll, THEN the flag SHALL be set before scrolling
3. WHEN the scroll completes, THEN the flag SHALL be cleared before IntersectionObserver can fire
4. THE flag SHALL be cleared if no scroll occurs (section already visible)

### Requirement 4: Debounce Coordination

**User Story:** As a developer, I want debounce timers to work correctly with the programmatic scroll flag, so that hash updates aren't incorrectly skipped.

#### Acceptance Criteria

1. WHEN a debounced hash update is about to execute, THEN the system SHALL check if the Programmatic_Scroll_Flag is still valid
2. WHEN the Programmatic_Scroll_Flag clears during a debounce period, THEN the pending hash update SHALL execute
3. THE system SHALL NOT skip hash updates due to stale flag values
4. WHEN rapid scrolling occurs, THEN only the final section SHALL have its hash updated

### Requirement 5: Scroll Event Listener for Completion Detection

**User Story:** As a developer, I want to detect when scrolling actually stops, so that I can clear flags at the right time.

#### Acceptance Criteria

1. WHEN a programmatic scroll is initiated, THEN the system SHALL add a scroll event listener
2. WHEN scrolling stops (no scroll events for 100ms), THEN the system SHALL clear the Programmatic_Scroll_Flag
3. WHEN the scroll event listener detects completion, THEN it SHALL remove itself
4. THE scroll event listener SHALL be passive to avoid performance issues

### Requirement 6: Backward Compatibility

**User Story:** As a user, I want all existing navigation features to continue working, so that the bugfix doesn't break anything.

#### Acceptance Criteria

1. WHEN the bugfix is applied, THEN all existing navigation features SHALL continue to work
2. THE hash SHALL still update during manual scrolling
3. THE hash SHALL still update during click navigation
4. THE browser back/forward buttons SHALL still work correctly
5. THE reduced motion preference SHALL still be respected

### Requirement 7: Testing and Validation

**User Story:** As a developer, I want comprehensive tests that verify the race condition is fixed, so that it doesn't regress.

#### Acceptance Criteria

1. THE system SHALL include a test that simulates rapid navigation clicks
2. THE system SHALL include a test that verifies flag clearing on scroll completion
3. THE system SHALL include a test that verifies no race conditions between flags and debounce timers
4. THE system SHALL include a test that verifies navigation works after programmatic scroll completes
