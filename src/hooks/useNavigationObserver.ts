"use client";

import { useEffect } from "react";
import { useNavigation, useNavigationUpdater } from "~/contexts/NavigationContext";
import type { UseIntersectionObserverOptions } from "~/lib/types";
import { useIntersectionObserver } from "./useIntersectionObserver";

/**
 * Hook that connects intersection observer to navigation context
 * Automatically updates navigation state based on scroll position
 * Feature: website-modernization
 */
export function useNavigationObserver(options?: UseIntersectionObserverOptions) {
  const { getSectionRefs } = useNavigation();
  const setCurrentSection = useNavigationUpdater();
  
  // Get section refs from context
  const sectionRefs = getSectionRefs();
  
  // Use intersection observer to track active section
  const activeSection = useIntersectionObserver(sectionRefs, options);
  
  // Update navigation context when active section changes
  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection);
    }
  }, [activeSection, setCurrentSection]);
}
