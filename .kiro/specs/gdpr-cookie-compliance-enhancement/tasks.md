# Implementation Plan: GDPR Cookie Compliance Enhancement

## Overview

This implementation plan converts the GDPR cookie compliance design into incremental coding tasks. The approach follows a bottom-up strategy: first establishing the data layer and core logic, then building UI components, and finally integrating everything together. Each task builds on previous work, with property-based tests placed close to implementation to catch errors early.

The implementation uses TypeScript with React Context for state management, fast-check for property-based testing, and maintains full backward compatibility with the existing cookie consent system.

## Tasks

- [x] 1. Update type definitions and constants
  - Add new TypeScript interfaces to `src/lib/types.ts` for enhanced cookie consent
  - Define `CookieCategoryId`, `CookieService`, `CookieCategory`, `CookieCategoryPreferences`, `ConsentMethod`, `ConsentLog`, `ConsentHistory`
  - Update `CookiePreferences` interface to new format with categories
  - Add `CookieConsentContextValue` interface for React Context
  - Update constants: `CONSENT_VERSION` to 2, add `CONSENT_LOGS_KEY`, `MAX_CONSENT_LOGS`
  - Define `COOKIE_CATEGORIES` constant array with Essential, Analytics, and Marketing definitions
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 2. Implement consent storage and migration utilities
  - [x] 2.1 Create `src/lib/cookieConsentStorage.ts` with storage functions
    - Implement `loadPreferences()` to read from localStorage with error handling
    - Implement `savePreferences()` to write to localStorage with error handling
    - Implement `migratePreferences()` to convert old format (v1) to new format (v2)
    - Implement `isValidPreferences()` to validate preference structure
    - Handle localStorage unavailable, corrupted data, and JSON parse errors
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 2.2 Write property test for migration
    - **Property 21: Migration Preserves Analytics Choice**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**
    - Generate random old format preferences (v1)
    - Verify migration preserves analytics boolean, sets marketing to false, preserves timestamp, updates version to 2

  - [ ]* 2.3 Write property test for persistence round trip
    - **Property 7: Preferences Persistence Round Trip**
    - **Validates: Requirements 3.7**
    - Generate random valid preferences
    - Verify saving and loading produces equivalent preferences

  - [ ]* 2.4 Write unit tests for storage error handling
    - Test localStorage unavailable (private browsing)
    - Test corrupted JSON data
    - Test invalid preference structure
    - Test migration with missing fields
    - _Requirements: 8.1_

- [x] 3. Implement consent logging utilities
  - [x] 3.1 Create `src/lib/cookieConsentLogs.ts` with logging functions
    - Implement `createConsentLog()` to generate log entry with UUID, timestamp, userAgent
    - Implement `saveConsentLog()` to append log to localStorage history
    - Implement `loadConsentLogs()` to read log history from localStorage
    - Implement `exportConsentLogs()` to return logs as JSON
    - Implement FIFO cleanup when logs exceed MAX_CONSENT_LOGS (50)
    - Handle localStorage errors gracefully
    - _Requirements: 5.1, 5.2, 5.6_

  - [ ]* 3.2 Write property test for consent logging structure
    - **Property 12: Consent Logging Structure**
    - **Validates: Requirements 5.1, 5.2**
    - Generate random consent decisions
    - Verify log entries contain all required fields: id, timestamp, preferences, userAgent, version

  - [ ]* 3.3 Write property test for consent method recording
    - **Property 13: Consent Method Recording**
    - **Validates: Requirements 5.3, 5.4, 5.5**
    - Generate random consent actions (accept-all, reject-all, custom)
    - Verify recorded method matches action type

  - [ ]* 3.4 Write property test for log export
    - **Property 14: Consent Log Export**
    - **Validates: Requirements 5.6**
    - Generate random consent history
    - Verify export returns valid JSON with all entries

  - [ ]* 3.5 Write unit test for log overflow
    - Test that logs are limited to MAX_CONSENT_LOGS entries
    - Test FIFO removal of oldest entries
    - _Requirements: 5.2_

- [x] 4. Create CookieConsentProvider with React Context
  - [x] 4.1 Create `src/contexts/CookieConsentContext.tsx`
    - Define `CookieConsentContext` with createContext
    - Implement `CookieConsentProvider` component
    - Initialize state from localStorage on mount with migration
    - Implement `acceptAll()` to grant all optional categories
    - Implement `rejectAll()` to deny all optional categories
    - Implement `updatePreferences()` to update specific categories
    - Implement `withdrawConsent()` to clear all preferences
    - Implement `openModal()` and `closeModal()` for UI state
    - Implement `exportConsentLogs()` to return audit trail
    - Log all consent decisions with createConsentLog
    - Provide context value with all state and actions
    - _Requirements: 2.5, 2.6, 4.5, 5.1, 5.3, 5.4, 5.5, 10.1_

  - [x] 4.2 Create `src/hooks/useCookieConsent.ts` hook
    - Implement hook that wraps useContext(CookieConsentContext)
    - Throw descriptive error if used outside provider
    - Return typed context value
    - _Requirements: 10.1_

  - [ ]* 4.3 Write property test for accept all
    - **Property 4: Accept All Grants All Categories**
    - **Validates: Requirements 2.5**
    - Generate random initial consent states
    - Verify acceptAll() sets analytics and marketing to true, essential remains true

  - [ ]* 4.4 Write property test for reject all
    - **Property 5: Reject All Denies Optional Categories**
    - **Validates: Requirements 2.6**
    - Generate random initial consent states
    - Verify rejectAll() sets analytics and marketing to false, essential remains true

  - [ ]* 4.5 Write property test for withdraw consent
    - **Property 11: Withdraw Consent Removes Scripts**
    - **Validates: Requirements 4.5**
    - Generate random consent states with some categories enabled
    - Verify withdrawConsent() clears preferences and sets state to null

  - [ ]* 4.6 Write unit tests for context
    - Test provider initialization with no saved preferences
    - Test provider initialization with saved preferences
    - Test provider initialization with old format (triggers migration)
    - Test hook throws error outside provider
    - _Requirements: 8.1, 10.1_

- [x] 5. Checkpoint - Ensure core logic tests pass
  - Run all unit and property tests for storage, logging, and context
  - Verify migration logic works correctly
  - Ensure all tests pass, ask the user if questions arise

- [x] 6. Implement conditional script loaders
  - [x] 6.1 Create `src/components/cookie/ConditionalAnalyticsLoader.tsx`
    - Use `useCookieConsent` hook to access hasAnalytics
    - Load Google Analytics script when hasAnalytics is true
    - Remove Google Analytics script when hasAnalytics is false
    - Check for existing script before loading (idempotent)
    - Handle script loading errors gracefully
    - Clean up script on unmount
    - _Requirements: 3.3, 3.4, 10.2, 10.3_

  - [x] 6.2 Create `src/components/cookie/ConditionalBandsintownWidget.tsx`
    - Use `useCookieConsent` hook to access hasMarketing
    - Render Bandsintown widget anchor element when hasMarketing is true
    - Load Bandsintown script when hasMarketing is true
    - Display fallback message with "Manage Cookie Preferences" button when hasMarketing is false
    - Remove script when hasMarketing changes to false
    - Handle script loading errors gracefully
    - Clean up script on unmount
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 3.5, 3.6, 10.4, 10.5_

  - [ ]* 6.3 Write property test for script blocking without consent
    - **Property 1: Script Blocking Without Consent**
    - **Validates: Requirements 1.1, 1.3**
    - Generate random page states where marketing consent is false or null
    - Verify Bandsintown script is not in DOM and fallback message is displayed

  - [ ]* 6.4 Write property test for script loading on consent grant
    - **Property 2: Script Loading on Consent Grant**
    - **Validates: Requirements 1.2, 1.5, 3.3, 3.5, 10.2, 10.4**
    - Generate random consent state transitions from false/null to true
    - Verify corresponding scripts load within 100ms

  - [ ]* 6.5 Write property test for script removal on consent withdrawal
    - **Property 3: Script Removal on Consent Withdrawal**
    - **Validates: Requirements 1.4, 3.4, 3.6, 10.3, 10.5**
    - Generate random consent state transitions from true to false
    - Verify corresponding scripts are removed within 100ms

  - [ ]* 6.6 Write property test for post-migration behavioral equivalence
    - **Property 22: Post-Migration Behavioral Equivalence**
    - **Validates: Requirements 8.6**
    - Generate random old format preferences
    - Migrate and verify Google Analytics loads/doesn't load based on migrated analytics value

  - [ ]* 6.7 Write unit tests for script loaders
    - Test script already loaded (idempotent behavior)
    - Test script loading failure
    - Test cleanup on unmount
    - _Requirements: 1.1, 3.3_

- [x] 7. Update ShowsSection to use conditional widget
  - [x] 7.1 Modify `src/app/_components/ShowsSection.tsx`
    - Remove direct Bandsintown script loading from useEffect
    - Replace Bandsintown anchor element with ConditionalBandsintownWidget component
    - Pass all existing data attributes as props
    - Remove script cleanup logic (now handled by ConditionalBandsintownWidget)
    - _Requirements: 1.1, 1.2, 1.5_

  - [ ]* 7.2 Write integration test for ShowsSection
    - Test widget displays when marketing consent granted
    - Test fallback message displays when marketing consent denied
    - _Requirements: 1.1, 1.3_

- [x] 8. Implement enhanced CookieConsentBanner
  - [x] 8.1 Update `src/components/cookie/CookieConsent.tsx`
    - Rename to `CookieConsentBanner.tsx` for clarity
    - Remove props, use `useCookieConsent` hook instead
    - Add three buttons: "Accept All", "Reject All", "Manage Preferences" with equal prominence
    - Add brief description of cookie categories (Essential, Analytics, Marketing)
    - Add list of third-party services: "We use Google Analytics and Bandsintown"
    - Add link to privacy policy (/privacy-policy)
    - Call `acceptAll()` on "Accept All" click
    - Call `rejectAll()` on "Reject All" click
    - Call `openModal()` on "Manage Preferences" click
    - Ensure keyboard navigation with visible focus indicators
    - Add ARIA attributes: role="dialog", aria-labelledby, aria-describedby
    - Trap focus within banner
    - Style with Tailwind CSS matching existing design
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.1, 7.3, 7.5_

  - [ ]* 8.2 Write property test for manage preferences opens modal
    - **Property 6: Manage Preferences Opens Modal**
    - **Validates: Requirements 2.7**
    - Generate random UI states
    - Verify clicking "Manage Preferences" transitions modal state to open

  - [ ]* 8.3 Write unit tests for banner
    - Test banner shows three buttons with correct text
    - Test banner lists cookie categories
    - Test banner mentions third-party services
    - Test banner includes privacy policy link
    - Test banner has proper ARIA attributes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 7.3_

- [x] 9. Implement CookiePreferencesModal
  - [x] 9.1 Create `src/components/cookie/CookiePreferencesModal.tsx`
    - Use `useCookieConsent` hook to access state and actions
    - Render modal overlay when showModal is true
    - Display header with "Cookie Preferences" title and close button
    - Display three category sections: Essential, Analytics, Marketing
    - Show Essential as always enabled (no toggle)
    - Show Analytics and Marketing with toggle controls
    - Display current consent state in toggles
    - Show detailed information for each category: description, services, cookies, retention period, privacy policy links
    - Maintain local state for toggle changes
    - Call `updatePreferences()` on "Save Preferences" click
    - Call `closeModal()` on "Cancel", close button, Escape key, or backdrop click
    - Ensure keyboard navigation with visible focus indicators
    - Trap focus within modal
    - Add ARIA attributes: role="dialog", aria-modal="true", aria-labelledby
    - Style with Tailwind CSS as modal overlay
    - Make responsive for mobile devices
    - _Requirements: 3.1, 3.2, 3.7, 3.8, 4.3, 6.1, 6.2, 6.3, 6.4, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 9.2 Write property test for modal save applies changes
    - **Property 8: Modal Save Applies Changes Immediately**
    - **Validates: Requirements 3.8, 4.4**
    - Generate random preference changes
    - Verify clicking "Save" closes modal and applies changes without page reload

  - [ ]* 9.3 Write property test for modal displays current state
    - **Property 10: Modal Displays Current State**
    - **Validates: Requirements 4.3**
    - Generate random saved consent preferences
    - Verify opening modal displays toggle states matching saved preferences

  - [ ]* 9.4 Write property test for escape key closes modal
    - **Property 17: Escape Key Closes Modal**
    - **Validates: Requirements 7.4**
    - Generate random modal open states
    - Verify pressing Escape key closes modal

  - [ ]* 9.5 Write property test for focus trap
    - **Property 18: Focus Trap in Dialogs**
    - **Validates: Requirements 7.5**
    - Generate random open dialog states
    - Verify tabbing cycles focus within dialog

  - [ ]* 9.6 Write property test for responsive layout
    - **Property 19: Responsive Layout Rendering**
    - **Validates: Requirements 7.6**
    - Generate random viewport widths (mobile, tablet, desktop)
    - Verify modal renders without overflow

  - [ ]* 9.7 Write unit tests for modal
    - Test modal shows toggle controls for analytics and marketing
    - Test modal shows essential as always enabled
    - Test modal lists all cookies and services
    - Test modal includes retention periods
    - Test modal includes privacy policy links
    - Test modal has proper ARIA attributes
    - _Requirements: 3.1, 3.2, 6.1, 6.2, 6.3, 6.4, 7.3_

- [x] 10. Implement CookieSettingsLink
  - [x] 10.1 Create `src/components/cookie/CookieSettingsLink.tsx`
    - Use `useCookieConsent` hook to access openModal
    - Render as text link or button
    - Call `openModal()` on click
    - Accept optional className prop for styling
    - Ensure keyboard accessible
    - Style with Tailwind CSS to match footer design
    - _Requirements: 4.1, 4.2_

  - [ ]* 10.2 Write property test for settings link opens modal
    - **Property 9: Settings Link Opens Modal**
    - **Validates: Requirements 4.2**
    - Generate random page states
    - Verify clicking settings link opens modal

  - [ ]* 10.3 Write unit test for settings link
    - Test link renders with correct text
    - Test link is keyboard accessible
    - _Requirements: 4.1_

- [x] 11. Update application layout to integrate consent system
  - [x] 11.1 Wrap app with CookieConsentProvider in `src/app/layout.tsx`
    - Import CookieConsentProvider
    - Wrap children with provider at top level
    - Ensure provider wraps all components that need consent state
    - _Requirements: 10.1_

  - [x] 11.2 Update banner rendering logic in `src/app/layout.tsx`
    - Remove old useCookieConsent hook usage
    - Use new CookieConsentBanner component (no props needed)
    - Render banner when showBanner is true (handled by provider)
    - _Requirements: 2.1, 5.7_

  - [x] 11.3 Add CookiePreferencesModal to layout
    - Import and render CookiePreferencesModal component
    - Modal visibility controlled by provider state
    - _Requirements: 2.7, 4.2_

  - [x] 11.4 Add CookieSettingsLink to footer
    - Locate footer component or section in layout
    - Add CookieSettingsLink component to footer
    - Style to match existing footer links
    - _Requirements: 4.1_

  - [x] 11.5 Add ConditionalAnalyticsLoader to layout
    - Import ConditionalAnalyticsLoader component
    - Pass NEXT_PUBLIC_GA_MEASUREMENT_ID as prop
    - Remove old analytics loading logic from useCookieConsent hook
    - _Requirements: 3.3, 3.4_

  - [ ]* 11.6 Write property test for version mismatch triggers re-consent
    - **Property 15: Version Mismatch Triggers Re-consent**
    - **Validates: Requirements 5.7**
    - Generate random stored preferences with version < current version
    - Verify banner displays to prompt re-consent

  - [ ]* 11.7 Write property test for state change propagation
    - **Property 23: State Change Propagation**
    - **Validates: Requirements 10.1**
    - Generate random consent preference changes
    - Verify all components receive updated state within one render cycle

- [x] 12. Checkpoint - Ensure integration tests pass
  - Run all tests including integration tests
  - Test complete user workflows: accept all, reject all, custom preferences
  - Verify scripts load/unload correctly
  - Verify preferences persist across page reloads
  - Ensure all tests pass, ask the user if questions arise

- [x] 13. Implement accessibility enhancements
  - [x] 13.1 Add keyboard navigation support
    - Verify Tab/Shift+Tab navigation works in banner and modal
    - Verify Enter/Space activate buttons
    - Verify Escape closes modal
    - Add visible focus indicators with focus-visible CSS
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 13.2 Add reduced motion support
    - Check for prefers-reduced-motion media query
    - Disable animations/transitions when enabled
    - Apply to banner and modal
    - _Requirements: 7.7_

  - [ ]* 13.3 Write property test for keyboard navigation
    - **Property 16: Keyboard Navigation Completeness**
    - **Validates: Requirements 7.1, 7.2**
    - Generate random interactive elements in banner and modal
    - Verify all elements reachable and operable with keyboard

  - [ ]* 13.4 Write property test for reduced motion compliance
    - **Property 20: Reduced Motion Compliance**
    - **Validates: Requirements 7.7**
    - Generate random user states with prefers-reduced-motion enabled
    - Verify consent interfaces don't display animations

  - [ ]* 13.5 Run accessibility audit with axe-core
    - Test banner with axe-core
    - Test modal with axe-core
    - Verify WCAG 2.1 AA compliance
    - Fix any violations found
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 14. Create placeholder privacy policy page
  - [x] 14.1 Create `src/app/privacy-policy/page.tsx`
    - Create basic privacy policy page
    - Include sections: Introduction, Cookies We Use, Third-Party Services, Your Rights, Contact
    - List all cookie categories and services
    - Explain data retention periods
    - Link to Google Analytics and Bandsintown privacy policies
    - Style with Tailwind CSS matching site design
    - _Requirements: 2.4, 6.5, 6.6_

  - [ ]* 14.2 Write unit test for privacy policy page
    - Test page renders without errors
    - Test page includes all required sections
    - _Requirements: 6.6_

- [x] 15. Install and configure fast-check for property-based testing
  - [x] 15.1 Install fast-check package
    - Run `pnpm add -D fast-check @types/fast-check`
    - Verify installation in package.json
    - _Requirements: All property tests_

  - [x] 15.2 Configure Jest for fast-check
    - Update jest.config.js if needed
    - Ensure fast-check works with existing Jest setup
    - Run sample property test to verify configuration
    - _Requirements: All property tests_

- [x] 16. Final integration and cleanup
  - [x] 16.1 Remove old cookie consent implementation
    - Remove old `useCookieConsent` hook if replaced
    - Remove old `CookieConsent` component if replaced
    - Clean up unused imports
    - _Requirements: 8.6_

  - [x] 16.2 Update type exports in `src/lib/types.ts`
    - Export all new cookie consent types
    - Ensure backward compatibility for any external usage
    - _Requirements: 9.7_

  - [x] 16.3 Add JSDoc comments to all new functions
    - Document all public functions and components
    - Include feature name and requirement references
    - Follow existing documentation style
    - _Requirements: All_

  - [ ]* 16.4 Run full test suite
    - Run all unit tests
    - Run all property tests (100+ iterations each)
    - Run all E2E tests
    - Run accessibility tests
    - Verify 100% of tests pass
    - _Requirements: All_

- [x] 17. Final checkpoint - Complete verification
  - Verify all requirements are met
  - Test complete user workflows manually
  - Verify GDPR compliance features work correctly
  - Verify backward compatibility with existing preferences
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based and unit tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation maintains full backward compatibility with existing cookie consent
- All components use TypeScript for type safety
- All components use Tailwind CSS for styling consistency
- fast-check library is used for property-based testing
- Jest with React Testing Library is used for unit testing
- Playwright is used for E2E testing (already integrated)
