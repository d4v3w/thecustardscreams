/**
 * Cookie Settings Link
 * Persistent link to reopen cookie preferences
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 4.1, 4.2
 */

"use client";

import { useCookieConsent } from "~/hooks/useCookieConsent";

interface CookieSettingsLinkProps {
  className?: string;
}

/**
 * Link component to open cookie preferences modal
 * Can be placed in footer or anywhere in the app
 */
export function CookieSettingsLink({ className = "" }: CookieSettingsLinkProps) {
  const { openModal } = useCookieConsent();

  return (
    <button
      onClick={openModal}
      className={`text-white/70 underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black ${className}`}
      aria-label="Open cookie preferences"
    >
      Cookie Settings
    </button>
  );
}
