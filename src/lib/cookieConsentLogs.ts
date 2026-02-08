/**
 * Cookie consent logging utilities for GDPR audit trail
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 5.1, 5.2, 5.6
 */

import type { ConsentHistory, ConsentLog, CookiePreferences } from "./types";
import { CONSENT_LOGS_KEY, CONSENT_VERSION, MAX_CONSENT_LOGS } from "./types";

/**
 * Generate a simple UUID v4
 * Used for consent log IDs
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a new consent log entry
 * 
 * @param preferences - The consent preferences to log
 * @returns A new ConsentLog entry with timestamp and metadata
 */
export function createConsentLog(preferences: CookiePreferences): ConsentLog {
  return {
    id: generateUUID(),
    timestamp: Date.now(),
    preferences,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    version: CONSENT_VERSION,
  };
}

/**
 * Save a consent log to localStorage history
 * Maintains FIFO queue with MAX_CONSENT_LOGS limit
 * 
 * @param log - The consent log to save
 * @returns true if saved successfully, false otherwise
 */
export function saveConsentLog(log: ConsentLog): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const history = loadConsentLogs();
    const logs = [...history.logs, log];

    // Enforce maximum log count (FIFO - remove oldest)
    while (logs.length > MAX_CONSENT_LOGS) {
      logs.shift();
    }

    const updatedHistory: ConsentHistory = { logs };
    const serialized = JSON.stringify(updatedHistory);
    localStorage.setItem(CONSENT_LOGS_KEY, serialized);
    return true;
  } catch (error) {
    console.error("Error saving consent log:", error);
    return false;
  }
}

/**
 * Load consent log history from localStorage
 * Returns empty history if not found or invalid
 * 
 * @returns ConsentHistory with all log entries
 */
export function loadConsentLogs(): ConsentHistory {
  if (typeof window === "undefined") {
    return { logs: [] };
  }

  try {
    const stored = localStorage.getItem(CONSENT_LOGS_KEY);
    if (!stored) {
      return { logs: [] };
    }

    const parsed = JSON.parse(stored);
    
    // Validate structure
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.logs)) {
      return parsed as ConsentHistory;
    }

    // Invalid format - return empty
    console.warn("Invalid consent logs format, returning empty history");
    return { logs: [] };
  } catch (error) {
    console.error("Error loading consent logs:", error);
    return { logs: [] };
  }
}

/**
 * Export consent logs as JSON for audit purposes
 * 
 * @returns Array of all consent log entries
 */
export function exportConsentLogs(): ConsentLog[] {
  const history = loadConsentLogs();
  return history.logs;
}
