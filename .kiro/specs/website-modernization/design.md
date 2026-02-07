# Design Document: Website Modernization

## Overview

This design transforms The Custard Screams website from a traditional multi-page Next.js application into a modern single-page app with smooth scrolling, enhanced navigation, and improved user experience. The modernization maintains the band's punk rock aesthetic (black background with amber accents) while introducing contemporary interaction patterns and accessibility features.

### Key Design Principles

1. **Progressive Enhancement**: Core content accessible without JavaScript, enhanced with smooth scrolling and animations when available
2. **Mobile-First**: Optimized for mobile app-like experience, with natural desktop adaptation
3. **Performance**: Lazy loading, optimized fonts, minimal layout shifts
4. **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, reduced motion support
5. **Privacy**: GDPR-compliant cookie consent, blocking tracking until user approval

## Architecture

### Application Structure

The application will transition from a multi-page architecture to a single-page architecture while maintaining Next.js 16's App Router structure for SEO and initial server-side rendering.

```
src/
├── app/
│   ├── layout.tsx              # Root layout with cookie consent
│   ├── page.tsx                # Single-page home with all sections
│   └── _components/            # Page-specific components
│       ├── HeroSection.tsx
│       ├── MusicSection.tsx
│       ├── ShowsSection.tsx
│       └── AboutSection.tsx
├── components/
│   ├── navigation/
│   │   ├── BottomNav.tsx       # Fixed bottom navigation
│   │   └── NavItem.tsx         # Individual nav items
│   ├── shows/
│   │   ├── NextShowBanner.tsx  # Hero banner for next show
│   │   ├── BandsintownWidget.tsx
│   │   ├── PastShowsGallery.tsx
│   │   └── StickyTicketButton.tsx
│   ├── cookie/
│   │   └── CookieConsent.tsx   # GDPR cookie banner
│   ├── Footer.tsx
│   ├── Music.tsx
│   ├── Socials.tsx
│   └── Links.tsx
├── hooks/
│   ├── useIntersectionObserver.ts  # Section visibility tracking
│   ├── useSmoothScroll.ts          # Smooth scroll behavior
│   ├── useCookieConsent.ts         # Cookie consent management
│   └── useReducedMotion.ts         # Accessibility preference
├── lib/
│   ├── metadata.ts
│   ├── analytics.ts            # Conditional analytics loading
│   └── types.ts                # Shared TypeScript types
└── styles/
    └── globals.css             # Tailwind + custom CSS
```

### Data Flow

1. **Initial Load**: Server-side renders complete page with all sections
2. **Hydration**: Client-side JavaScript enhances with smooth scrolling and animations
3. **Navigation**: Intersection Observer tracks visible section, updates bottom nav
4. **Cookie Consent**: Blocks analytics/tracking until user consent
5. **Shows Data**: Bandsintown widget lazy loads when Shows section approaches viewport

## Components and Interfaces

### Core Components

#### 1. BottomNav Component

Fixed navigation bar at bottom of viewport with section links and active indicators.

```typescript
interface BottomNavProps {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
}

type SectionId = 'hero' | 'music' | 'shows' | 'about';

interface NavItemConfig {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}
```

**Behavior:**
- Fixed position at bottom with z-index above content
- Highlights active section based on scroll position
- Smooth scrolls to section on click
- Minimum 44x44px touch targets for mobile
- Keyboard navigable (Tab, Enter, Space)

#### 2. Section Container Component

Wrapper for each major content section with scroll-snap and intersection observer.

```typescript
interface SectionProps {
  id: SectionId;
  className?: string;
  children: React.ReactNode;
  onVisibilityChange?: (isVisible: boolean) => void;
}
```

**Behavior:**
- Uses CSS scroll-snap-align for smooth section transitions
- Registers with Intersection Observer for visibility tracking
- Applies fade-in animation on first appearance (respects prefers-reduced-motion)
- Provides semantic HTML structure (section, heading hierarchy)

#### 3. NextShowBanner Component

Large hero banner displaying the next upcoming show with ticket CTA.

```typescript
interface Show {
  id: string;
  date: Date;
  venue: string;
  location: string;
  ticketUrl: string;
  imageUrl?: string;
}

interface NextShowBannerProps {
  show: Show | null;
  loading: boolean;
}
```

**Behavior:**
- Fetches next show from Bandsintown API or static data
- Displays large, prominent banner with show details
- Primary CTA button for ticket purchase
- Gracefully handles no upcoming shows
- Loading state with skeleton UI

#### 4. BandsintownWidget Component

Lazy-loaded third-party widget for show listings.

```typescript
interface BandsintownWidgetProps {
  artistId: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}
```

**Behavior:**
- Lazy loads script when Shows section approaches viewport
- Displays loading state until widget initializes
- Error boundary for graceful failure
- Respects cookie consent (blocks until approved)

#### 5. StickyTicketButton Component

Floating "Get Tickets" button visible when Shows section is in viewport.

```typescript
interface StickyTicketButtonProps {
  show: Show | null;
  visible: boolean;
}
```

**Behavior:**
- Fixed position button (bottom-right, above bottom nav)
- Only visible when Shows section is in viewport
- Smooth fade in/out transitions
- Links to next show ticket URL
- Hidden when no upcoming shows

#### 6. CookieConsent Component

GDPR-compliant cookie consent banner.

```typescript
interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

interface CookiePreferences {
  analytics: boolean;
  timestamp: number;
}
```

**Behavior:**
- Displays on first visit (checks localStorage)
- Blocks analytics scripts until consent
- Stores preference in essential cookie
- Provides clear explanation of cookie usage
- Allows withdrawal of consent
- Accessible (keyboard navigation, screen reader friendly)

### Custom Hooks

#### useIntersectionObserver

Tracks which section is currently visible in viewport.

```typescript
interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

function useIntersectionObserver(
  refs: Map<SectionId, React.RefObject<HTMLElement>>,
  options?: UseIntersectionObserverOptions
): SectionId | null;
```

**Implementation:**
- Creates Intersection Observer with configurable threshold (default 0.5)
- Tracks all section refs
- Returns currently visible section ID
- Cleans up observer on unmount
- Handles browser compatibility (fallback for no support)

#### useSmoothScroll

Provides smooth scrolling to sections with focus management.

```typescript
interface UseSmoothScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  offset?: number;
}

function useSmoothScroll(
  options?: UseSmoothScrollOptions
): (sectionId: SectionId) => void;
```

**Implementation:**
- Scrolls to section with smooth behavior
- Manages focus for keyboard users
- Updates URL hash without page reload
- Respects prefers-reduced-motion (instant scroll if enabled)
- Handles scroll-snap alignment

#### useCookieConsent

Manages cookie consent state and analytics loading.

```typescript
interface UseCookieConsentReturn {
  hasConsent: boolean | null;  // null = not decided
  acceptCookies: () => void;
  declineCookies: () => void;
  withdrawConsent: () => void;
}

function useCookieConsent(): UseCookieConsentReturn;
```

**Implementation:**
- Reads consent from localStorage on mount
- Provides functions to accept/decline/withdraw
- Triggers analytics script loading on accept
- Removes analytics on decline/withdraw
- Stores minimal essential cookie for preference

#### useReducedMotion

Detects user's motion preference for accessibility.

```typescript
function useReducedMotion(): boolean;
```

**Implementation:**
- Checks prefers-reduced-motion media query
- Returns boolean indicating if reduced motion is preferred
- Updates on preference change
- Used to disable animations conditionally

## Data Models

### Section Configuration

```typescript
type SectionId = 'hero' | 'music' | 'shows' | 'about';

interface SectionConfig {
  id: SectionId;
  title: string;
  ariaLabel: string;
  navLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionConfig[] = [
  {
    id: 'hero',
    title: 'The Custard Screams',
    ariaLabel: 'Hero section with band introduction',
    navLabel: 'Home',
    icon: HomeIcon
  },
  {
    id: 'music',
    title: 'Music',
    ariaLabel: 'Music streaming and downloads',
    navLabel: 'Music',
    icon: MusicIcon
  },
  {
    id: 'shows',
    title: 'Live Shows',
    ariaLabel: 'Upcoming and past live shows',
    navLabel: 'Shows',
    icon: CalendarIcon
  },
  {
    id: 'about',
    title: 'About',
    ariaLabel: 'About the band',
    navLabel: 'About',
    icon: InfoIcon
  }
];
```

### Show Data Model

```typescript
interface Show {
  id: string;
  date: Date;
  venue: string;
  location: string;
  city: string;
  country: string;
  ticketUrl: string;
  rsvpUrl?: string;
  imageUrl?: string;
  description?: string;
  isPast: boolean;
}

interface ShowsData {
  nextShow: Show | null;
  upcomingShows: Show[];
  pastShows: Show[];
}
```

### Cookie Consent Model

```typescript
interface CookiePreferences {
  analytics: boolean;
  timestamp: number;
  version: number;  // For future consent updates
}

const COOKIE_CONSENT_KEY = 'custard-screams-cookie-consent';
const CONSENT_VERSION = 1;
```

### Analytics Configuration

```typescript
interface AnalyticsConfig {
  enabled: boolean;
  measurementId: string;
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Section Rendering Completeness
*For any* page load, all four primary sections (Hero, Music, Shows, About) should be present in the rendered HTML with their corresponding section identifiers.
**Validates: Requirements 1.1**

### Property 2: Scroll-Snap CSS Application
*For any* section container, the CSS scroll-snap properties should be correctly applied to enable smooth section alignment.
**Validates: Requirements 1.2**

### Property 3: Intersection Observer Section Detection
*For any* section that enters the viewport, the Intersection Observer should trigger and update the active section state to match the visible section.
**Validates: Requirements 1.3**

### Property 4: Viewport Animation Application
*For any* content element entering the viewport, fade-in animation classes should be applied unless prefers-reduced-motion is enabled.
**Validates: Requirements 1.4**

### Property 5: Anchor Link Navigation
*For any* section ID, navigating to the anchor link (#sectionId) should scroll to that section and properly align it in the viewport.
**Validates: Requirements 1.5**

### Property 6: SPA State Preservation
*For any* navigation action within the page, the scroll position and section state should be maintained without triggering a page reload.
**Validates: Requirements 1.6**

### Property 7: Navigation Item Completeness
*For any* section defined in the configuration, there should be a corresponding navigation item in the bottom nav with both an icon and text label.
**Validates: Requirements 2.2**

### Property 8: Active Section Indicator Synchronization
*For any* active section, the corresponding navigation item should have the active visual indicator applied.
**Validates: Requirements 2.3**

### Property 9: Navigation Click Scrolling
*For any* navigation item click, the system should smoothly scroll to the corresponding section.
**Validates: Requirements 2.4**

### Property 10: Touch Target Sizing
*For any* navigation item, the clickable area should be at least 44x44 pixels to meet mobile accessibility standards.
**Validates: Requirements 2.6**

### Property 11: Next Show Banner Rendering
*For any* upcoming show data, the hero banner should be rendered with all required show details (date, venue, location) and a ticket CTA button.
**Validates: Requirements 3.1**

### Property 12: Past Shows Gallery Rendering
*For any* collection of past shows, they should be rendered in a grid or masonry layout with all show information visible.
**Validates: Requirements 3.3**

### Property 13: Sticky Button Visibility Control
*For any* scroll position, the sticky "Get Tickets" button should be visible if and only if the Shows section is currently in the viewport.
**Validates: Requirements 3.4, 3.5**

### Property 14: Show Information Completeness
*For any* show element (past or upcoming), it should contain all required information fields: date, venue, location, and ticket link.
**Validates: Requirements 3.6**

### Property 15: Interactive Element Transitions
*For any* interactive element (button, link, nav item), CSS transition properties should be defined for smooth hover effects.
**Validates: Requirements 4.1**

### Property 16: Loading State Display
*For any* external content component in a loading state, an appropriate loading indicator should be displayed to the user.
**Validates: Requirements 4.5**

### Property 17: Transition Duration Constraints
*For any* CSS transition applied to interactive elements, the duration should be between 200ms and 400ms.
**Validates: Requirements 4.7**

### Property 18: Reduced Motion Respect
*For any* animation or transition, when prefers-reduced-motion is enabled, the animation should be disabled and replaced with instant state changes while maintaining full functionality.
**Validates: Requirements 4.8, 8.8, 8.9, 8.10**

### Property 19: Standard Image Element Usage
*For any* image rendered in the application, it should use a standard HTML img element with an uploadthing.io URL, not the Next.js Image component.
**Validates: Requirements 5.1, 5.2**

### Property 20: Image Alt Text Presence
*For any* img element, it should have a non-empty alt attribute providing descriptive text for accessibility.
**Validates: Requirements 5.3**

### Property 21: Responsive Image Sizing
*For any* image element, it should have CSS properties that make it responsive to different viewport sizes.
**Validates: Requirements 5.4**

### Property 22: Image Error Fallback
*For any* image that fails to load, the system should display an appropriate fallback state (placeholder or error message).
**Validates: Requirements 5.5**

### Property 23: Widget Lazy Loading
*For any* page load, the Bandsintown widget script should not be loaded until the Shows section approaches the viewport (within a threshold distance).
**Validates: Requirements 6.1**

### Property 24: Error Boundary Protection
*For any* component that throws an error during rendering, an error boundary should catch it and display a fallback UI without crashing the entire application.
**Validates: Requirements 6.4**

### Property 25: ARIA Label Presence
*For any* navigation item, it should have an appropriate aria-label or aria-labelledby attribute for screen reader accessibility.
**Validates: Requirements 8.1**

### Property 26: Focus Indicator Visibility
*For any* focusable element, it should have visible focus styles (outline or custom focus indicator) when focused via keyboard navigation.
**Validates: Requirements 8.2**

### Property 27: Focus Management on Scroll
*For any* smooth scroll navigation to a section, focus should be appropriately managed by moving to the target section for keyboard users.
**Validates: Requirements 8.3**

### Property 28: Color Contrast Compliance
*For any* text element, the color contrast ratio between text and background should be at least 4.5:1 for normal text or 3:1 for large text.
**Validates: Requirements 8.4**

### Property 29: Text Alternatives for Non-Text Content
*For any* non-text content (images, icons, graphics), there should be a text alternative available for screen readers.
**Validates: Requirements 8.5**

### Property 30: Section Change Announcements
*For any* active section change during scrolling, the change should be announced to screen readers using ARIA live regions.
**Validates: Requirements 8.6**

### Property 31: Keyboard Navigation Support
*For any* interactive element, it should respond appropriately to keyboard events (Tab for focus, Enter/Space for activation).
**Validates: Requirements 8.7**

### Property 32: Scroll-Snap Fallback
*For any* browser that does not support CSS scroll-snap, the system should provide fallback behavior that maintains smooth scrolling functionality.
**Validates: Requirements 9.2**

### Property 33: Intersection Observer Fallback
*For any* browser that does not support Intersection Observer, the system should provide fallback behavior for section detection (e.g., scroll event listeners).
**Validates: Requirements 9.3**

### Property 34: Heading Hierarchy Compliance
*For any* page section, the heading elements should follow proper hierarchical order (h1 → h2 → h3) without skipping levels.
**Validates: Requirements 10.2**

### Property 35: URL Hash Update Without Reload
*For any* section navigation, the URL hash should be updated to reflect the current section without triggering a page reload.
**Validates: Requirements 10.5**

### Property 36: First Visit Cookie Banner Display
*For any* user visiting the site for the first time (no consent preference stored), the cookie consent banner should be displayed before any non-essential cookies are set.
**Validates: Requirements 13.1**

### Property 37: Conditional Analytics Loading
*For any* page load, analytics scripts and tracking cookies should not be loaded until the user explicitly provides consent, and third-party scripts should be similarly blocked.
**Validates: Requirements 13.2, 13.9**

### Property 38: Functionality Without Consent
*For any* user who declines cookie consent, the website should maintain full functionality without setting any non-essential cookies or loading analytics.
**Validates: Requirements 13.3**

### Property 39: Analytics Enablement on Consent
*For any* user who accepts cookie consent, analytics scripts should be loaded and tracking features should be enabled.
**Validates: Requirements 13.4**

### Property 40: Consent Withdrawal Mechanism
*For any* user who has previously accepted cookies, there should be a mechanism to withdraw consent, which should remove analytics and stop tracking.
**Validates: Requirements 13.5**

### Property 41: Consent Preference Storage
*For any* user consent decision (accept or decline), the preference should be stored using localStorage or an essential cookie for future visits.
**Validates: Requirements 13.6**

## Error Handling

### Client-Side Error Handling

**Error Boundaries:**
- Wrap major sections (Hero, Music, Shows, About) in error boundaries
- Display user-friendly error messages instead of blank screens
- Log errors to console for debugging (production: send to error tracking service)
- Provide "Retry" action where applicable

**Network Errors:**
- Bandsintown API failures: Display cached data or friendly message
- Image loading failures: Show placeholder with alt text
- Analytics script failures: Fail silently, don't block page functionality

**Browser Compatibility Errors:**
- Intersection Observer not supported: Fall back to scroll event listeners
- CSS scroll-snap not supported: Use JavaScript smooth scrolling
- localStorage not available: Cookie consent defaults to declined state

### Server-Side Error Handling

**Build-Time Errors:**
- Missing environment variables: Fail build with clear error message
- Invalid configuration: Validate and fail fast with helpful errors

**Runtime Errors:**
- CSP violations: Log to console, don't break functionality
- Missing metadata: Use fallback values from configuration

### User Input Validation

**Navigation:**
- Invalid section IDs: Default to hero section
- Malformed anchor links: Scroll to top of page

**Cookie Consent:**
- Invalid stored preferences: Reset to no consent, show banner again
- Corrupted localStorage: Clear and start fresh

## Testing Strategy

### Dual Testing Approach

This project will use both unit tests and property-based tests for comprehensive coverage:

**Unit Tests:**
- Specific examples demonstrating correct behavior
- Edge cases (empty data, missing props, error states)
- Integration points between components
- Browser compatibility fallbacks
- Cookie consent flows

**Property-Based Tests:**
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Each property test runs minimum 100 iterations
- Tests validate correctness properties from design document

### Property-Based Testing Configuration

**Library:** We will use `@fast-check/jest` for TypeScript/React property-based testing.

**Test Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: website-modernization, Property {N}: {property_text}`
- Tests reference design document properties explicitly

**Example Property Test Structure:**
```typescript
// Feature: website-modernization, Property 7: Navigation Item Completeness
describe('Navigation Item Completeness', () => {
  it('should render nav item for every section in config', () => {
    fc.assert(
      fc.property(
        fc.array(sectionConfigArbitrary, { minLength: 1, maxLength: 10 }),
        (sections) => {
          const { container } = render(<BottomNav sections={sections} />);
          sections.forEach(section => {
            expect(container).toHaveTextContent(section.navLabel);
            // Verify icon is rendered
            expect(container.querySelector(`[data-section="${section.id}"]`)).toBeInTheDocument();
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Coverage

**Component Tests:**
- BottomNav: Active state, click handlers, keyboard navigation
- NextShowBanner: Show data rendering, loading states, no show state
- BandsintownWidget: Lazy loading, error handling, consent blocking
- StickyTicketButton: Visibility based on scroll position
- CookieConsent: Accept/decline flows, withdrawal, storage

**Hook Tests:**
- useIntersectionObserver: Section detection, cleanup, fallback
- useSmoothScroll: Scroll behavior, focus management, reduced motion
- useCookieConsent: State management, analytics loading, storage
- useReducedMotion: Media query detection, updates

**Integration Tests:**
- Full page rendering with all sections
- Navigation flow from top to bottom
- Cookie consent blocking analytics
- Scroll-snap with Intersection Observer
- Keyboard navigation through all interactive elements

### Accessibility Testing

**Automated:**
- jest-axe for WCAG compliance
- Color contrast validation
- ARIA attribute presence
- Keyboard navigation paths

**Manual:**
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Reduced motion preference testing
- High contrast mode compatibility

### Performance Testing

**Metrics to Monitor:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)
- Bundle size

**Tools:**
- Lighthouse CI for automated performance checks
- Bundle analyzer for size monitoring
- Chrome DevTools for manual profiling

### Browser Compatibility Testing

**Automated:**
- Playwright for cross-browser testing
- Test on Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Manual:**
- Visual regression testing
- Feature fallback verification
- Touch interaction testing on real devices

### Security Testing

**CSP Validation:**
- Verify CSP headers in responses
- Test that unauthorized resources are blocked
- Confirm legitimate resources load correctly

**Cookie Compliance:**
- Verify no tracking before consent
- Test consent withdrawal
- Validate essential cookie usage only

### Test Execution Strategy

1. **Development:** Run unit tests on file save (watch mode)
2. **Pre-commit:** Run all unit tests and linting
3. **CI Pipeline:** 
   - Unit tests
   - Property-based tests (100 iterations)
   - Integration tests
   - Accessibility tests
   - Browser compatibility tests
4. **Pre-deployment:**
   - Full test suite
   - Performance benchmarks
   - Security validation

### Coverage Goals

- **Unit test coverage:** Minimum 80% for business logic and components
- **Property test coverage:** All testable correctness properties implemented
- **Integration test coverage:** All critical user flows
- **Accessibility coverage:** WCAG 2.1 AA compliance

### Test Maintenance

- Review and update tests when requirements change
- Add regression tests for discovered bugs
- Keep property tests aligned with design properties
- Regular accessibility audit updates
