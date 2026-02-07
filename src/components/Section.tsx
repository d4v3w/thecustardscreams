"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import { useRegisterSection } from "~/hooks/useRegisterSection";
import type { SectionProps } from "~/lib/types";

// Section order mapping
const SECTION_ORDER: Record<string, number> = {
  hero: 0,
  music: 1,
  shows: 2,
  about: 3,
};

/**
 * Wrapper component for major content sections
 * Applies scroll-snap, registers with navigation context, and fade-in animations
 * Feature: website-modernization
 * Requirements: 1.2, 1.3, 1.4, 4.8
 */
export default function Section({
  id,
  className = "",
  children,
  onVisibilityChange,
}: SectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const internalRef = useRef<HTMLElement>(null);
  
  // Register section with navigation context
  const contextRef = useRegisterSection(id, SECTION_ORDER[id] ?? 999);

  // Merge refs
  const mergedRef = (element: HTMLElement | null) => {
    internalRef.current = element;
    (contextRef as React.MutableRefObject<HTMLElement | null>).current = element;
  };

  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    // Apply fade-in animation on first appearance (unless reduced motion)
    if (!prefersReducedMotion) {
      // Start with opacity 0
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";

      // Trigger animation after a brief delay
      const timer = setTimeout(() => {
        element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // No animation for reduced motion preference
      element.style.opacity = "1";
      element.style.transform = "none";
    }
  }, [prefersReducedMotion]);

  return (
    <section
      ref={mergedRef}
      id={id}
      data-section-id={id}
      className={`snap-start min-h-screen ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      {children}
    </section>
  );
}
