"use client";

import type { NavItemProps } from "~/lib/types";

/**
 * Individual navigation item for bottom nav
 * Displays icon and label with active state styling
 * Feature: website-modernization
 * Requirements: 2.2, 2.6, 8.1, 8.7
 */
export default function NavItem({ section, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center
        gap-1 rounded-lg px-3 py-2 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black
        ${
          isActive
            ? "bg-amber-400 text-black"
            : "bg-transparent text-white hover:bg-white/10"
        }
      `}
      aria-label={section.ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Icon placeholder - using emoji for now */}
      <span className="text-xl" aria-hidden="true">
        {section.id === "hero" && "🏠"}
        {section.id === "music" && "🎵"}
        {section.id === "shows" && "📅"}
        {section.id === "about" && "ℹ️"}
      </span>
      
      {/* Label */}
      <span className="text-xs font-bold">{section.navLabel}</span>
    </button>
  );
}
