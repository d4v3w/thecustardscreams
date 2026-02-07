# Design Document: Image Carousel with Lightbox

## Overview

This design specifies a reusable, accessible image carousel component with lightbox functionality for React 19 and TypeScript. The solution follows a separation of concerns architecture with three main layers:

1. **Business Logic Layer**: Custom hooks managing carousel state and navigation
2. **Presentation Layer**: Reusable UI components (Carousel, Lightbox)
3. **Integration Layer**: Shows component integration with existing image data

The design prioritizes type safety, accessibility, performance, and mobile-first responsive design using Tailwind CSS.

## Architecture

### Component Hierarchy

```
Shows (Integration)
  └── Carousel (Container)
      ├── CarouselViewport (Scroll Container)
      │   └── CarouselItem[] (Image Wrappers)
      ├── CarouselNavigation (Buttons)
      └── CarouselPagination (Dots)
  └── ImageLightbox (Modal)
      └── <dialog> (Native Element)
```

### Separation of Concerns

**Custom Hooks (Logic)**:
- `useCarousel`: Manages carousel state, navigation, and scroll behavior
- `useLightbox`: Manages modal open/close state and focus management
- `useKeyboardNavigation`: Handles keyboard event listeners for accessibility

**UI Components (Presentation)**:
- `Carousel<T>`: Generic carousel container accepting any item type
- `ImageLightbox`: Modal component for full-screen image display
- `CarouselNavigation`: Left/right navigation buttons
- `CarouselPagination`: Pagination dots indicator

**Integration**:
- `Shows`: Existing component updated to use Carousel with image data

## Components and Interfaces

### Type Definitions

```typescript
// Core image interface
interface CarouselImage {
  src: string;
  alt: string;
  id?: string;
  caption?: string;
}

// Generic carousel props
interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  className?: string;
  ariaLabel?: string;
}

// Image-specific carousel props
interface ImageCarouselProps {
  images: CarouselImage[];
  className?: string;
  ariaLabel?: string;
}

// Lightbox props
interface ImageLightboxProps {
  image: CarouselImage | null;
  isOpen: boolean;
  onClose: () => void;
}

// Hook return types
interface UseCarouselReturn {
  currentIndex: number;
  scrollToIndex: (index: number) => void;
  scrollToNext: () => void;
  scrollToPrevious: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
}

interface UseLightboxReturn {
  isOpen: boolean;
  selectedImage: CarouselImage | null;
  openLightbox: (image: CarouselImage) => void;
  closeLightbox: () => void;
  dialogRef: React.RefObject<HTMLDialogElement>;
}
```

### Component: `useCarousel` Hook

**Purpose**: Manages carousel navigation state and scroll behavior

**Implementation Details**:
- Maintains `currentIndex` state for active slide
- Provides `scrollToIndex`, `scrollToNext`, `scrollToPrevious` functions
- Uses `useRef` for scroll container reference
- Implements smooth scroll with `scrollIntoView` or `scrollTo`
- Uses `IntersectionObserver` to detect which image is currently visible
- Calculates `canScrollPrevious` and `canScrollNext` based on current index
- Handles edge cases (empty array, single item)

**State Management**:
```typescript
const [currentIndex, setCurrentIndex] = useState(0);
const containerRef = useRef<HTMLDivElement>(null);
```

**Scroll Logic**:
- Use `scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })`
- Alternative: Calculate scroll position and use `scrollTo({ left: position, behavior: 'smooth' })`
- Update `currentIndex` when scroll completes using IntersectionObserver

### Component: `useLightbox` Hook

**Purpose**: Manages lightbox modal state and focus management

**Implementation Details**:
- Maintains `isOpen` boolean state
- Maintains `selectedImage` state for currently displayed image
- Provides `openLightbox(image)` and `closeLightbox()` functions
- Uses `useRef` for dialog element reference
- Calls `dialogRef.current.showModal()` to open
- Calls `dialogRef.current.close()` to close
- Stores previously focused element before opening
- Restores focus to stored element after closing
- Handles ESC key automatically via native dialog behavior

**Focus Management**:
```typescript
const previousFocusRef = useRef<HTMLElement | null>(null);

const openLightbox = (image: CarouselImage) => {
  previousFocusRef.current = document.activeElement as HTMLElement;
  setSelectedImage(image);
  setIsOpen(true);
  dialogRef.current?.showModal();
};

const closeLightbox = () => {
  dialogRef.current?.close();
  setIsOpen(false);
  setSelectedImage(null);
  previousFocusRef.current?.focus();
};
```

### Component: `useKeyboardNavigation` Hook

**Purpose**: Handles keyboard events for carousel navigation

**Implementation Details**:
- Accepts callbacks for left, right, and escape actions
- Uses `useEffect` to add/remove event listeners
- Listens for `ArrowLeft`, `ArrowRight`, `Escape` keys
- Only active when carousel is focused or descendant is focused
- Prevents default behavior for handled keys

**Event Handler**:
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    onPrevious();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    onNext();
  } else if (event.key === 'Escape') {
    onEscape?.();
  }
};
```

### Component: `Carousel<T>`

**Purpose**: Generic, reusable carousel container

**Props**:
- `items: T[]` - Array of items to display
- `renderItem: (item: T, index: number) => ReactNode` - Render function for each item
- `onItemClick?: (item: T, index: number) => void` - Click handler for items
- `className?: string` - Additional CSS classes
- `ariaLabel?: string` - Accessibility label for carousel

**Structure**:
```tsx
<div className="relative" role="region" aria-label={ariaLabel}>
  {/* Scroll Container */}
  <div 
    ref={containerRef}
    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
  >
    {items.map((item, index) => (
      <div key={index} className="flex-shrink-0 w-full snap-center">
        {renderItem(item, index)}
      </div>
    ))}
  </div>
  
  {/* Navigation Buttons */}
  <CarouselNavigation 
    onPrevious={scrollToPrevious}
    onNext={scrollToNext}
    canScrollPrevious={canScrollPrevious}
    canScrollNext={canScrollNext}
  />
  
  {/* Pagination Dots */}
  <CarouselPagination
    totalItems={items.length}
    currentIndex={currentIndex}
    onDotClick={scrollToIndex}
  />
</div>
```

**Styling**:
- Container: `relative` for absolute positioning of navigation
- Scroll container: `flex overflow-x-auto snap-x snap-mandatory`
- Items: `flex-shrink-0 w-full snap-center`
- Hide scrollbar: Custom CSS class `scrollbar-hide`

### Component: `CarouselNavigation`

**Purpose**: Left/right navigation buttons

**Props**:
- `onPrevious: () => void`
- `onNext: () => void`
- `canScrollPrevious: boolean`
- `canScrollNext: boolean`

**Structure**:
```tsx
<>
  <button
    onClick={onPrevious}
    disabled={!canScrollPrevious}
    aria-label="Previous image"
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full disabled:opacity-30"
  >
    ←
  </button>
  <button
    onClick={onNext}
    disabled={!canScrollNext}
    aria-label="Next image"
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full disabled:opacity-30"
  >
    →
  </button>
</>
```

**Accessibility**:
- `aria-label` for screen readers
- `disabled` state when at boundaries
- Minimum 44x44px touch target
- Visible focus indicators

### Component: `CarouselPagination`

**Purpose**: Pagination dots indicator

**Props**:
- `totalItems: number`
- `currentIndex: number`
- `onDotClick: (index: number) => void`

**Structure**:
```tsx
<div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Carousel pagination">
  {Array.from({ length: totalItems }).map((_, index) => (
    <button
      key={index}
      onClick={() => onDotClick(index)}
      aria-label={`Go to image ${index + 1} of ${totalItems}`}
      aria-current={index === currentIndex ? 'true' : 'false'}
      role="tab"
      className={`w-3 h-3 rounded-full transition-colors ${
        index === currentIndex 
          ? 'bg-amber-400' 
          : 'bg-gray-400 hover:bg-gray-300'
      }`}
    />
  ))}
</div>
```

**Accessibility**:
- `role="tablist"` and `role="tab"` for semantic structure
- `aria-label` with position information
- `aria-current` for active dot
- Keyboard navigable

### Component: `ImageLightbox`

**Purpose**: Full-screen modal for image display

**Props**:
- `image: CarouselImage | null`
- `isOpen: boolean`
- `onClose: () => void`

**Structure**:
```tsx
<dialog
  ref={dialogRef}
  className="backdrop:bg-black/80 bg-transparent p-0 max-w-full max-h-full"
  onClose={onClose}
  onClick={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}
>
  <div className="relative flex items-center justify-center min-h-screen p-4">
    <button
      onClick={onClose}
      aria-label="Close lightbox"
      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full z-10"
    >
      ✕
    </button>
    {image && (
      <img
        src={image.src}
        alt={image.alt}
        className="max-w-full max-h-[90vh] object-contain"
      />
    )}
  </div>
</dialog>
```

**Behavior**:
- Native `<dialog>` element provides:
  - Automatic ESC key handling
  - Focus trapping
  - Backdrop styling via `::backdrop` pseudo-element
- Click on backdrop (dialog element itself) closes modal
- Close button for explicit dismissal
- Image sized to fit viewport with `max-h-[90vh]` and `object-contain`

**Accessibility**:
- Native dialog provides focus trap
- Close button with `aria-label`
- ESC key handled automatically
- Focus restored on close via `useLightbox` hook

### Component: `ImageCarousel`

**Purpose**: Specialized carousel for images (composition of generic Carousel)

**Implementation**:
```tsx
export function ImageCarousel({ images, className, ariaLabel }: ImageCarouselProps) {
  const { isOpen, selectedImage, openLightbox, closeLightbox } = useLightbox();
  
  return (
    <>
      <Carousel
        items={images}
        renderItem={(image) => (
          <button
            onClick={() => openLightbox(image)}
            className="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-auto rounded-lg object-cover"
            />
          </button>
        )}
        className={className}
        ariaLabel={ariaLabel || "Image carousel"}
      />
      <ImageLightbox
        image={selectedImage}
        isOpen={isOpen}
        onClose={closeLightbox}
      />
    </>
  );
}
```

### Integration: Updated `Shows` Component

**Changes**:
- Remove masonry grid layout
- Import `ImageCarousel` component
- Define image data array with proper typing
- Pass images to carousel

**Implementation**:
```tsx
const Shows = () => {
  const images: CarouselImage[] = [
    {
      src: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jhiX7K9CW63sKRVJPxiQH09w81nhzYZI5bMg",
      alt: "The Custard Screams at Freaks and Geeks - Stratford, London, November 21st 2025",
      id: "show-1"
    },
    {
      src: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM",
      alt: "The Custard Screams at Freaks and Geeks - Stratford, London, May 31st 2025",
      id: "show-2"
    },
    {
      src: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX11TVvcM2zyFK0ROkwl3WSGv8XHuon7LfdbVrj",
      alt: "The Custard Screams Skull Logo",
      id: "show-3"
    }
  ];

  return (
    <article className="p-2 md:p-3">
      <h2 className="text-xl font-bold text-amber-400">Previous shows</h2>
      <p>The Custard Screams previous shows</p>
      <ImageCarousel 
        images={images}
        ariaLabel="Previous shows gallery"
        className="mt-3"
      />
    </article>
  );
};
```

## Data Models

### CarouselImage Interface

```typescript
interface CarouselImage {
  src: string;        // Required: Image URL
  alt: string;        // Required: Accessibility text
  id?: string;        // Optional: Unique identifier
  caption?: string;   // Optional: Image caption for future use
}
```

**Validation**:
- `src` must be non-empty string
- `alt` must be non-empty string (accessibility requirement)
- `id` should be unique if provided

### Carousel State

```typescript
interface CarouselState {
  currentIndex: number;      // Currently visible slide (0-based)
  totalItems: number;        // Total number of items
  canScrollPrevious: boolean; // Whether previous navigation is available
  canScrollNext: boolean;     // Whether next navigation is available
}
```

### Lightbox State

```typescript
interface LightboxState {
  isOpen: boolean;                    // Whether modal is currently open
  selectedImage: CarouselImage | null; // Currently displayed image
  previousFocus: HTMLElement | null;   // Element to restore focus to
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Carousel navigation bounds

*For any* carousel with N images and any sequence of navigation actions (button clicks, keyboard presses), the current index should always remain between 0 and N-1 (inclusive).

**Validates: Requirements 2.3, 2.4, 10.3**

### Property 2: Pagination dot count matches item count

*For any* carousel with N items, the pagination component should render exactly N dots.

**Validates: Requirements 3.2**

### Property 3: Active pagination dot matches current index

*For any* carousel state, exactly one pagination dot should be marked as active (aria-current="true"), and it should correspond to the current index.

**Validates: Requirements 3.3**

### Property 4: Pagination dot navigation

*For any* pagination dot at index N, clicking that dot should navigate the carousel to display image N.

**Validates: Requirements 3.4**

### Property 5: Image data preservation

*For any* array of images passed to the carousel, all images should be rendered in the DOM with their original src and alt attributes unchanged.

**Validates: Requirements 1.4, 6.8, 8.3**

### Property 6: Keyboard navigation consistency

*For any* carousel state with focus on the carousel, pressing the right arrow key should move to the next image (if not at the end), and pressing the left arrow key should move to the previous image (if not at the start).

**Validates: Requirements 2.6, 6.7**

### Property 7: Lightbox image click opens with correct image

*For any* image in the carousel, clicking that image should open the lightbox displaying the same image (matching src and alt).

**Validates: Requirements 5.1, 5.3**

### Property 8: Lightbox focus management

*For any* sequence of opening and closing the lightbox, focus should move to the dialog element when opened, and return to the previously focused element when closed.

**Validates: Requirements 5.5, 6.5, 6.6**

### Property 9: Lightbox ESC key closure

*For any* open lightbox, pressing the ESC key should close the lightbox and restore focus to the previously focused element.

**Validates: Requirements 5.5, 6.7**

### Property 10: Click outside closes lightbox

*For any* open lightbox, clicking on the backdrop (the dialog element itself, not its children) should close the lightbox.

**Validates: Requirements 5.6**

### Property 11: Focus trap in lightbox

*For any* open lightbox, repeatedly pressing Tab should cycle focus only among focusable elements within the dialog (close button and dialog itself), never escaping to the page behind.

**Validates: Requirements 5.8**

### Property 12: ARIA label presence

*For all* interactive carousel elements (navigation buttons, pagination dots, carousel container), appropriate ARIA labels (aria-label or aria-labelledby) should be present and non-empty.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 13: Logical tab order

*For any* carousel, pressing Tab should move focus through elements in a logical order: carousel container → previous button → next button → pagination dots (in order) → images (in order).

**Validates: Requirements 6.10**

### Property 14: Responsive image sizing

*For any* viewport width and any image aspect ratio, carousel images should scale to fit the container without distortion (maintaining aspect ratio) or causing horizontal overflow.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.6**

### Property 15: Empty state handling

*For any* carousel receiving an empty array of images, the component should render without errors, display an appropriate empty state message, and hide navigation controls.

**Validates: Requirements 10.4**

### Property 16: Single image navigation hiding

*For any* carousel with exactly one image, navigation buttons and pagination dots should be hidden or disabled, but the image should still be clickable to open the lightbox.

**Validates: Requirements 10.5**

### Property 17: Error-free rendering

*For any* valid array of images (non-empty, with required src and alt properties), the carousel should render without throwing React errors or logging console warnings.

**Validates: Requirements 10.2**

## Error Handling

### Empty Image Array

**Scenario**: Carousel receives an empty array of images

**Handling**:
- Render empty state message: "No images to display"
- Hide navigation buttons and pagination dots
- Maintain proper ARIA labels for accessibility
- No errors or warnings in console

**Implementation**:
```typescript
if (items.length === 0) {
  return (
    <div className="text-center p-8 text-gray-500" role="status">
      No images to display
    </div>
  );
}
```

### Single Image

**Scenario**: Carousel receives exactly one image

**Handling**:
- Display the single image
- Hide navigation buttons (no navigation possible)
- Hide pagination dots (only one item)
- Lightbox functionality still works

**Implementation**:
```typescript
const showNavigation = items.length > 1;
const showPagination = items.length > 1;
```

### Invalid Image Data

**Scenario**: Image object missing required properties (src or alt)

**Handling**:
- TypeScript prevents this at compile time
- Runtime validation in development mode
- Fallback alt text if missing: "Image"
- Console warning in development

**Implementation**:
```typescript
const validateImage = (image: CarouselImage): boolean => {
  if (!image.src || !image.alt) {
    console.warn('Invalid image data:', image);
    return false;
  }
  return true;
};
```

### Image Load Failure

**Scenario**: Image URL fails to load

**Handling**:
- Browser handles with broken image icon
- Alt text displayed by browser
- Carousel continues to function
- Consider adding `onError` handler for custom fallback

**Future Enhancement**:
```typescript
<img
  src={image.src}
  alt={image.alt}
  onError={(e) => {
    e.currentTarget.src = '/fallback-image.png';
  }}
/>
```

### Dialog Not Supported

**Scenario**: Browser doesn't support `<dialog>` element

**Handling**:
- Use dialog polyfill or fallback to div-based modal
- Check for dialog support: `'showModal' in document.createElement('dialog')`
- Modern browsers (2022+) all support dialog
- For this project, assume modern browser support

### Focus Management Failure

**Scenario**: Previously focused element no longer exists when lightbox closes

**Handling**:
- Check if element still exists before focusing
- Fallback to focusing carousel container
- Prevent focus errors

**Implementation**:
```typescript
const closeLightbox = () => {
  dialogRef.current?.close();
  setIsOpen(false);
  setSelectedImage(null);
  
  if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
    previousFocusRef.current.focus();
  } else {
    // Fallback: focus carousel container
    containerRef.current?.focus();
  }
};
```

### Scroll Container Not Found

**Scenario**: Ref to scroll container is null when navigation is triggered

**Handling**:
- Check ref exists before calling scroll methods
- Early return if ref is null
- Log warning in development

**Implementation**:
```typescript
const scrollToIndex = (index: number) => {
  if (!containerRef.current) {
    console.warn('Carousel container ref not found');
    return;
  }
  // Proceed with scroll
};
```

## Testing Strategy

### Dual Testing Approach

This feature requires both **unit tests** and **property-based tests** for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and integration points
- **Property tests**: Verify universal properties across randomized inputs

### Property-Based Testing

**Library**: fast-check (already in package.json)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: image-carousel-lightbox, Property {N}: {description}`

**Test Organization**:
```
src/
  components/
    carousel/
      __tests__/
        Carousel.test.tsx          # Unit tests
        Carousel.properties.test.tsx # Property tests
        useCarousel.test.tsx       # Hook unit tests
        useLightbox.test.tsx       # Hook unit tests
      Carousel.tsx
      ImageCarousel.tsx
      CarouselNavigation.tsx
      CarouselPagination.tsx
      ImageLightbox.tsx
      useCarousel.ts
      useLightbox.ts
      useKeyboardNavigation.ts
      types.ts
```

### Property Test Examples

**Property 1: Navigation Bounds**
```typescript
// Feature: image-carousel-lightbox, Property 1: Carousel navigation bounds
it('should keep current index within valid bounds', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({ src: fc.webUrl(), alt: fc.string() }), { minLength: 1, maxLength: 20 }),
      (images) => {
        const { result } = renderHook(() => useCarousel(images.length));
        
        // Navigate randomly
        act(() => {
          const randomNav = Math.random();
          if (randomNav < 0.5) result.current.scrollToNext();
          else result.current.scrollToPrevious();
        });
        
        // Index should always be valid
        expect(result.current.currentIndex).toBeGreaterThanOrEqual(0);
        expect(result.current.currentIndex).toBeLessThan(images.length);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property 5: Image Data Preservation**
```typescript
// Feature: image-carousel-lightbox, Property 5: Image data preservation
it('should preserve all image src and alt attributes', () => {
  fc.assert(
    fc.property(
      fc.array(
        fc.record({
          src: fc.webUrl(),
          alt: fc.string({ minLength: 1 })
        }),
        { minLength: 1, maxLength: 10 }
      ),
      (images) => {
        const { container } = render(<ImageCarousel images={images} />);
        const renderedImages = container.querySelectorAll('img');
        
        expect(renderedImages.length).toBe(images.length);
        
        images.forEach((image, index) => {
          expect(renderedImages[index].src).toBe(image.src);
          expect(renderedImages[index].alt).toBe(image.alt);
        });
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Test Coverage

**Component Tests**:
- Carousel renders with provided images
- Navigation buttons trigger scroll
- Pagination dots render correctly
- Clicking pagination dot navigates to correct image
- Lightbox opens when image is clicked
- Lightbox closes on ESC, backdrop click, and close button
- Empty state renders for empty array
- Single image hides navigation

**Hook Tests**:
- `useCarousel` initializes with correct state
- `useCarousel` navigation functions update index
- `useLightbox` opens and closes correctly
- `useLightbox` restores focus after close
- `useKeyboardNavigation` responds to arrow keys

**Integration Tests**:
- Shows component renders ImageCarousel
- Shows component passes correct image data
- Full user flow: navigate carousel → click image → view lightbox → close

**Accessibility Tests**:
- All interactive elements have ARIA labels
- Keyboard navigation works (Tab, Arrow keys, Enter, ESC)
- Focus trap works in lightbox
- Focus restoration works after lightbox close
- Screen reader announcements (test with aria-live regions)

### Edge Cases to Test

1. Empty image array
2. Single image
3. Very large number of images (100+)
4. Images with very long alt text
5. Images with missing optional properties
6. Rapid navigation (clicking multiple times quickly)
7. Opening lightbox while carousel is animating
8. Resizing viewport while carousel is open
9. Resizing viewport while lightbox is open
10. Keyboard navigation at boundaries (first/last image)

### Manual Testing Checklist

- [ ] Test on mobile devices (iOS Safari, Android Chrome)
- [ ] Test on tablets
- [ ] Test on desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test keyboard-only navigation
- [ ] Test touch gestures on mobile
- [ ] Verify scrollbar hiding on all browsers
- [ ] Verify snap scroll behavior
- [ ] Verify lightbox backdrop styling
- [ ] Verify responsive image sizing at various breakpoints

