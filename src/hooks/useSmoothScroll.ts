"use client";

import { useCallback } from "react";
import type { SectionId, UseSmoothScrollOptions } from "~/lib/types";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Hook to provide smooth scrolling to sections with focus management
 * Respects user's motion preferences
 * Feature: website-modernization
 * Requirements: 1.5, 2.4, 8.3, 10.5
 */
export function useSmoothScroll(_options?: UseSmoothScrollOptions) {
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = useCallback(
    (sectionId: SectionId) => {
      // Find the target section element
      const targetElement = document.querySelector(
        `[data-section-id="${sectionId}"]`,
      );

      if (!targetElement) {
        console.warn(`Section with id "${sectionId}" not found`);
        return;
      }

      // Determine scroll behavior based on user preference
      const behavior = prefersReducedMotion ? "auto" : "smooth";

      // Get the section's position and scroll the window to trigger scroll-snap
      const offsetTop = (targetElement as HTMLElement).offsetTop;
      
      window.scrollTo({
        top: offsetTop,
        behavior,
      });

      // Update URL hash without page reload
      if (window.history.pushState) {
        window.history.pushState(null, "", `#${sectionId}`);
      } else {
        // Fallback for older browsers
        window.location.hash = sectionId;
      }

      // Manage focus for keyboard users
      // Wait for scroll to complete before focusing
      setTimeout(
        () => {
          // Make section focusable if not already
          if (!targetElement.hasAttribute("tabindex")) {
            targetElement.setAttribute("tabindex", "-1");
          }

          // Focus the section for keyboard navigation
          (targetElement as HTMLElement).focus({ preventScroll: true });

          // Remove tabindex after focus to restore natural tab order
          setTimeout(() => {
            targetElement.removeAttribute("tabindex");
          }, 100);
        },
        prefersReducedMotion ? 0 : 500,
      ); // Wait for smooth scroll animation
    },
    [prefersReducedMotion],
  );

  return scrollToSection;
}
