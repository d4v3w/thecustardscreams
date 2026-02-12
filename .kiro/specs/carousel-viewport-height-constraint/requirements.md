# Carousel Viewport Height Constraint - Requirements

## Overview
Ensure the image carousel component respects viewport height constraints and never causes images to bleed off the screen, particularly on mobile devices where vertical space is limited.

## User Stories

### 1. Viewport-Constrained Carousel
**As a** mobile user viewing the shows section  
**I want** the image carousel to fit within the viewport  
**So that** I can see the entire image without scrolling within the section

### 2. Responsive Image Sizing
**As a** user on any device  
**I want** carousel images to maintain their aspect ratio while fitting the available space  
**So that** images look correct and don't overflow the viewport

## Acceptance Criteria

### 1.1 Carousel Height Constraint
- The carousel container must have a maximum height that accounts for:
  - Section padding (p-2 on mobile, p-3 on desktop)
  - Section heading and description text
  - Bottom navigation bar (80px)
  - Carousel navigation controls and pagination dots
- Images must never exceed the calculated available height

### 1.2 Image Aspect Ratio Preservation
- Images must maintain their natural aspect ratio
- Images must have `max-width: 100%` to prevent horizontal overflow
- Images must have `max-height` set to fit within the carousel container

### 1.3 Section Layout Integrity
- Each section should remain 100vh in height
- Content must be made to fit within the parent section
- No vertical scrolling should be required within a section

### 1.4 Responsive Behavior
- Solution must work across all viewport sizes
- Mobile devices (small vertical space) must be prioritized
- Desktop devices should also benefit from the constraint

### 1.5 Lightbox Unaffected
- The lightbox modal should continue to display full-size images
- Lightbox images should maintain their current max-height of 90vh

## Non-Functional Requirements

### Performance
- CSS-based solution preferred for optimal performance
- No JavaScript calculations for height unless necessary

### Accessibility
- Image alt text must remain intact
- Keyboard navigation must continue to work
- Focus indicators must remain visible

### Browser Compatibility
- Solution must work in all modern browsers
- Mobile Safari and Chrome must be tested

## Out of Scope
- Changing the lightbox behavior
- Modifying the carousel navigation controls
- Altering the section snap behavior
