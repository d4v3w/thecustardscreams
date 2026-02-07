"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect user's motion preference for accessibility
 * Returns true if user prefers reduced motion
 * Feature: website-modernization
 * Requirements: 4.8, 8.8
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === "undefined") {
      return;
    }

    // Create media query for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Handler for media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
