"use client";

import CookieConsent from "~/components/cookie/CookieConsent";
import { useCookieConsent } from "~/hooks/useCookieConsent";

/**
 * Client-side layout wrapper for cookie consent
 * Feature: website-modernization
 * Requirements: 13.1
 */
export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { hasConsent, acceptCookies, declineCookies } = useCookieConsent();

  return (
    <>
      {children}

      {/* Cookie Consent Banner - only show if user hasn't decided */}
      {hasConsent === null && (
        <CookieConsent onAccept={acceptCookies} onDecline={declineCookies} />
      )}
    </>
  );
}

LayoutClient.displayName = "LayoutClient";
