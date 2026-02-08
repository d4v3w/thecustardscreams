/**
 * Hook to access cookie consent context
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 10.1
 */

"use client";

import { useContext } from "react";
import { CookieConsentContext } from "~/contexts/CookieConsentContext";
import type { CookieConsentContextValue } from "~/lib/types";

/**
 * Hook to access cookie consent state and actions
 * Must be used within CookieConsentProvider
 * 
 * @throws Error if used outside CookieConsentProvider
 * @returns Cookie consent context value
 */
export function useCookieConsent(): CookieConsentContextValue {
  const context = useContext(CookieConsentContext);
  
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider. " +
      "Wrap your app with <CookieConsentProvider> in the root layout."
    );
  }
  
  return context;
}
