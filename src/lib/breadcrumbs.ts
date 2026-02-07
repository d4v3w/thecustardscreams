/**
 * Utility functions for breadcrumb generation
 * Feature: persistent-navigation-breadcrumbs
 */

import type { BreadcrumbItem } from "./types";

/**
 * Special case mappings for URL segments to display labels
 */
const SEGMENT_LABEL_MAP: Record<string, string> = {
  ep: "EP",
  "the-custard-screams-ep": "The Custard Screams EP",
  music: "Music",
  about: "About",
  "live-shows": "Live Shows",
};

/**
 * Convert a URL segment to a human-readable label
 * Handles kebab-case conversion and special cases
 * 
 * @param segment - URL segment (e.g., "royal-flush", "ep")
 * @returns Human-readable label (e.g., "Royal Flush", "EP")
 */
export function formatSegmentLabel(segment: string): string {
  // Check for special cases first
  if (SEGMENT_LABEL_MAP[segment]) {
    return SEGMENT_LABEL_MAP[segment];
  }

  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate breadcrumb items from a URL pathname
 * Always includes "Home" as the first item
 * 
 * @param pathname - URL pathname (e.g., "/music/the-custard-screams-ep/royal-flush")
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  try {
    // Validate input
    if (!pathname || typeof pathname !== "string") {
      console.warn("Invalid pathname provided to generateBreadcrumbs:", pathname);
      return [{ label: "Home", href: "/", isActive: true }];
    }

    // Remove trailing slash and split into segments
    const normalizedPath = pathname.replace(/\/$/, "");
    const segments = normalizedPath.split("/").filter(Boolean);

    // Start with Home
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/", isActive: false },
    ];

    // Return early if we're on the home page
    if (segments.length === 0) {
      if (breadcrumbs[0]) {
        breadcrumbs[0].isActive = true;
      }
      return breadcrumbs;
    }

    // Build breadcrumbs for each segment
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      breadcrumbs.push({
        label: formatSegmentLabel(segment),
        href: currentPath,
        isActive: isLast,
      });
    });

    return breadcrumbs;
  } catch (error) {
    console.error("Error generating breadcrumbs:", error);
    // Return minimal safe breadcrumb
    return [{ label: "Home", href: "/", isActive: true }];
  }
}

/**
 * Check if breadcrumbs should be displayed for a given pathname
 * Breadcrumbs are hidden on the home page
 * 
 * @param pathname - URL pathname
 * @returns true if breadcrumbs should be shown, false otherwise
 */
export function shouldShowBreadcrumbs(pathname: string): boolean {
  const normalizedPath = pathname.replace(/\/$/, "");
  return normalizedPath !== "" && normalizedPath !== "/";
}
