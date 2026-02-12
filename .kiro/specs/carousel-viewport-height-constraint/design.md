# Carousel Viewport Height Constraint - Design

## Overview
Implement CSS-based height constraints on the image carousel to ensure images fit within the viewport, accounting for section padding, text content, and navigation elements.

## Technical Approach

### Solution: CSS Max-Height with Tailwind Classes

The solution uses Tailwind CSS utility classes to constrain the carousel container height, allowing images to scale proportionally within the available space.

### Key Calculations

For a 100vh section, we need to account for:
- Bottom navigation: 80px (scroll-padding-bottom in globals.css)
- Section padding: 0.5rem (p-2 mobile) / 0.75rem (p-3 desktop)
- Heading + description: ~60px estimated
- Carousel pagination dots: ~40px (must always be visible below images)
- Carousel navigation buttons: Overlaid on images (no height impact)
- Safety margin: ~20px

**Available height for carousel container**: ~65vh on mobile, ~70vh on desktop
**Available height for images**: ~60vh on mobile (leaving room for pagination)

## Implementation Details

### 1. Carousel Wrapper Constraints

**File**: `src/components/carousel/Carousel.tsx`

Add max-height constraint to the main carousel wrapper to ensure the entire carousel (images + pagination) fits:

```typescript
<div className={`relative max-h-[65vh] md:max-h-[70vh] flex flex-col ${className}`} role="region" aria-label={ariaLabel}>
```

**Rationale**: 65vh on mobile provides safe space for all surrounding elements. The flex-col layout ensures pagination sits below the scroll container.

### 2. Image Scroll Container

**File**: `src/components/carousel/Carousel.tsx`

Update the scroll container to grow and fill available space:

```typescript
<div
  ref={containerRef}
  className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto flex-1 min-h-0"
>
```

**Changes**:
- Add `flex-1` - allows container to grow and fill available space
- Add `min-h-0` - allows flex item to shrink below content size

**Rationale**: With the parent using flex-col and max-height, this container will take remaining space after pagination.

### 3. Image Sizing Constraints

**File**: `src/components/carousel/ImageCarousel.tsx`

Update image element with proper sizing constraints:

```typescript
<img
  src={image.src}
  alt={image.alt}
  className="h-full w-full max-w-full rounded-lg object-contain"
/>
```

**Changes**:
- Change `object-cover` to `object-contain` - preserves full image without cropping
- Change to `h-full w-full` - fills the scroll container
- Add `max-w-full` - prevents horizontal overflow
- Remove explicit vh constraint - height is controlled by parent flex container

**Rationale**: The parent flex layout controls the height, so images fill available space while maintaining aspect ratio.

### 4. Pagination Positioning

**File**: `src/components/carousel/Carousel.tsx`

Ensure pagination is always visible below images (no changes needed to CarouselPagination component itself, but verify it's positioned after the scroll container in the DOM):

```typescript
{/* Scroll Container */}
<div ref={containerRef} className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto flex-1 min-h-0">
  {/* images */}
</div>

{/* Navigation Buttons - absolutely positioned, overlaid on images */}
{showNavigation && <CarouselNavigation ... />}

{/* Pagination Dots - in normal flow, below scroll container */}
{showNavigation && <CarouselPagination ... />}
```

**Rationale**: Navigation buttons are absolutely positioned (overlay), pagination is in normal flow (below images).

## Component Changes

### Modified Files

1. **src/components/carousel/Carousel.tsx**
   - Add `max-h-[65vh] md:max-h-[70vh] flex flex-col` to main wrapper
   - Add `flex-1 min-h-0` to scroll container
   - Ensures carousel container respects viewport height and pagination is always visible

2. **src/components/carousel/ImageCarousel.tsx**
   - Change `object-cover` to `object-contain`
   - Change to `h-full w-full max-w-full` for image element
   - Ensures images scale to fit within flex container while maintaining aspect ratio

### Unchanged Files

- `src/components/carousel/ImageLightbox.tsx` - Already has proper constraints (max-h-[90vh])
- `src/components/Section.tsx` - No changes needed
- `src/styles/globals.css` - No changes needed

## CSS Properties Explained

### object-contain vs object-cover

- **object-cover**: Crops image to fill container (current behavior)
- **object-contain**: Scales image to fit within container, showing full image (new behavior)

For a carousel where users want to see the full image, `object-contain` is more appropriate.

### max-height with vh units

Using viewport height (vh) units ensures the constraint adapts to any screen size:
- Mobile portrait: Small vh, tight constraint
- Desktop: Large vh, more generous constraint
- Landscape: Medium vh, balanced constraint

## Testing Strategy

### Unit Tests

**File**: `src/components/carousel/__tests__/ImageCarousel.test.tsx`

Add test to verify image sizing classes:

```typescript
it('should apply proper sizing constraints to images', () => {
  render(<ImageCarousel images={mockImages} />);
  
  const images = screen.getAllByRole('img');
  images.forEach((img) => {
    expect(img).toHaveClass('h-full');
    expect(img).toHaveClass('w-full');
    expect(img).toHaveClass('object-contain');
  });
});
```

**File**: `src/components/carousel/__tests__/Carousel.test.tsx` (if exists, or add to ImageCarousel.test.tsx)

Add test to verify carousel wrapper constraints:

```typescript
it('should apply viewport height constraints to carousel wrapper', () => {
  render(<ImageCarousel images={mockImages} />);
  
  const carousel = screen.getByRole('region');
  expect(carousel).toHaveClass('max-h-[65vh]');
  expect(carousel).toHaveClass('flex-col');
});
```

### E2E Tests

**File**: `e2e/tests/carousel-viewport.spec.ts` (new file)

Test viewport constraints and pagination visibility across devices:

```typescript
test('carousel fits within viewport with pagination visible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await page.goto('/#shows');
  
  const carousel = page.locator('[aria-label="Previous shows gallery"]');
  const carouselBox = await carousel.boundingBox();
  
  // Carousel should fit within viewport
  expect(carouselBox.height).toBeLessThan(667 * 0.70);
  
  // Pagination should be visible
  const pagination = carousel.locator('[role="tablist"]');
  await expect(pagination).toBeVisible();
});
```

### Manual Testing Checklist

- [ ] Mobile portrait (375x667) - iPhone SE
  - [ ] Pagination dots visible below images
  - [ ] No vertical scrolling within section
- [ ] Mobile landscape (667x375) - iPhone SE rotated
  - [ ] Pagination dots visible below images
  - [ ] Images constrained appropriately
- [ ] Tablet portrait (768x1024) - iPad
  - [ ] Pagination dots visible below images
- [ ] Desktop (1920x1080) - Standard monitor
  - [ ] Pagination dots visible below images
- [ ] Verify images maintain aspect ratio
- [ ] Verify lightbox still shows full-size images
- [ ] Verify navigation buttons overlay on images correctly

## Correctness Properties

### Property 1: Carousel Height Constraint
**Validates: Requirements 1.1, 1.3**

For all viewport sizes, the carousel container height (including pagination) must not exceed 70vh:

```typescript
∀ viewport ∈ Viewports:
  carouselHeight(viewport) + paginationHeight ≤ 0.70 × viewport.height
```

### Property 2: Pagination Visibility
**Validates: Requirements 1.1**

For all carousel instances with multiple images, pagination must be visible:

```typescript
∀ carousel ∈ Carousels where carousel.images.length > 1:
  isVisible(carousel.pagination) = true
```

### Property 2: Image Aspect Ratio Preservation
**Validates: Requirements 1.2**

For all images, the displayed aspect ratio must match the natural aspect ratio:

```typescript
∀ image ∈ CarouselImages:
  displayedAspectRatio(image) = naturalAspectRatio(image)
```

### Property 3: No Viewport Overflow
**Validates: Requirements 1.3, 1.4**

For all sections containing carousels, the section height must equal viewport height:

```typescript
∀ section ∈ SectionsWithCarousel:
  section.scrollHeight ≤ viewport.height
```

### Property 4: Lightbox Independence
**Validates: Requirements 1.5**

Lightbox image constraints must remain unchanged:

```typescript
∀ lightboxImage ∈ LightboxImages:
  maxHeight(lightboxImage) = 0.90 × viewport.height
```

## Accessibility Considerations

### Maintained Features
- Alt text remains on all images
- Keyboard navigation continues to work
- Focus indicators remain visible
- ARIA labels unchanged

### Potential Improvements
- Consider adding aria-label describing image size constraints
- Ensure focus remains visible when images are smaller

## Performance Impact

### Positive
- Pure CSS solution - no JavaScript calculations
- No layout thrashing or reflows
- Hardware-accelerated rendering

### Neutral
- No impact on bundle size
- No impact on runtime performance

## Browser Compatibility

### Supported Properties
- `max-height` with vh units: All modern browsers
- `object-contain`: All modern browsers (IE11+ with prefix)
- Tailwind responsive classes: All modern browsers

### Fallback
No fallback needed - all properties are widely supported.

## Migration Notes

### Breaking Changes
None - this is a visual enhancement.

### Visual Changes
- Images will show full content instead of being cropped
- Some images may appear smaller if they have extreme aspect ratios
- Letterboxing may occur for very wide images

### User Impact
Positive - users can see full images without scrolling.

## Future Enhancements

### Potential Improvements
1. Dynamic height calculation based on actual content height
2. Different constraints for portrait vs landscape images
3. Zoom controls for images that are constrained
4. Configurable max-height via props

### Out of Scope
- Changing carousel navigation behavior
- Modifying lightbox functionality
- Altering section snap behavior
