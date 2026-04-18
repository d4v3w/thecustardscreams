# Design Document: Logo on Sub-Pages

## Overview

This design document specifies the implementation of a reusable Logo component that displays the band logo on all sub-pages (music, about, live-shows, privacy-policy) while maintaining consistency with the existing homepage design. The logo serves as both a branding element and a navigation link back to the homepage.

The Logo component will be a small, responsive circular image positioned at the top-left of each sub-page, above the breadcrumb navigation. It will use the same image URL and srcSet as the HeroSection but with constrained sizing (max-width: 20rem) to maintain visual hierarchy on sub-pages.

## Architecture

### Component Hierarchy

```
SubPage Layout
├── Logo (new component)
├── Breadcrumb (existing)
└── Main Content
```

The Logo component will be positioned at the top of each sub-page layout, before the Breadcrumb component. This ensures the logo appears first in the visual hierarchy and in the DOM for accessibility.

### Component Placement

The Logo component will be integrated into the following layout files:
- `src/app/music/layout.tsx`
- `src/app/about/layout.tsx`
- `src/app/live-shows/layout.tsx`
- `src/app/privacy-policy/layout.tsx`

The component will NOT be added to:
- `src/app/layout.tsx` (root layout)
- `src/app/page.tsx` (homepage)
- `src/app/_components/HeroSection.tsx` (existing logo display)

### Layout Structure Pattern

Each sub-page layout will follow this structure:

```typescript
<div className="min-h-screen pb-20">
  <Logo />
  <Breadcrumb />
  <main className="p-4 md:p-6">{children}</main>
</div>
```

## Components and Interfaces

### Logo Component

**File Location:** `src/components/Logo.tsx`

**Component Type:** Server component (no client-side interactivity required)

**Props Interface:**

```typescript
interface LogoProps {
  className?: string;
}
```

**Component Signature:**

```typescript
export default function Logo({ className = "" }: LogoProps): JSX.Element
```

**Display Name:** `Logo.displayName = "Logo"`

### Component Structure

The Logo component will be a simple, semantic HTML structure:

```typescript
<Link href="/">
  <img
    src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
    srcSet="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x, https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
    alt="The Custard Screams logo"
    aria-label="The Custard Screams - Back to home"
    className="h-20 w-20 rounded-full transition-opacity duration-300 hover:opacity-80"
  />
</Link>
```

**Key Design Decisions:**

1. **Server Component:** No client-side state or interactivity needed, so this is a server component by default
2. **Link Wrapper:** Uses Next.js `Link` component for client-side navigation
3. **Image Element:** Uses standard HTML `<img>` tag with `srcSet` for responsive image loading
4. **Semantic HTML:** Proper use of `alt` and `aria-label` attributes for accessibility
5. **Tailwind Classes:** Uses utility classes for styling and responsive behavior

## Data Models

### Image Assets

The Logo component uses the same image assets as the HeroSection:

**Primary Image URL:**
```
https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg
```

**SrcSet (High-DPI Support):**
```
1x: https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM
2x: https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z
```

These URLs are identical to those used in HeroSection, ensuring consistency across the site.

### Sizing Constants

The Logo component uses the following sizing constraints:

| Property | Value | Notes |
|----------|-------|-------|
| Max Width | 20rem (320px) | Requirement 2.1 |
| Aspect Ratio | 1:1 (square) | Circular image |
| Mobile Height | 5rem (80px) | h-20 in Tailwind |
| Mobile Width | 5rem (80px) | w-20 in Tailwind |
| Tablet/Desktop | Same as mobile | Consistent sizing across breakpoints |
| Border Radius | 9999px (full circle) | rounded-full in Tailwind |

## Styling Strategy

### Tailwind CSS Implementation

The Logo component uses Tailwind CSS utility classes for all styling:

```typescript
className="h-20 w-20 rounded-full transition-opacity duration-300 hover:opacity-80"
```

**Breakdown:**
- `h-20` - Height of 5rem (80px)
- `w-20` - Width of 5rem (80px)
- `rounded-full` - Border radius of 9999px (creates perfect circle)
- `transition-opacity` - Smooth opacity transition on hover
- `duration-300` - 300ms transition duration
- `hover:opacity-80` - 80% opacity on hover (20% darker)

### Responsive Sizing

The Logo component maintains consistent sizing across all viewport widths:

| Breakpoint | Size | Tailwind Classes |
|------------|------|------------------|
| Mobile (< 640px) | 5rem × 5rem | h-20 w-20 |
| Tablet (640px - 1024px) | 5rem × 5rem | h-20 w-20 |
| Desktop (> 1024px) | 5rem × 5rem | h-20 w-20 |

**Rationale:** The logo is intentionally small on sub-pages to maintain visual hierarchy and avoid competing with page content. The consistent sizing across breakpoints ensures predictable layout behavior.

### Spacing and Layout

The Logo component will be wrapped in a container with appropriate padding:

```typescript
<div className="p-4 md:p-6">
  <Logo />
</div>
```

**Spacing Values:**
- Mobile padding: 1rem (p-4)
- Tablet/Desktop padding: 1.5rem (p-6)
- Vertical spacing below logo: Inherited from layout padding

### Hover and Focus States

**Hover State:**
- Opacity reduces to 80% (`hover:opacity-80`)
- Smooth transition over 300ms (`transition-opacity duration-300`)
- Indicates the logo is clickable

**Focus State:**
- Inherited from Next.js Link component
- Browser default focus ring visible
- Keyboard navigation support

### Dark Theme Consistency

The Logo component maintains the site's dark theme:
- Black background (inherited from page)
- White/amber text (not applicable to image)
- Circular shape consistent with punk rock aesthetic

## Layout Integration

### Integration Points

The Logo component will be integrated into four sub-page layouts:

#### 1. Music Layout (`src/app/music/layout.tsx`)

```typescript
import Logo from "~/components/Logo";
import Breadcrumb from "~/components/navigation/Breadcrumb";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 md:p-6">
        <Logo />
      </div>
      <Breadcrumb />
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
```

#### 2. About Layout (`src/app/about/layout.tsx`)

Same structure as Music Layout

#### 3. Live Shows Layout (`src/app/live-shows/layout.tsx`)

Same structure as Music Layout

#### 4. Privacy Policy Page (`src/app/privacy-policy/page.tsx`)

For the privacy policy page (which doesn't have a dedicated layout), the Logo will be added directly to the page:

```typescript
import Logo from "~/components/Logo";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Logo />
        </div>
        {/* Existing content */}
      </div>
    </div>
  );
}
```

### Layout Hierarchy

The Logo component is positioned before the Breadcrumb in the layout hierarchy:

```
Layout Container (min-h-screen pb-20)
├── Logo Container (p-4 md:p-6)
│   └── Logo Component
├── Breadcrumb Component (p-4)
└── Main Content (p-4 md:p-6)
```

This ensures:
1. Logo appears first visually
2. Logo appears first in DOM (better for accessibility)
3. Breadcrumb remains visible and functional
4. Main content is not affected

## Image Handling

### Image URL Strategy

The Logo component uses the same image URL as HeroSection for consistency:

**Primary URL:** `https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg`

**SrcSet URLs:**
- 1x: `https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM`
- 2x: `https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z`

### Responsive Image Loading

The `srcSet` attribute enables responsive image loading for high-DPI displays:

```typescript
srcSet="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x, https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
```

**Behavior:**
- 1x: Standard resolution displays (96 DPI)
- 2x: High-DPI displays (Retina, modern phones)

### Image Optimization

**Current Approach:** Direct image URLs from external CDN (Uploadcare)

**Future Optimization Opportunities:**
- Consider using Next.js `Image` component for automatic optimization
- Implement lazy loading if performance becomes a concern
- Add image caching headers

## Responsive Behavior

### Viewport Breakpoints

The Logo component uses Tailwind's default breakpoints:

| Breakpoint | Width | Logo Behavior |
|------------|-------|---------------|
| Mobile | < 640px | 5rem × 5rem, p-4 padding |
| Tablet | 640px - 1024px | 5rem × 5rem, p-4 padding |
| Desktop | > 1024px | 5rem × 5rem, p-6 padding |

### Responsive Sizing Strategy

The Logo maintains consistent sizing across all breakpoints because:

1. **Visual Hierarchy:** Small size ensures logo doesn't compete with page content
2. **Touch Targets:** 5rem (80px) exceeds minimum 44px touch target size
3. **Consistency:** Same size across all pages and devices
4. **Simplicity:** No complex responsive logic needed

### Mobile Considerations

**Small Mobile (< 640px):**
- Logo: 5rem × 5rem (80px × 80px)
- Padding: 1rem (p-4)
- No horizontal overflow
- Touch-friendly dimensions

**Large Mobile (640px - 768px):**
- Logo: 5rem × 5rem (80px × 80px)
- Padding: 1rem (p-4)
- Maintains proper spacing

**Tablet/Desktop (> 768px):**
- Logo: 5rem × 5rem (80px × 80px)
- Padding: 1.5rem (p-6)
- Consistent with desktop layout

## Accessibility Implementation

### Alt Text

The Logo component includes descriptive alt text:

```typescript
alt="The Custard Screams logo"
```

**Purpose:** Describes the image for screen readers and when image fails to load

### ARIA Labels

The Logo component includes an aria-label on the Link element:

```typescript
aria-label="The Custard Screams - Back to home"
```

**Purpose:** Provides additional context for screen readers about the link's purpose

### Keyboard Navigation

The Logo component supports keyboard navigation through the Next.js Link component:

- **Tab Key:** Focus moves to the logo link
- **Enter Key:** Navigates to homepage
- **Focus Indicator:** Browser default focus ring visible

### Touch Accessibility

The Logo component meets touch accessibility requirements:

- **Minimum Touch Target:** 5rem (80px) exceeds 44px minimum
- **Touch Feedback:** Hover state provides visual feedback
- **No Hover-Only Content:** All information is visible without hover

### Screen Reader Announcements

The Logo component provides clear announcements for screen readers:

1. **Alt Text:** "The Custard Screams logo"
2. **ARIA Label:** "The Custard Screams - Back to home"
3. **Link Role:** Implicit from `<Link>` component

### Semantic HTML

The Logo component uses semantic HTML:

- `<Link>` - Semantic link element
- `<img>` - Semantic image element
- Proper alt and aria-label attributes

## Error Handling

### Image Loading Failures

**Current Approach:** No explicit error handling

**Fallback Behavior:**
- Alt text displays if image fails to load
- Link remains functional
- Page layout unaffected

**Future Enhancement:** Consider implementing error boundary or fallback image

### Navigation Errors

**Current Approach:** Next.js Link handles navigation

**Behavior:**
- Link always navigates to homepage (/)
- No error states needed

## Testing Strategy

### Property-Based Testing Applicability

**Assessment:** Property-based testing is NOT applicable to this feature.

**Rationale:**
- This feature is a UI component with fixed rendering behavior
- Acceptance criteria test specific pages and specific behavior, not universal properties
- No meaningful input variation that would reveal edge cases through randomization
- No pure functions with universal properties to test
- Testing is better served by example-based unit tests and E2E tests

This feature involves:
- UI component rendering (not suitable for PBT)
- Layout integration (not suitable for PBT)
- Styling and positioning (not suitable for PBT)
- Navigation behavior (not suitable for PBT)

### Unit Tests

Unit tests will verify the Logo component's rendering and behavior:

**Test File:** `src/components/Logo.test.tsx`

**Test Cases:**

1. **Rendering:** Component renders without errors
   - Verify the component renders a Link element
   - Verify the component renders an img element

2. **Image Attributes:** Correct src, srcSet, alt, and aria-label attributes
   - Verify src attribute matches HeroSection URL
   - Verify srcSet attribute is present and correct
   - Verify alt attribute is "The Custard Screams logo"
   - Verify aria-label is "The Custard Screams - Back to home"

3. **Link Destination:** Link href points to homepage (/)
   - Verify Link href is "/"

4. **CSS Classes:** Correct Tailwind classes applied
   - Verify className includes "h-20 w-20"
   - Verify className includes "rounded-full"
   - Verify className includes "transition-opacity duration-300"
   - Verify className includes "hover:opacity-80"

5. **Display Name:** Component has correct display name for debugging
   - Verify Logo.displayName is "Logo"

6. **Props:** Component accepts optional className prop
   - Verify component renders with custom className
   - Verify custom className is merged with default classes

### Integration Tests

Integration tests will verify the Logo component integrates correctly with layouts:

**Test Scenarios:**

1. **Music Layout:** Logo appears above breadcrumb
   - Render MusicLayout with children
   - Verify Logo component is rendered
   - Verify Breadcrumb component is rendered
   - Verify Logo appears before Breadcrumb in DOM

2. **About Layout:** Logo appears above breadcrumb
   - Render AboutLayout with children
   - Verify Logo component is rendered
   - Verify Breadcrumb component is rendered
   - Verify Logo appears before Breadcrumb in DOM

3. **Live Shows Layout:** Logo appears above breadcrumb
   - Render LiveShowsLayout with children
   - Verify Logo component is rendered
   - Verify Breadcrumb component is rendered
   - Verify Logo appears before Breadcrumb in DOM

4. **Privacy Policy Page:** Logo appears at top of page
   - Render PrivacyPolicyPage
   - Verify Logo component is rendered
   - Verify Logo appears at top of page

5. **Homepage:** Logo does NOT appear on homepage
   - Render HomePage
   - Verify Logo component is NOT rendered
   - Verify HeroSection is rendered

6. **Breadcrumb Functionality:** Breadcrumb remains functional with Logo
   - Render layout with Logo and Breadcrumb
   - Verify Breadcrumb links are clickable
   - Verify Breadcrumb navigation works correctly

7. **Main Content:** Logo does not interfere with main content
   - Render layout with Logo and main content
   - Verify main content is rendered correctly
   - Verify main content layout is not affected

### E2E Tests

End-to-end tests will verify user interactions:

**Test Scenarios:**

1. **Logo Click Navigation:** Clicking logo navigates to homepage
   - Navigate to music page
   - Click logo
   - Verify URL is "/"
   - Verify homepage is displayed

2. **Keyboard Navigation:** Tab to logo and press Enter navigates to homepage
   - Navigate to music page
   - Tab to logo
   - Verify logo has focus
   - Press Enter
   - Verify URL is "/"
   - Verify homepage is displayed

3. **Responsive Display:** Logo displays correctly on mobile, tablet, and desktop
   - Set viewport to mobile (375px)
   - Verify logo is visible and properly sized
   - Set viewport to tablet (768px)
   - Verify logo is visible and properly sized
   - Set viewport to desktop (1920px)
   - Verify logo is visible and properly sized

4. **Visual Consistency:** Logo appears identical on all sub-pages
   - Navigate to music page
   - Take screenshot of logo
   - Navigate to about page
   - Take screenshot of logo
   - Compare screenshots (should be identical)
   - Repeat for live-shows and privacy-policy pages

5. **No Horizontal Scrolling:** Logo does not cause horizontal scrolling on mobile
   - Set viewport to small mobile (375px)
   - Navigate to music page
   - Verify no horizontal scrolling
   - Verify logo is fully visible

6. **Touch Interaction:** Logo is touch-friendly on mobile
   - Set viewport to mobile (375px)
   - Navigate to music page
   - Tap logo
   - Verify navigation to homepage

### Testing Approach

- **Unit Tests:** Jest with React Testing Library
  - Test component rendering and attributes
  - Test component props and behavior
  - Test component display name

- **Integration Tests:** Jest with React Testing Library
  - Test component integration with layouts
  - Test component interaction with other components
  - Test component does not appear on homepage

- **E2E Tests:** Playwright
  - Test user interactions (clicking, keyboard navigation)
  - Test navigation behavior
  - Test responsive display
  - Test visual consistency

- **Visual Tests:** Manual verification
  - Verify responsive behavior on mobile, tablet, desktop
  - Verify visual hierarchy and spacing
  - Verify accessibility with screen reader

### Test Coverage Goals

- **Unit Tests:** 100% coverage of Logo component
- **Integration Tests:** All layout integration scenarios
- **E2E Tests:** All user interaction scenarios
- **Overall:** Comprehensive coverage of all acceptance criteria

## File Structure

### New Files to Create

```
src/
├── components/
│   └── Logo.tsx (new)
└── components/
    └── Logo.test.tsx (new)
```

### Files to Modify

```
src/app/
├── music/
│   └── layout.tsx (add Logo import and component)
├── about/
│   └── layout.tsx (add Logo import and component)
├── live-shows/
│   └── layout.tsx (add Logo import and component)
└── privacy-policy/
    └── page.tsx (add Logo import and component)
```

### Configuration Files

No configuration file changes needed. The Logo component uses existing Tailwind CSS configuration.

## Implementation Checklist

- [ ] Create `src/components/Logo.tsx`
- [ ] Create `src/components/Logo.test.tsx`
- [ ] Update `src/app/music/layout.tsx`
- [ ] Update `src/app/about/layout.tsx`
- [ ] Update `src/app/live-shows/layout.tsx`
- [ ] Update `src/app/privacy-policy/page.tsx`
- [ ] Verify logo does NOT appear on homepage
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Run E2E tests
- [ ] Verify responsive behavior on mobile, tablet, desktop
- [ ] Verify accessibility with screen reader
- [ ] Verify keyboard navigation

## Design Decisions and Rationale

### Why a Server Component?

The Logo component is a server component because:
- No client-side state or interactivity
- Simple rendering of static content
- Reduces JavaScript bundle size
- Improves performance

### Why Consistent Sizing?

The Logo maintains consistent sizing across all breakpoints because:
- Simplifies implementation
- Ensures predictable layout
- Maintains visual hierarchy
- Reduces CSS complexity

### Why 5rem (80px)?

The 5rem size was chosen because:
- Exceeds 44px minimum touch target size
- Smaller than homepage logo (40-60 units) to maintain hierarchy
- Respects max-width constraint of 20rem
- Provides good visual balance on sub-pages

### Why Positioned Above Breadcrumb?

The Logo is positioned above the breadcrumb because:
- Breadcrumb is navigation, logo is branding
- Logo should appear first in visual hierarchy
- Logo should appear first in DOM for accessibility
- Consistent with common web design patterns

### Why Link to Homepage?

The Logo links to the homepage because:
- Provides intuitive navigation
- Common pattern on websites
- Improves user experience
- Requirement 4.1, 4.2

## Future Enhancements

1. **Image Optimization:** Migrate to Next.js Image component
2. **Lazy Loading:** Implement lazy loading for performance
3. **Animation:** Add subtle animation on hover
4. **Customization:** Make image URL configurable via props
5. **Error Boundary:** Add error handling for image loading failures
6. **Analytics:** Track logo clicks for user engagement

## References

- [Next.js Link Component](https://nextjs.org/docs/app/api-reference/components/link)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
