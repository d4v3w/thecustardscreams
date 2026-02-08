/**
 * Enhanced GDPR-compliant cookie consent banner
 * Displays on first visit with equal prominence for accept/reject
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.1, 7.3, 7.5
 */

"use client";

import { useEffect, useRef } from "react";
import { useCookieConsent } from "~/hooks/useCookieConsent";

/**
 * Cookie Consent Banner Component
 * Shows three equally prominent options: Accept All, Reject All, Manage Preferences
 */
export function CookieConsentBanner() {
  const { acceptAll, rejectAll, openModal } = useCookieConsent();
  const bannerRef = useRef<HTMLDivElement>(null);

  // Trap focus within banner
  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const focusableElements = banner.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Banner */}
      <div
        ref={bannerRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 p-4 shadow-lg backdrop-blur-sm md:p-6"
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        aria-modal="true"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="cookie-consent-title"
            className="mb-2 text-lg font-bold text-amber-400"
          >
            Cookie Consent
          </h2>
          
          <p
            id="cookie-consent-description"
            className="mb-4 text-sm text-white md:text-base"
          >
            We use cookies to analyze site traffic and improve your experience.
            You can choose to accept or decline non-essential cookies. The site
            will function fully regardless of your choice.
          </p>

          {/* Cookie Categories Summary */}
          <div className="mb-4 space-y-2 text-sm text-white/80">
            <p>
              <strong className="text-white">Essential:</strong> Required for
              the website to function (always enabled)
            </p>
            <p>
              <strong className="text-white">Analytics:</strong> Google
              Analytics to measure website traffic
            </p>
            <p>
              <strong className="text-white">Marketing:</strong> Bandsintown
              widget to display upcoming shows
            </p>
          </div>

          {/* Privacy Policy Link */}
          <p className="mb-4 text-sm text-white/80">
            For more information, see our{" "}
            <a
              href="/privacy-policy"
              className="text-amber-400 underline hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
            >
              Privacy Policy
            </a>
            .
          </p>

          {/* Action Buttons - Equal Prominence */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={acceptAll}
              className="flex-1 rounded-lg bg-amber-400 px-6 py-3 font-bold text-black transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Accept all cookies including analytics and marketing"
            >
              Accept All
            </button>
            
            <button
              onClick={rejectAll}
              className="flex-1 rounded-lg border-2 border-white/40 bg-transparent px-6 py-3 font-bold text-white transition-colors hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Reject all non-essential cookies"
            >
              Reject All
            </button>
            
            <button
              onClick={openModal}
              className="flex-1 rounded-lg border-2 border-amber-400/40 bg-transparent px-6 py-3 font-bold text-amber-400 transition-colors hover:border-amber-400/60 hover:bg-amber-400/10 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Open preferences to customize cookie settings"
            >
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
