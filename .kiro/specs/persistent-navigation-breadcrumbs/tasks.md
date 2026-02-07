# Implementation Plan: Persistent Navigation and Breadcrumbs

## Overview

This implementation plan breaks down the persistent navigation and breadcrumbs feature into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout to catch issues early. The implementation follows Next.js 16 App Router patterns and maintains the existing punk rock aesthetic.

## Tasks

- [x] 1. Create breadcrumb utility functions and types
  - Create `src/lib/breadcrumbs.ts` with `formatSegmentLabel` and `generateBreadcrumbs` functions
  - Add `BreadcrumbItem` and `BreadcrumbProps` interfaces to `src/lib/types.ts`
  - Implement special case handling for URL segments (ep → EP, etc.)
  - Implement kebab-case to Title Case conversion
  - _Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x]* 1.1 Write unit tests for breadcrumb utility functions
  - Test `formatSegmentLabel` with various inputs (kebab-case, special cases, edge cases)
  - Test `generateBreadcrumbs` with single-segment, multi-segment, and empty paths
  - Test error handling for malformed URLs
  - _Requirements: 12.1, 12.3, 13.5_

- [ ]* 1.2 Write property tests for breadcrumb generation
  - **Property 5: Breadcrumb Trail Generation** - breadcrumb count equals segment count plus one
  - **Property 6: Breadcrumb Trail Structure** - first is Home, last is active, intermediates are clickable
  - **Property 7: URL Slug Formatting** - kebab-case converts to Title Case
  - **Property 15: Error Resilience** - malformed URLs return safe fallback
  - **Validates: Requirements 2.4, 2.5, 2.6, 2.7, 2.8, 2.10, 8.1, 8.2, 8.3, 12.1, 12.3**

- [x] 2. Create Breadcrumb component
  - Create `src/components/navigation/Breadcrumb.tsx`
  - Use `usePathname()` hook to get current URL
  - Call `generateBreadcrumbs()` to create breadcrumb trail
  - Render semantic HTML with nav, ol, and li elements
  - Apply ARIA attributes (aria-label="Breadcrumb", aria-current="page")
  - Style with Tailwind CSS (amber for links, muted for active, separators)
  - Implement responsive design for mobile and desktop
  - _Requirements: 2.1, 2.2, 2.3, 2.9, 3.1, 3.2, 3.3, 3.7, 5.1, 5.2, 5.3, 5.4, 5.6, 7.1, 7.2, 7.6_

- [x]* 2.1 Write unit tests for Breadcrumb component
  - Test rendering on nested pages
  - Test that it doesn't render on home page
  - Test correct number of breadcrumb items
  - Test ARIA attributes
  - Test click handlers
  - Test responsive classes
  - _Requirements: 2.1, 2.2, 5.1, 5.2, 5.4, 7.1_

- [ ]* 2.2 Write property tests for Breadcrumb component
  - **Property 4: Breadcrumb Conditional Display** - breadcrumbs show on nested pages only
  - **Property 8: Breadcrumb Semantic HTML** - correct semantic structure and ARIA
  - **Property 9: Breadcrumb Visual Styling** - correct colors and separators
  - **Property 10: Breadcrumb Touch Targets** - minimum 44x44px on mobile
  - **Property 13: Responsive Breadcrumb Layout** - adapts to viewport width
  - **Validates: Requirements 2.1, 2.2, 2.9, 3.1, 3.2, 5.1, 5.2, 5.4, 5.6, 7.1, 7.2, 7.6**

- [ ] 3. Checkpoint - Ensure breadcrumb tests pass
  - Run `npm test` to verify all breadcrumb tests pass
  - Run `tsc --noEmit` to verify TypeScript type checking
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Enhance BottomNav for nested page navigation
  - Modify `src/components/navigation/BottomNav.tsx`
  - Import `usePathname` and `useRouter` from Next.js
  - Add `useIsHomePage` helper function to detect current route
  - Update `handleNavigate` to check if on home page
  - If on home page: use existing scroll behavior
  - If on nested page: use `router.push(/#${sectionId})` to navigate to home with section anchor
  - _Requirements: 1.3, 1.4, 6.1, 6.2, 6.3_

- [ ]* 4.1 Write unit tests for enhanced BottomNav
  - Test navigation behavior on home page (scrolling)
  - Test navigation behavior on nested pages (routing)
  - Test URL hash preservation
  - Mock Next.js router for testing
  - _Requirements: 1.3, 1.4, 6.1, 6.3_

- [ ]* 4.2 Write property tests for BottomNav
  - **Property 1: BottomNav Universal Presence** - renders on all pages
  - **Property 2: BottomNav Consistent Styling** - maintains styling across pages
  - **Property 3: BottomNav Touch Target Accessibility** - minimum 44x44px targets
  - **Property 11: Navigation URL Hash Preservation** - hash preserved during navigation
  - **Validates: Requirements 1.1, 1.2, 1.5, 1.6, 6.3**

- [x] 5. Create LayoutClient component
  - Create `src/app/LayoutClient.tsx`
  - Import `useNavigation` hook from NavigationContext
  - Import BottomNav component
  - Accept children as props
  - Render children and BottomNav with navigation state
  - _Requirements: 1.1, 4.1, 4.7, 9.1_

- [ ]* 5.1 Write unit tests for LayoutClient
  - Test that it renders children
  - Test that it renders BottomNav
  - Test that navigation context is used correctly
  - Mock NavigationContext for testing
  - _Requirements: 1.1, 4.1, 4.7_

- [x] 6. Update RootLayout to use LayoutClient
  - Modify `src/app/layout.tsx`
  - Import LayoutClient component
  - Remove BottomNav from page.tsx (if present)
  - Wrap children with LayoutClient inside NavigationProvider
  - Ensure CookieConsent remains outside LayoutClient
  - Maintain existing head metadata and styling
  - _Requirements: 1.1, 4.5, 4.6, 4.7, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ]* 6.1 Write integration tests for layout
  - Test that BottomNav renders in layout
  - Test that NavigationProvider is available
  - Test that CookieConsent doesn't conflict with BottomNav
  - Test that existing functionality is preserved
  - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 7. Update HomePage to remove BottomNav
  - Modify `src/app/page.tsx`
  - Remove BottomNav import and rendering
  - Keep all existing section rendering
  - Keep existing navigation observer setup
  - Keep existing hash navigation handling
  - Verify scroll-snap behavior still works
  - _Requirements: 9.7_

- [ ]* 7.1 Write integration tests for HomePage
  - Test that sections render correctly
  - Test that navigation observer works
  - Test that hash navigation works
  - Test that scroll-snap behavior is preserved
  - _Requirements: 9.7_

- [ ] 8. Checkpoint - Ensure layout integration tests pass
  - Run `npm test` to verify all layout tests pass
  - Run `tsc --noEmit` to verify TypeScript type checking
  - Manually test navigation on home page
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Add Breadcrumb to nested music pages
  - Create `src/app/music/layout.tsx` (nested layout)
  - Import Breadcrumb component
  - Render Breadcrumb at the top
  - Wrap children with appropriate padding (pb-20 for BottomNav clearance)
  - Use same global padding as home page
  - _Requirements: 2.1, 4.2, 4.3, 4.4, 9.1_

- [ ]* 9.1 Write tests for music layout
  - Test that Breadcrumb renders in music layout
  - Test that children render correctly
  - Test padding and spacing
  - _Requirements: 2.1, 4.3, 4.4_

- [x] 10. Add Breadcrumb to other nested page sections
  - Create `src/app/about/layout.tsx` if needed
  - Create `src/app/live-shows/layout.tsx` if needed
  - Follow same pattern as music layout
  - Ensure consistent padding and styling across all nested layouts
  - _Requirements: 2.1, 4.2, 4.3, 4.4_

- [ ]* 10.1 Write tests for other nested layouts
  - Test Breadcrumb rendering in each layout
  - Test consistent padding across layouts
  - _Requirements: 2.1, 4.3, 4.4_

- [x] 11. Test navigation flow end-to-end
  - Manually test clicking BottomNav on home page (should scroll)
  - Manually test clicking BottomNav on nested pages (should navigate to home + scroll)
  - Manually test clicking breadcrumb links (should navigate to parent pages)
  - Manually test clicking "Home" breadcrumb (should navigate to home)
  - Test on mobile viewport
  - Test on desktop viewport
  - Test keyboard navigation (Tab, Enter)
  - Test with screen reader (verify ARIA announcements)
  - _Requirements: 1.3, 1.4, 5.3, 6.1, 6.2, 6.4, 7.1, 7.2, 7.3, 7.4_

- [x] 12. Verify accessibility requirements
  - Check color contrast ratios for breadcrumbs (use browser dev tools)
  - Verify touch targets are at least 44x44px on mobile
  - Test keyboard navigation through all interactive elements
  - Test with screen reader (VoiceOver on Mac, NVDA on Windows)
  - Verify ARIA labels and attributes are correct
  - Test focus indicators are visible
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 13. Test error handling scenarios
  - Test with malformed URLs (e.g., "///", empty string)
  - Test with non-existent parent pages
  - Test navigation failures
  - Verify error logging without user-facing errors
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]* 13.1 Write property tests for error handling
  - **Property 15: Error Resilience for Malformed URLs** - comprehensive error handling
  - Test various malformed inputs
  - Verify safe fallbacks
  - **Validates: Requirements 12.1, 12.3**

- [x] 14. Final checkpoint - Comprehensive testing
  - Run full test suite: `npm test`
  - Run type checking: `tsc --noEmit`
  - Check test coverage: `npm test -- --coverage`
  - Verify coverage is >80% for new code
  - Test on Chrome, Firefox, Safari, Edge
  - Test on mobile browsers (iOS Safari, Chrome Mobile)
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Performance and optimization review
  - Check bundle size impact of new components
  - Verify no layout shifts during breadcrumb rendering
  - Test page load performance
  - Verify smooth transitions between pages
  - Check for unnecessary re-renders using React DevTools
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [ ]* 15.1 Write performance tests
  - Test that LayoutClient doesn't cause unnecessary re-renders
  - Test breadcrumb generation performance
  - _Requirements: 10.3_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Run `npm test` and `tsc --noEmit` after each task before proceeding
- Manual testing is included for accessibility and cross-browser compatibility
- The implementation maintains the existing punk rock aesthetic with black background and amber accents
