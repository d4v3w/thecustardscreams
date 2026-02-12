/**
 * Cookie-related components for layout
 * Separated to use cookie consent context
 * Feature: gdpr-cookie-compliance-enhancement
 */

"use client";

import { ConditionalAnalyticsLoader } from "~/components/cookie/ConditionalAnalyticsLoader";
import { CookieConsentBanner } from "~/components/cookie/CookieConsentBanner";
import { CookiePreferencesModal } from "~/components/cookie/CookiePreferencesModal";
import { useCookieConsent } from "~/hooks/useCookieConsent";

/**
 * Renders cookie consent UI components
 * Must be inside CookieConsentProvider
 */
export function LayoutCookieComponents() {
  const { showBanner, showModal, preferences } = useCookieConsent();
  
  // Get GA measurement ID from environment
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-XXXXXXXXXX";

  return (
    <>
      {/* Cookie Consent Banner - only show if user hasn't decided */}
      {showBanner && <CookieConsentBanner />}
      
      {/* Cookie Preferences Modal */}
      {showModal && <CookiePreferencesModal key={preferences?.timestamp ?? 0} />}
      
      {/* Conditional Analytics Loader */}
      <ConditionalAnalyticsLoader measurementId={measurementId} />
    </>
  );
}
