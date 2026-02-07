"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import type { SectionId } from "~/lib/types";

/**
 * Navigation context for managing page/section state
 * Provides current, next, and previous section tracking
 * Allows dynamic section registration
 * Feature: website-modernization
 */

interface SectionRegistration {
  id: SectionId;
  ref: React.RefObject<HTMLElement | null>;
  order: number;
}

interface NavigationContextValue {
  // Current state
  currentSection: SectionId | null;
  previousSection: SectionId | null;
  nextSection: SectionId | null;
  
  // Section management
  sections: SectionId[];
  registerSection: (id: SectionId, ref: React.RefObject<HTMLElement | null>, order: number) => void;
  unregisterSection: (id: SectionId) => void;
  
  // Navigation actions
  navigateToSection: (id: SectionId) => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  
  // Section refs for intersection observer
  getSectionRefs: () => Map<SectionId, React.RefObject<HTMLElement | null>>;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentSection, setCurrentSection] = useState<SectionId | null>(null);
  const [previousSection, setPreviousSection] = useState<SectionId | null>(null);
  const sectionsMapRef = useRef<Map<SectionId, SectionRegistration>>(new Map());
  const [sections, setSections] = useState<SectionId[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Register a section with its ref and order
  const registerSection = useCallback((id: SectionId, ref: React.RefObject<HTMLElement | null>, order: number) => {
    sectionsMapRef.current.set(id, { id, ref, order });
    
    // Update sections array sorted by order
    const sortedSections = Array.from(sectionsMapRef.current.values())
      .sort((a, b) => a.order - b.order)
      .map(s => s.id);
    
    setSections(sortedSections);
  }, []);

  // Unregister a section
  const unregisterSection = useCallback((id: SectionId) => {
    sectionsMapRef.current.delete(id);
    
    const sortedSections = Array.from(sectionsMapRef.current.values())
      .sort((a, b) => a.order - b.order)
      .map(s => s.id);
    
    setSections(sortedSections);
  }, []);

  // Get section refs map for intersection observer
  const getSectionRefs = useCallback(() => {
    const refsMap = new Map<SectionId, React.RefObject<HTMLElement | null>>();
    sectionsMapRef.current.forEach((registration, id) => {
      refsMap.set(id, registration.ref);
    });
    return refsMap;
  }, []);

  // Calculate next section based on current
  const nextSection = currentSection 
    ? sections[sections.indexOf(currentSection) + 1] || null
    : sections[0] || null;

  // Navigate to a specific section
  const navigateToSection = useCallback((id: SectionId) => {
    const registration = sectionsMapRef.current.get(id);
    if (!registration?.ref.current) {
      console.warn(`Section ${id} not found or not registered`);
      return;
    }

    // Get the section's position
    const element = registration.ref.current;
    const offsetTop = element.offsetTop;

    // Determine scroll behavior based on user preference
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    // Scroll the body container to trigger scroll-snap
    // CSS scroll-snap will handle the snapping behavior
    window.scrollTo({
      top: offsetTop,
      behavior,
    });

    // Update URL hash
    if (window.history.pushState) {
      window.history.pushState(null, "", `#${id}`);
    }
  }, [prefersReducedMotion]);

  // Navigate to next section
  const navigateNext = useCallback(() => {
    if (nextSection) {
      navigateToSection(nextSection);
    }
  }, [nextSection, navigateToSection]);

  // Navigate to previous section
  const navigatePrevious = useCallback(() => {
    if (previousSection) {
      navigateToSection(previousSection);
    }
  }, [previousSection, navigateToSection]);

  // Update current section (called by intersection observer)
  useEffect(() => {
    // This will be updated by the intersection observer hook
    // which will call setCurrentSection through the context
  }, []);

  const value: NavigationContextValue = {
    currentSection,
    previousSection,
    nextSection,
    sections,
    registerSection,
    unregisterSection,
    navigateToSection,
    navigateNext,
    navigatePrevious,
    getSectionRefs,
  };

  // Expose setCurrentSection internally for intersection observer
  (value as any)._setCurrentSection = (section: SectionId | null) => {
    setPreviousSection(currentSection);
    setCurrentSection(section);
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

// Hook to use navigation context
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}

// Internal hook for intersection observer to update current section
export function useNavigationUpdater() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationUpdater must be used within NavigationProvider");
  }
  return (context as any)._setCurrentSection as (section: SectionId | null) => void;
}
