import type { CarouselNavigationProps } from './types';

/**
 * Navigation buttons for carousel (previous/next)
 */
export default function CarouselNavigation({
  onPrevious,
  onNext,
  canScrollPrevious,
  canScrollNext,
}: CarouselNavigationProps) {
  return (
    <>
      <button
        onClick={onPrevious}
        disabled={!canScrollPrevious}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-opacity hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <span className="text-xl" aria-hidden="true">←</span>
      </button>
      <button
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label="Next image"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-opacity hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <span className="text-xl" aria-hidden="true">→</span>
      </button>
    </>
  );
}
