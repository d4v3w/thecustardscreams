"use client";

import { useEffect, useState } from "react";
import type {
    CookiePreferences,
    UseCookieConsentReturn,
} from "~/lib/types";
import { CONSENT_VERSION, COOKIE_CONSENT_KEY } from "~/lib/types";

/**
 * Hook to manage cookie consent state and analytics loading
 * Implements GDPR-compliant consent management
 * Feature: website-modernization
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6
 */
export function useCookieConsent(): UseCookieConsentReturn {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  // Read consent from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored) {
        const preferences: CookiePreferences = JSON.parse(stored);
        
        // Check if consent version matches
        if (preferences.version === CONSENT_VERSION) {
          setHasConsent(preferences.analytics);
          
          // Load analytics if consent was previously granted
          if (preferences.analytics) {
            loadAnalytics();
          }
        } else {
          // Version mismatch, reset consent
          setHasConsent(null);
        }
      } else {
        // No stored preference, user needs to decide
        setHasConsent(null);
      }
    } catch (error) {
      console.error("Error reading cookie consent:", error);
      setHasConsent(null);
    }
  }, []);

  const acceptCookies = () => {
    const preferences: CookiePreferences = {
      analytics: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
      setHasConsent(true);
      loadAnalytics();
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  };

  const declineCookies = () => {
    const preferences: CookiePreferences = {
      analytics: false,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
      setHasConsent(false);
      removeAnalytics();
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  };

  const withdrawConsent = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      setHasConsent(null);
      removeAnalytics();
    } catch (error) {
      console.error("Error withdrawing consent:", error);
    }
  };

  return {
    hasConsent,
    acceptCookies,
    declineCookies,
    withdrawConsent,
  };
}

/**
 * Load Google Analytics script
 */
function loadAnalytics() {
  if (typeof window === "undefined") {
    return;
  }

  // Check if analytics is already loaded
  if (window.gtag) {
    return;
  }

  // Get measurement ID from environment or use placeholder
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-XXXXXXXXXX";

  // Create and append analytics script
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  script.id = "ga-script";
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

/**
 * Remove Google Analytics script and data
 */
function removeAnalytics() {
  if (typeof window === "undefined") {
    return;
  }

  // Remove analytics script
  const script = document.getElementById("ga-script");
  if (script) {
    script.remove();
  }

  // Clear gtag function
  delete window.gtag;
  
  // Clear dataLayer
  window.dataLayer = [];
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
