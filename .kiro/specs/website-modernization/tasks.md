# Implementation Plan: Website Modernization

## Overview

This implementation plan transforms The Custard Screams website from a multi-page application into a modern single-page app with smooth scrolling, enhanced navigation, and improved accessibility. The implementation follows a mobile-first approach while ensuring excellent desktop experience, maintains the punk rock aesthetic, and implements GDPR-compliant cookie consent.

## Tasks

- [x] 1. Set up TypeScript configuration and shared types
  - Enable strict mode in tsconfig.json
  - Create src/lib/types.ts with shared type definitions (SectionId, SectionConfig, Show, CookiePreferences, AnalyticsConfig)
  - Define section configuration constants
  - _Requirements: 11.1, 1.1, 3.6, 13.6_

- [ ] 2. Implement custom hooks for core functionality
  - [x] 2.1 Create useReducedMotion hook
    - Implement media query detection for prefers-reduced-motion
    - Return boolean indicating motion preference
    - Handle media query changes
    - _Requirements: 4.8, 8.8_
  
  - [ ]* 2.2 Write property test for useReducedMotion
    - **Property 18: Reduced Motion Respect**
    - **Validates: Requirements 4.8, 8.8, 8.9, 8.10**
  
  - [x] 2.3 Create useIntersectionObserver hook
    - Accept map of section refs and options
    - Create Intersection Observer with threshold
    - Track visible sections and return active section ID
    - Implement fallback for browsers without support
    - Clean up observer on unmount
    - _Requirements: 1.3, 9.3_
  
  - [ ]* 2.4 Write property test for useIntersectionObserver
    - **Property 3: Intersection Observer Section Detection**
    - **Property 33: Intersection Observer Fallback**
    - **Validates: Requirements 1.3, 9.3**
  
  - [x] 2.5 Create useSmoothScroll hook
    - Implement smooth scroll to section by ID
    - Manage focus for keyboard users
    - Update URL hash without reload
    - Respect prefers-reduced-motion (instant scroll if enabled)
    - _Requirements: 1.5, 2.4, 8.3, 10.5_
  
  - [ ]* 2.6 Write property test for useSmoothScroll
    - **Property 5: Anchor Link Navigation**
    - **Property 9: Navigation Click Scrolling**
    - **Property 27: Focus Management on Scroll**
    - **Property 35: URL Hash Update Without Reload**
    - **Validates: Requirements 1.5, 2.4, 8.3, 10.5**
  
  - [ ] 2.7 Create useCookieConsent hook
    - Read consent from localStorage on mount
    - Provide accept/decline/withdraw functions
    - Trigger analytics loading on accept
    - Store preference in localStorage
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [ ]* 2.8 Write property test for useCookieConsent
    - **Property 36: First Visit Cookie Banner Display**
    - **Property 37: Conditional Analytics Loading**
    - **Property 38: Functionality Without Consent**
    - **Property 39: Analytics Enablement on Consent**
    - **Property 40: Consent Withdrawal Mechanism**
    - **Property 41: Consent Preference Storage**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.9**

- [x] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement cookie consent system
  - [x] 4.1 Create CookieConsent component
    - Display banner on first visit
    - Show clear explanation of cookie usage
    - Provide Accept and Decline buttons
    - Handle consent state from useCookieConsent hook
    - Implement accessible keyboard navigation
    - Style with Tailwind (black background, amber accents)
    - _Requirements: 13.1, 13.7, 13.8_
  
  - [ ]* 4.2 Write unit tests for CookieConsent component
    - Test banner display on first visit
    - Test accept/decline button handlers
    - Test keyboard navigation
    - Test accessibility (ARIA labels, focus management)
    - _Requirements: 13.1, 13.7, 13.8_
  
  - [ ] 4.3 Create analytics utility with conditional loading
    - Implement loadAnalytics function that loads Google Analytics script
    - Block loading until consent is granted
    - Implement removeAnalytics function for consent withdrawal
    - _Requirements: 13.2, 13.4, 13.5_
  
  - [ ]* 4.4 Write unit tests for analytics utility
    - Test that analytics doesn't load without consent
    - Test analytics loads after consent
    - Test analytics removal on withdrawal
    - _Requirements: 13.2, 13.4, 13.5_

- [ ] 5. Implement section components
  - [x] 5.1 Create Section wrapper component
    - Accept id, className, children, onVisibilityChange props
    - Apply scroll-snap-align CSS
    - Register with Intersection Observer
    - Apply fade-in animation (respecting prefers-reduced-motion)
    - Use semantic HTML (section element)
    - _Requirements: 1.2, 1.3, 1.4, 4.8_
  
  - [ ]* 5.2 Write property test for Section component
    - **Property 2: Scroll-Snap CSS Application**
    - **Property 4: Viewport Animation Application**
    - **Validates: Requirements 1.2, 1.4**
  
  - [x] 5.3 Create HeroSection component
    - Display band logo and introduction
    - Include band photo
    - Integrate NextShowBanner (to be implemented)
    - Use external images from uploadthing.io
    - Ensure proper heading hierarchy (h1)
    - _Requirements: 1.1, 5.1, 10.2_
  
  - [x] 5.4 Create MusicSection component
    - Display streaming links and music information
    - Reuse existing Music component
    - Use external images from uploadthing.io
    - Ensure proper heading hierarchy (h2)
    - _Requirements: 1.1, 5.1, 10.2_
  
  - [x] 5.5 Create ShowsSection component
    - Integrate BandsintownWidget (to be implemented)
    - Integrate PastShowsGallery (to be implemented)
    - Ensure proper heading hierarchy (h2)
    - _Requirements: 1.1, 3.2, 10.2_
  
  - [x] 5.6 Create AboutSection component
    - Display band information and member list
    - Reuse existing content from about page
    - Ensure proper heading hierarchy (h2)
    - _Requirements: 1.1, 10.2_
  
  - [ ]* 5.7 Write property test for section rendering
    - **Property 1: Section Rendering Completeness**
    - **Property 34: Heading Hierarchy Compliance**
    - **Validates: Requirements 1.1, 10.2**

- [ ] 6. Implement bottom navigation
  - [x] 6.1 Create NavItem component
    - Display icon and label
    - Accept active state prop
    - Apply active styling (amber accent)
    - Ensure 44x44px minimum touch target
    - Implement keyboard support (Tab, Enter, Space)
    - Add ARIA labels
    - _Requirements: 2.2, 2.6, 8.1, 8.7_
  
  - [ ]* 6.2 Write property test for NavItem
    - **Property 10: Touch Target Sizing**
    - **Property 25: ARIA Label Presence**
    - **Property 31: Keyboard Navigation Support**
    - **Validates: Requirements 2.6, 8.1, 8.7**
  
  - [x] 6.3 Create BottomNav component
    - Fixed position at bottom of viewport
    - Render NavItem for each section
    - Highlight active section
    - Handle navigation clicks with useSmoothScroll
    - Style with Tailwind (black background, amber accents)
    - Optimize for mobile (no hamburger menu)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_
  
  - [ ]* 6.4 Write property test for BottomNav
    - **Property 7: Navigation Item Completeness**
    - **Property 8: Active Section Indicator Synchronization**
    - **Validates: Requirements 2.2, 2.3**
  
  - [ ]* 6.5 Write unit tests for BottomNav
    - Test fixed positioning CSS
    - Test mobile responsiveness
    - Test color scheme application
    - _Requirements: 2.1, 2.5, 2.7_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement shows display components
  - [ ] 8.1 Create NextShowBanner component
    - Accept show data prop (Show | null)
    - Display large banner with show details (date, venue, location)
    - Prominent "Get Tickets" CTA button
    - Handle loading state with skeleton UI
    - Handle no upcoming shows gracefully
    - Use external images from uploadthing.io
    - _Requirements: 3.1, 5.1_
  
  - [ ]* 8.2 Write property test for NextShowBanner
    - **Property 11: Next Show Banner Rendering**
    - **Property 14: Show Information Completeness**
    - **Validates: Requirements 3.1, 3.6**
  
  - [ ] 8.3 Create PastShowsGallery component
    - Accept array of past shows
    - Display in masonry/grid layout
    - Show all show information (date, venue, location)
    - Use external images from uploadthing.io
    - Implement responsive grid (1 column mobile, 2-3 desktop)
    - _Requirements: 3.3, 3.6, 5.1_
  
  - [ ]* 8.4 Write property test for PastShowsGallery
    - **Property 12: Past Shows Gallery Rendering**
    - **Property 14: Show Information Completeness**
    - **Validates: Requirements 3.3, 3.6**
  
  - [ ] 8.5 Create BandsintownWidget component
    - Lazy load Bandsintown script when Shows section approaches viewport
    - Display loading state until widget initializes
    - Implement error boundary for graceful failure
    - Block loading until cookie consent granted
    - _Requirements: 3.2, 6.1, 13.9_
  
  - [ ]* 8.6 Write property test for BandsintownWidget
    - **Property 23: Widget Lazy Loading**
    - **Property 37: Conditional Analytics Loading** (applies to third-party scripts)
    - **Validates: Requirements 6.1, 13.9**
  
  - [ ] 8.7 Create StickyTicketButton component
    - Fixed position button (bottom-right, above bottom nav)
    - Show/hide based on Shows section visibility
    - Smooth fade in/out transitions (respecting prefers-reduced-motion)
    - Link to next show ticket URL
    - Hide when no upcoming shows
    - _Requirements: 3.4, 3.5, 4.8_
  
  - [ ]* 8.8 Write property test for StickyTicketButton
    - **Property 13: Sticky Button Visibility Control**
    - **Validates: Requirements 3.4, 3.5**

- [ ] 9. Implement image handling and accessibility
  - [ ] 9.1 Create ImageWithFallback component
    - Use standard HTML img element (not Next.js Image)
    - Accept uploadthing.io URL
    - Require alt text prop
    - Apply responsive CSS sizing
    - Handle image load errors with fallback
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 9.2 Write property test for ImageWithFallback
    - **Property 19: Standard Image Element Usage**
    - **Property 20: Image Alt Text Presence**
    - **Property 21: Responsive Image Sizing**
    - **Property 22: Image Error Fallback**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [ ] 10. Implement accessibility features
  - [ ] 10.1 Add ARIA live region for section changes
    - Create visually hidden live region
    - Announce active section changes to screen readers
    - Update on scroll/navigation
    - _Requirements: 8.6_
  
  - [ ]* 10.2 Write property test for ARIA announcements
    - **Property 30: Section Change Announcements**
    - **Validates: Requirements 8.6**
  
  - [ ] 10.3 Implement focus indicators for all interactive elements
    - Add visible focus styles to all buttons, links, nav items
    - Use Tailwind focus utilities or custom CSS
    - Ensure sufficient contrast for visibility
    - _Requirements: 8.2_
  
  - [ ]* 10.4 Write property test for focus indicators
    - **Property 26: Focus Indicator Visibility**
    - **Validates: Requirements 8.2**
  
  - [ ] 10.5 Validate color contrast ratios
    - Audit all text/background combinations
    - Ensure 4.5:1 for normal text, 3:1 for large text
    - Adjust colors if needed while maintaining aesthetic
    - _Requirements: 8.4_
  
  - [ ]* 10.6 Write property test for color contrast
    - **Property 28: Color Contrast Compliance**
    - **Validates: Requirements 8.4**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement CSS and styling
  - [x] 12.1 Update globals.css with scroll-snap and animation styles
    - Add scroll-snap-type to scroll container
    - Add scroll-snap-align to sections
    - Create fade-in animation keyframes
    - Wrap animations in @media (prefers-reduced-motion: no-preference)
    - Add smooth scroll behavior
    - _Requirements: 1.2, 1.4, 4.8, 8.9_
  
  - [ ]* 12.2 Write property test for animation media queries
    - **Property 18: Reduced Motion Respect** (CSS validation)
    - **Validates: Requirements 8.9**
  
  - [ ] 12.3 Add transition styles for interactive elements
    - Define transition durations (200-400ms)
    - Apply to buttons, links, nav items
    - Wrap in prefers-reduced-motion media query
    - _Requirements: 4.1, 4.7_
  
  - [ ]* 12.4 Write property test for transition durations
    - **Property 15: Interactive Element Transitions**
    - **Property 17: Transition Duration Constraints**
    - **Validates: Requirements 4.1, 4.7**
  
  - [ ] 12.5 Implement responsive layout styles
    - Mobile-first approach with app-like feel
    - Desktop layout with natural, open scrolling
    - Adjust spacing and typography for different viewports
    - _Requirements: 4.3, 4.4_

- [ ] 13. Update root layout and main page
  - [x] 13.1 Update src/app/layout.tsx
    - Integrate CookieConsent component
    - Update analytics loading to be conditional
    - Add font-display: swap to font configuration
    - Preserve existing metadata
    - Add CSP headers configuration
    - _Requirements: 6.2, 7.1, 7.2, 7.3, 7.4, 10.1, 13.1_
  
  - [ ]* 13.2 Write unit tests for layout
    - Test cookie consent integration
    - Test conditional analytics loading
    - Test metadata preservation
    - _Requirements: 10.1, 13.1_
  
  - [x] 13.3 Refactor src/app/page.tsx to single-page layout
    - Remove multi-page structure
    - Render all sections (Hero, Music, Shows, About) in single page
    - Integrate BottomNav component
    - Integrate StickyTicketButton component
    - Apply scroll-snap container styles
    - Wire up useIntersectionObserver for active section tracking
    - Preserve structured data (JSON-LD)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.4, 10.4_
  
  - [ ]* 13.4 Write property test for page structure
    - **Property 1: Section Rendering Completeness**
    - **Property 6: SPA State Preservation**
    - **Validates: Requirements 1.1, 1.6**

- [ ] 14. Implement error boundaries
  - [ ] 14.1 Create ErrorBoundary component
    - Catch component errors during rendering
    - Display user-friendly fallback UI
    - Log errors to console
    - Provide retry action where applicable
    - _Requirements: 6.4_
  
  - [ ]* 14.2 Write property test for ErrorBoundary
    - **Property 24: Error Boundary Protection**
    - **Validates: Requirements 6.4**
  
  - [ ] 14.3 Wrap major sections in error boundaries
    - Wrap HeroSection, MusicSection, ShowsSection, AboutSection
    - Ensure one section failure doesn't crash entire page
    - _Requirements: 6.4_

- [ ] 15. Configure Content Security Policy
  - [ ] 15.1 Add CSP headers to next.config.js
    - Configure CSP directives (script-src, style-src, img-src, frame-src)
    - Allow uploadthing.io for images
    - Allow Bandsintown domains for widget
    - Allow Google Analytics (conditional on consent)
    - Test that legitimate resources load and unauthorized are blocked
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 15.2 Write unit tests for CSP configuration
    - Test CSP headers presence
    - Test allowed domains configuration
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Remove old multi-page routes
  - [ ] 17.1 Delete src/app/music/page.tsx
    - Content now in MusicSection on main page
    - _Requirements: 1.1_
  
  - [ ] 17.2 Delete src/app/live-shows/page.tsx
    - Content now in ShowsSection on main page
    - _Requirements: 1.1_
  
  - [ ] 17.3 Delete src/app/about/page.tsx
    - Content now in AboutSection on main page
    - _Requirements: 1.1_
  
  - [ ] 17.4 Update internal links to use section anchors
    - Change /music links to #music
    - Change /live-shows links to #shows
    - Change /about links to #about
    - _Requirements: 1.5_

- [ ] 18. Implement progressive enhancement fallbacks
  - [ ] 18.1 Add noscript fallback content
    - Display core content without JavaScript
    - Show message about enhanced experience with JS
    - _Requirements: 6.5_
  
  - [ ] 18.2 Implement scroll-snap fallback
    - Detect CSS scroll-snap support
    - Fall back to JavaScript smooth scrolling if not supported
    - _Requirements: 9.2_
  
  - [ ]* 18.3 Write property test for scroll-snap fallback
    - **Property 32: Scroll-Snap Fallback**
    - **Validates: Requirements 9.2**

- [ ] 19. Final integration and polish
  - [ ] 19.1 Test complete user flows
    - First visit → cookie consent → navigation → shows
    - Keyboard navigation through all sections
    - Mobile touch navigation
    - _Requirements: 1.1, 2.4, 8.7, 13.1_
  
  - [ ] 19.2 Optimize performance
    - Verify lazy loading works for Bandsintown widget
    - Check bundle size
    - Test loading performance
    - _Requirements: 6.1, 6.3_
  
  - [ ] 19.3 Accessibility audit
    - Run jest-axe tests
    - Test with screen reader (manual)
    - Verify keyboard navigation
    - Test with prefers-reduced-motion enabled
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_
  
  - [ ]* 19.4 Write integration tests for critical flows
    - Test full navigation flow
    - Test cookie consent flow
    - Test shows section with widget loading
    - _Requirements: 1.1, 2.4, 6.1, 13.1_

- [ ] 20. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- Implementation follows mobile-first approach with natural desktop adaptation
- All animations must respect prefers-reduced-motion
- Cookie consent must block all tracking until user approval
- TypeScript strict mode enforced throughout
- Maintain test coverage above 80%
