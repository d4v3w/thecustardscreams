# Design Document: Navigation Hash Sync Race Condition Fix

## Overview

This design fixes a critical race condition where the `programmaticScrollRef` flag remains true after a programmatic scroll completes, causing subsequent navigation clicks to fail. The fix replaces fixed timeout-based flag clearing with event-based scroll completion detection.

### Root Cause Analysis

**Current Implementation**:
```typescript
// In NavigationContext
const setProgrammaticScroll = (value: boolean, duration: number = 800) => {
  programmaticScrollRef.current = value;
  
  if (value) {
    scrollTimeoutRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, duration); // ❌ Fixed 800ms timeout
  }
};
```

**The Problem**:
1. User clicks nav → `setProgrammaticScroll(true, 800)` → scroll starts
2. Scroll completes in ~500ms (smooth scroll duration varies)
3. IntersectionObserver fires at ~500ms
4. `isProgrammaticScroll()` returns true (flag still set)
5. Hash update skipped in useScrollObserver
6. Flag clears at 800ms, but no new events occur
7. **System stuck until manual scroll**

**Why Fixed Timeouts Fail**:
- Smooth scroll duration varies by browser, distance, and device performance
- Reduced motion uses instant scroll (0ms) but flag is still set for 800ms
- User can interrupt scroll with manual input
- No way to know when scroll actually completes

### Solution: Event-Based Scroll Completion Detection

Replace fixed timeouts with scroll event listeners that detect when scrolling actually stops.

**New Implementation**:
```typescript
// Detect scroll completion using scroll events
const clearProgrammaticScrollOnCompletion = () => {
  let scrollTimeout: NodeJS.Timeout;
  
  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      programmaticScrollRef.current = false;
      window.removeEventListener('scroll', handleScroll);
    }, 100); // Clear flag 100ms after scrolling stops
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Fallback: clear after max duration if scroll events don't fire
  setTimeout(() => {
    programmaticScrollRef.current = false;
    window.removeEventListener('scroll', handleScroll);
  }, 1500);
};
```

**How It Works**:
1. User clicks nav → set flag → start scroll → add scroll listener
2. Scroll events fire continuously during animation
3. Each scroll event resets 100ms timer
4. Scrolling stops → no more scroll events
5. Timer expires after 100ms → flag cleared
6. IntersectionObserver can now update hash
7. Fallback timeout (1500ms) ensures flag is always cleared

## Architecture Changes

### 1. NavigationContext Changes

**Current**:
```typescript
const setProgrammaticScroll = (value: boolean, duration: number = 800) => {
  programmaticScrollRef.current = value;
  
  if (value) {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, duration);
  }
};
```

**New**:
```typescript
const setProgrammaticScroll = (value: boolean) => {
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
};
```

**Key Changes**:
- Removed `duration` parameter (no longer needed)
- Added scroll event listener to detect completion
- Added 100ms debounce after scrolling stops
- Added 1500ms fallback timeout for safety
- Added cleanup function to remove listeners

### 2. useHashSync Changes

**Current**:
```typescript
// Set programmatic scroll flag to prevent infinite loops
setProgrammaticScroll(true, 800);

// Scroll to section
ref.current.scrollIntoView({
  behavior,
  block: "start",
  inline: "nearest",
});
```

**New**:
```typescript
// Set programmatic scroll flag to prevent infinite loops
setProgrammaticScroll(true); // No duration parameter

// Scroll to section
ref.current.scrollIntoView({
  behavior,
  block: "start",
  inline: "nearest",
});

// Note: Flag will be cleared automatically when scrolling stops
```

**Key Changes**:
- Remove duration parameter from `setProgrammaticScroll` calls
- Flag clearing is now automatic via scroll event detection

### 3. Additional Safety: Clear Flag When No Scroll Occurs

**Problem**: If section is already visible, no scroll occurs, but flag is still set.

**Solution**: Clear flag immediately if `isSectionVisible` returns true.

```typescript
const scrollToSection = useCallback((sectionId: SectionId, retries = 0) => {
  const sectionRefs = getSectionRefs();
  const ref = sectionRefs.get(sectionId);
  
  if (!ref?.current) {
    if (retries < 3) {
      setTimeout(() => scrollToSection(sectionId, retries + 1), 100);
    } else {
      console.error(`Section "${sectionId}" not found after ${retries} retries`);
    }
    return;
  }

  const alreadyVisible = isSectionVisible(sectionId, sectionRefs, 0.3);
  
  if (alreadyVisible) {
    // Section is already visible, no scroll needed
    // ✅ NEW: Don't set flag if no scroll will occur
    return;
  }

  // Set programmatic scroll flag to prevent infinite loops
  setProgrammaticScroll(true); // Flag will be cleared when scroll completes
  
  // Scroll to section
  ref.current.scrollIntoView({
    behavior,
    block: "start",
    inline: "nearest",
  });
  
  // Focus management remains unchanged
  // ...
}, [getSectionRefs, prefersReducedMotion, setProgrammaticScroll]);
```

## Data Flow

### Before Fix (Broken)

```
User clicks nav
  ↓
updateHash(section, true)
  ↓
setProgrammaticScroll(true, 800ms) ← Flag set for fixed duration
  ↓
scrollIntoView() → scroll starts
  ↓
~500ms: Scroll completes
  ↓
IntersectionObserver fires
  ↓
isProgrammaticScroll() → true ❌ (flag still set)
  ↓
Hash update SKIPPED ❌
  ↓
800ms: Flag clears (too late)
  ↓
No new events → STUCK ❌
```

### After Fix (Working)

```
User clicks nav
  ↓
updateHash(section, true)
  ↓
setProgrammaticScroll(true) ← Flag set, scroll listener added
  ↓
scrollIntoView() → scroll starts
  ↓
Scroll events fire continuously
  ↓
~500ms: Scroll completes
  ↓
No more scroll events
  ↓
100ms: Flag cleared ✓
  ↓
IntersectionObserver fires
  ↓
isProgrammaticScroll() → false ✓
  ↓
Hash update executes ✓
  ↓
System ready for next navigation ✓
```

## Edge Cases Handled

### 1. Reduced Motion (Instant Scroll)

**Problem**: With `behavior: "auto"`, scroll completes instantly, but flag was set for 800ms.

**Solution**: Scroll events still fire (even for instant scroll), so flag is cleared after 100ms.

### 2. User Interrupts Scroll

**Problem**: User manually scrolls during programmatic scroll animation.

**Solution**: Scroll events continue firing, flag is cleared 100ms after user stops scrolling.

### 3. No Scroll Events Fire

**Problem**: In rare cases, scroll events might not fire (e.g., section already at exact position).

**Solution**: Fallback timeout (1500ms) ensures flag is always cleared.

### 4. Rapid Navigation Clicks

**Problem**: User clicks multiple nav items quickly.

**Solution**: Each click clears previous scroll listener and sets up new one. Only the last click's scroll completion matters.

### 5. Section Already Visible

**Problem**: If section is already visible, no scroll occurs, but flag might be set.

**Solution**: Check `isSectionVisible` before setting flag. If visible, don't set flag at all.

## Testing Strategy

### Unit Tests

1. **Test: Flag cleared after scroll completion**
   - Simulate programmatic scroll
   - Fire scroll events
   - Stop firing scroll events
   - Wait 100ms
   - Verify flag is false

2. **Test: Flag cleared with fallback timeout**
   - Simulate programmatic scroll
   - Don't fire any scroll events
   - Wait 1500ms
   - Verify flag is false

3. **Test: Rapid navigation clicks**
   - Click nav item 1
   - Wait 200ms
   - Click nav item 2
   - Wait 200ms
   - Click nav item 3
   - Verify all navigations work

4. **Test: No flag set when section visible**
   - Mock `isSectionVisible` to return true
   - Call `scrollToSection`
   - Verify flag is never set

### Integration Tests

1. **Test: Full navigation flow**
   - Click nav → verify scroll → verify hash update → verify flag cleared
   - Click another nav → verify it works
   - Repeat 5 times

2. **Test: Manual scroll after programmatic scroll**
   - Click nav → wait for completion
   - Manually scroll
   - Verify hash updates correctly

3. **Test: Browser back/forward**
   - Click nav multiple times
   - Click browser back
   - Verify navigation works
   - Click browser forward
   - Verify navigation works

## Implementation Notes

### Performance Considerations

- Scroll event listener is passive (no performance impact)
- Listener is removed after flag clears (no memory leaks)
- Debounce timer (100ms) prevents excessive flag checks

### Browser Compatibility

- Scroll events: Universal support
- Passive event listeners: Supported in all modern browsers
- Fallback timeout ensures compatibility even if scroll events fail

### Backward Compatibility

- No breaking changes to public API
- `setProgrammaticScroll` signature changes (removes duration parameter)
- All existing navigation features continue to work
- Tests verify no regressions

## Migration Path

1. Update `NavigationContext.setProgrammaticScroll` implementation
2. Remove `duration` parameter from all `setProgrammaticScroll` calls
3. Add scroll listener cleanup on unmount
4. Run existing tests to verify no regressions
5. Add new tests for race condition fix
6. Manual testing of rapid navigation clicks
7. Deploy to production

## Success Criteria

✅ Navigation works on first click
✅ Navigation works on second click
✅ Navigation works on third click
✅ Navigation works after manual scroll
✅ No fixed timeout race conditions
✅ All existing tests pass
✅ New tests verify race condition is fixed
