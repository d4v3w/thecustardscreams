"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionId, UseIntersectionObserverOptions } from "~/lib/types";

/**
 * Hook to track which section is currently visible in viewport
 * Uses Intersection Observer API with fallback for unsupported browsers
 * Feature: website-modernization
 * Requirements: 1.3, 9.3
 */
export function useIntersectionObserver(
  refs: Map<SectionId, React.RefObject<HTMLElement | null>>,
  options?: UseIntersectionObserverOptions,
): SectionId | null {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if window and IntersectionObserver are available
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: return first section
      const firstSection = Array.from(refs.keys())[0];
      if (firstSection) {
        setActiveSection(firstSection);
      }
      return;
    }

    const threshold = options?.threshold ?? 0.5;
    const rootMargin = options?.rootMargin ?? "0px";

    // Track visibility of each section
    const visibleSections = new Map<SectionId, number>();

    const updateActiveSection = () => {
      // Find section with highest intersection ratio
      let maxRatio = 0;
      let mostVisibleSection: SectionId | null = null;

      visibleSections.forEach((ratio, sectionId) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = sectionId;
        }
      });

      setActiveSection(mostVisibleSection);
    };

    const debouncedUpdate = () => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer - debounce for 100ms
      debounceTimerRef.current = setTimeout(() => {
        updateActiveSection();
      }, 100);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute(
            "data-section-id",
          ) as SectionId | null;

          if (sectionId) {
            if (entry.isIntersecting) {
              // Store intersection ratio for this section
              visibleSections.set(sectionId, entry.intersectionRatio);
            } else {
              // Remove section when not intersecting
              visibleSections.delete(sectionId);
            }
          }
        });

        // Debounce the state update
        debouncedUpdate();
      },
      {
        threshold,
        rootMargin,
      },
    );

    // Observe all section refs
    refs.forEach((ref, sectionId) => {
      if (ref.current) {
        // Set data attribute for identification
        ref.current.setAttribute("data-section-id", sectionId);
        observer.observe(ref.current);
      }
    });

    // Cleanup observer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      observer.disconnect();
    };
  }, [refs, options?.threshold, options?.rootMargin]);

  return activeSection;
}
