"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useHashSync } from "~/hooks/useHashSync";
import { useReducedMotion } from "~/hooks/useReducedMotion";
import { useScrollObserver } from "~/hooks/useScrollObserver";
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
  
  // Hash synchronization (new)
  updateHash: (section: SectionId, addToHistory?: boolean) => void;
  isProgrammaticScroll: () => boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [previousSection, setPreviousSection] = useState<SectionId | null>(null);
  const sectionsMapRef = useRef<Map<SectionId, SectionRegistration>>(new Map());
  const [sections, setSections] = useState<SectionId[]>([]);
  const prefersReducedMotion = useReducedMotion();
  
  // Programmatic scroll flag management (prevents infinite loops)
  const programmaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollListenerCleanupRef = useRef<(() => void) | null>(null);

  const setProgrammaticScroll = useCallback((value: boolean) => {
    programmaticScrollRef.current = value;
    
    if (value) {
      // Clear any existing listeners
      if (scrollListenerCleanupRef.current) {
        scrollListenerCleanupRef.current();
      }
      
      // Set up scroll completion detection
      let scrollTimeout: NodeJS.Timeout;
      let fallbackTimeout: NodeJS.Timeout;
      
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          programmaticScrollRef.current = false;
          cleanup();
        }, 100);
      };
      
      const cleanup = () => {
        clearTimeout(scrollTimeout);
        clearTimeout(fallbackTimeout);
        window.removeEventListener('scroll', handleScroll);
        scrollListenerCleanupRef.current = null;
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Fallback: clear after 1500ms if scroll events don't fire
      fallbackTimeout = setTimeout(() => {
        programmaticScrollRef.current = false;
        cleanup();
      }, 1500);
      
      scrollListenerCleanupRef.current = cleanup;
    }
  }, []);

  const isProgrammaticScroll = useCallback(() => programmaticScrollRef.current, []);

  // Get section refs map for intersection observer
  const getSectionRefs = useCallback(() => {
    const refsMap = new Map<SectionId, React.RefObject<HTMLElement | null>>();
    sectionsMapRef.current.forEach((registration, id) => {
      refsMap.set(id, registration.ref);
    });
    return refsMap;
  }, []);

  // Use hash sync hook to manage current section (hash is single source of truth)
  const { currentSection, updateHash } = useHashSync({
    sections,
    getSectionRefs,
    isProgrammaticScroll,
    setProgrammaticScroll,
    onHashChange: (section) => {
      // Update previous section when current changes
      setPreviousSection((prev) => {
        // Only update if section actually changed
        return prev !== section ? currentSection : prev;
      });
    },
  });

  // Initialize scroll observer to detect visible sections and update hash
  // Replaces old useNavigationObserver hook (Requirements: 1.1, 1.3, 5.1)
  useScrollObserver(getSectionRefs(), {
    updateHash,
    isProgrammaticScroll,
    threshold: 0.3,
    rootMargin: "-80px 0px -80px 0px",
  });

  // Cleanup scroll listener on unmount
  useEffect(() => {
    return () => {
      // Cleanup scroll listener on unmount
      if (scrollListenerCleanupRef.current) {
        scrollListenerCleanupRef.current();
      }
      // Clear scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Reset flag
      programmaticScrollRef.current = false;
    };
  }, []);

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

  // Calculate next section based on current
  const nextSection = currentSection 
    ? sections[sections.indexOf(currentSection) + 1] || null
    : sections[0] || null;

  // Navigate to a specific section
  const navigateToSection = useCallback((id: SectionId) => {
    // Simply update the hash with history entry (for user clicks)
    // The useHashSync hook will handle scrolling
    updateHash(id, true);
  }, [updateHash]);

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
    updateHash,
    isProgrammaticScroll,
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

// DEPRECATED: Internal hook for intersection observer to update current section
// This will be removed in task 5.4 when useScrollObserver replaces useNavigationObserver
// For now, it's a no-op since currentSection is managed by useHashSync
export function useNavigationUpdater() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationUpdater must be used within NavigationProvider");
  }
  // Return a no-op function since hash sync now manages currentSection
  // The old useNavigationObserver will call this but it won't do anything
  return (_section: SectionId | null) => {
    // No-op: currentSection is now managed by useHashSync via URL hash
  };
}
