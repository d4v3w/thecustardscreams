"use client";

import type { CookieConsentProps } from "~/lib/types";

/**
 * GDPR-compliant cookie consent banner
 * Displays on first visit and blocks analytics until consent
 * Feature: website-modernization
 * Requirements: 13.1, 13.7, 13.8
 */
export default function CookieConsent({
  onAccept,
  onDecline,
}: CookieConsentProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 p-4 shadow-lg backdrop-blur-sm md:p-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
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
          These cookies help us understand how visitors interact with our
          website. You can choose to accept or decline non-essential cookies.
          The site will function fully regardless of your choice.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onAccept}
            className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-black transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Accept cookies and enable analytics"
          >
            Accept Cookies
          </button>
          <button
            onClick={onDecline}
            className="rounded-lg border-2 border-white/20 bg-transparent px-6 py-3 font-bold text-white transition-colors hover:border-white/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Decline cookies and continue without analytics"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
