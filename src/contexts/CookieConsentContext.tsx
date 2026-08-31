/**
 * Cookie Consent Context Provider
 * Centralized state management for GDPR-compliant cookie consent
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 2.5, 2.6, 4.5, 5.1, 5.3, 5.4, 5.5, 10.1
 */

"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
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
  // Start with the SSR-safe defaults (no stored preferences, banner hidden)
  // so the client's first hydration pass renders the same tree the server
  // did. Reading localStorage synchronously in these initializers used to
  // branch on `typeof window`, which made the client's initial render
  // diverge from the server's - the classic cause of a React hydration
  // mismatch (showBanner flips true/false depending on stored consent,
  // directly changing whether <CookieConsentBanner /> is in the tree).
  // The real value is loaded after mount instead, in the effect below.
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Deferred to a microtask (rather than calling setState directly in the
    // effect body) per this repo's react-hooks/set-state-in-effect lint rule.
    queueMicrotask(() => {
      const stored = loadPreferences();
      setPreferences(stored);
      setShowBanner(!stored);
    });
  }, []);

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

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}
