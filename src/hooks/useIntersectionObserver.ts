"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionId, UseIntersectionObserverOptions } from "~/lib/types";

/**
 * Parse the top/bottom insets out of a CSS margin-shorthand rootMargin
 * string (e.g. "-80px 0px -80px 0px"), matching the subset of syntax
 * this app ever passes: 1-4 px values, top first, going clockwise.
 * Left/right are ignored since section visibility here is vertical-only.
 */
function parseVerticalRootMargin(rootMargin: string): { top: number; bottom: number } {
  const values = rootMargin
    .trim()
    .split(/\s+/)
    .map((v) => parseFloat(v) || 0);

  const [top = 0, , bottom = top] = values;
  return { top, bottom };
}

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
  const [activeSection, setActiveSection] = useState<SectionId | null>(() => {
    // Initialize with first section as fallback
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return Array.from(refs.keys())[0] ?? null;
    }
    return null;
  });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if window and IntersectionObserver are available
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback already handled in initial state
      return;
    }

    const threshold = options?.threshold ?? 0.5;
    const rootMargin = options?.rootMargin ?? "0px";
    const { top: topInset, bottom: bottomInset } = parseVerticalRootMargin(rootMargin);

    /**
     * Compute which section is most visible right now by measuring real
     * DOM geometry directly, rather than trusting an intersection ratio
     * accumulated from IntersectionObserver's enter/leave callback
     * stream. A fast fling-scroll (a real touch gesture, which covers
     * much more distance per rendered frame than any scripted or
     * incremental test scroll) can carry a section's ratio past the
     * configured threshold and back down again within a single frame -
     * if the browser ever coalesces or drops the "leaving" callback for
     * that, its last-known ratio stays frozen in an accumulated map
     * forever. That's a real, reported bug: bottom-nav highlighting
     * getting permanently stuck on a section the user has scrolled well
     * past. Measuring fresh each time is self-healing - it can't go
     * stale no matter what the observer's callback stream missed. The
     * observer itself is kept purely as an efficient trigger for when to
     * re-measure, avoiding continuous scroll-event polling.
     */
    const updateActiveSection = () => {
      const windowHeight = window.innerHeight;
      const visibleTop = 0 + topInset;
      const visibleBottom = windowHeight + bottomInset;

      let maxRatio = 0;
      let mostVisibleSection: SectionId | null = null;

      refs.forEach((ref, sectionId) => {
        const element = ref.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        if (rect.height <= 0) return;

        const visibleHeight =
          Math.min(rect.bottom, visibleBottom) - Math.max(rect.top, visibleTop);
        const ratio = Math.max(0, visibleHeight) / rect.height;

        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = sectionId;
        }
      });

      // Only update once something actually clears the threshold - keeps
      // the "no section visible" (e.g. mid-transition) case a no-op
      // rather than clearing activeSection to null.
      if (maxRatio >= threshold) {
        setActiveSection(mostVisibleSection);
      }
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

    const observer = new IntersectionObserver(debouncedUpdate, {
      threshold,
      rootMargin,
    });

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
