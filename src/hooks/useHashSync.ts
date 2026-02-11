/**
 * Hook for synchronizing URL hash with navigation state
 * Implements single-source-of-truth pattern where hash is authoritative
 * Feature: navigation-hash-sync
 * Requirements: 1.1, 1.2, 2.1, 2.2, 7.2
 */

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { isSectionVisible, parseHash, validateHash } from "~/lib/navigationUtils";
import type { SectionId } from "~/lib/types";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Options for useHashSync hook
 */
export interface UseHashSyncOptions {
  /** Array of valid section IDs */
  sections: SectionId[];
  
  /** Map of section IDs to their DOM element refs */
  getSectionRefs: () => Map<SectionId, React.RefObject<HTMLElement | null>>;
  
  /** Callback when hash changes */
  onHashChange?: (section: SectionId) => void;
  
  /** Function to check if scroll is programmatic */
  isProgrammaticScroll: () => boolean;
  
  /** Function to set programmatic scroll flag */
  setProgrammaticScroll: (value: boolean, duration?: number) => void;
}

/**
 * Return value from useHashSync hook
 */
export interface UseHashSyncReturn {
  /** Current active section derived from hash */
  currentSection: SectionId | null;
  
  /** Function to update hash programmatically */
  updateHash: (section: SectionId, addToHistory?: boolean) => void;
}

/**
 * Hook that synchronizes URL hash with navigation state
 * Listens to hash changes and updates React state accordingly
 * Provides updateHash function for programmatic hash updates
 * 
 * Security: All hash values are validated against whitelist of known sections
 * No XSS risk - hash values are never used in innerHTML or dangerouslySetInnerHTML
 */
export function useHashSync(options: UseHashSyncOptions): UseHashSyncReturn {
  const {
    sections,
    getSectionRefs,
    onHashChange,
    isProgrammaticScroll,
    setProgrammaticScroll,
  } = options;

  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [currentSection, setCurrentSection] = useState<SectionId | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const isUpdatingHashRef = useRef(false);

  /**
   * Scroll to a specific section
   * Only scrolls if section is NOT already visible (prevents page jumps)
   * Manages keyboard focus for accessibility
   * Security: No XSS risk - only manipulates scroll position and focus
   */
  const scrollToSection = useCallback((sectionId: SectionId, retries = 0) => {
    const sectionRefs = getSectionRefs();
    const ref = sectionRefs.get(sectionId);
    
    if (!ref?.current) {
      // Section not yet mounted, retry up to 3 times
      if (retries < 3) {
        setTimeout(() => scrollToSection(sectionId, retries + 1), 100);
      } else {
        console.error(`Section "${sectionId}" not found after ${retries} retries`);
      }
      return;
    }

    // Check if section is already visible (prevents jarring page jumps)
    const alreadyVisible = isSectionVisible(sectionId, sectionRefs, 0.3);
    
    if (alreadyVisible) {
      // Section is already visible, no need to scroll
      // This is critical for seamless hash updates during manual scroll
      return;
    }

    // Set programmatic scroll flag to prevent infinite loops
    setProgrammaticScroll(true, 800);

    // Determine scroll behavior based on user preference
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    // Scroll to section
    ref.current.scrollIntoView({
      behavior,
      block: "start",
      inline: "nearest",
    });

    // Focus management for accessibility (Requirement 6.3)
    // Wait for scroll to complete before focusing
    const scrollDuration = prefersReducedMotion ? 0 : 800;
    setTimeout(() => {
      const element = ref.current;
      if (!element) return;

      // Store original tabindex to restore later
      const originalTabIndex = element.getAttribute("tabindex");
      
      // Temporarily set tabindex="-1" to make element focusable
      element.setAttribute("tabindex", "-1");
      
      // Focus the element (preventScroll to avoid double scroll)
      element.focus({ preventScroll: true });
      
      // Restore original tabindex after focus to maintain tab order
      // Use requestAnimationFrame to ensure focus has been applied
      requestAnimationFrame(() => {
        if (originalTabIndex === null) {
          element.removeAttribute("tabindex");
        } else {
          element.setAttribute("tabindex", originalTabIndex);
        }
      });
    }, scrollDuration);
  }, [getSectionRefs, prefersReducedMotion, setProgrammaticScroll]);

  /**
   * Handle hash change events
   * Parses, validates, and updates current section state
   * Triggers scroll if section is not already visible
   * Security: Validates hash against whitelist before using
   */
  const handleHashChange = useCallback(() => {
    // Skip if we're currently updating the hash programmatically from scroll
    // This prevents the wobble when hash updates during manual scroll
    if (isUpdatingHashRef.current) {
      return;
    }
    
    // Get current hash from window
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    
    // Parse and validate hash (security: only valid SectionIds pass through)
    const parsedHash = parseHash(hash);
    const validatedHash = validateHash(parsedHash, sections);
    
    if (validatedHash) {
      setCurrentSection(validatedHash);
      onHashChange?.(validatedHash);
      
      // Scroll to section if not already visible
      scrollToSection(validatedHash);
    }
  }, [sections, onHashChange, scrollToSection]);

  /**
   * Listen to hash changes via hashchange event
   * This catches browser back/forward navigation and direct hash changes
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Handle initial hash on mount
    if (!isInitializedRef.current) {
      handleHashChange();
      isInitializedRef.current = true;
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [handleHashChange]);

  /**
   * Update URL hash programmatically
   * Uses router.push() for user clicks (creates history entry)
   * Uses router.replace() for scroll events (no history entry)
   * Security: No XSS risk - hash values are validated SectionIds, never user input
   * 
   * @param section - Valid section ID to navigate to
   * @param addToHistory - If true, creates browser history entry (for clicks)
   */
  const updateHash = useCallback((section: SectionId, addToHistory: boolean = false) => {
    // For user clicks, execute immediately (no debounce)
    // For scroll events, debounce to prevent excessive router calls
    if (addToHistory) {
      // Clear any pending scroll updates
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      try {
        // Security: section is type-safe SectionId, no XSS risk
        const newHash = `#${section}`;
        
        // User click: create history entry, disable browser scroll
        router.push(newHash, { scroll: false });
        
        // Update state and trigger scroll immediately (don't wait for hashchange)
        setCurrentSection(section);
        onHashChange?.(section);
        scrollToSection(section);
      } catch (error) {
        // Fallback to direct hash manipulation if router fails
        console.error("Router hash update failed, using fallback", error);
        // Security: section is validated SectionId, safe to use
        if (typeof window !== "undefined") {
          // Use history API to avoid browser scroll
          const newUrl = `${window.location.pathname}${window.location.search}#${section}`;
          window.history.pushState(null, "", newUrl);
          
          // Update state and trigger scroll
          setCurrentSection(section);
          onHashChange?.(section);
          scrollToSection(section);
        }
      }
    } else {
      // Scroll event: debounce to prevent excessive updates
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        // Set flag to prevent handleHashChange from running (prevents wobble)
        isUpdatingHashRef.current = true;
        
        try {
          // Security: section is type-safe SectionId, no XSS risk
          const newHash = `#${section}`;
          
          // Scroll event: replace current entry (no history pollution)
          router.replace(newHash, { scroll: false });
          
          // Update current section state directly (bypass handleHashChange)
          setCurrentSection(section);
          onHashChange?.(section);
        } catch (error) {
          // Fallback to direct hash manipulation if router fails
          console.error("Router hash update failed, using fallback", error);
          // Security: section is validated SectionId, safe to use
          if (typeof window !== "undefined") {
            // Use history API to avoid browser scroll
            const newUrl = `${window.location.pathname}${window.location.search}#${section}`;
            window.history.replaceState(null, "", newUrl);
            // Update state directly
            setCurrentSection(section);
            onHashChange?.(section);
          }
        } finally {
          // Clear flag after a short delay
          setTimeout(() => {
            isUpdatingHashRef.current = false;
          }, 100);
        }
      }, 150); // Debounce for 150ms
    }
  }, [router, onHashChange, scrollToSection]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    currentSection,
    updateHash,
  };
}
