# Carousel Viewport Height Constraint - Tasks

## Implementation Tasks

### 1. Update Carousel Component Layout
**File**: `src/components/carousel/Carousel.tsx`

- [ ] 1.1 Add flex column layout and max-height constraint to main wrapper
  - Add `max-h-[65vh] md:max-h-[70vh] flex flex-col` classes to the main div
  - Ensures entire carousel (images + pagination) fits within viewport

- [ ] 1.2 Update scroll container to use flex-1
  - Add `flex-1 min-h-0` classes to the scroll container div
  - Allows container to fill available space above pagination

### 2. Update Image Sizing in ImageCarousel
**File**: `src/components/carousel/ImageCarousel.tsx`

- [ ] 2.1 Change image object-fit from cover to contain
  - Change `object-cover` to `object-contain`
  - Ensures full image is visible without cropping

- [ ] 2.2 Update image sizing classes
  - Change from `h-auto w-full` to `h-full w-full max-w-full`
  - Allows images to fill flex container while maintaining aspect ratio

### 3. Add Unit Tests
**File**: `src/components/carousel/__tests__/ImageCarousel.test.tsx`

- [ ] 3.1 Add test for image sizing constraints
  - Verify images have `h-full`, `w-full`, and `object-contain` classes
  - Ensures images scale properly within container

- [ ] 3.2 Add test for carousel wrapper constraints
  - Verify carousel wrapper has `max-h-[65vh]` and `flex-col` classes
  - Ensures carousel respects viewport height

### 4. Add E2E Tests
**File**: `e2e/tests/carousel-viewport.spec.ts` (new file)

- [ ] 4.1 Create E2E test file for carousel viewport constraints
  - Test carousel fits within viewport on mobile
  - Test pagination is visible below images
  - Test across multiple viewport sizes

### 5. Manual Testing
- [ ] 5.1 Test on mobile portrait (375x667)
  - Verify pagination dots visible below images
  - Verify no vertical scrolling within section

- [ ] 5.2 Test on mobile landscape (667x375)
  - Verify pagination dots visible below images
  - Verify images constrained appropriately

- [ ] 5.3 Test on tablet (768x1024)
  - Verify pagination dots visible below images

- [ ] 5.4 Test on desktop (1920x1080)
  - Verify pagination dots visible below images

- [ ] 5.5 Verify lightbox functionality unchanged
  - Lightbox should still show full-size images at max-h-[90vh]

## Testing Notes

- Run unit tests: `pnpm test`
- Run E2E tests: `pnpm test:e2e`
- Start dev server for manual testing: `pnpm dev`

## Acceptance Criteria Validation

- [ ] Carousel container height does not exceed 70vh on any device
- [ ] Pagination dots are always visible below images
- [ ] Images maintain aspect ratio without cropping
- [ ] No vertical scrolling required within sections
- [ ] Lightbox functionality remains unchanged
