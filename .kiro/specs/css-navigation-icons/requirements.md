# Requirements Document

## Introduction

This feature replaces the current emoji-based navigation icons (🏠🎵📅ℹ️) with pure CSS icons that better match a hard rock band's visual aesthetic. The new icons will be minimalist, edgy, and built entirely with CSS geometric shapes, eliminating external dependencies while maintaining accessibility and performance.

## Glossary

- **NavItem**: The React component that renders individual navigation items in the bottom navigation bar
- **CSS_Icon**: A visual icon created entirely using CSS properties (borders, transforms, pseudo-elements) without images or external icon libraries
- **Active_State**: The visual state when a navigation item is currently selected
- **Inactive_State**: The visual state when a navigation item is not currently selected
- **Hard_Rock_Aesthetic**: A visual design style inspired by punk rock and KISS - bold, aggressive, high contrast, angular geometric shapes with an edgy modern feel

## Requirements

### Requirement 1: Replace Emoji Icons with CSS Icons

**User Story:** As a website visitor, I want to see navigation icons that match the hard rock band's aesthetic, so that the visual design feels cohesive and professional.

#### Acceptance Criteria

1. THE NavItem SHALL render a CSS_Icon instead of an emoji character for each navigation section
2. WHEN rendering the hero/home icon, THE NavItem SHALL display a house-shaped CSS_Icon using geometric shapes
3. WHEN rendering the music icon, THE NavItem SHALL display a music note-shaped CSS_Icon using geometric shapes
4. WHEN rendering the shows icon, THE NavItem SHALL display a calendar-shaped CSS_Icon using geometric shapes
5. WHEN rendering the about icon, THE NavItem SHALL display an info-shaped CSS_Icon using geometric shapes

### Requirement 2: Maintain Visual Consistency

**User Story:** As a website visitor, I want the icons to be visually consistent with each other, so that the navigation feels unified and professional.

#### Acceptance Criteria

1. THE CSS_Icons SHALL use consistent stroke widths across all icon types
2. THE CSS_Icons SHALL use consistent sizing (width and height) across all icon types
3. THE CSS_Icons SHALL use the Hard_Rock_Aesthetic design principles (bold, aggressive, high contrast, angular with punk rock/KISS-inspired edgy modern feel)
4. WHEN displayed in Inactive_State, THE CSS_Icons SHALL use white color
5. WHEN displayed in Active_State, THE CSS_Icons SHALL use black color

### Requirement 3: Preserve Accessibility

**User Story:** As a user with assistive technology, I want the navigation to remain accessible, so that I can navigate the website effectively.

#### Acceptance Criteria

1. THE CSS_Icons SHALL be marked with aria-hidden="true" to prevent screen reader announcement
2. THE NavItem SHALL maintain existing aria-label attributes for screen reader users
3. THE NavItem SHALL maintain existing aria-current attributes for active state indication
4. THE NavItem SHALL maintain existing keyboard focus indicators

### Requirement 4: Maintain Performance

**User Story:** As a website visitor, I want the navigation to load quickly, so that I can access content without delay.

#### Acceptance Criteria

1. THE CSS_Icons SHALL be implemented using only CSS properties (no external files or libraries)
2. THE CSS_Icons SHALL not require additional HTTP requests
3. THE CSS_Icons SHALL render without layout shifts during page load
4. THE NavItem SHALL maintain existing transition animations for state changes

### Requirement 5: Ensure Responsive Behavior

**User Story:** As a mobile user, I want the icons to display correctly on my device, so that I can navigate easily.

#### Acceptance Criteria

1. THE CSS_Icons SHALL scale appropriately within the existing min-h-[44px] min-w-[44px] touch target
2. THE CSS_Icons SHALL maintain visual clarity at the rendered size
3. THE CSS_Icons SHALL maintain aspect ratios across different viewport sizes
4. WHEN the NavItem transitions between Active_State and Inactive_State, THE CSS_Icons SHALL animate smoothly

### Requirement 6: Support Theme Integration

**User Story:** As a developer, I want the icons to integrate with the existing Tailwind CSS theme, so that styling remains maintainable.

#### Acceptance Criteria

1. THE CSS_Icons SHALL use Tailwind CSS utility classes where possible
2. THE CSS_Icons SHALL respect the existing color scheme (amber-400 for active, white for inactive)
3. WHEN custom CSS is required, THE NavItem SHALL use scoped styles or CSS modules
4. THE CSS_Icons SHALL support the existing hover state (hover:bg-white/10)
