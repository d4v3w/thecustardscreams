'use client';

import Carousel from './Carousel';
import ImageLightbox from './ImageLightbox';
import type { ImageCarouselProps } from './types';
import { useLightbox } from './useLightbox';

/**
 * Specialized carousel component for images with lightbox functionality
 */
export default function ImageCarousel({
  images,
  className = '',
  ariaLabel = 'Image carousel',
}: ImageCarouselProps) {
  const { isOpen, selectedImage, openLightbox, closeLightbox } = useLightbox();

  return (
    <>
      <Carousel
        items={images}
        renderItem={(image) => (
          <button
            onClick={() => openLightbox(image)}
            className="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            aria-label={`View full size: ${image.alt}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-auto w-full rounded-lg object-cover"
            />
          </button>
        )}
        className={className}
        ariaLabel={ariaLabel}
      />
      <ImageLightbox
        image={selectedImage}
        isOpen={isOpen}
        onClose={closeLightbox}
      />
    </>
  );
}
