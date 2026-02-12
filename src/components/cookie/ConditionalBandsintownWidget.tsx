/**
 * Conditional Bandsintown Widget Loader
 * Only loads widget when user has granted marketing consent
 * Uses lazy loading to defer third-party script until after page load
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.5, 3.6, 10.4, 10.5
 */

"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useCookieConsent } from "~/hooks/useCookieConsent";

// Lazy load the actual widget component
const BandsintownWidget = lazy(() => import("./BandsintownWidget"));

interface ConditionalBandsintownWidgetProps {
  artistId: string;
  fallbackMessage?: string;
}

/**
 * Component that conditionally loads Bandsintown widget based on marketing consent
 * Shows fallback message when consent not granted
 */
export function ConditionalBandsintownWidget({
  artistId,
  fallbackMessage,
}: ConditionalBandsintownWidgetProps) {
  const { hasMarketing, openModal } = useCookieConsent();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Always render consent prompt during SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="rounded-lg border-2 border-white/20 bg-black/50 p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold text-amber-400">
          Upcoming Shows
        </h3>
        <p className="mb-4 text-sm text-white/80">
          {fallbackMessage ||
            "To see our upcoming shows from Bandsintown, please enable marketing cookies in your cookie settings."}
        </p>
        <button
          onClick={openModal}
          className="rounded-lg bg-amber-400 px-6 py-2 font-bold text-black transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Open cookie preferences to enable upcoming shows"
        >
          Manage Cookie Preferences
        </button>
      </div>
    );
  }

  // After mounting, show consent prompt if no marketing consent
  if (!hasMarketing) {
    return (
      <div className="rounded-lg border-2 border-white/20 bg-black/50 p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold text-amber-400">
          Upcoming Shows
        </h3>
        <p className="mb-4 text-sm text-white/80">
          {fallbackMessage ||
            "To see our upcoming shows from Bandsintown, please enable marketing cookies in your cookie settings."}
        </p>
        <button
          onClick={openModal}
          className="rounded-lg bg-amber-400 px-6 py-2 font-bold text-black transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Open cookie preferences to enable upcoming shows"
        >
          Manage Cookie Preferences
        </button>
      </div>
    );
  }

  // Lazy load widget with Suspense fallback
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border-2 border-white/20 bg-black/50 p-6 text-center">
          <div className="mb-4 flex justify-center">
            <svg
              className="h-12 w-12 animate-spin text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-sm text-white/80">Loading upcoming shows...</p>
        </div>
      }
    >
      <BandsintownWidget artistId={artistId} />
    </Suspense>
  );
}
