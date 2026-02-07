# Footer Visibility Fix - Requirements

## Overview
The footer component is currently only visible on the home page and is hidden by the fixed bottom navigation bar. This spec addresses making the footer visible and accessible on all pages with proper spacing to prevent overlap with the bottom navigation.

## Problem Statement
- Footer is only present on the home page, not on other pages (music, live-shows, about)
- Footer can be hidden or overlapped by the fixed bottom navigation bar
- Users cannot scroll to see the full footer content including copyright and social links

## User Stories

### 1. Footer on All Pages
**As a** site visitor  
**I want** to see the footer on every page  
**So that** I can access social links and copyright information regardless of which page I'm viewing

### 2. Footer Accessibility
**As a** site visitor  
**I want** to be able to scroll to the bottom and see the complete footer  
**So that** the footer content is not hidden behind the fixed bottom navigation

### 3. Consistent Spacing
**As a** site visitor  
**I want** consistent spacing between content and the bottom navigation  
**So that** no content is obscured and the layout feels polished

## Acceptance Criteria

### 1.1 Footer Component Placement
- Footer must be rendered on all pages (home, music, live-shows, about, and any nested pages)
- Footer should be placed in a consistent location across all pages

### 1.2 Bottom Navigation Clearance
- Footer must have sufficient bottom padding/margin to clear the fixed bottom navigation bar
- The bottom navigation bar height plus additional spacing should be accounted for
- Minimum clearance should be at least the height of the bottom nav (approximately 64-72px) plus comfortable spacing (16-24px)

### 1.3 Scroll Accessibility
- Users must be able to scroll to the bottom of any page and see the complete footer
- Footer content (social links, copyright text) must be fully visible and not obscured

### 1.4 Visual Consistency
- Footer styling should remain consistent across all pages
- Footer should maintain proper spacing from page content above it

### 1.5 Responsive Behavior
- Footer clearance should work correctly on all screen sizes (mobile, tablet, desktop)
- Bottom padding should adapt if bottom navigation height changes on different viewports

## Technical Constraints

- Must work with the existing fixed bottom navigation (`BottomNav` component)
- Should not break existing scroll-snap behavior on the home page
- Must maintain accessibility standards
- Should work with the current layout structure (LayoutClient wrapper)

## Out of Scope

- Redesigning the footer content or styling
- Modifying the bottom navigation functionality
- Adding new footer features or sections
- Changing the footer component's internal structure beyond placement

## Success Metrics

- Footer is visible on 100% of pages
- Footer content is fully accessible when scrolling to bottom
- No overlap between footer and bottom navigation
- Zero visual regressions on existing pages
