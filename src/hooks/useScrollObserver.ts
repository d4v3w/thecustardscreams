/**
 * Hook that detects visible sections and triggers hash updates
 * Wraps useIntersectionObserver to add hash synchronization logic
 * Feature: navigation-hash-sync
 * Requirements: 1.1, 1.3, 5.1
 */

"use client";

import { useEffect, useRef } from "react";
import type { SectionId, UseIntersectionObserverOptions } from "~/lib/types";
import { useIntersectionObserver } from "./useIntersectionObserver";

/**
 * Options for useScrollObserver hook
 */
export interface UseScrollObserverOptions extends UseIntersectionObserverOptions {
  /** Function to update hash when section changes */
  updateHash: (section: SectionId, addToHistory?: boolean) => void;
  
  /** Function to check if current scroll is programmatic */
  isProgrammaticScroll: () => boolean;
}

/**
 * Hook that observes scroll position and updates hash accordingly
 * Prevents hash updates during programmatic scrolls to avoid infinite loops
 * Debounces hash updates to prevent excessive router calls
 * 
 * @param refs - Map of section IDs to their DOM element refs
 * @param options - Configuration including updateHash and isProgrammaticScroll functions
 * 
 * Security: No XSS risk - only calls updateHash with validated SectionId values
 */
export function useScrollObserver(
  refs: Map<SectionId, React.RefObject<HTMLElement | null>>,
  options: UseScrollObserverOptions
): void {
  const { updateHash, isProgrammaticScroll, threshold, rootMargin } = options;
  
  // Use existing intersection observer to detect active section
  const activeSection = useIntersectionObserver(refs, { threshold, rootMargin });
  
  // Track previous section to avoid redundant updates
  const previousSectionRef = useRef<SectionId | null>(null);
  
  // Debounce timer for hash updates
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Update hash when active section changes
   * Debounced to prevent excessive updates during rapid scrolling
   * Skips update if programmatic scroll is active (prevents loops)
   */
  useEffect(() => {
    // Skip if no active section
    if (!activeSection) return;
    
    // Skip if section hasn't changed
    if (activeSection === previousSectionRef.current) return;
    
    // Skip if this is a programmatic scroll (prevents infinite loops)
    if (isProgrammaticScroll()) {
      // Update previous section ref even during programmatic scroll
      // so we don't trigger an update when the flag clears
      previousSectionRef.current = activeSection;
      return;
    }
    
    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce hash update to prevent excessive router calls
    // Use 150ms delay as specified in requirements (Req 8.1)
    debounceTimerRef.current = setTimeout(() => {
      // Update hash without creating history entry (use router.replace)
      // Security: activeSection is validated SectionId from intersection observer
      updateHash(activeSection, false);
      
      // Update previous section ref
      previousSectionRef.current = activeSection;
    }, 150);
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [activeSection, isProgrammaticScroll, updateHash]);
  
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
}
