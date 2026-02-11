# Implementation Plan: Navigation Hash Synchronization

## Overview

This implementation converts the navigation system from a dual-state model (React state + URL hash) to a single-source-of-truth model where the URL hash is authoritative. The key challenge is ensuring seamless hash updates during scroll (no page jumps) while maintaining smooth click navigation and browser history integration.

## Implementation Status

Core implementation is complete (Tasks 1-5). Focus management has been implemented in useHashSync. Remaining work includes ARIA attributes, error handling edge cases, comprehensive property-based tests, and cleanup of deprecated code.

## Tasks

- [x] 1. Create section visibility checker utility
  - Implement `isSectionVisible()` function in new file `src/lib/navigationUtils.ts`
  - Use `getBoundingClientRect()` to calculate visibility ratio
  - Match Intersection Observer threshold (0.3 = 30% visible)
  - Add TypeScript types for visibility checking
  - _Requirements: 1.1, 2.1, 5.1_

- [x]* 1.1 Write property test for section visibility checker
  - **Property: Visibility Detection Accuracy**
  - **Validates: Requirements 1.1**

- [x] 2. Implement useHashSync hook
  - [x] 2.1 Create hook skeleton and interface
    - Create `src/hooks/useHashSync.ts`
    - Define `UseHashSyncOptions` and `UseHashSyncReturn` interfaces
    - Export hook function with proper TypeScript types
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.2_
  
  - [x] 2.2 Implement hash change listener
    - Add `useEffect` with `hashchange` event listener
    - Parse hash using utility function
    - Validate hash against known sections
    - Update `currentSection` state on hash change
    - _Requirements: 1.1, 3.1, 3.2, 3.3, 4.1_
  
  - [x] 2.3 Implement conditional scroll logic
    - Call `isSectionVisible()` before scrolling
    - Only scroll if target section is NOT visible (prevents jumps)
    - Use `scrollIntoView` with smooth/auto behavior based on reduced motion
    - Set programmatic scroll flag during scroll animation
    - _Requirements: 1.1, 2.1, 5.1, 6.1, 6.2_
  
  - [x] 2.4 Implement updateHash function
    - Accept `section` and `addToHistory` parameters
    - Use `router.push()` when `addToHistory` is true (clicks)
    - Use `router.replace()` when `addToHistory` is false (scroll)
    - Wrap in try-catch with fallback to `window.location.hash`
    - _Requirements: 1.2, 2.2_
  
  - [x] 2.5 Handle initial page load with hash
    - Check for hash on mount
    - Validate and set initial section
    - Scroll to section after render (use `useEffect` with empty deps)
    - Don't create history entry on initial load
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x]* 2.6 Write property test for hash-state synchronization
    - **Property 1: Hash-State Synchronization Invariant**
    - **Validates: Requirements 7.2, 8.4**
  
  - [x]* 2.7 Write property test for router method selection
    - **Property 3: Router Method Selection**
    - **Validates: Requirements 1.2, 2.2**

- [x] 3. Implement useScrollObserver hook
  - [x] 3.1 Create hook that wraps useIntersectionObserver
    - Create `src/hooks/useScrollObserver.ts`
    - Accept `updateHash` and `isProgrammaticScroll` functions
    - Reuse existing `useIntersectionObserver` logic
    - _Requirements: 1.1, 1.3, 5.1_
  
  - [x] 3.2 Add programmatic scroll check
    - Check `isProgrammaticScroll()` before calling `updateHash`
    - Skip hash update if programmatic scroll is active
    - Prevents infinite loops during click navigation
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 3.3 Implement debouncing for hash updates
    - Debounce `updateHash` calls with 150ms delay
    - Use `useRef` to track debounce timer
    - Clear timer on unmount
    - Ensure final hash matches final visible section
    - _Requirements: 1.3, 8.1, 8.2, 8.4_
  
  - [x]* 3.4 Write property test for debounced hash updates
    - **Property 4: Debounced Hash Updates**
    - **Validates: Requirements 1.3, 5.4, 8.1, 8.2**
  
  - [x]* 3.5 Write property test for loop prevention
    - **Property 10: Programmatic Scroll Loop Prevention**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 4. Checkpoint - Verify new hooks work independently
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update NavigationContext to use new hooks
  - [x] 5.1 Replace useState with useHashSync
    - Remove `useState(currentSection)` and `useState(previousSection)`
    - Call `useHashSync` hook to get `currentSection` and `updateHash`
    - Update context value to include `updateHash` function
    - Remove internal `_setCurrentSection` method (no longer needed)
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 7.2_
  
  - [x] 5.2 Add programmatic scroll flag management
    - Create `programmaticScrollRef` using `useRef(false)`
    - Create `scrollTimeoutRef` for auto-clearing flag
    - Implement `setProgrammaticScroll` function
    - Implement `isProgrammaticScroll` function
    - Add to context value
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 5.3 Update navigateToSection function
    - Change to only call `updateHash(id, true)` (use router.push)
    - Remove direct scroll logic (handled by useHashSync)
    - Remove direct hash manipulation (handled by updateHash)
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 5.4 Initialize useScrollObserver
    - Call `useScrollObserver` with section refs
    - Pass `updateHash` and `isProgrammaticScroll` functions
    - Remove old `useNavigationObserver` call
    - _Requirements: 1.1, 1.3, 5.1_
  
  - [x]* 5.5 Write integration test for NavigationContext
    - Test context provides correct values
    - Test `navigateToSection` updates hash
    - Test programmatic scroll flag management
    - _Requirements: 2.1, 5.1, 7.2_

- [ ] 6. Update ARIA attributes for accessibility
  - [x] 6.1 Add focus management to useHashSync (COMPLETED)
    - Focus target section after scroll completes
    - Set `tabindex="-1"` temporarily for focus
    - Remove tabindex after focus to restore tab order
    - Use `preventScroll: true` to avoid double scroll
    - _Requirements: 6.3_
  
  - [ ] 6.2 Update ARIA attributes on section change
    - Set `aria-current="page"` on active section element
    - Remove `aria-current` from previous section element
    - Update navigation items with `aria-current="true"` for active item
    - Ensure screen readers announce section changes
    - _Requirements: 6.4, 7.1_
  
  - [ ]* 6.3 Write property test for accessibility
    - **Property 13: Focus Management**
    - **Validates: Requirements 6.3, 6.4**

- [ ] 7. Add error handling and edge cases
  - [ ] 7.1 Enhance invalid hash handling
    - `validateHash()` function already exists in navigationUtils.ts
    - Verify it's being used correctly in useHashSync
    - Ensure router.replace() is called to correct invalid URLs
    - Add console warning for debugging (already implemented)
    - _Requirements: 4.2_
  
  - [ ] 7.2 Improve missing section reference handling
    - Retry logic already implemented in useHashSync scrollToSection
    - Verify 3-retry limit with 100ms delays works correctly
    - Ensure error logging after retries exhausted
    - Test with sections that mount asynchronously
    - _Requirements: 2.1, 4.1_
  
  - [ ] 7.3 Add fallback for Intersection Observer
    - Check for `IntersectionObserver` support on mount in useScrollObserver
    - Implement scroll event listener fallback
    - Use `getBoundingClientRect()` to detect visible section
    - Throttle scroll events to 150ms to match debounce timing
    - _Requirements: 1.1, 8.1_
  
  - [ ]* 7.4 Write unit tests for error handling
    - Test invalid hash handling and default to first section
    - Test missing section refs with retry logic
    - Test Intersection Observer fallback on unsupported browsers
    - Test router.push/replace failure fallback to window.location.hash
    - _Requirements: 4.2_

- [ ] 8. Checkpoint - Verify full integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Write property-based tests for core properties
  - [ ]* 9.1 Write property test for scroll-triggered hash updates
    - **Property 2: Scroll-Triggered Hash Updates**
    - Generate random section sequences and verify hash updates within 300ms
    - **Validates: Requirements 1.1, 1.4**
  
  - [ ]* 9.2 Write property test for click navigation
    - **Property 5: Click Navigation Completeness**
    - Generate random navigation clicks and verify scroll + hash update within 500ms
    - **Validates: Requirements 2.1, 2.3**
  
  - [ ]* 9.3 Write property test for idempotent navigation
    - **Property 6: Idempotent Active Navigation**
    - Verify clicking active section doesn't trigger state changes or router calls
    - **Validates: Requirements 2.4**
  
  - [ ]* 9.4 Write property test for browser history
    - **Property 7: Browser History Navigation**
    - Simulate back/forward navigation and verify correct scrolling without new history entries
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
  
  - [ ]* 9.5 Write property test for initial page load
    - **Property 8: Initial Page Load with Hash**
    - Generate random valid hashes and verify correct initial navigation
    - **Validates: Requirements 4.1, 4.3, 4.4**
  
  - [ ]* 9.6 Write property test for reduced motion
    - **Property 11: Reduced Motion Accessibility**
    - Verify instant scrolling (behavior: "auto") when reduced motion is enabled
    - **Validates: Requirements 6.1**
  
  - [ ]* 9.7 Write property test for visual highlighting
    - **Property 14: Visual Highlighting Synchronization**
    - Verify navigation highlighting updates within 50ms of state change
    - **Validates: Requirements 7.1, 7.4**

- [ ] 10. Write unit tests for specific scenarios
  - [ ]* 10.1 Write unit test for initial load with valid hash
    - Test page loads with `#music` and scrolls to music section
    - Verify no additional history entries created
    - _Requirements: 4.1_
  
  - [ ]* 10.2 Write unit test for initial load with invalid hash
    - Test page loads with `#invalid` and defaults to first section
    - Verify hash is corrected using router.replace()
    - _Requirements: 4.2_
  
  - [ ]* 10.3 Write unit test for click navigation
    - Test clicking navigation item updates hash with router.push()
    - Verify scroll occurs and programmatic scroll flag is set
    - _Requirements: 2.1, 2.2_
  
  - [ ]* 10.4 Write unit test for browser back button
    - Test back button scrolls to previous section
    - Verify no new history entries created
    - _Requirements: 3.1_
  
  - [ ]* 10.5 Write unit test for reduced motion preference
    - Mock prefers-reduced-motion media query
    - Verify scrollIntoView uses behavior: "auto"
    - _Requirements: 6.1_
  
  - [ ]* 10.6 Write unit test for rapid navigation
    - Test clicking multiple items rapidly
    - Verify only last click is processed (debouncing works)
    - _Requirements: 7.3_

- [ ] 11. Remove deprecated code
  - [ ] 11.1 Remove useNavigationObserver hook
    - Search for `useNavigationObserver` imports in codebase
    - Verify it's no longer used (replaced by useScrollObserver)
    - Delete `src/hooks/useNavigationObserver.ts` if it exists
    - Remove any remaining imports
  
  - [ ] 11.2 Remove useSmoothScroll hook (if no longer used)
    - Search for `useSmoothScroll` usage in codebase
    - If not used elsewhere, delete `src/hooks/useSmoothScroll.ts`
    - Scroll logic is now in useHashSync, so this may be redundant
    - Remove any remaining imports
  
  - [ ] 11.3 Clean up NavigationContext exports
    - Remove `useNavigationUpdater` export (marked as deprecated)
    - Verify no components are still using this hook
    - Update TypeScript types to remove deprecated methods
    - Update any documentation or comments

- [ ] 12. Final checkpoint - Full system verification
  - Run full test suite (unit + integration + e2e)
  - Verify no console errors or warnings in browser
  - Test manual scrolling updates hash correctly
  - Test clicking navigation updates hash and scrolls
  - Test browser back/forward buttons work correctly
  - Test initial page load with various hash values
  - Test reduced motion preference is respected
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- The implementation maintains backward compatibility with existing navigation behavior
- No breaking changes to component APIs
- Existing shared links continue to work
- Focus management (Task 6.1) is already implemented in useHashSync
- Error handling utilities (validateHash, parseHash) already exist in navigationUtils.ts
- Integration tests in src/__tests__/NavigationContext.test.tsx cover focus management extensively
