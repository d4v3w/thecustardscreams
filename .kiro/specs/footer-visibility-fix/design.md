# Footer Visibility Fix - Design Document

## Overview
This design implements a solution to make the footer visible and accessible on all pages by moving it to the root layout and ensuring proper spacing to prevent overlap with the fixed bottom navigation.

## Architecture

### Current State
- Footer component exists in `src/components/Footer.tsx`
- Footer is only rendered in `src/app/page.tsx` (home page)
- Footer has `pb-20` (80px) padding on home page
- BottomNav is fixed at bottom with `z-40` in `src/components/navigation/BottomNav.tsx`
- LayoutClient wraps all page content and renders BottomNav

### Proposed Solution
Move the footer to the LayoutClient component so it's rendered on all pages with consistent bottom padding to clear the fixed navigation.

## Component Changes

### 1. LayoutClient Component (`src/app/LayoutClient.tsx`)

**Current:**
```tsx
export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { currentSection, navigateToSection } = useNavigation();

  return (
    <>
      {children}
      <BottomNav activeSection={currentSection} onNavigate={navigateToSection} />
    </>
  );
}
```

**Proposed:**
```tsx
import Footer from "~/components/Footer";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { currentSection, navigateToSection } = useNavigation();

  return (
    <>
      <div className="pb-24">
        {children}
        <Footer />
      </div>
      <BottomNav activeSection={currentSection} onNavigate={navigateToSection} />
    </>
  );
}
```

**Rationale:**
- Wrapping children + footer in a container with `pb-24` (96px) provides clearance for the bottom nav
- 96px accounts for typical bottom nav height (~64-72px) plus comfortable spacing (~24-32px)
- Footer is now part of the scrollable content on all pages

### 2. Home Page (`src/app/page.tsx`)

**Change:** Remove the footer from the home page since it's now in LayoutClient

**Current:**
```tsx
<AboutSection />

{/* Footer - outside scroll-snap flow */}
<div className="pb-20">
  <Footer />
</div>
```

**Proposed:**
```tsx
<AboutSection />
```

**Rationale:**
- Eliminates duplication
- Footer is now managed centrally in LayoutClient

### 3. Footer Component (`src/components/Footer.tsx`)

**No changes required** - The component works as-is. Current implementation:
```tsx
export const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="mt-6 flex flex-col items-center p-2 text-amber-200">
      <Socials type="all" />
      <p>Copyright &copy; {currentYear} The Custard Screams</p>
    </footer>
  );
};
```

## Styling Considerations

### Bottom Padding Calculation
- BottomNav height: ~64-72px (depends on content/padding)
- Additional spacing: 24-32px for visual comfort
- Total: `pb-24` (96px) provides adequate clearance
- Alternative: `pb-28` (112px) for extra breathing room if needed

### Responsive Behavior
- Tailwind's `pb-24` is consistent across breakpoints
- If bottom nav height changes on mobile, may need responsive padding: `pb-20 md:pb-24`
- Current BottomNav uses `py-2` which is consistent across breakpoints

## Testing Strategy

### Manual Testing
1. Navigate to each page (home, music, live-shows, about)
2. Scroll to bottom of each page
3. Verify footer is visible and not obscured by bottom nav
4. Check on mobile, tablet, and desktop viewports
5. Verify social links and copyright text are fully visible

### Visual Regression
1. Compare footer placement across all pages
2. Ensure consistent spacing from content above
3. Verify no overlap with bottom navigation
4. Check scroll behavior on home page sections

## Edge Cases

### Short Content Pages
- Pages with minimal content should still show footer at bottom
- Footer should not float in middle of viewport on short pages
- Solution: The `pb-24` on the wrapper ensures proper spacing regardless of content height

### Long Content Pages
- Footer should appear after all content when scrolling
- Bottom padding ensures footer is accessible
- No changes needed - natural scroll behavior

### Home Page Scroll-Snap
- Home page uses scroll-snap for sections
- Footer should be outside scroll-snap flow (already is with current structure)
- Moving footer to LayoutClient maintains this behavior

## Accessibility

### Keyboard Navigation
- Footer links remain keyboard accessible
- Tab order: page content → footer links → bottom nav (fixed, always accessible)

### Screen Readers
- Footer semantic HTML (`<footer>`) is preserved
- Copyright and social links remain properly labeled
- No changes to accessibility attributes needed

## Performance Impact

- Minimal: Footer is lightweight component
- No additional network requests
- No state management overhead
- Footer renders once per page load (same as before)

## Rollback Plan

If issues arise:
1. Revert LayoutClient changes
2. Re-add footer to individual pages as needed
3. Adjust padding values if spacing is incorrect

## Future Considerations

- If bottom nav height changes, update `pb-24` accordingly
- Consider CSS variable for bottom nav height for easier maintenance
- Could add responsive padding if mobile nav differs in height

## Correctness Properties

### Property 1: Footer Presence
**Property:** Every page in the application must render exactly one footer component
**Validates:** Requirements 1.1

### Property 2: Footer Visibility
**Property:** When scrolled to the bottom of any page, the footer must be fully visible without overlap from the bottom navigation
**Validates:** Requirements 1.2, 1.3

### Property 3: Minimum Clearance
**Property:** The bottom padding of the content wrapper must be at least equal to the height of the bottom navigation bar plus 16px
**Validates:** Requirements 1.2

### Property 4: Footer Accessibility
**Property:** All interactive elements in the footer (links, buttons) must be clickable and not obscured by fixed elements
**Validates:** Requirements 1.3

### Property 5: Consistent Styling
**Property:** Footer component styling and spacing must be identical across all pages
**Validates:** Requirements 1.4

## Implementation Notes

- Import Footer component in LayoutClient
- Wrap children and Footer in a div with bottom padding
- Remove Footer from home page
- Test on all pages and viewports
- Verify no visual regressions
