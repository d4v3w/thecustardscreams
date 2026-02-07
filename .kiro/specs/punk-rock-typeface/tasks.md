# Implementation Plan: Punk Rock Typeface

## Overview

This implementation plan transforms the website's heading typography from clean and minimal to bold, aggressive punk rock styling. The approach involves configuring Google Fonts (Bebas Neue), creating a new CSS file for typography styles, integrating it into the layout, and ensuring accessibility and performance. Tasks are organized to build incrementally, with testing integrated throughout.

## Tasks

- [x] 1. Configure Bebas Neue font in Next.js
  - Import Bebas Neue from next/font/google in layout.tsx
  - Configure with weights [400, 700], display: 'swap', and preload: true
  - Add font variable to html className alongside existing Geist font
  - Update Tailwind config to include font-display in theme.extend.fontFamily
  - _Requirements: 1.1, 1.2, 1.4, 8.1, 8.2_

- [ ]* 1.1 Write unit test for font configuration
  - Test that Bebas Neue is configured with correct properties
  - Verify font-display: swap is set
  - Verify weights 400 and 700 are included
  - _Requirements: 1.4, 8.1_

- [x] 2. Create punk-typography.css file
  - [x] 2.1 Create src/styles/punk-typography.css with CSS custom properties
    - Define --font-display with Bebas Neue and fallback stack
    - Define heading size variables for mobile, tablet, desktop (h1-h3)
    - Define letter-spacing variables (tight, normal, wide)
    - Define text-shadow variables (punk shadow, glow effect)
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3_

  - [x] 2.2 Add base heading styles (h1-h6)
    - Style h1 with largest sizes, tight line-height, uppercase transform
    - Style h2 with section heading sizes, uppercase transform
    - Style h3 with subsection sizes, uppercase transform
    - Style h4-h6 with smaller sizes, wide letter-spacing
    - Apply amber color (#fbbf24) to all headings
    - Apply text-shadow effects appropriately per heading level
    - _Requirements: 2.1, 2.2, 5.1, 7.2_

  - [x] 2.3 Add responsive typography media queries
    - Add @media (min-width: 768px) for tablet sizes
    - Add @media (min-width: 1024px) for desktop sizes
    - Ensure h1 gets glow effect only on desktop
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 2.4 Write property test for responsive scaling
    - **Property 8: Responsive Typography Scaling**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Test that font-sizes scale correctly across viewport widths
    - Generate random viewport widths and verify appropriate sizing

  - [x] 2.5 Add accessibility overrides
    - Add @media (prefers-reduced-motion: reduce) to disable animations
    - Add @media (prefers-contrast: high) to remove shadows and add outlines
    - Ensure text remains selectable (no user-select: none)
    - _Requirements: 6.2, 9.2, 5.4_

  - [ ]* 2.6 Write property test for reduced motion compliance
    - **Property 11: Reduced Motion Disables Animations**
    - **Validates: Requirements 6.2**
    - Test that animations are disabled when prefers-reduced-motion is set
    - Verify animation-duration is 0s or none

- [x] 3. Integrate typography styles into application
  - Import punk-typography.css in layout.tsx after globals.css
  - Verify import order: globals.css → punk-icons.css → punk-typography.css
  - Test that styles apply to existing heading elements
  - _Requirements: 7.1, 7.3, 7.4_

- [ ]* 3.1 Write property test for Tailwind utility preservation
  - **Property 12: Tailwind Utility Preservation**
  - **Validates: Requirements 7.3**
  - Test that Tailwind utilities (mb-6, text-center, etc.) still apply
  - Generate random Tailwind classes and verify they're not overridden

- [x] 4. Add optional hover effects for interactive headings
  - Add hover styles for headings within links (a h1:hover, etc.)
  - Apply red color (#ff0000) and enhanced glow on hover
  - Add transition for smooth color/shadow changes
  - Disable transitions in reduced motion mode
  - _Requirements: 6.1, 6.2_

- [x] 5. Checkpoint - Visual verification and accessibility testing
  - Ensure all tests pass, ask the user if questions arise
  - Manually verify headings look punk rock and aggressive
  - Test with browser zoom at 200%
  - Test with high contrast mode enabled
  - Test with reduced motion enabled

- [ ]* 6. Write property tests for contrast compliance
  - [ ]* 6.1 Write property test for WCAG AA contrast
    - **Property 5: WCAG AA Contrast Compliance**
    - **Validates: Requirements 2.5, 5.2**
    - Test contrast ratios between heading colors and backgrounds
    - Generate random background colors and verify minimum contrast ratios

  - [ ]* 6.2 Write property test for effects on light and dark backgrounds
    - **Property 6: Effects Work on Light and Dark Backgrounds**
    - **Validates: Requirements 3.3**
    - Test that headings with effects maintain contrast on black and white
    - Verify minimum 3:1 contrast ratio

- [ ]* 7. Write property tests for layout stability
  - [ ]* 7.1 Write property test for layout shift prevention
    - **Property 7: Effects Prevent Layout Shifts**
    - **Validates: Requirements 3.4**
    - Test that applying effects doesn't change element dimensions
    - Measure bounding box before and after effects

  - [ ]* 7.2 Write property test for text overflow prevention
    - **Property 9: Text Overflow Prevention**
    - **Validates: Requirements 4.4**
    - Test headings at various viewport widths (320px-1920px)
    - Generate random text content and verify no overflow

  - [ ]* 7.3 Write property test for zoom support
    - **Property 14: Zoom Support Without Overflow**
    - **Validates: Requirements 9.4**
    - Test headings at 200% browser zoom
    - Verify no horizontal overflow occurs

- [ ]* 8. Write property tests for typography hierarchy
  - [ ]* 8.1 Write property test for distinct heading levels
    - **Property 3: Distinct Heading Level Styling**
    - **Validates: Requirements 2.1**
    - Test that each heading level has unique font-size
    - Compare all pairs of heading levels

  - [ ]* 8.2 Write property test for h1 maximum size
    - **Property 4: H1 Maximum Size Hierarchy**
    - **Validates: Requirements 2.2**
    - Test that h1 font-size is largest at any viewport width
    - Compare h1 against h2-h6

- [ ]* 9. Write unit tests for configuration and edge cases
  - [ ]* 9.1 Test CSS variables are defined
    - Verify --font-display, --text-h1-mobile, --text-shadow-punk exist
    - Check that values match design specifications

  - [ ]* 9.2 Test font stack includes fallbacks
    - **Property 1: Font Stack Includes Display Font and Fallbacks**
    - **Validates: Requirements 1.1, 1.2**
    - Verify font-family includes Bebas Neue, Impact, Arial Black

  - [ ]* 9.3 Test graceful font loading degradation
    - **Property 2: Graceful Font Loading Degradation**
    - **Validates: Requirements 1.3**
    - Simulate font load failure and verify fallbacks work

  - [ ]* 9.4 Test color scheme consistency
    - **Property 10: Amber Color Scheme Consistency**
    - **Validates: Requirements 5.1, 7.2**
    - Verify all headings use #fbbf24 or equivalent amber color

  - [ ]* 9.5 Test text selectability
    - **Property 13: Text Selectability**
    - **Validates: Requirements 9.2**
    - Verify user-select is not 'none' on any heading

  - [ ]* 9.6 Test focus indicator visibility
    - **Property 15: Focus Indicator Visibility**
    - **Validates: Requirements 9.5**
    - Test that interactive headings show visible focus indicators

- [ ] 10. Final checkpoint - Complete testing and documentation
  - Ensure all tests pass, ask the user if questions arise
  - Verify all 15 correctness properties are validated
  - Test across browsers (Chrome, Firefox, Safari)
  - Document any browser-specific quirks or fallbacks

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation and user feedback
- Font loading uses Next.js font optimization for best performance
- All styles use CSS custom properties for easy theming and maintenance
