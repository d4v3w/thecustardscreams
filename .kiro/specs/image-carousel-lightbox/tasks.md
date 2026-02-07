# Implementation Plan: Image Carousel with Lightbox

## Overview

This implementation plan breaks down the image carousel with lightbox feature into incremental, testable steps. The approach follows a bottom-up strategy: building core hooks first, then composing them into UI components, and finally integrating with the Shows component. Each step includes property-based tests to validate correctness properties from the design document.

## Tasks

- [x] 1. Set up component structure and TypeScript types
  - Create `src/components/carousel/` directory
  - Create `types.ts` with all TypeScript interfaces (CarouselImage, CarouselProps, ImageCarouselProps, ImageLightboxProps, UseCarouselReturn, UseLightboxReturn)
  - Create barrel export `index.ts` for clean imports
  - Add custom Tailwind CSS class for scrollbar hiding in global styles
  - _Requirements: 1.1, 1.2, 9.1, 9.2, 9.3, 9.4_

- [ ] 2. Implement useCarousel hook
  - [x] 2.1 Create `useCarousel.ts` hook with state management
    - Implement currentIndex state
    - Implement containerRef for scroll container
    - Implement scrollToIndex, scrollToNext, scrollToPrevious functions
    - Calculate canScrollPrevious and canScrollNext
    - Handle edge cases (empty array, single item, boundaries)
    - _Requirements: 2.3, 2.4, 10.3, 10.4, 10.5_
  
  - [ ]* 2.2 Write property test for navigation bounds
    - **Property 1: Carousel navigation bounds**
    - **Validates: Requirements 2.3, 2.4, 10.3**
  
  - [ ]* 2.3 Write unit tests for useCarousel hook
    - Test initialization with different array lengths
    - Test navigation at boundaries
    - Test edge cases (empty, single item)
    - _Requirements: 2.3, 2.4, 10.3_

- [ ] 3. Implement useLightbox hook
  - [x] 3.1 Create `useLightbox.ts` hook with modal state management
    - Implement isOpen and selectedImage state
    - Implement dialogRef for dialog element
    - Implement openLightbox and closeLightbox functions
    - Implement focus management (store and restore previous focus)
    - _Requirements: 5.1, 5.5, 6.5, 6.6_
  
  - [ ]* 3.2 Write property test for focus restoration
    - **Property 8: Lightbox focus management**
    - **Validates: Requirements 5.5, 6.5, 6.6**
  
  - [ ]* 3.3 Write unit tests for useLightbox hook
    - Test open/close state transitions
    - Test focus restoration
    - Test with null/undefined edge cases
    - _Requirements: 5.1, 5.5, 6.6_

- [ ] 4. Implement useKeyboardNavigation hook
  - [x] 4.1 Create `useKeyboardNavigation.ts` hook
    - Accept callbacks for left, right, and escape actions
    - Add/remove keyboard event listeners in useEffect
    - Handle ArrowLeft, ArrowRight, Escape keys
    - Prevent default behavior for handled keys
    - _Requirements: 2.6, 6.7_
  
  - [ ]* 4.2 Write property test for keyboard navigation
    - **Property 6: Keyboard navigation consistency**
    - **Validates: Requirements 2.6, 6.7**

- [ ] 5. Checkpoint - Ensure all hook tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement CarouselNavigation component
  - [x] 6.1 Create `CarouselNavigation.tsx` component
    - Accept onPrevious, onNext, canScrollPrevious, canScrollNext props
    - Render left/right navigation buttons with absolute positioning
    - Add aria-labels for accessibility
    - Style with Tailwind (bg-black/50, rounded-full, min 44x44px touch target)
    - Disable buttons at boundaries
    - _Requirements: 2.3, 2.4, 6.3, 7.5_
  
  - [ ]* 6.2 Write unit tests for CarouselNavigation
    - Test button rendering
    - Test disabled states
    - Test click handlers
    - Test ARIA labels
    - _Requirements: 2.3, 6.3_

- [ ] 7. Implement CarouselPagination component
  - [x] 7.1 Create `CarouselPagination.tsx` component
    - Accept totalItems, currentIndex, onDotClick props
    - Render pagination dots with role="tablist" and role="tab"
    - Add aria-labels with position information ("Go to image X of Y")
    - Add aria-current for active dot
    - Style active/inactive states (amber-400 vs gray-400)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.4_
  
  - [ ]* 7.2 Write property test for pagination dot count
    - **Property 2: Pagination dot count matches item count**
    - **Validates: Requirements 3.2**
  
  - [ ]* 7.3 Write property test for active dot
    - **Property 3: Active pagination dot matches current index**
    - **Validates: Requirements 3.3**
  
  - [ ]* 7.4 Write property test for dot click navigation
    - **Property 4: Pagination dot navigation**
    - **Validates: Requirements 3.4**
  
  - [ ]* 7.5 Write unit tests for CarouselPagination
    - Test dot rendering
    - Test active state styling
    - Test click handlers
    - Test ARIA attributes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.4_

- [ ] 8. Implement ImageLightbox component
  - [x] 8.1 Create `ImageLightbox.tsx` component
    - Accept image, isOpen, onClose props
    - Use native <dialog> element with ref
    - Implement backdrop click to close (check event.target === event.currentTarget)
    - Render close button with aria-label
    - Style with backdrop:bg-black/80 and max-h-[90vh] for image
    - Use useEffect to call showModal/close based on isOpen prop
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [ ]* 8.2 Write property test for ESC key closure
    - **Property 9: Lightbox ESC key closure**
    - **Validates: Requirements 5.5, 6.7**
  
  - [ ]* 8.3 Write property test for backdrop click closure
    - **Property 10: Click outside closes lightbox**
    - **Validates: Requirements 5.6**
  
  - [ ]* 8.4 Write property test for focus trap
    - **Property 11: Focus trap in lightbox**
    - **Validates: Requirements 5.8**
  
  - [ ]* 8.5 Write unit tests for ImageLightbox
    - Test dialog open/close
    - Test close button click
    - Test image rendering
    - Test with null image
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7_

- [ ] 9. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement generic Carousel component
  - [x] 10.1 Create `Carousel.tsx` generic component
    - Accept generic type parameter T for items
    - Accept items, renderItem, onItemClick, className, ariaLabel props
    - Use useCarousel hook for navigation logic
    - Use useKeyboardNavigation hook for keyboard support
    - Render scroll container with flex, overflow-x-auto, snap-x, snap-mandatory, scrollbar-hide
    - Render items with flex-shrink-0, w-full, snap-center
    - Conditionally render CarouselNavigation (only if items.length > 1)
    - Conditionally render CarouselPagination (only if items.length > 1)
    - Handle empty array with empty state message
    - Add role="region" and aria-label to container
    - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 4.1, 6.1, 6.2, 6.9, 10.4, 10.5_
  
  - [ ]* 10.2 Write property test for image data preservation
    - **Property 5: Image data preservation**
    - **Validates: Requirements 1.4, 6.8, 8.3**
  
  - [ ]* 10.3 Write property test for ARIA labels
    - **Property 12: ARIA label presence**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
  
  - [ ]* 10.4 Write property test for logical tab order
    - **Property 13: Logical tab order**
    - **Validates: Requirements 6.10**
  
  - [ ]* 10.5 Write property test for empty state
    - **Property 15: Empty state handling**
    - **Validates: Requirements 10.4**
  
  - [ ]* 10.6 Write property test for single image
    - **Property 16: Single image navigation hiding**
    - **Validates: Requirements 10.5**
  
  - [ ]* 10.7 Write property test for error-free rendering
    - **Property 17: Error-free rendering**
    - **Validates: Requirements 10.2**

- [ ] 11. Implement ImageCarousel component
  - [x] 11.1 Create `ImageCarousel.tsx` specialized component
    - Accept images, className, ariaLabel props (ImageCarouselProps)
    - Use useLightbox hook
    - Render generic Carousel with images
    - Provide renderItem function that wraps images in clickable buttons
    - Add focus styles (focus:ring-2 focus:ring-amber-400)
    - Call openLightbox on image click
    - Render ImageLightbox component
    - _Requirements: 1.1, 1.3, 5.1, 6.1_
  
  - [ ]* 11.2 Write property test for lightbox image click
    - **Property 7: Lightbox image click opens with correct image**
    - **Validates: Requirements 5.1, 5.3**
  
  - [ ]* 11.3 Write property test for responsive sizing
    - **Property 14: Responsive image sizing**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.6**
  
  - [ ]* 11.4 Write integration tests for ImageCarousel
    - Test full user flow: render → navigate → click image → lightbox opens → close
    - Test keyboard navigation through carousel
    - Test responsive behavior at different breakpoints
    - _Requirements: 1.1, 2.4, 2.6, 5.1, 5.5, 7.1, 7.2, 7.3_

- [ ] 12. Checkpoint - Ensure all carousel tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Update Shows component to use ImageCarousel
  - [x] 13.1 Modify `src/components/Shows.tsx`
    - Import ImageCarousel and CarouselImage type
    - Define images array with existing three images and proper typing
    - Remove masonry grid layout (columns-1 sm:columns-2 lg:columns-3)
    - Replace img elements with ImageCarousel component
    - Pass images array to ImageCarousel
    - Add ariaLabel="Previous shows gallery"
    - Maintain existing styling context (p-2 md:p-3, mt-3)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 13.2 Write integration test for Shows component
    - Test Shows renders ImageCarousel
    - Test correct image data is passed
    - Test all three images have correct alt text
    - Test masonry grid classes are removed
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 14. Add scrollbar hiding CSS
  - [x] 14.1 Add custom CSS to global styles or Tailwind config
    - Add .scrollbar-hide class with WebKit, Firefox, and IE/Edge scrollbar hiding
    - Ensure scrollbar is hidden but scroll functionality remains
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 15. Final checkpoint - End-to-end testing
  - [x] 15.1 Manual testing checklist
    - Test on mobile viewport (320px)
    - Test on tablet viewport (768px)
    - Test on desktop viewport (1024px+)
    - Test keyboard navigation (Tab, Arrow keys, Enter, ESC)
    - Test touch gestures on mobile (if available)
    - Verify scrollbar hiding across browsers
    - Verify snap scroll behavior
    - Verify lightbox backdrop styling
    - Verify all ARIA labels with screen reader (if available)
    - _Requirements: 2.5, 4.1, 6.1, 6.2, 6.3, 6.4, 6.7, 7.1, 7.2, 7.3_
  
  - [x] 15.2 Run all tests and verify no errors
    - Run `pnpm test` to execute all unit and property tests
    - Verify no TypeScript compilation errors
    - Verify no React warnings in console
    - _Requirements: 10.1, 10.2_

- [x] 16. Final integration verification
  - Ensure all tests pass, verify the carousel works correctly in the Shows section, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each property test should run minimum 100 iterations using fast-check
- Property tests should be tagged with: `Feature: image-carousel-lightbox, Property {N}: {description}`
- The implementation follows a bottom-up approach: hooks → components → integration
- Checkpoints ensure incremental validation and early error detection
- All TypeScript types are defined upfront to enable type-safe development
- The generic Carousel component enables future reuse with different content types
