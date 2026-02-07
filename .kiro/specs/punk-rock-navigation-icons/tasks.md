# Implementation Plan: Punk Rock Navigation Icons

## Overview

This implementation plan converts the pure CSS punk rock navigation icons design into actionable coding tasks. The approach follows an incremental pattern: create CSS styles for each icon, modify the NavItem component to support icon types, integrate with the navigation system, and validate with comprehensive tests. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [x] 1. Create CSS icon styles file and implement home icon
  - Create new file `src/styles/punk-icons.css`
  - Implement `.icon-home` base styles with container positioning
  - Implement `.icon-home::before` for triangular roof using CSS borders
  - Implement `.icon-home::after` for rectangular base
  - Add hover state styles with red color and glow effect
  - Add active state styles with red color
  - Import the CSS file in main application stylesheet
  - _Requirements: 1.1, 1.2, 2.1, 2.4, 4.1, 4.2_

- [ ]* 1.1 Write property test for home icon pure CSS implementation
  - **Property 2: Pure CSS Implementation**
  - **Validates: Requirements 1.2, 4.1, 4.2**

- [x] 2. Implement remaining icon CSS styles
  - [x] 2.1 Implement music icon (lightning bolt) in punk-icons.css
    - Create `.icon-music` base styles
    - Implement `.icon-music::before` with clip-path polygon for lightning bolt
    - Add rotation transform for dynamic angle
    - Add hover state with scale and glow
    - Add active state styles
    - _Requirements: 1.1, 1.4, 2.1, 2.2, 4.1_
  
  - [x] 2.2 Implement shows icon (angular star) in punk-icons.css
    - Create `.icon-shows` base styles
    - Implement `.icon-shows::before` with clip-path polygon for star shape
    - Implement `.icon-shows::after` for center accent dot
    - Add hover state with rotation and scale
    - Add active state with yellow accent color
    - _Requirements: 1.1, 1.5, 2.1, 2.2, 4.1_
  
  - [x] 2.3 Implement about icon (exclamation mark) in punk-icons.css
    - Create `.icon-about` base styles
    - Implement `.icon-about::before` for vertical line
    - Implement `.icon-about::after` for bottom dot
    - Add hover state with glow effect
    - Add active state styles
    - _Requirements: 1.1, 1.6, 2.1, 4.1_

- [ ]* 2.4 Write property test for icon type mapping
  - **Property 1: Icon Type Mapping**
  - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

- [x] 3. Add state transition styles and responsive behavior
  - Add CSS transition properties to all icon elements (200ms duration)
  - Add focus state styles with visible outline ring
  - Add @supports fallback for browsers without clip-path
  - Add @media query for high contrast mode
  - Test that all transitions are smooth
  - _Requirements: 3.5, 4.1, 5.2, 6.5_

- [ ]* 3.1 Write property test for CSS transition presence
  - **Property 8: CSS Transition Presence**
  - **Validates: Requirements 3.5**

- [ ]* 3.2 Write property test for focus indicator visibility
  - **Property 14: Focus Indicator Visibility**
  - **Validates: Requirements 6.5**

- [x] 4. Modify NavItem component to support icon types
  - [x] 4.1 Update NavItemProps interface to include iconType prop
    - Add `iconType: 'home' | 'music' | 'shows' | 'about'` to interface
    - Make iconType optional with default fallback
    - _Requirements: 1.1, 1.2_
  
  - [x] 4.2 Implement icon rendering function in NavItem component
    - Create `renderIcon()` function that returns icon JSX
    - Add icon container div with relative positioning and size classes
    - Add icon div with dynamic className based on iconType
    - Apply active class to container when isActive is true
    - Add fallback logic for missing or invalid iconType
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 3.2_
  
  - [x] 4.3 Replace emoji rendering with icon rendering in NavItem
    - Update component return statement to use renderIcon()
    - Ensure label text remains visible for accessibility
    - Maintain existing className and styling structure
    - _Requirements: 1.1, 6.1_

- [ ]* 4.4 Write unit tests for NavItem icon rendering
  - Test that home icon renders with correct className
  - Test that music icon renders with correct className
  - Test that shows icon renders with correct className
  - Test that about icon renders with correct className
  - Test that active class is applied when isActive is true
  - Test fallback behavior for invalid iconType
  - _Requirements: 1.3, 1.4, 1.5, 1.6, 3.2_

- [ ]* 4.5 Write property test for hover state visual changes
  - **Property 5: Hover State Visual Changes**
  - **Validates: Requirements 3.1**

- [ ]* 4.6 Write property test for active state application
  - **Property 6: Active State Application**
  - **Validates: Requirements 3.2**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update parent navigation component to pass iconType props
  - Open the parent navigation component that renders NavItem instances
  - Add iconType="home" prop to Hero/Home NavItem
  - Add iconType="music" prop to Music NavItem
  - Add iconType="shows" prop to Shows NavItem
  - Add iconType="about" prop to About NavItem
  - Verify all four icons render correctly in the navigation
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6_

- [ ] 6.1 Visual validation - Verify icons are rendering in browser
  - Open the dev site in browser
  - Verify home icon (angular house) is visible in navigation
  - Verify music icon (lightning bolt) is visible in navigation
  - Verify shows icon (angular star) is visible in navigation
  - Verify about icon (exclamation mark) is visible in navigation
  - Verify icons change color on hover (white to red with glow)
  - Verify active icon shows red color
  - If icons are not visible, debug CSS loading and rendering issues
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 2.1, 3.1, 3.2_

- [ ]* 6.1 Write property test for Tailwind class usage
  - **Property 4: Tailwind Class Usage**
  - **Validates: Requirements 2.4**

- [ ]* 6.2 Write property test for state visual distinction
  - **Property 7: State Visual Distinction**
  - **Validates: Requirements 3.4**

- [x] 7. Implement accessibility enhancements
  - [x] 7.1 Add ARIA labels to icon containers
    - Add aria-label attribute to icon container divs
    - Ensure label describes the icon purpose
    - _Requirements: 6.1, 6.2_
  
  - [x] 7.2 Ensure keyboard navigation support
    - Verify NavItem elements are focusable
    - Test tab navigation through all icons
    - Verify focus styles are visible
    - _Requirements: 6.4, 6.5_

- [ ]* 7.3 Write property test for accessibility label presence
  - **Property 12: Accessibility Label Presence**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 7.4 Write property test for keyboard focusability
  - **Property 13: Keyboard Focusability**
  - **Validates: Requirements 6.4**

- [ ]* 7.5 Write property test for WCAG AA contrast compliance
  - **Property 11: WCAG AA Contrast Compliance**
  - **Validates: Requirements 2.1, 5.4, 6.3**

- [x] 8. Add error handling and fallbacks
  - Add console warning for missing iconType in development mode
  - Implement fallback to home icon for invalid iconType values
  - Add browser compatibility fallbacks in CSS using @supports
  - Test error scenarios (missing props, invalid values)
  - _Requirements: 4.1, 4.3_

- [ ]* 8.1 Write unit tests for error handling
  - Test console warning for missing iconType
  - Test fallback behavior for undefined iconType
  - Test fallback behavior for invalid iconType string
  - _Requirements: 4.1, 4.3_

- [ ] 9. Implement responsive behavior and viewport testing
  - [ ] 9.1 Add responsive CSS for icon scaling
    - Ensure icons use relative units (rem, em) for sizing
    - Test icons at different viewport widths
    - Verify proportional scaling behavior
    - _Requirements: 5.2, 5.3_
  
  - [ ]* 9.2 Write property test for proportional scaling
    - **Property 9: Proportional Scaling**
    - **Validates: Requirements 5.2**
  
  - [ ]* 9.3 Write property test for viewport consistency
    - **Property 10: Viewport Consistency**
    - **Validates: Requirements 5.3**

- [x] 10. Final integration and validation
  - [ ] 10.1 Verify zero external resource loading
    - Open browser DevTools Network tab
    - Load page with navigation icons
    - Confirm no image, font, or SVG requests for icons
    - _Requirements: 4.2, 4.4_
  
  - [ ]* 10.2 Write property test for zero external resource loading
    - **Property 3: Zero External Resource Loading**
    - **Validates: Requirements 4.2, 4.4**
  
  - [ ] 10.3 Visual validation of punk rock aesthetic
    - Review all four icons in browser
    - Verify angular geometric shapes
    - Verify high contrast colors (white/red/yellow on black)
    - Verify hover and active states work correctly
    - Test keyboard navigation and focus indicators
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.4, 6.5_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- CSS implementation uses Tailwind utility classes combined with custom CSS for pseudo-elements
- Property tests use fast-check library with minimum 100 iterations
- All icons are pure CSS with no external dependencies
- Focus on incremental progress: styles → component → integration → testing
