# Implementation Plan: Skip Navigation Link for Keyboard Accessibility

## Overview

This implementation plan improves keyboard accessibility by implementing a skip navigation link that allows keyboard users to quickly jump to the main navigation at the bottom of the page. The skip link is visually hidden by default and becomes visible when focused, providing an optional shortcut while maintaining natural tab order (content first, then navigation).

## Tasks

- [x] 1. Create SkipLink component
  - [x] 1.1 Create SkipLink.tsx component file
    - Implement visually hidden link with href="#main-navigation"
    - Add off-screen positioning (absolute -left-[9999px])
    - Add focus-visible positioning (left-4 top-4)
    - Add punk aesthetic styling (Bebas Neue, black/white, border)
    - Add focus indicator (amber ring)
    - Add reduced motion support
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 1.2 Write unit tests for SkipLink component
    - Test component renders without errors
    - Test has correct href (#main-navigation)
    - Test has correct text ("Skip to navigation")
    - Test has off-screen positioning classes
    - Test has focus-visible positioning classes
    - Test has punk aesthetic styling
    - Test has focus indicator
    - Test has reduced motion class
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2. Integrate SkipLink into RootLayout
  - [x] 2.1 Add SkipLink to layout.tsx
    - Import SkipLink component
    - Add SkipLink as first element in body (before CookieConsentProvider)
    - Verify SkipLink is first in tab order
    - _Requirements: 1.4, 5.1, 5.2_
  
  - [x] 2.2 Write unit tests for RootLayout integration
    - Test SkipLink is first element in body
    - Test SkipLink appears before CookieConsentProvider
    - Test component renders without errors
    - _Requirements: 1.4, 5.1, 5.2_

- [x] 3. Verify Nav component has required attributes
  - [x] 3.1 Check Nav component has id="main-navigation"
    - Verify Nav has id attribute (already exists)
    - _Requirements: 4.1_
  
  - [x] 3.2 Check Nav component has tabIndex={-1}
    - Verify Nav has tabIndex attribute (already exists)
    - _Requirements: 4.2_

- [ ] 4. Test skip link visibility and styling
  - [ ] 4.1 Write unit tests for skip link visibility
    - Test skip link is not visible by default (off-screen)
    - Test skip link becomes visible when focused
    - Test skip link has correct position when focused (top-left)
    - _Requirements: 1.2, 1.3, 3.1, 3.2, 3.5_
  
  - [ ] 4.2 Write property test for visual hiding
    - **Property 2: Skip link is visually hidden by default**
    - **Validates: Requirements 1.2, 3.1**
    - For any page render, verify skip link is not visible until focused
    - _Requirements: 1.2, 3.1_
  
  - [ ] 4.3 Write property test for focus visibility
    - **Property 3: Skip link becomes visible when focused**
    - **Validates: Requirements 1.3, 3.2, 3.5**
    - For any focus event, verify skip link becomes visible at top-left
    - _Requirements: 1.3, 3.2, 3.5_

- [ ] 5. Test keyboard navigation and tab order
  - [ ] 5.1 Write integration tests for tab order
    - Test first Tab from page start focuses skip link
    - Test second Tab focuses first content link
    - Test tab order: skip link → content → footer → navigation
    - Test Shift+Tab backward navigation works
    - Test no keyboard traps exist
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 5.2 Write property test for tab order
    - **Property 1: Skip link is first in tab order**
    - **Validates: Requirements 1.4, 5.1, 5.2**
    - For any page, verify pressing Tab from start focuses skip link
    - _Requirements: 1.4, 5.1, 5.2_
  
  - [ ] 5.3 Write property test for logical tab order
    - **Property 5: Tab order is logical**
    - **Validates: Requirements 5.1, 5.3, 5.4**
    - For any keyboard navigation, verify focus moves: skip link → content → footer → nav
    - _Requirements: 5.1, 5.3, 5.4_
  
  - [ ] 5.4 Write property test for no keyboard traps
    - **Property 6: No keyboard traps exist**
    - **Validates: Requirements 4.5, 5.4**
    - For any keyboard navigation sequence, verify users can tab through all elements
    - _Requirements: 4.5, 5.4_

- [ ] 6. Test skip link functionality
  - [ ] 6.1 Write integration tests for skip link activation
    - Test clicking skip link scrolls to navigation
    - Test pressing Enter on skip link scrolls to navigation
    - Test navigation receives focus after activation
    - Test skip link works with hash navigation
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [ ] 6.2 Write property test for navigation target
    - **Property 4: Skip link navigates to navigation**
    - **Validates: Requirements 4.1, 4.3, 4.4**
    - For any activation, verify page scrolls to and focuses navigation
    - _Requirements: 4.1, 4.3, 4.4_

- [ ] 7. Test accessibility compliance
  - [ ] 7.1 Write unit tests for accessibility attributes
    - Test skip link has correct href
    - Test skip link has descriptive text
    - Test skip link is keyboard accessible
    - Test skip link has visible focus indicator
    - _Requirements: 1.1, 1.5, 6.2, 6.4_
  
  - [ ] 7.2 Write property test for accessible styling
    - **Property 8: Skip link has accessible styling**
    - **Validates: Requirements 2.3, 6.2, 6.5**
    - For any render, verify skip link has sufficient contrast and focus indicator
    - _Requirements: 2.3, 6.2, 6.5_
  
  - [ ] 7.3 Write integration tests for screen reader compatibility
    - Test skip link is announced by screen readers
    - Test skip link text is descriptive
    - Test skip link works with NVDA/JAWS/VoiceOver
    - _Requirements: 6.3_
  
  - [ ] 7.4 Write property test for reduced motion
    - **Property 7: Skip link respects reduced motion**
    - **Validates: Requirements 2.5, 6.6**
    - For any user with reduced motion preference, verify no animations
    - _Requirements: 2.5, 6.6_

- [ ] 8. Create end-to-end tests
  - [ ] 8.1 Write E2E test for home page keyboard navigation
    - Test Tab from page start focuses skip link
    - Test skip link is visible when focused
    - Test activating skip link scrolls to navigation
    - Test complete keyboard flow (skip → content → footer → nav)
    - _Requirements: 1.3, 1.4, 4.3, 5.1, 5.3_
  
  - [ ] 8.2 Write E2E tests for all routes
    - Test skip link on /music page
    - Test skip link on /live-shows page
    - Test skip link on /about page
    - Test skip link on /privacy-policy page
    - Verify consistent behavior across all pages
    - _Requirements: 5.3_
  
  - [ ] 8.3 Write E2E tests for skip link visibility
    - Test skip link not visible by default
    - Test skip link visible when focused (at top-left)
    - Test skip link has correct styling when visible
    - Capture screenshots for visual regression
    - _Requirements: 1.2, 1.3, 3.1, 3.2, 3.5_

- [ ] 9. Clean up abandoned implementation
  - [ ] 9.1 Delete or update LayoutClient.test.tsx
    - Remove tests for DOM reordering (abandoned approach)
    - Keep only tests relevant to current implementation
    - Or delete file entirely if no relevant tests remain
    - _Requirements: N/A (cleanup task)_

- [ ] 10. Run comprehensive test suite
  - [ ] 10.1 Run all unit tests
    - Execute `pnpm test` and verify all tests pass
    - Fix any failing tests
    - _Requirements: All_
  
  - [ ] 10.2 Run type checking
    - Execute `pnpm typecheck` and verify no errors
    - Fix any type errors
    - _Requirements: All_
  
  - [ ] 10.3 Run E2E tests
    - Execute `pnpm test:e2e` and verify all tests pass
    - Fix any failing E2E tests
    - _Requirements: All_
  
  - [ ] 10.4 Run linting
    - Execute `pnpm lint` and verify no errors
    - Fix any linting issues
    - _Requirements: All_

- [ ] 11. Manual accessibility testing
  - [ ] 11.1 Test with keyboard only
    - Navigate entire site using only keyboard
    - Verify skip link is first in tab order
    - Verify skip link becomes visible when focused
    - Verify activating skip link jumps to navigation
    - Verify no keyboard traps
    - _Requirements: 1.2, 1.3, 1.4, 4.3, 4.5, 5.1, 5.4, 6.1, 6.4_
  
  - [ ] 11.2 Test with screen readers
    - Test with NVDA (Windows) or JAWS
    - Test with VoiceOver (macOS)
    - Verify skip link is announced correctly
    - Verify skip link text is descriptive
    - _Requirements: 6.3_
  
  - [ ] 11.3 Test visual appearance
    - Verify skip link not visible by default
    - Verify skip link appears at top-left when focused
    - Verify skip link has punk aesthetic styling
    - Test on different viewport sizes
    - _Requirements: 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.5_
  
  - [ ] 11.4 Test reduced motion
    - Enable reduced motion preference in OS
    - Verify skip link doesn't animate when appearing
    - Verify skip link still functions correctly
    - _Requirements: 2.5, 6.6_

- [ ] 12. Update documentation
  - [ ] 12.1 Update structure.md steering file
    - Document the skip link pattern
    - Note that skip link is first in tab order
    - Update any references to keyboard navigation
    - _Requirements: N/A (documentation task)_

## Notes

- Tasks 1-3 are completed (SkipLink component created, integrated, and Nav verified)
- SkipLink.tsx is fully implemented with all required features
- SkipLink.test.tsx has 16 passing tests
- layout.tsx has SkipLink integrated as first element in body
- Nav component already has required attributes (id and tabIndex)
- Main remaining work is additional testing and cleanup
- Task 9 (cleanup) removes tests for abandoned DOM reordering approach
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases using Jest
- E2E tests validate real-world keyboard navigation using Playwright
- Manual testing ensures real-world accessibility compliance
- Skip link approach is better than DOM reordering because users have choice
- Tab order: skip link → content → footer → navigation (natural order)
- Skip link is optional - users can skip to navigation OR tab through content
