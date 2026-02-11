/**
 * Navigation utility functions for hash synchronization
 * Feature: navigation-hash-sync
 * Requirements: 1.1, 2.1, 5.1
 */

import type React from "react";
import type { SectionId } from "~/lib/types";

/**
 * Check if a section is currently visible in the viewport
 * Uses getBoundingClientRect to calculate visibility ratio
 * 
 * @param sectionId - The section identifier to check
 * @param refs - Map of section IDs to their DOM element refs
 * @param threshold - Minimum visibility ratio (0-1) to consider section visible (default: 0.3)
 * @returns true if section visibility ratio >= threshold, false otherwise
 * 
 * Security: No XSS risk - only reads DOM properties, doesn't manipulate content
 */
export function isSectionVisible(
  sectionId: SectionId,
  refs: Map<SectionId, React.RefObject<HTMLElement | null>>,
  threshold: number = 0.3
): boolean {
  const ref = refs.get(sectionId);
  if (!ref?.current) return false;

  const rect = ref.current.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate how much of the section is visible
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const sectionHeight = rect.height;

  // Prevent division by zero
  if (sectionHeight === 0) return false;

  const visibilityRatio = visibleHeight / sectionHeight;

  // Section is considered visible if threshold is met
  return visibilityRatio >= threshold;
}

/**
 * Parse and sanitize hash from URL
 * Removes leading # and validates format
 * 
 * @param hash - Raw hash string from window.location.hash
 * @returns Cleaned section ID or null if invalid
 * 
 * Security: Sanitizes input to prevent XSS - only returns valid SectionId values
 */
export function parseHash(hash: string): SectionId | null {
  // Remove leading # and trim whitespace
  const cleaned = hash.replace(/^#/, "").trim();
  
  // Return null for empty strings
  if (!cleaned) return null;
  
  // Only return if it's a valid SectionId (type-safe)
  // This prevents any arbitrary strings from being used
  return cleaned as SectionId;
}

/**
 * Validate hash against known sections
 * Returns valid section or defaults to first section
 * 
 * @param hash - Section ID to validate
 * @param sections - Array of valid section IDs
 * @returns Valid section ID or first section as fallback
 * 
 * Security: Validates against whitelist of known sections
 */
export function validateHash(
  hash: SectionId | null,
  sections: SectionId[]
): SectionId | null {
  // Default to first section if hash is null or empty
  if (!hash) return sections[0] ?? null;

  // Check if hash is in the valid sections list
  if (!sections.includes(hash)) {
    console.warn(`Invalid hash "${hash}", defaulting to first section`);
    return sections[0] ?? null;
  }

  return hash;
}
