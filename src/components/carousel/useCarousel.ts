'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseCarouselReturn } from './types';

/**
 * Custom hook for managing carousel state and navigation
 * @param totalItems - Total number of items in the carousel
 * @returns Carousel state and navigation functions
 */
export function useCarousel(totalItems: number): UseCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate navigation availability
  const canScrollPrevious = currentIndex > 0;
  const canScrollNext = currentIndex < totalItems - 1;

  /**
   * Scroll to a specific index
   */
  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) {
      console.warn('Carousel container ref not found');
      return;
    }

    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(index, totalItems - 1));
    
    const children = containerRef.current.children;
    if (children[clampedIndex]) {
      children[clampedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setCurrentIndex(clampedIndex);
    }
  }, [totalItems]);

  /**
   * Scroll to next item
   */
  const scrollToNext = useCallback(() => {
    if (canScrollNext) {
      scrollToIndex(currentIndex + 1);
    }
  }, [currentIndex, canScrollNext, scrollToIndex]);

  /**
   * Scroll to previous item
   */
  const scrollToPrevious = useCallback(() => {
    if (canScrollPrevious) {
      scrollToIndex(currentIndex - 1);
    }
  }, [currentIndex, canScrollPrevious, scrollToIndex]);

  /**
   * Use IntersectionObserver to detect which item is currently visible
   */
  useEffect(() => {
    if (!containerRef.current || totalItems === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Array.from(containerRef.current!.children).indexOf(
              entry.target
            );
            if (index !== -1 && index !== currentIndex) {
              setCurrentIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5,
      }
    );

    Array.from(containerRef.current.children).forEach((child) => {
      observer.observe(child);
    });

    return () => {
      observer.disconnect();
    };
  }, [totalItems, currentIndex]);

  return {
    currentIndex,
    scrollToIndex,
    scrollToNext,
    scrollToPrevious,
    containerRef,
    canScrollPrevious,
    canScrollNext,
  };
}
