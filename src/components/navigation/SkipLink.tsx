"use client";

/**
 * Skip navigation link component
 * Provides keyboard users a shortcut to jump directly to main navigation
 * Feature: skip-navigation-link
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5
 */
export default function SkipLink() {
  return (
    <a
      href="#main-navigation"
      className="
        absolute -left-[9999px] top-0
        focus-visible:left-4 focus-visible:top-4
        z-50 px-4 py-2 rounded
        bg-black text-white
        font-display text-lg
        border-2 border-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        transition-all duration-200
        motion-reduce:transition-none
      "
    >
      Skip to navigation
    </a>
  );
}

SkipLink.displayName = "SkipLink";
