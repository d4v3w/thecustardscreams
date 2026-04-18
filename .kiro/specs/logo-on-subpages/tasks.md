# Implementation Plan: Logo on Sub-Pages

## Overview

This implementation plan breaks down the logo-on-subpages feature into discrete, sequential coding tasks. The Logo component will be created as a reusable, server-side component that displays the band logo on all sub-pages (music, about, live-shows, privacy-policy) while maintaining consistency with the existing homepage design. Each task builds on previous steps, with testing integrated throughout to catch issues early.

## Tasks

- [x] 1. Create the Logo component
  - Create `src/components/Logo.tsx` with proper TypeScript interfaces
  - Implement the component with Link wrapper, img element, and Tailwind styling
  - Set display name for debugging
  - _Requirements: 1.1, 2.1, 4.1, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4_

- [x] 2. Write unit tests for Logo component
  - [x] 2.1 Test Logo component rendering and attributes
    - Verify component renders Link and img elements
    - Verify src, srcSet, alt, and aria-label attributes are correct
    - Verify Link href points to "/"
    - _Requirements: 1.1, 4.1, 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 2.2 Test Logo component CSS classes and styling
    - Verify Tailwind classes are applied correctly
    - Verify hover state classes are present
    - Verify responsive classes are present
    - _Requirements: 2.1, 6.1, 6.2_
  
  - [ ]* 2.3 Test Logo component props and display name
    - Verify component accepts optional className prop
    - Verify custom className is merged with defaults
    - Verify display name is set correctly
    - _Requirements: 5.5_

- [x] 3. Update music layout to include Logo component
  - Import Logo component in `src/app/music/layout.tsx`
  - Add Logo component above Breadcrumb in layout structure
  - Wrap Logo in container with appropriate padding
  - Verify Breadcrumb remains visible and functional
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 4. Update about layout to include Logo component
  - Import Logo component in `src/app/about/layout.tsx`
  - Add Logo component above Breadcrumb in layout structure
  - Wrap Logo in container with appropriate padding
  - Verify Breadcrumb remains visible and functional
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 5. Update live-shows layout to include Logo component
  - Import Logo component in `src/app/live-shows/layout.tsx`
  - Add Logo component above Breadcrumb in layout structure
  - Wrap Logo in container with appropriate padding
  - Verify Breadcrumb remains visible and functional
  - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 6. Update privacy-policy page to include Logo component
  - Import Logo component in `src/app/privacy-policy/page.tsx`
  - Add Logo component at the top of the page content
  - Wrap Logo in container with appropriate spacing
  - Verify existing page content remains unchanged
  - _Requirements: 1.1, 3.1, 3.2, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [-] 7. Verify logo does NOT appear on homepage
  - Verify Logo component is NOT imported in `src/app/layout.tsx`
  - Verify Logo component is NOT imported in `src/app/page.tsx`
  - Verify Logo component is NOT imported in `src/app/_components/HeroSection.tsx`
  - Verify homepage renders without Logo component
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [~] 8. Checkpoint - Ensure all unit tests pass
  - Run `pnpm test` to execute all unit tests
  - Verify Logo component tests pass
  - Verify no regressions in existing tests
  - Ask the user if questions arise.

- [ ]* 9. Write integration tests for Logo component
  - [ ] 9.1 Test Logo integration with music layout
    - Render MusicLayout with children
    - Verify Logo appears before Breadcrumb in DOM
    - Verify Breadcrumb remains functional
    - _Requirements: 3.3, 7.1, 7.2, 7.4_
  
  - [ ]* 9.2 Test Logo integration with about layout
    - Render AboutLayout with children
    - Verify Logo appears before Breadcrumb in DOM
    - Verify Breadcrumb remains functional
    - _Requirements: 3.3, 7.1, 7.2, 7.4_
  
  - [ ]* 9.3 Test Logo integration with live-shows layout
    - Render LiveShowsLayout with children
    - Verify Logo appears before Breadcrumb in DOM
    - Verify Breadcrumb remains functional
    - _Requirements: 3.3, 7.1, 7.2, 7.4_
  
  - [ ]* 9.4 Test Logo integration with privacy-policy page
    - Render PrivacyPolicyPage
    - Verify Logo appears at top of page
    - Verify page content renders correctly
    - _Requirements: 3.1, 3.2, 7.1, 7.2_
  
  - [ ]* 9.5 Test Logo does NOT appear on homepage
    - Render HomePage
    - Verify Logo component is NOT rendered
    - Verify HeroSection is rendered
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [~] 10. Checkpoint - Ensure all tests pass
  - Run `pnpm test` to execute all unit and integration tests
  - Verify no regressions in existing tests
  - Ask the user if questions arise.

- [ ]* 11. Write E2E tests for Logo component
  - [ ]* 11.1 Test Logo click navigation
    - Navigate to music page
    - Click logo
    - Verify URL is "/"
    - Verify homepage is displayed
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 11.2 Test Logo keyboard navigation
    - Navigate to music page
    - Tab to logo
    - Verify logo has focus
    - Press Enter
    - Verify URL is "/"
    - Verify homepage is displayed
    - _Requirements: 4.1, 4.4_
  
  - [ ]* 11.3 Test Logo responsive display on mobile
    - Set viewport to mobile (375px)
    - Navigate to music page
    - Verify logo is visible and properly sized
    - Verify no horizontal scrolling
    - _Requirements: 2.1, 2.2, 8.1, 8.3, 8.4_
  
  - [ ]* 11.4 Test Logo responsive display on tablet
    - Set viewport to tablet (768px)
    - Navigate to music page
    - Verify logo is visible and properly sized
    - _Requirements: 2.1, 2.3, 8.2_
  
  - [ ]* 11.5 Test Logo responsive display on desktop
    - Set viewport to desktop (1920px)
    - Navigate to music page
    - Verify logo is visible and properly sized
    - _Requirements: 2.1, 2.3_
  
  - [ ]* 11.6 Test Logo visual consistency across sub-pages
    - Navigate to music page and take screenshot of logo
    - Navigate to about page and take screenshot of logo
    - Navigate to live-shows page and take screenshot of logo
    - Navigate to privacy-policy page and take screenshot of logo
    - Verify all screenshots are identical
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [~] 12. Final checkpoint - Ensure all tests pass
  - Run `pnpm test:all` to execute all unit, integration, and E2E tests
  - Verify no regressions in existing tests
  - Verify all acceptance criteria are met
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Unit tests validate component behavior and attributes
- Integration tests validate component interaction with layouts
- E2E tests validate user interactions and navigation
- All tasks build on previous steps with no orphaned code
