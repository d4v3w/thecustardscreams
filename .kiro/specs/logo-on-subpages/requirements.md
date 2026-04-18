# Requirements Document: Logo on Sub-Pages

## Introduction

The Custard Screams website currently displays the band logo only on the homepage as a large circular image (40-60 units). This feature adds the logo to all sub-pages (music, about, live-shows, and privacy-policy) in a smaller, responsive format positioned at the top-left of each page. The logo will serve as a clickable link back to the homepage, providing consistent branding and improved navigation across the site.

## Glossary

- **Logo**: The circular band image currently displayed on the homepage (The Custard Screams logo)
- **Sub-pages**: All pages except the homepage (music, about, live-shows, privacy-policy)
- **Homepage**: The root page (/) displaying the HeroSection
- **Responsive**: Adapts layout and sizing based on viewport width
- **Max-width**: Maximum width constraint (20rem) that the logo respects
- **Left-aligned**: Positioned at the left edge of the page content area
- **Breadcrumb**: Navigation component showing the current page hierarchy
- **Design system**: Existing sizing and spacing patterns used throughout the site

## Requirements

### Requirement 1: Logo Display on All Sub-Pages

**User Story:** As a visitor, I want to see the band logo on every sub-page, so that I can quickly identify the site and navigate back to the homepage.

#### Acceptance Criteria

1. WHEN a user navigates to the music page, THE Logo_Component SHALL display the band logo at the top-left of the page
2. WHEN a user navigates to the about page, THE Logo_Component SHALL display the band logo at the top-left of the page
3. WHEN a user navigates to the live-shows page, THE Logo_Component SHALL display the band logo at the top-left of the page
4. WHEN a user navigates to the privacy-policy page, THE Logo_Component SHALL display the band logo at the top-left of the page
5. THE Logo_Component SHALL NOT display on the homepage (root page)

### Requirement 2: Logo Sizing and Responsiveness

**User Story:** As a designer, I want the logo to scale responsively across devices, so that it maintains visual balance on all screen sizes.

#### Acceptance Criteria

1. THE Logo_Component SHALL have a maximum width of 20rem (320px)
2. WHEN the viewport width is less than 768px (mobile), THE Logo_Component SHALL scale proportionally to fit the mobile layout
3. WHEN the viewport width is 768px or greater (tablet/desktop), THE Logo_Component SHALL maintain consistent sizing
4. THE Logo_Component SHALL maintain its circular aspect ratio at all viewport sizes
5. THE Logo_Component SHALL use sizing values consistent with other responsive elements in the design system

### Requirement 3: Logo Positioning and Layout

**User Story:** As a user, I want the logo positioned consistently at the top of each sub-page, so that I can easily find it.

#### Acceptance Criteria

1. THE Logo_Component SHALL be positioned at the top-left of the page content area
2. THE Logo_Component SHALL be left-aligned with appropriate padding from the left edge
3. WHEN the Breadcrumb component is present, THE Logo_Component SHALL be positioned above the breadcrumb navigation
4. THE Logo_Component SHALL have appropriate vertical spacing below it to separate from page content
5. THE Logo_Component SHALL use padding and spacing values consistent with the existing design system

### Requirement 4: Logo as Navigation Link

**User Story:** As a visitor, I want to click the logo to return to the homepage, so that I have an intuitive way to navigate back.

#### Acceptance Criteria

1. THE Logo_Component SHALL be wrapped in a clickable link element
2. WHEN a user clicks the logo, THE Browser SHALL navigate to the homepage (/)
3. THE Logo_Component SHALL have a hover state indicating it is clickable
4. THE Logo_Component SHALL have appropriate focus styling for keyboard navigation
5. THE Logo_Component SHALL have an aria-label describing its purpose for screen readers

### Requirement 5: Logo Image and Accessibility

**User Story:** As an accessibility-conscious user, I want the logo to be properly labeled and accessible, so that screen readers can describe it.

#### Acceptance Criteria

1. THE Logo_Component SHALL use the same logo image URL as the homepage HeroSection
2. THE Logo_Component SHALL have an alt attribute describing the logo
3. THE Logo_Component SHALL have an aria-label attribute on the link element
4. THE Logo_Component SHALL support responsive image loading with srcSet for high-DPI displays
5. THE Logo_Component SHALL have a display name for debugging purposes

### Requirement 6: Logo Styling Consistency

**User Story:** As a designer, I want the logo styling to match the site's punk rock aesthetic, so that it feels cohesive with the existing design.

#### Acceptance Criteria

1. THE Logo_Component SHALL use the same circular border-radius as the homepage logo
2. THE Logo_Component SHALL use Tailwind CSS utility classes consistent with the codebase
3. THE Logo_Component SHALL maintain the dark theme (black background, white/amber accents)
4. THE Logo_Component SHALL use the same image URL and srcSet as the HeroSection for consistency
5. THE Logo_Component SHALL apply appropriate shadow or border styling if needed for visual separation

### Requirement 7: Logo Integration with Existing Layouts

**User Story:** As a developer, I want the logo to integrate seamlessly with existing page layouts, so that implementation is straightforward.

#### Acceptance Criteria

1. THE Logo_Component SHALL be placed in the appropriate layout files (music/layout.tsx, about/layout.tsx, live-shows/layout.tsx, privacy-policy/layout.tsx)
2. WHEN the Logo_Component is added to a layout, THE Breadcrumb component SHALL remain visible and functional
3. THE Logo_Component SHALL not interfere with the main content area
4. THE Logo_Component SHALL be positioned before the breadcrumb in the layout hierarchy
5. THE Logo_Component SHALL use the same layout structure as existing components

### Requirement 8: Logo Responsive Behavior on Mobile

**User Story:** As a mobile user, I want the logo to display properly on small screens, so that the page remains usable and visually appealing.

#### Acceptance Criteria

1. WHEN the viewport width is less than 640px (small mobile), THE Logo_Component SHALL scale appropriately without overflow
2. WHEN the viewport width is between 640px and 768px (large mobile), THE Logo_Component SHALL maintain proper spacing
3. THE Logo_Component SHALL not cause horizontal scrolling on any mobile device
4. THE Logo_Component SHALL have touch-friendly dimensions (minimum 44px height for touch targets)
5. THE Logo_Component SHALL maintain readability and visual hierarchy on mobile devices

### Requirement 9: Logo Consistency Across Sub-Pages

**User Story:** As a visitor, I want the logo to look and behave the same way on every sub-page, so that the experience is consistent.

#### Acceptance Criteria

1. THE Logo_Component SHALL have identical styling across all sub-pages
2. THE Logo_Component SHALL have identical sizing across all sub-pages
3. THE Logo_Component SHALL have identical positioning across all sub-pages
4. THE Logo_Component SHALL have identical link behavior across all sub-pages
5. THE Logo_Component SHALL use the same component implementation across all sub-pages

### Requirement 10: Logo Does Not Display on Homepage

**User Story:** As a designer, I want the logo to only appear on sub-pages, so that the homepage maintains its current design.

#### Acceptance Criteria

1. THE Logo_Component SHALL NOT be added to the homepage layout
2. WHEN a user is on the homepage, THE Logo_Component SHALL not be visible
3. THE Logo_Component SHALL not affect the HeroSection styling or layout
4. THE Logo_Component SHALL not interfere with the homepage's existing logo display
5. THE Homepage layout SHALL remain unchanged from its current implementation
