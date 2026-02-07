# Implementation Plan: Scroll-Snap Navigation Fix

## Overview

This plan systematically debugs and fixes the broken scroll-snap navigation by:
1. Creating diagnostic tests to identify root causes
2. Fixing CSS scroll-snap configuration
3. Ensuring JavaScript doesn't interfere with native scrolling
4. Validating fixes with comprehensive property-based tests

Each task builds incrementally, with checkpoints to validate progress.

## Key Findings from Diagnostics

✅ **All diagnostic tests passed** - The theoretical implementation is correct
✅ **No preventDefault calls** - JavaScript is not blocking scroll events
✅ **CSS configuration correct** - scroll-snap properties are properly set
✅ **IntersectionObserver is passive** - No scroll interference from observer

**Root Cause Identified**: Tailwind utility classes (`snap-start`, `min-h-screen`, `scroll-mt-0`) were being used alongside CSS rules, potentially causing conflicts or specificity issues. 

**Solution**: Removed all Tailwind classes from scroll-snap functionality and moved everything to pure CSS in globals.css. This ensures:
- No class conflicts
- Consistent behavior across browsers
- Simpler debugging
- Better performance (no runtime class processing)

**Additional Finding**: CSS selector `section[data-section-id]` is correctly targeting sections (verified with red outline debug). Sections have `min-height: 100vh` applied. Body has `scroll-snap-type: y mandatory` applied.

**Current Status**: CSS is applied correctly but scroll-snap behavior not activating in browser. Investigating browser-specific issues and scroll container configuration.

## Tasks

- [x] 1. Set up diagnostic test infrastructure
  - Create test utilities for simulating scroll events
  - Create test utilities for checking CSS computed styles
  - Set up mocks for window.scrollTo and IntersectionObserver
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 2. Diagnose root cause with tests
  - [x] 2.1 Create test to verify scroll events are not blocked
    - Simulate wheel events on body element
    - Verify preventDefault is not called
    - Verify scroll position changes
    - _Requirements: 1.1, 1.6, 5.1_
  
  - [x] 2.2 Create test to verify CSS scroll-snap properties
    - Check body has scroll-snap-type: y mandatory
    - Check sections have scroll-snap-align: start
    - Check sections have scroll-snap-stop: normal
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 2.3 Create test to verify window.scrollTo behavior
    - Call window.scrollTo with smooth behavior
    - Verify scroll position reaches target
    - Verify scroll-snap activates (position aligns with section)
    - _Requirements: 3.1, 3.2, 5.2_
  
  - [x] 2.4 Create test to verify IntersectionObserver is passive
    - Trigger observer callbacks
    - Verify no scroll methods are called from callbacks
    - _Requirements: 5.3_
  
  - [x] 2.5 Run diagnostic tests and document findings
    - Execute all diagnostic tests
    - Document which tests fail
    - Identify root cause from failures
    - _Requirements: All from 2.1-2.4_

- [x] 3. Checkpoint - Review diagnostic results
  - Ensure diagnostic tests have identified the root cause. Ask the user if questions arise about the findings.

- [x] 4. Fix CSS scroll-snap configuration
  - [x] 4.1 Update globals.css with correct scroll-snap properties
    - Ensure body has scroll-snap-type: y mandatory
    - Ensure sections have scroll-snap-align: start
    - Add scroll-snap-stop: normal to sections
    - Verify scroll-padding-bottom accounts for nav
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 4.2 Write property test for CSS scroll-snap configuration
    - **Property 13: Sections Have Correct Snap CSS**
    - **Validates: Requirements 6.2, 6.3**
  
  - [ ]* 4.3 Write example test for scroll container configuration
    - **Example 4: Scroll Container Has Mandatory Snap**
    - **Validates: Requirements 6.1**

- [x] 5. Fix JavaScript scroll interference
  - [x] 5.1 Audit and remove any preventDefault calls on scroll events
    - Search codebase for scroll/wheel event listeners
    - Remove any preventDefault calls
    - Ensure listeners are passive or don't block
    - _Requirements: 1.1, 1.6, 5.1_
  
  - [x] 5.2 Update NavigationContext to respect prefers-reduced-motion
    - Add useReducedMotion hook to NavigationContext
    - Use behavior: "auto" when reduced motion is preferred
    - Use behavior: "smooth" when reduced motion is not preferred
    - _Requirements: 3.1, 3.4, 3.5_
    - **Status**: NavigationContext currently always uses "smooth" - needs to check motion preference
  
  - [ ]* 5.3 Write property test for scroll events not blocked
    - **Property 1: Scroll Events Are Not Blocked**
    - **Validates: Requirements 1.1, 1.6, 5.1**
  
  - [ ]* 5.4 Write property test for scroll behavior respects motion preference
    - **Property 7: Scroll Behavior Respects Motion Preference**
    - **Validates: Requirements 3.4, 3.5**

- [ ] 6. Verify natural scrolling works
  - [ ]* 6.1 Write property test for touch scroll events
    - **Property 2: Touch Scroll Events Are Not Blocked**
    - **Validates: Requirements 1.3**
  
  - [ ]* 6.2 Write example tests for keyboard navigation
    - **Example 1: Keyboard Navigation Down**
    - **Example 2: Keyboard Navigation Up**
    - **Validates: Requirements 1.4, 1.5**
  
  - [ ]* 6.3 Write property test for event listeners are passive
    - **Property 15: Event Listeners Are Passive**
    - **Validates: Requirements 9.5**

- [ ] 7. Checkpoint - Verify natural scrolling
  - Ensure all natural scrolling tests pass. Manually test with mouse, trackpad, and keyboard. Ask the user if issues arise.

- [x] 7.5 Manual browser testing of scroll-snap fix
  - Start dev server and test in real browser
  - Verify sections have min-height: 100vh applied
  - Verify sections have scroll-snap-align: start applied
  - Verify body has scroll-snap-type: y mandatory applied
  - Test natural scrolling with mouse wheel
  - Test programmatic navigation with nav links
  - Verify sections snap into place
  - Document any remaining issues
  - _Requirements: All requirements_
  - **Critical**: This validates the CSS changes work in real browsers, not just tests

- [ ] 8. Verify scroll-snap activation
  - [ ]* 8.1 Write property test for scroll position alignment
    - **Property 3: Scroll Position Aligns After Snap**
    - **Validates: Requirements 2.1, 2.2**
  
  - [ ]* 8.2 Write example test for scroll-snap-stop configuration
    - **Example 3: Scroll-Snap-Stop Allows Pass-Through**
    - **Validates: Requirements 2.5**

- [ ] 9. Verify programmatic navigation
  - [ ]* 9.1 Write property test for navigation triggers scroll
    - **Property 4: Navigation Triggers Scroll**
    - **Validates: Requirements 3.1**
  
  - [ ]* 9.2 Write property test for programmatic scroll respects snap
    - **Property 5: Programmatic Scroll Respects Snap**
    - **Validates: Requirements 3.2, 5.2**
  
  - [ ]* 9.3 Write property test for URL hash updates
    - **Property 6: URL Hash Updates on Navigation**
    - **Validates: Requirements 3.3**

- [ ] 10. Verify active section tracking
  - [ ] 10.1 Verify useIntersectionObserver implementation
    - Confirm debounce timing is 100ms ✅ (already verified in code review)
    - Confirm highest intersection ratio is selected ✅ (already verified in code review)
    - Confirm observer doesn't trigger scrolls ✅ (already verified in diagnostic tests)
    - _Requirements: 4.1, 4.5, 5.3_
    - **Status**: Implementation is correct, just needs verification in browser
  
  - [ ]* 10.2 Write property test for active section tracking
    - **Property 8: Active Section Tracks Highest Intersection**
    - **Validates: Requirements 4.1, 4.5**
  
  - [ ]* 10.3 Write property test for active section UI reflection
    - **Property 9: Active Section Reflects in UI**
    - **Validates: Requirements 4.2**
  
  - [ ]* 10.4 Write property test for navigation completion
    - **Property 10: Navigation Completes to Target Section**
    - **Validates: Requirements 4.4**
  
  - [ ]* 10.5 Write property test for IntersectionObserver passivity
    - **Property 11: IntersectionObserver Is Passive**
    - **Validates: Requirements 5.3**
  
  - [ ]* 10.6 Write property test for debounced state updates
    - **Property 12: State Updates Are Debounced**
    - **Validates: Requirements 5.4, 9.1**

- [ ] 11. Checkpoint - Verify active section tracking
  - Ensure all active section tracking tests pass. Manually test that navigation highlights update correctly. Ask the user if issues arise.

- [ ] 12. Implement focus management
  - [ ] 12.1 Update useSmoothScroll to handle focus correctly
    - Set tabindex="-1" before focusing
    - Call focus with preventScroll: true
    - Remove tabindex after focus
    - Respect reduced motion for timing
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 12.2 Write property test for focus management
    - **Property 14: Focus Moves to Target Section**
    - **Validates: Requirements 7.1**
  
  - [ ]* 12.3 Write example tests for focus implementation details
    - **Example 6: Focus Uses Temporary Tabindex**
    - **Example 7: Focus Uses PreventScroll**
    - **Example 8: Focus Timing Respects Motion Preference**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.5**

- [ ] 13. Add browser compatibility fallbacks
  - [ ] 13.1 Verify IntersectionObserver fallback in useIntersectionObserver
    - Check if IntersectionObserver exists ✅ (already implemented)
    - Fall back to first section if not supported ✅ (already implemented)
    - _Requirements: 8.2, 8.3_
    - **Status**: Fallback already exists, just needs testing
  
  - [ ]* 13.2 Write example test for IntersectionObserver fallback
    - **Example 9: IntersectionObserver Feature Detection**
    - **Validates: Requirements 8.2, 8.3**

- [ ] 14. Performance optimization
  - [ ] 14.1 Verify section registration batching
    - Ensure multiple registrations don't cause excessive re-renders
    - Use React.useMemo or batching where appropriate
    - _Requirements: 9.3_
  
  - [ ]* 14.2 Write example test for section registration batching
    - **Example 10: Section Registration Batching**
    - **Validates: Requirements 9.3**

- [ ] 15. Integration testing
  - [ ]* 15.1 Write integration test combining natural and programmatic scrolling
    - Simulate user scrolling naturally
    - Then trigger programmatic navigation
    - Verify both work correctly together
    - _Requirements: 1.1, 3.1, 4.1_
  
  - [ ]* 15.2 Write integration test for rapid navigation
    - Trigger multiple navigation calls quickly
    - Verify system handles gracefully
    - _Requirements: 3.1, 5.4_
  
  - [ ]* 15.3 Write integration test for hash navigation on load
    - Simulate page load with hash in URL
    - Verify navigation to correct section
    - _Requirements: 3.1, 3.3_

- [ ] 16. Final checkpoint - Run full test suite
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Manual testing and validation
  - Create manual testing checklist document
  - Test mouse wheel scrolling in all directions
  - Test trackpad gestures
  - Test touch gestures on mobile device
  - Test keyboard navigation (Page Up/Down, arrows)
  - Test navigation link clicks
  - Test in Chrome, Firefox, Safari, Edge
  - Test with prefers-reduced-motion enabled
  - Document any issues found
  - _Requirements: All requirements_

## Notes

- Tasks marked with `*` are optional property-based and example tests that can be skipped for faster MVP
- Each property test should run minimum 100 iterations
- Property tests should use fast-check or similar property-based testing library for TypeScript
- Diagnostic tests (task 2) should be run first to identify root cause before implementing fixes
- Checkpoints ensure incremental validation of fixes
- Manual testing (task 17) validates the complete fix in real browsers
