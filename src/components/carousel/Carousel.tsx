import CarouselNavigation from './CarouselNavigation';
import CarouselPagination from './CarouselPagination';
import type { CarouselProps } from './types';
import { useCarousel } from './useCarousel';
import { useKeyboardNavigation } from './useKeyboardNavigation';

/**
 * Generic carousel component accepting any item type
 */
export default function Carousel<T>({
  items,
  renderItem,
  className = '',
  ariaLabel = 'Carousel',
}: CarouselProps<T>) {
  const {
    currentIndex,
    scrollToIndex,
    scrollToNext,
    scrollToPrevious,
    containerRef,
    canScrollPrevious,
    canScrollNext,
  } = useCarousel(items.length);

  // Enable keyboard navigation
  useKeyboardNavigation({
    onPrevious: scrollToPrevious,
    onNext: scrollToNext,
    enabled: items.length > 1,
  });

  // Handle empty state
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500" role="status">
        No images to display
      </div>
    );
  }

  // Show navigation only if more than one item
  const showNavigation = items.length > 1;

  return (
    <div className={`relative max-h-[65vh] md:max-h-[70vh] flex flex-col ${className}`} role="region" aria-label={ariaLabel}>
      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto flex-1 min-h-0"
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 snap-center">
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {showNavigation && (
        <CarouselNavigation
          onPrevious={scrollToPrevious}
          onNext={scrollToNext}
          canScrollPrevious={canScrollPrevious}
          canScrollNext={canScrollNext}
        />
      )}

      {/* Pagination Dots */}
      {showNavigation && (
        <CarouselPagination
          totalItems={items.length}
          currentIndex={currentIndex}
          onDotClick={scrollToIndex}
        />
      )}
    </div>
  );
}
