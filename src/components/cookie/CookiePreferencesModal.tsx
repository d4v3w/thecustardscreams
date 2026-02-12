/**
 * Cookie Preferences Modal
 * Detailed interface for granular cookie category selection
 * Feature: gdpr-cookie-compliance-enhancement
 * Requirements: 3.1, 3.2, 3.7, 3.8, 4.3, 6.1, 6.2, 6.3, 6.4, 7.2, 7.3, 7.4, 7.5, 7.6
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useCookieConsent } from "~/hooks/useCookieConsent";
import { COOKIE_CATEGORIES } from "~/lib/types";

/**
 * Modal for managing granular cookie preferences
 */
export function CookiePreferencesModal() {
  const { preferences, updatePreferences, closeModal } = useCookieConsent();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Local state for toggle changes - initialize from preferences
  // Component remounts when preferences change (via key prop), so no sync needed
  const [analytics, setAnalytics] = useState(preferences?.categories.analytics ?? false);
  const [marketing, setMarketing] = useState(preferences?.categories.marketing ?? false);

  // Handle save
  const handleSave = () => {
    updatePreferences({ analytics, marketing });
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeModal]);

  // Trap focus within modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
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
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-black/95 p-6 shadow-xl backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-modal-title"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="preferences-modal-title"
            className="text-2xl font-bold text-amber-400"
          >
            Cookie Preferences
          </h2>
          <button
            onClick={closeModal}
            className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Close preferences modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
          {COOKIE_CATEGORIES.map((category) => {
            const isEssential = category.id === "essential";
            const isAnalytics = category.id === "analytics";
            const isMarketing = category.id === "marketing";
            const isEnabled = isEssential
              ? true
              : isAnalytics
              ? analytics
              : marketing;

            return (
              <div
                key={category.id}
                className="rounded-lg border border-white/20 bg-white/5 p-4"
              >
                {/* Category Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/70">
                      {category.description}
                    </p>
                  </div>

                  {/* Toggle */}
                  <div className="ml-4">
                    {isEssential ? (
                      <div className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-400">
                        Always On
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (isAnalytics) setAnalytics(!analytics);
                          if (isMarketing) setMarketing(!marketing);
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black ${
                          isEnabled ? "bg-amber-400" : "bg-white/20"
                        }`}
                        role="switch"
                        aria-checked={isEnabled}
                        aria-label={`Toggle ${category.name}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-3">
                  {category.services.map((service) => (
                    <div key={service.name} className="text-sm">
                      <p className="font-semibold text-white">
                        {service.name}
                      </p>
                      <p className="mb-1 text-white/60">{service.purpose}</p>
                      <p className="text-xs text-white/50">
                        Cookies: {service.cookies.join(", ")}
                      </p>
                      <a
                        href={service.privacyPolicyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-amber-400 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        Privacy Policy →
                      </a>
                    </div>
                  ))}
                </div>

                {/* Retention Period */}
                <p className="mt-3 text-xs text-white/50">
                  Retention: {category.retentionPeriod}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-amber-400 px-6 py-3 font-bold text-black transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Save Preferences
          </button>
          <button
            onClick={closeModal}
            className="flex-1 rounded-lg border-2 border-white/20 bg-transparent px-6 py-3 font-bold text-white transition-colors hover:border-white/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
