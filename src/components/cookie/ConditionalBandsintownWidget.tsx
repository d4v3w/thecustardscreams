/**
 * Conditional Bandsintown Widget Loader
 * Only loads widget when user has granted marketing consent
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.5, 3.6, 10.4, 10.5
 */

"use client";

import { useEffect } from "react";
import { useCookieConsent } from "~/hooks/useCookieConsent";

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

  useEffect(() => {
    if (hasMarketing) {
      loadBandsintownScript();
    } else {
      removeBandsintownScript();
    }

    // Cleanup on unmount
    return () => {
      removeBandsintownScript();
    };
  }, [hasMarketing]);

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

  // Render Bandsintown widget anchor when consent granted
  return (
    <a
      className="bit-widget-initializer"
      data-artist-name={artistId}
      data-events-to-display=""
      data-background-color="rgba(0,0,0,1)"
      data-separator-color="rgba(155,155,155,1)"
      data-text-color="rgba(248,231,28,1)"
      data-font="Helvetica"
      data-auto-style="true"
      data-button-label-capitalization="uppercase"
      data-header-capitalization="uppercase"
      data-location-capitalization="uppercase"
      data-venue-capitalization="uppercase"
      data-display-local-dates="true"
      data-local-dates-position="tab"
      data-display-past-dates="true"
      data-display-details="false"
      data-display-lineup="false"
      data-display-start-time="false"
      data-social-share-icon="false"
      data-display-limit="all"
      data-date-format="MMM. D, YYYY"
      data-date-orientation="horizontal"
      data-date-border-color="#4A4A4A"
      data-date-border-width="1px"
      data-date-capitalization="capitalize"
      data-date-border-radius="10px"
      data-event-ticket-cta-size="medium"
      data-event-custom-ticket-text=""
      data-event-ticket-text="TICKETS"
      data-event-ticket-icon="false"
      data-event-ticket-cta-text-color="rgba(255,255,255,1)"
      data-event-ticket-cta-bg-color="rgba(74,74,74,1)"
      data-event-ticket-cta-border-color="rgba(74,74,74,1)"
      data-event-ticket-cta-border-width="0px"
      data-event-ticket-cta-border-radius="2px"
      data-sold-out-button-text-color="rgba(255,255,255,1)"
      data-sold-out-button-background-color="rgba(74,74,74,1)"
      data-sold-out-button-border-color="rgba(74,74,74,1)"
      data-sold-out-button-clickable="true"
      data-event-rsvp-position="left"
      data-event-rsvp-cta-size="medium"
      data-event-rsvp-only-show-icon="false"
      data-event-rsvp-text="RSVP"
      data-event-rsvp-icon="false"
      data-event-rsvp-cta-text-color="rgba(74,74,74,1)"
      data-event-rsvp-cta-bg-color="rgba(255,255,255,1)"
      data-event-rsvp-cta-border-color="rgba(74,74,74,1)"
      data-event-rsvp-cta-border-width="1px"
      data-event-rsvp-cta-border-radius="2px"
      data-follow-section-position="top"
      data-follow-section-alignment="center"
      data-follow-section-header-text="Get updates on new shows, new music, and more"
      data-follow-section-cta-size="medium"
      data-follow-section-cta-text="FOLLOW"
      data-follow-section-cta-icon="false"
      data-follow-section-cta-text-color="rgba(255,255,255,1)"
      data-follow-section-cta-bg-color="rgba(74,74,74,1)"
      data-follow-section-cta-border-color="rgba(74,74,74,1)"
      data-follow-section-cta-border-width="0px"
      data-follow-section-cta-border-radius="2px"
      data-play-my-city-position="bottom"
      data-play-my-city-alignment="center"
      data-play-my-city-header-text="Don't see a show near you?"
      data-play-my-city-cta-size="medium"
      data-play-my-city-cta-text="REQUEST A SHOW"
      data-play-my-city-cta-icon="false"
      data-play-my-city-cta-text-color="rgba(255,255,255,1)"
      data-play-my-city-cta-bg-color="rgba(74,74,74,1)"
      data-play-my-city-cta-border-color="rgba(74,74,74,1)"
      data-play-my-city-cta-border-width="0px"
      data-play-my-city-cta-border-radius="2px"
      data-optin-font=""
      data-optin-text-color=""
      data-optin-bg-color=""
      data-optin-cta-text-color=""
      data-optin-cta-bg-color=""
      data-optin-cta-border-width=""
      data-optin-cta-border-radius=""
      data-optin-cta-border-color=""
      data-language="en"
      data-layout-breakpoint="900"
      data-app-id="9e137db868386b2ef5a78258f5fdbbb8"
      data-affil-code=""
      data-bit-logo-position="bottomRight"
      data-bit-logo-color="rgba(248,231,28,1)"
    ></a>
  );
}

/**
 * Load Bandsintown widget script
 */
function loadBandsintownScript() {
  if (typeof window === "undefined") {
    return;
  }

  // Check if script already loaded
  if (document.getElementById("bandsintown-script")) {
    return;
  }

  try {
    const script = document.createElement("script");
    script.src = "https://widgetv3.bandsintown.com/main.min.js";
    script.defer = true;
    script.id = "bandsintown-script";

    script.onerror = (error) => {
      console.error("Failed to load Bandsintown widget:", error);
    };

    document.body.appendChild(script);
  } catch (error) {
    console.error("Error loading Bandsintown widget:", error);
  }
}

/**
 * Remove Bandsintown widget script
 */
function removeBandsintownScript() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const script = document.getElementById("bandsintown-script");
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
  } catch (error) {
    console.error("Error removing Bandsintown widget:", error);
  }
}
