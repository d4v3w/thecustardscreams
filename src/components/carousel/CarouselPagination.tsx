import type { CarouselPaginationProps } from './types';

/**
 * Pagination dots indicator for carousel
 */
export default function CarouselPagination({
  totalItems,
  currentIndex,
  onDotClick,
}: CarouselPaginationProps) {
  return (
    <div
      className="mt-4 flex justify-center gap-2"
      role="tablist"
      aria-label="Carousel pagination"
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          aria-label={`Go to image ${index + 1} of ${totalItems}`}
          aria-current={index === currentIndex ? 'true' : 'false'}
          role="tab"
          className={`h-3 w-3 rounded-full transition-colors ${
            index === currentIndex
              ? 'bg-amber-400'
              : 'bg-gray-400 hover:bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
