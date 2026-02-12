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
export type SectionId = "home" | "music" | "shows" | "about";

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
    id: "home",
    title: "The Custard Screams",
    ariaLabel: "Home section with band introduction",
    navLabel: "Home",
  },
  {
    id: "shows",
    title: "Live Shows",
    ariaLabel: "Upcoming and past live shows",
    navLabel: "Shows",
  },
  {
    id: "music",
    title: "Music",
    ariaLabel: "Music streaming and downloads",
    navLabel: "Music",
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
 * Cookie category identifiers
 * Feature: gdpr-cookie-compliance-enhancement
 */
export type CookieCategoryId = 'essential' | 'analytics' | 'marketing';

/**
 * Information about a third-party service that uses cookies
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface CookieService {
  name: string;
  purpose: string;
  cookies: readonly string[];
  privacyPolicyUrl: string;
}

/**
 * Complete definition of a cookie category
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface CookieCategory {
  id: CookieCategoryId;
  name: string;
  description: string;
  required: boolean;
  services: readonly CookieService[];
  retentionPeriod: string;
}

/**
 * User's consent preferences by category
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface CookieCategoryPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

/**
 * Method by which user provided consent
 * Feature: gdpr-cookie-compliance-enhancement
 */
export type ConsentMethod = 'accept-all' | 'reject-all' | 'custom';

/**
 * User's cookie consent preferences (enhanced format v2)
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface CookiePreferences {
  categories: CookieCategoryPreferences;
  timestamp: number;
  version: number;
  method: ConsentMethod;
}

/**
 * Single consent decision log entry for audit trail
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface ConsentLog {
  id: string;
  timestamp: number;
  preferences: CookiePreferences;
  userAgent: string;
  version: number;
}

/**
 * Collection of consent logs for audit purposes
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface ConsentHistory {
  logs: ConsentLog[];
}

/**
 * React Context value for cookie consent state management
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface CookieConsentContextValue {
  preferences: CookiePreferences | null;
  hasEssential: boolean;
  hasAnalytics: boolean;
  hasMarketing: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<CookieCategoryPreferences>) => void;
  withdrawConsent: () => void;
  showBanner: boolean;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  exportConsentLogs: () => ConsentLog[];
}

/**
 * Cookie consent storage configuration
 */
export const COOKIE_CONSENT_KEY = "custard-screams-cookie-consent";
export const CONSENT_LOGS_KEY = "custard-screams-consent-logs";
export const CONSENT_VERSION = 2;
export const MAX_CONSENT_LOGS = 50;

/**
 * Cookie category definitions with services and metadata
 * Feature: gdpr-cookie-compliance-enhancement
 */
export const COOKIE_CATEGORIES: readonly CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for the website to function. These cannot be disabled.',
    required: true,
    services: [
      {
        name: 'Consent Preferences',
        purpose: 'Stores your cookie consent choices',
        cookies: ['custard-screams-cookie-consent', 'custard-screams-consent-logs'],
        privacyPolicyUrl: '/privacy-policy'
      }
    ],
    retentionPeriod: '1 year'
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors use our website.',
    required: false,
    services: [
      {
        name: 'Google Analytics',
        purpose: 'Measures website traffic and user behavior',
        cookies: ['_ga', '_ga_*', '_gid', '_gat'],
        privacyPolicyUrl: 'https://policies.google.com/privacy'
      }
    ],
    retentionPeriod: '2 years'
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used by third parties to show relevant content and track engagement.',
    required: false,
    services: [
      {
        name: 'Bandsintown',
        purpose: 'Displays upcoming concert information and may track engagement',
        cookies: ['bit_*', 'bandsintown_*'],
        privacyPolicyUrl: 'https://www.bandsintown.com/privacy'
      }
    ],
    retentionPeriod: '1 year'
  }
] as const;

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
 * Props for Nav component (main navigation)
 */
export interface NavProps {
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
 * Props for CookieSettingsLink component
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface CookieSettingsLinkProps {
  className?: string;
}

/**
 * Props for ConditionalBandsintownWidget component
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface ConditionalBandsintownWidgetProps {
  artistId: string;
  fallbackMessage?: string;
}

/**
 * Props for ConditionalAnalyticsLoader component
 * Feature: gdpr-cookie-compliance-enhancement
 */
export interface ConditionalAnalyticsLoaderProps {
  measurementId: string;
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
 * Return type for useCookieConsent hook (legacy - kept for backward compatibility)
 */
export interface UseCookieConsentReturn {
  hasConsent: boolean | null; // null = not decided yet
  acceptCookies: () => void;
  declineCookies: () => void;
  withdrawConsent: () => void;
}
