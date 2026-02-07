/**
 * Shared TypeScript type definitions for The Custard Screams website
 * Feature: website-modernization
 */


// ============================================================================
// Section Types
// ============================================================================

/**
 * Unique identifier for each major section of the single-page layout
 */
export type SectionId = "hero" | "music" | "shows" | "about";

/**
 * Configuration for a single section including navigation metadata
 */
export interface SectionConfig {
  id: SectionId;
  title: string;
  ariaLabel: string;
  navLabel: string;
}

/**
 * Section configuration constants
 */
export const SECTIONS: readonly SectionConfig[] = [
  {
    id: "hero",
    title: "The Custard Screams",
    ariaLabel: "Hero section with band introduction",
    navLabel: "Home",
  },
  {
    id: "music",
    title: "Music",
    ariaLabel: "Music streaming and downloads",
    navLabel: "Music",
  },
  {
    id: "shows",
    title: "Live Shows",
    ariaLabel: "Upcoming and past live shows",
    navLabel: "Shows",
  },
  {
    id: "about",
    title: "About",
    ariaLabel: "About the band",
    navLabel: "About",
  },
] as const;

// ============================================================================
// Show Types
// ============================================================================

/**
 * Represents a single live performance (past or upcoming)
 */
export interface Show {
  id: string;
  date: Date;
  venue: string;
  location: string;
  city: string;
  country: string;
  ticketUrl: string;
  rsvpUrl?: string;
  imageUrl?: string;
  description?: string;
  isPast: boolean;
}

/**
 * Collection of show data organized by status
 */
export interface ShowsData {
  nextShow: Show | null;
  upcomingShows: Show[];
  pastShows: Show[];
}

// ============================================================================
// Cookie Consent Types
// ============================================================================

/**
 * User's cookie consent preferences
 */
export interface CookiePreferences {
  analytics: boolean;
  timestamp: number;
  version: number;
}

/**
 * Cookie consent storage configuration
 */
export const COOKIE_CONSENT_KEY = "custard-screams-cookie-consent";
export const CONSENT_VERSION = 1;

// ============================================================================
// Analytics Types
// ============================================================================

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean;
  measurementId: string;
}

/**
 * Analytics event structure
 */
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for Section wrapper component
 */
export interface SectionProps {
  id: SectionId;
  className?: string;
  children: any;
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * Props for BottomNav component
 */
export interface BottomNavProps {
  activeSection: SectionId | null;
  onNavigate: (sectionId: SectionId) => void;
}

/**
 * Icon type for navigation items
 */
export type IconType = "home" | "music" | "shows" | "about";

/**
 * Props for NavItem component
 */
export interface NavItemProps {
  section: SectionConfig;
  isActive: boolean;
  onClick: () => void;
  iconType?: IconType;
}

/**
 * Props for NextShowBanner component
 */
export interface NextShowBannerProps {
  show: Show | null;
  loading: boolean;
}

/**
 * Props for PastShowsGallery component
 */
export interface PastShowsGalleryProps {
  shows: Show[];
}

/**
 * Props for BandsintownWidget component
 */
export interface BandsintownWidgetProps {
  artistId: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Props for StickyTicketButton component
 */
export interface StickyTicketButtonProps {
  show: Show | null;
  visible: boolean;
}

/**
 * Props for CookieConsent component
 */
export interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Props for ImageWithFallback component
 */
export interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

// ============================================================================
// Breadcrumb Types
// ============================================================================

/**
 * Represents a single item in the breadcrumb trail
 * Feature: persistent-navigation-breadcrumbs
 */
export interface BreadcrumbItem {
  /** Display text for the breadcrumb */
  label: string;
  
  /** URL path for navigation */
  href: string;
  
  /** Whether this is the current page (non-clickable) */
  isActive: boolean;
}

/**
 * Props for Breadcrumb component
 * Feature: persistent-navigation-breadcrumbs
 */
export interface BreadcrumbProps {
  className?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for useIntersectionObserver hook
 */
export interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Return type for useSmoothScroll hook
 */
export interface UseSmoothScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  offset?: number;
}

/**
 * Return type for useCookieConsent hook
 */
export interface UseCookieConsentReturn {
  hasConsent: boolean | null; // null = not decided yet
  acceptCookies: () => void;
  declineCookies: () => void;
  withdrawConsent: () => void;
}
