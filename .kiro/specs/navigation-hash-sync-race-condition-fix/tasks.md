# Implementation Plan: Navigation Hash Sync Race Condition Fix

## Overview

This plan fixes the race condition where navigation works once then fails until manual scroll. The fix replaces fixed timeout-based flag clearing with event-based scroll completion detection.

## Root Cause

The `programmaticScrollRef` flag is set for a fixed 800ms duration, but scrolls complete in ~500ms. When IntersectionObserver fires after scroll completion, the flag is still true, causing hash updates to be skipped. The system gets stuck until manual scroll triggers new events.

## Solution

Replace fixed timeouts with scroll event listeners that detect when scrolling actually stops, clearing the flag at the right time.

## Tasks

- [x] 1. Update NavigationContext.setProgrammaticScroll implementation
  - Remove `duration` parameter from function signature
  - Add scroll event listener to detect scroll completion
  - Clear flag 100ms after scrolling stops (debounced)
  - Add fallback timeout (1500ms) for safety
  - Add cleanup function to remove listeners
  - Store cleanup function in ref for later removal
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3, 5.4_
  
  **Implementation**:
  ```typescript
  // In NavigationContext
  const scrollListenerCleanupRef = useRef<(() => void) | null>(null);
  
  const setProgrammaticScroll = useCallback((value: boolean) => {
    programmaticScrollRef.current = value;
    
    if (value) {
      // Clear any existing listeners
      if (scrollListenerCleanupRef.current) {
        scrollListenerCleanupRef.current();
      }
      
      // Set up scroll completion detection
      let scrollTimeout: NodeJS.Timeout;
      let fallbackTimeout: NodeJS.Timeout;
      
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          programmaticScrollRef.current = false;
          cleanup();
        }, 100);
      };
      
      const cleanup = () => {
        clearTimeout(scrollTimeout);
        clearTimeout(fallbackTimeout);
        window.removeEventListener('scroll', handleScroll);
        scrollListenerCleanupRef.current = null;
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Fallback: clear after 1500ms if scroll events don't fire
      fallbackTimeout = setTimeout(() => {
        programmaticScrollRef.current = false;
        cleanup();
      }, 1500);
      
      scrollListenerCleanupRef.current = cleanup;
    }
  }, []);
  ```

- [x] 2. Add cleanup on unmount in NavigationContext
  - Add useEffect cleanup to remove scroll listener on unmount
  - Clear any pending timeouts
  - Reset flag to false
  - _Requirements: 5.3, 5.4_
  
  **Implementation**:
  ```typescript
  // In NavigationProvider
  useEffect(() => {
    return () => {
      // Cleanup scroll listener on unmount
      if (scrollListenerCleanupRef.current) {
        scrollListenerCleanupRef.current();
      }
      // Clear scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Reset flag
      programmaticScrollRef.current = false;
    };
  }, []);
  ```

- [x] 3. Update useHashSync to remove duration parameter
  - Remove `duration` parameter from `setProgrammaticScroll(true, 800)` calls
  - Change to `setProgrammaticScroll(true)`
  - Flag will now be cleared automatically when scroll completes
  - _Requirements: 1.4, 2.4, 3.4_
  
  **Files to update**:
  - `src/hooks/useHashSync.ts` - In `scrollToSection` function

- [x] 4. Improve isSectionVisible check in useHashSync
  - Ensure flag is NOT set if section is already visible
  - Return early before calling `setProgrammaticScroll`
  - This prevents unnecessary flag setting when no scroll occurs
  - _Requirements: 3.4_
  
  **Current code is correct** - already returns early if section is visible

- [x] 5. Write unit test for flag clearing on scroll completion
  - Simulate programmatic scroll
  - Fire scroll events using jest.useFakeTimers
  - Stop firing scroll events
  - Advance timers by 100ms
  - Verify `isProgrammaticScroll()` returns false
  - _Requirements: 7.1, 7.2_

- [x] 6. Write unit test for fallback timeout
  - Simulate programmatic scroll
  - Don't fire any scroll events
  - Advance timers by 1500ms
  - Verify `isProgrammaticScroll()` returns false
  - _Requirements: 7.2_

- [x] 7. Write unit test for rapid navigation clicks
  - Click nav item 1
  - Wait 200ms
  - Click nav item 2
  - Wait 200ms
  - Click nav item 3
  - Verify all three navigations execute correctly
  - Verify flag is cleared after each navigation
  - _Requirements: 2.2, 7.1_

- [x] 8. Write integration test for navigation after programmatic scroll
  - Click nav item
  - Wait for scroll completion (monitor flag)
  - Click another nav item
  - Verify second navigation works
  - Repeat 5 times to ensure reliability
  - _Requirements: 2.1, 2.2, 7.4_

- [x] 9. Write integration test for manual scroll after programmatic scroll
  - Click nav item
  - Wait for scroll completion
  - Simulate manual scroll (fire scroll events)
  - Verify hash updates correctly
  - Verify IntersectionObserver updates work
  - _Requirements: 6.2, 7.4_

- [x] 10. Checkpoint - Run all tests
  - Run existing navigation-hash-sync tests
  - Run new race condition tests
  - Verify no regressions
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Manual testing - Rapid navigation clicks
  - Start dev server
  - Click navigation items rapidly (5+ clicks in quick succession)
  - Verify each click navigates correctly
  - Verify no "stuck" behavior
  - Test in Chrome, Firefox, Safari
  - _Requirements: 2.1, 2.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 12. Manual testing - Navigation after scroll
  - Click nav item → wait for completion
  - Click another nav item → verify it works
  - Manually scroll → verify hash updates
  - Click nav item again → verify it works
  - Repeat 10 times to ensure reliability
  - _Requirements: 2.1, 2.2, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13. Manual testing - Reduced motion
  - Enable prefers-reduced-motion in browser
  - Click nav items rapidly
  - Verify instant scrolling works
  - Verify navigation doesn't get stuck
  - Verify flag is cleared quickly (no 800ms delay)
  - _Requirements: 6.5_

- [x] 14. Final checkpoint - Verify fix is complete
  - Ensure all tests pass
  - Ensure manual testing confirms fix
  - Verify no regressions in existing functionality
  - Ask the user if questions arise.

## Notes

- The key change is replacing fixed 800ms timeout with event-based scroll completion detection
- Scroll events fire continuously during animation, stop when scrolling stops
- Flag is cleared 100ms after last scroll event (debounced)
- Fallback timeout (1500ms) ensures flag is always cleared
- This eliminates race conditions between flag clearing and IntersectionObserver firing
- All existing navigation features continue to work
- No breaking changes to public API (except internal `setProgrammaticScroll` signature)

## Expected Outcome

After this fix:
✅ Navigation works on first click
✅ Navigation works on second click
✅ Navigation works on third click
✅ Navigation works after manual scroll
✅ No "stuck" behavior requiring manual scroll to unstick
✅ All existing tests pass
✅ New tests verify race condition is fixed
