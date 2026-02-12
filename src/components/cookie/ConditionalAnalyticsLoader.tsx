/**
 * Conditional Google Analytics Loader
 * Only loads analytics when user has granted analytics consent
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 3.3, 3.4, 10.2, 10.3
 */

"use client";

import { useEffect } from "react";
import { useCookieConsent } from "~/hooks/useCookieConsent";

interface ConditionalAnalyticsLoaderProps {
  measurementId: string;
}

/**
 * Component that conditionally loads Google Analytics based on consent
 */
export function ConditionalAnalyticsLoader({
  measurementId,
}: ConditionalAnalyticsLoaderProps) {
  const { hasAnalytics } = useCookieConsent();

  useEffect(() => {
    if (hasAnalytics) {
      loadAnalytics(measurementId);
    } else {
      removeAnalytics();
    }

    // Cleanup on unmount
    return () => {
      removeAnalytics();
    };
  }, [hasAnalytics, measurementId]);

  return null; // This component doesn't render anything
}

/**
 * Load Google Analytics script
 */
function loadAnalytics(measurementId: string) {
  if (typeof window === "undefined") {
    return;
  }

  // Check if analytics is already loaded
  if (window.gtag) {
    return;
  }

  try {
    // Create and append analytics script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.id = "ga-script";
    
    script.onerror = (error) => {
      console.error("Failed to load Google Analytics:", error);
    };

    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  } catch (error) {
    console.error("Error loading Google Analytics:", error);
  }
}

/**
 * Remove Google Analytics script and data
 */
function removeAnalytics() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // Remove analytics script
    const script = document.getElementById("ga-script");
    if (script) {
      script.remove();
    }

    // Clear gtag function
    delete window.gtag;

    // Clear dataLayer
    window.dataLayer = [];
  } catch (error) {
    console.error("Error removing Google Analytics:", error);
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
