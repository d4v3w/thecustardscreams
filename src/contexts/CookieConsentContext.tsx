/**
 * Cookie Consent Context Provider
 * Centralized state management for GDPR-compliant cookie consent
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 2.5, 2.6, 4.5, 5.1, 5.3, 5.4, 5.5, 10.1
 */

"use client";

import { createContext, useState, type ReactNode } from "react";
import {
    createConsentLog,
    exportConsentLogs as exportLogs,
    saveConsentLog,
} from "~/lib/cookieConsentLogs";
import { loadPreferences, savePreferences } from "~/lib/cookieConsentStorage";
import type {
    CookieCategoryPreferences,
    CookieConsentContextValue,
    CookiePreferences,
} from "~/lib/types";
import { CONSENT_VERSION } from "~/lib/types";

/**
 * React Context for cookie consent state
 */
export const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

/**
 * Props for CookieConsentProvider
 */
interface CookieConsentProviderProps {
  children: ReactNode;
}

/**
 * Cookie Consent Provider Component
 * Manages consent state, persistence, and logging
 */
export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  // Initialize state from localStorage immediately (lazy initialization)
  const [preferences, setPreferences] = useState<CookiePreferences | null>(() => {
    if (typeof window === "undefined") return null;
    return loadPreferences();
  });
  
  const [showBanner, setShowBanner] = useState(() => {
    if (typeof window === "undefined") return false;
    return !loadPreferences();
  });
  
  const [showModal, setShowModal] = useState(false);
  
  // Use a simple flag instead of state to avoid setState-in-effect
  const [isInitialized] = useState(true);

  // Derived state for quick access
  const hasEssential = preferences?.categories.essential ?? true;
  const hasAnalytics = preferences?.categories.analytics ?? false;
  const hasMarketing = preferences?.categories.marketing ?? false;

  /**
   * Accept all optional cookie categories
   */
  const acceptAll = () => {
    const newPreferences: CookiePreferences = {
      categories: {
        essential: true,
        analytics: true,
        marketing: true,
      },
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      method: "accept-all",
    };

    setPreferences(newPreferences);
    savePreferences(newPreferences);
    
    // Log consent decision
    const log = createConsentLog(newPreferences);
    saveConsentLog(log);

    setShowBanner(false);
    setShowModal(false);
  };

  /**
   * Reject all optional cookie categories
   */
  const rejectAll = () => {
    const newPreferences: CookiePreferences = {
      categories: {
        essential: true,
        analytics: false,
        marketing: false,
      },
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      method: "reject-all",
    };

    setPreferences(newPreferences);
    savePreferences(newPreferences);
    
    // Log consent decision
    const log = createConsentLog(newPreferences);
    saveConsentLog(log);

    setShowBanner(false);
    setShowModal(false);
  };

  /**
   * Update specific cookie categories (custom preferences)
   */
  const updatePreferences = (updates: Partial<CookieCategoryPreferences>) => {
    const newPreferences: CookiePreferences = {
      categories: {
        essential: true, // Always true
        analytics: updates.analytics ?? hasAnalytics,
        marketing: updates.marketing ?? hasMarketing,
      },
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      method: "custom",
    };

    setPreferences(newPreferences);
    savePreferences(newPreferences);
    
    // Log consent decision
    const log = createConsentLog(newPreferences);
    saveConsentLog(log);

    setShowModal(false);
  };

  /**
   * Withdraw all consent and clear preferences
   */
  const withdrawConsent = () => {
    setPreferences(null);
    
    // Clear from localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("custard-screams-cookie-consent");
      } catch (error) {
        console.error("Error removing consent:", error);
      }
    }

    setShowBanner(true);
    setShowModal(false);
  };

  /**
   * Open preferences modal
   */
  const openModal = () => {
    setShowModal(true);
    setShowBanner(false);
  };

  /**
   * Close preferences modal
   */
  const closeModal = () => {
    setShowModal(false);
  };

  /**
   * Export consent logs for audit
   */
  const exportConsentLogs = () => {
    return exportLogs();
  };

  const contextValue: CookieConsentContextValue = {
    preferences,
    hasEssential,
    hasAnalytics,
    hasMarketing,
    acceptAll,
    rejectAll,
    updatePreferences,
    withdrawConsent,
    showBanner,
    showModal,
    openModal,
    closeModal,
    exportConsentLogs,
  };

  // Don't render children until initialized to avoid hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}
