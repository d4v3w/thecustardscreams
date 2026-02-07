"use client";

import type { IconType, NavItemProps } from "~/lib/types";

/**
 * Individual navigation item for bottom nav
 * Displays icon and label with active state styling
 * Feature: punk-rock-navigation-icons
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 3.2, 6.1
 */
export default function NavItem({ section, isActive, onClick, iconType }: NavItemProps) {
  // Determine icon type from section ID if not provided
  const resolvedIconType: IconType = iconType || (section.id === "home" ? "home" : section.id as IconType);
  
  // Dev warning for missing iconType
  if (process.env.NODE_ENV === "development" && !iconType) {
    console.warn(`NavItem: iconType prop is missing for section "${section.id}", falling back to "${resolvedIconType}"`);
  }
  
  // Render CSS icon with multiple elements for music
  const renderIcon = () => {
    // Music icon uses multiple HTML elements for better control
    if (resolvedIconType === 'music') {
      return (
        <div 
          className={`icon-container icon-music relative ${isActive ? 'active' : ''}`}
          aria-hidden="true"
          style={{ width: '32px', height: '32px' }}
        >
          {/* Note stem */}
          <div className="music-stem" />
          {/* Note head */}
          <div className="music-head" />
          {/* Flag */}
          <div className="music-flag" />
        </div>
      );
    }
    
    // Other icons use pure CSS
    return (
      <div 
        className={`icon-container relative ${isActive ? 'active' : ''}`}
        aria-hidden="true"
        style={{ width: '32px', height: '32px' }}
      >
        <div 
          className={`icon-${resolvedIconType}`} 
          style={{ width: '32px', height: '32px', color: 'currentColor' }}
        />
      </div>
    );
  };

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
      {/* CSS Icon */}
      {renderIcon()}
      
      {/* Label */}
      <span className="text-xs font-bold">{section.navLabel}</span>
    </button>
  );
}
