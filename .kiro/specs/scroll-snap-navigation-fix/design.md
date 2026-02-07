# Design Document: Scroll-Snap Navigation Fix

## Overview

This design addresses the broken scroll-snap navigation in a Next.js single-page website. The system currently prevents natural user scrolling, forcing users to navigate only via link clicks. The root cause involves conflicts between JavaScript scroll methods (`window.scrollTo()`, `scrollIntoView()`), CSS scroll-snap properties, and the IntersectionObserver tracking system.

The fix requires a systematic approach:
1. **Root cause analysis** - Identify why natural scrolling is blocked
2. **CSS configuration** - Ensure scroll-snap properties are correctly applied
3. **JavaScript coordination** - Ensure JS doesn't interfere with native scroll behavior
4. **Testing infrastructure** - Create comprehensive tests to validate each aspect

### Key Design Principles

- **Native-first**: Rely on browser's native scroll-snap behavior rather than JavaScript control
- **Non-interference**: JavaScript should observe and respond to scrolling, not control it
- **Progressive enhancement**: Core scrolling works without JavaScript; JS adds navigation features
- **Testability**: Each component of scroll behavior is independently testable

## Architecture

### Component Hierarchy

```
NavigationProvider (Context)
├── NavigationContext (State Management)
│   ├── Section Registration
│   ├── Current Section Tracking
│   └── Navigation Actions
├── useIntersectionObserver (Scroll Tracking)
│   └── Debounced Section Updates
├── useNavigationObserver (Context Integration)
└── Page Components
    ├── Sections (with scroll-snap CSS)
    └── BottomNav (Navigation UI)
```

### Data Flow

```
User Scroll Event
    ↓
Browser Native Scroll-Snap
    ↓
IntersectionObserver Detects Change
    ↓
Debounced Update (100ms)
    ↓
NavigationContext Updates currentSection
    ↓
BottomNav Highlights Active Item
```

### Programmatic Navigation Flow

```
User Clicks Nav Link
    ↓
navigateToSection(id)
    ↓
window.scrollTo({ top, behavior: "smooth" })
    ↓
Browser Handles Scroll + Snap
    ↓
IntersectionObserver Detects Change
    ↓
NavigationContext Updates
    ↓
URL Hash Updates
```

## Components and Interfaces

### NavigationContext

**Purpose**: Central state management for section navigation

**State**:
```typescript
interface NavigationContextValue {
  currentSection: SectionId | null;
  previousSection: SectionId | null;
  nextSection: SectionId | null;
  sections: SectionId[];
  
  registerSection: (id: SectionId, ref: RefObject<HTMLElement>, order: number) => void;
  unregisterSection: (id: SectionId) => void;
  navigateToSection: (id: SectionId) => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  getSectionRefs: () => Map<SectionId, RefObject<HTMLElement>>;
}
```

**Key Methods**:

- `registerSection`: Adds section to ordered list, stores ref for scrolling
- `navigateToSection`: Scrolls to section using `window.scrollTo()` with smooth behavior
- `getSectionRefs`: Provides refs to IntersectionObserver

**Current Issues**:
- Uses `window.scrollTo()` which should work with scroll-snap but may have timing issues
- No explicit handling of scroll-snap completion

**Proposed Fix**:
- Ensure `window.scrollTo()` uses `behavior: "smooth"` to allow scroll-snap to activate
- Remove any event listeners that might call `preventDefault()` on scroll events
- Add flag to track programmatic vs natural scrolling (optional, for debugging)

### useIntersectionObserver Hook

**Purpose**: Track which section is most visible in viewport

**Configuration**:
```typescript
interface UseIntersectionObserverOptions {
  threshold?: number;  // Default: 0.5
  rootMargin?: string; // Default: "0px"
}
```

**Algorithm**:
1. Create IntersectionObserver with threshold and rootMargin
2. Observe all section refs
3. Track intersection ratios in a Map
4. Debounce updates by 100ms
5. Return section with highest intersection ratio

**Current Issues**:
- Debouncing may cause lag in active section updates
- May conflict with programmatic scrolling

**Proposed Fix**:
- Maintain 100ms debounce for performance
- Ensure observer doesn't trigger during programmatic scroll (passive observation only)
- Consider increasing threshold to 0.6 for more accurate "active" detection

### Section Component

**Purpose**: Wrapper for content sections with scroll-snap styling

**CSS Classes Applied**:
- `min-h-screen` - Full viewport height
- `snap-start` - Snap alignment point
- `scroll-mt-0` - Scroll margin top (for fixed headers)

**Current Issues**:
- May have conflicting CSS that prevents snap
- Animation effects might interfere with scroll

**Proposed Fix**:
- Verify no CSS overrides `scroll-snap-align`
- Ensure animations don't trigger layout shifts during scroll
- Add `scroll-snap-stop: normal` to allow scrolling through sections

### CSS Scroll-Snap Configuration

**Body Element** (Scroll Container):
```css
body {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-padding-bottom: 80px; /* For bottom nav */
}
```

**Section Elements** (Snap Points):
```css
section[data-section-id] {
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  min-height: 100vh;
}
```

**Key Properties**:
- `scroll-snap-type: y mandatory` - Enforces snapping on Y axis
- `scroll-snap-align: start` - Sections snap to top of viewport
- `scroll-snap-stop: normal` - Allows scrolling through sections (not forced to stop at each)
- `scroll-padding-bottom` - Accounts for fixed navigation

**Current Issues**:
- May be missing `scroll-snap-stop: normal`
- Possible CSS specificity conflicts
- May have JavaScript that disables scrolling

**Proposed Fix**:
- Explicitly set `scroll-snap-stop: normal` on sections
- Audit for any CSS that sets `overflow: hidden` on body
- Remove any `touch-action` restrictions
- Verify no JavaScript calls `preventDefault()` on scroll/wheel events

## Data Models

### SectionId Type

```typescript
type SectionId = "hero" | "music" | "shows" | "about";
```

### SectionRegistration

```typescript
interface SectionRegistration {
  id: SectionId;
  ref: RefObject<HTMLElement | null>;
  order: number;
}
```

### Section Order Mapping

```typescript
const SECTION_ORDER: Record<string, number> = {
  hero: 0,
  music: 1,
  shows: 2,
  about: 3,
};
```

## Root Cause Analysis

### Hypothesis 1: JavaScript Preventing Native Scroll

**Symptoms**: Users cannot scroll with mouse/trackpad
**Possible Causes**:
- Event listener with `preventDefault()` on wheel/scroll events
- CSS `overflow: hidden` on body or html
- JavaScript hijacking scroll events

**Diagnostic Approach**:
1. Check for event listeners on window, document, body
2. Audit CSS for overflow properties
3. Test with JavaScript disabled
4. Check browser console for errors

**Test Strategy**:
- Create test that simulates wheel events
- Verify no `preventDefault()` is called
- Check computed styles for overflow properties

### Hypothesis 2: Scroll-Snap Configuration Issues

**Symptoms**: Sections don't snap after scrolling
**Possible Causes**:
- Missing `scroll-snap-type` on container
- Missing `scroll-snap-align` on sections
- `scroll-snap-stop: always` forcing stops
- Conflicting CSS from other sources

**Diagnostic Approach**:
1. Inspect computed styles on body element
2. Inspect computed styles on section elements
3. Check for CSS specificity conflicts
4. Test in different browsers

**Test Strategy**:
- Verify CSS classes are applied
- Check computed styles programmatically
- Test scroll-snap in isolation

### Hypothesis 3: window.scrollTo() Bypassing Scroll-Snap

**Symptoms**: Programmatic navigation doesn't snap
**Possible Causes**:
- Using `scrollIntoView()` which may bypass snap
- Incorrect scroll behavior parameter
- Timing issues with scroll-snap activation

**Diagnostic Approach**:
1. Test `window.scrollTo()` vs `scrollIntoView()`
2. Try different behavior values ("smooth" vs "auto")
3. Add delays to see if timing matters
4. Check browser compatibility

**Test Strategy**:
- Test both scroll methods
- Verify snap activates after programmatic scroll
- Test with different behavior values

### Hypothesis 4: IntersectionObserver Conflicts

**Symptoms**: Active section doesn't update correctly
**Possible Causes**:
- Observer triggering additional scrolls
- Debounce timing too long/short
- Threshold configuration incorrect
- Observer interfering with scroll events

**Diagnostic Approach**:
1. Log observer callbacks
2. Test different debounce values
3. Test different threshold values
4. Disable observer temporarily

**Test Strategy**:
- Verify observer is passive (doesn't trigger scrolls)
- Test debounce timing
- Validate threshold accuracy

## Error Handling

### Browser Compatibility Fallbacks

**IntersectionObserver Not Supported**:
```typescript
if (!("IntersectionObserver" in window)) {
  // Fallback: Set first section as active
  setActiveSection(sections[0]);
  return;
}
```

**Scroll-Snap Not Supported**:
- Graceful degradation: smooth scrolling still works
- No special handling needed; feature detection via CSS

### Invalid Section Navigation

```typescript
const navigateToSection = (id: SectionId) => {
  const registration = sectionsMapRef.current.get(id);
  if (!registration?.ref.current) {
    console.warn(`Section ${id} not found`);
    return; // Fail silently
  }
  // ... proceed with scroll
};
```

### Scroll Event Errors

- Wrap scroll operations in try-catch
- Log errors but don't break user experience
- Provide fallback to hash navigation

## Testing Strategy

### Unit Tests

**CSS Class Application**:
- Verify `snap-start` on all sections
- Verify `min-h-screen` on all sections
- Verify `data-section-id` attributes
- Verify body has scroll-snap-type

**Navigation Context**:
- Test section registration/unregistration
- Test section order sorting
- Test navigateToSection calls window.scrollTo
- Test URL hash updates

**IntersectionObserver**:
- Test observer creation with correct options
- Test debounce timing (100ms)
- Test highest intersection ratio selection
- Test fallback when not supported

### Integration Tests

**Natural Scrolling**:
- Simulate wheel events
- Verify scroll position changes
- Verify no preventDefault called
- Verify snap activates after scroll stops

**Programmatic Navigation**:
- Click navigation links
- Verify window.scrollTo called
- Verify target section reached
- Verify URL hash updated
- Verify active section updated

**Scroll-Snap Behavior**:
- Scroll between sections
- Verify sections snap to start
- Verify can scroll through multiple sections
- Verify snap works with smooth scrolling

### Property-Based Tests

Property-based tests will be defined in the Correctness Properties section below.

### Manual Testing Checklist

1. **Mouse Wheel Scrolling**:
   - Scroll down through all sections
   - Scroll up through all sections
   - Verify sections snap into place

2. **Trackpad Gestures**:
   - Two-finger swipe down
   - Two-finger swipe up
   - Verify smooth scrolling with snap

3. **Touch Gestures** (Mobile):
   - Swipe up/down
   - Verify touch scrolling works
   - Verify snap on touch release

4. **Keyboard Navigation**:
   - Page Down / Page Up
   - Arrow keys
   - Space bar
   - Verify keyboard scrolling works

5. **Navigation Links**:
   - Click each nav item
   - Verify smooth scroll to section
   - Verify section snaps into place
   - Verify URL hash updates
   - Verify active item highlights

6. **Browser Testing**:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

7. **Reduced Motion**:
   - Enable prefers-reduced-motion
   - Verify instant scrolling (no smooth)
   - Verify snap still works

## Debugging Workflow

### Phase 1: Identify Root Cause

**Tasks**:
1. Create diagnostic test suite
2. Test natural scrolling (wheel events)
3. Test CSS scroll-snap properties
4. Test window.scrollTo() behavior
5. Test IntersectionObserver behavior
6. Document findings

**Success Criteria**:
- Identify which component is blocking scroll
- Understand why scroll-snap isn't activating
- Have reproducible test cases

### Phase 2: Implement Fixes

**Tasks**:
1. Fix CSS scroll-snap configuration
2. Remove/fix JavaScript scroll interference
3. Update scroll method (scrollTo vs scrollIntoView)
4. Adjust IntersectionObserver configuration
5. Test each fix in isolation

**Success Criteria**:
- Natural scrolling works
- Sections snap properly
- Programmatic navigation works
- Active section tracking works

### Phase 3: Integration Testing

**Tasks**:
1. Test all scroll methods together
2. Test edge cases (rapid scrolling, etc.)
3. Test across browsers
4. Test with reduced motion
5. Performance testing

**Success Criteria**:
- All requirements met
- No regressions
- Smooth 60fps scrolling
- Works in all target browsers

### Phase 4: Validation

**Tasks**:
1. Run full test suite
2. Manual testing checklist
3. User acceptance testing
4. Performance profiling

**Success Criteria**:
- All tests pass
- Manual testing confirms fix
- Performance is acceptable
- Ready for deployment


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Scroll Events Are Not Blocked

*For any* scroll or wheel event triggered by user input, the system should not call `preventDefault()` on the event, allowing the browser's native scroll behavior to proceed unimpeded.

**Validates: Requirements 1.1, 1.6, 5.1**

### Property 2: Touch Scroll Events Are Not Blocked

*For any* touch event sequence (touchstart, touchmove, touchend) that represents a scroll gesture, the system should not call `preventDefault()` on the events, allowing native touch scrolling to work.

**Validates: Requirements 1.3**

### Property 3: Scroll Position Aligns After Snap

*For any* section, when scrolling stops near that section, the final scroll position should equal the section's offsetTop (within a small tolerance), indicating that scroll-snap has activated correctly.

**Validates: Requirements 2.1, 2.2**

### Property 4: Navigation Triggers Scroll

*For any* section ID, when `navigateToSection(id)` is called, `window.scrollTo()` should be invoked with the correct offsetTop and behavior parameters.

**Validates: Requirements 3.1**

### Property 5: Programmatic Scroll Respects Snap

*For any* section, after programmatic navigation to that section completes, the scroll position should equal the section's offsetTop, indicating scroll-snap worked with `window.scrollTo()`.

**Validates: Requirements 3.2, 5.2**

### Property 6: URL Hash Updates on Navigation

*For any* section ID, when navigating to that section, `window.history.pushState()` should be called with a hash matching the section ID.

**Validates: Requirements 3.3**

### Property 7: Scroll Behavior Respects Motion Preference

*For any* navigation action, when `prefers-reduced-motion` is enabled, `window.scrollTo()` should be called with `behavior: "auto"`, and when disabled, with `behavior: "smooth"`.

**Validates: Requirements 3.4, 3.5**

### Property 8: Active Section Tracks Highest Intersection

*For any* set of intersecting sections with different intersection ratios, the section with the highest intersection ratio should be set as the active section.

**Validates: Requirements 4.1, 4.5**

### Property 9: Active Section Reflects in UI

*For any* section that is marked as active, the corresponding navigation item should have the active CSS classes (`bg-amber-400`, `text-black`), and non-active items should not.

**Validates: Requirements 4.2**

### Property 10: Navigation Completes to Target Section

*For any* section ID, after programmatic navigation to that section, the active section state should equal the target section ID.

**Validates: Requirements 4.4**

### Property 11: IntersectionObserver Is Passive

*For any* IntersectionObserver callback execution, the callback should not invoke `window.scrollTo()`, `scrollIntoView()`, or any other scroll-triggering method.

**Validates: Requirements 5.3**

### Property 12: State Updates Are Debounced

*For any* sequence of rapid scroll events (within 100ms), only one state update should occur after the debounce period expires, not one per event.

**Validates: Requirements 5.4, 9.1**

### Property 13: Sections Have Correct Snap CSS

*For any* section element with `data-section-id` attribute, the computed styles should include `scroll-snap-align: start` and `scroll-snap-stop: normal`.

**Validates: Requirements 6.2, 6.3**

### Property 14: Focus Moves to Target Section

*For any* section, after programmatic navigation to that section completes, `document.activeElement` should reference the target section element.

**Validates: Requirements 7.1**

### Property 15: Event Listeners Are Passive

*For any* scroll or wheel event listener added by the system, the listener should either be registered with `{ passive: true }` or should never call `preventDefault()`.

**Validates: Requirements 9.5**

### Example-Based Tests

The following behaviors should be validated with specific example tests rather than property-based tests:

**Example 1: Keyboard Navigation Down**
- Press Page Down key
- Verify scroll position moves to next section
- **Validates: Requirements 1.4**

**Example 2: Keyboard Navigation Up**
- Press Page Up key
- Verify scroll position moves to previous section
- **Validates: Requirements 1.5**

**Example 3: Scroll-Snap-Stop Allows Pass-Through**
- Verify `scroll-snap-stop: normal` is set on sections
- This allows scrolling through multiple sections without forced stops
- **Validates: Requirements 2.5**

**Example 4: Scroll Container Has Mandatory Snap**
- Verify body element has `scroll-snap-type: y mandatory`
- **Validates: Requirements 6.1**

**Example 5: Scroll Container Has Padding**
- Verify body element has `scroll-padding-bottom: 80px`
- **Validates: Requirements 6.4**

**Example 6: Focus Uses Temporary Tabindex**
- Navigate to section
- Verify tabindex="-1" is set before focus
- Verify tabindex is removed after focus
- **Validates: Requirements 7.2, 7.4**

**Example 7: Focus Uses PreventScroll**
- Navigate to section
- Verify `element.focus({ preventScroll: true })` is called
- **Validates: Requirements 7.3**

**Example 8: Focus Timing Respects Motion Preference**
- With reduced motion: verify focus delay is 0ms
- Without reduced motion: verify focus delay is ~500ms
- **Validates: Requirements 7.5**

**Example 9: IntersectionObserver Feature Detection**
- Mock `IntersectionObserver` as undefined
- Verify first section becomes active (fallback)
- **Validates: Requirements 8.2, 8.3**

**Example 10: Section Registration Batching**
- Register multiple sections
- Verify state updates are batched (not one per registration)
- **Validates: Requirements 9.3**

### Edge Cases

The following edge cases should be covered by the property tests' input generators:

- **Empty scroll container**: No sections registered
- **Single section**: Only one section exists
- **Rapid navigation**: Multiple navigation calls in quick succession
- **Mid-scroll navigation**: Navigation triggered while user is scrolling
- **Hash navigation on load**: Initial page load with hash in URL
- **Invalid section ID**: Navigation to non-existent section
- **Sections with varying heights**: Not all sections are exactly 100vh
- **Scroll near boundaries**: Scrolling at very top or very bottom

