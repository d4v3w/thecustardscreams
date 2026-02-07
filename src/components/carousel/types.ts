/**
 * Core image interface for carousel items
 */
export interface CarouselImage {
  src: string;
  alt: string;
  id?: string;
  caption?: string;
}

/**
 * Generic carousel props accepting any item type
 */
export interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Image-specific carousel props
 */
export interface ImageCarouselProps {
  images: CarouselImage[];
  className?: string;
  ariaLabel?: string;
}

/**
 * Lightbox component props
 */
export interface ImageLightboxProps {
  image: CarouselImage | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Return type for useCarousel hook
 */
export interface UseCarouselReturn {
  currentIndex: number;
  scrollToIndex: (index: number) => void;
  scrollToNext: () => void;
  scrollToPrevious: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
}

/**
 * Return type for useLightbox hook
 */
export interface UseLightboxReturn {
  isOpen: boolean;
  selectedImage: CarouselImage | null;
  openLightbox: (image: CarouselImage) => void;
  closeLightbox: () => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}

/**
 * Props for CarouselNavigation component
 */
export interface CarouselNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
}

/**
 * Props for CarouselPagination component
 */
export interface CarouselPaginationProps {
  totalItems: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}
