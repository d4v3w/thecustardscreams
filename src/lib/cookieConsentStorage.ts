/**
 * Cookie consent storage and migration utilities
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import type { CookiePreferences } from "./types";
import { CONSENT_VERSION, COOKIE_CONSENT_KEY } from "./types";

/**
 * Old format preferences (version 1) for migration
 */
interface OldCookiePreferences {
  analytics: boolean;
  timestamp: number;
  version: 1;
}

/**
 * Load cookie preferences from localStorage
 * Handles errors gracefully and returns null if unavailable or invalid
 * 
 * @returns CookiePreferences or null if not found/invalid
 */
export function loadPreferences(): CookiePreferences | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    
    // Check if this is old format (version 1) and needs migration
    if (parsed.version === 1) {
      const migrated = migratePreferences(parsed as OldCookiePreferences);
      // Save migrated preferences
      savePreferences(migrated);
      return migrated;
    }

    // Validate new format
    if (isValidPreferences(parsed)) {
      return parsed;
    }

    // Invalid format - clear and return null
    console.warn("Invalid cookie preferences format, clearing storage");
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    return null;
  } catch (error) {
    console.error("Error loading cookie preferences:", error);
    // Clear corrupted data
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {
      // Ignore cleanup errors
    }
    return null;
  }
}

/**
 * Save cookie preferences to localStorage
 * Handles errors gracefully
 * 
 * @param preferences - The preferences to save
 * @returns true if saved successfully, false otherwise
 */
export function savePreferences(preferences: CookiePreferences): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const serialized = JSON.stringify(preferences);
    localStorage.setItem(COOKIE_CONSENT_KEY, serialized);
    return true;
  } catch (error) {
    console.error("Error saving cookie preferences:", error);
    return false;
  }
}

/**
 * Migrate old format preferences (v1) to new format (v2)
 * Maps analytics boolean to new category-based structure
 * 
 * @param old - Old format preferences
 * @returns Migrated preferences in new format
 */
export function migratePreferences(old: OldCookiePreferences): CookiePreferences {
  return {
    categories: {
      essential: true,
      analytics: old.analytics,
      marketing: false, // Default to false for existing users
    },
    timestamp: old.timestamp, // Preserve original timestamp
    version: CONSENT_VERSION,
    method: old.analytics ? "accept-all" : "reject-all",
  };
}

/**
 * Validate that preferences object has correct structure
 * 
 * @param data - Data to validate
 * @returns true if valid CookiePreferences structure
 */
export function isValidPreferences(data: unknown): data is CookiePreferences {
  if (!data || typeof data !== "object") {
    return false;
  }

  const prefs = data as Partial<CookiePreferences>;

  // Check required fields
  if (
    !prefs.categories ||
    typeof prefs.categories !== "object" ||
    typeof prefs.timestamp !== "number" ||
    typeof prefs.version !== "number" ||
    typeof prefs.method !== "string"
  ) {
    return false;
  }

  // Check categories structure
  const { categories } = prefs;
  if (
    typeof categories.essential !== "boolean" ||
    typeof categories.analytics !== "boolean" ||
    typeof categories.marketing !== "boolean"
  ) {
    return false;
  }

  // Check method is valid
  const validMethods = ["accept-all", "reject-all", "custom"];
  if (!validMethods.includes(prefs.method)) {
    return false;
  }

  return true;
}
