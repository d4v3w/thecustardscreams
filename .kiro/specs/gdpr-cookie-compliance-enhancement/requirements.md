# Requirements Document

## Introduction

This specification addresses critical GDPR and ePrivacy Directive compliance gaps in The Custard Screams band website's cookie consent implementation. The current implementation has a basic consent banner that blocks Google Analytics, but fails to meet several EU legal requirements that could result in regulatory fines. This enhancement will implement granular cookie category controls, third-party script blocking, consent logging, and comprehensive transparency features to achieve full compliance with EU data protection regulations.

## Glossary

- **System**: The cookie consent management system within The Custard Screams website
- **User**: Any visitor to The Custard Screams website
- **EU_Visitor**: A user accessing the website from within the European Union
- **Cookie_Banner**: The initial consent interface displayed to users without saved preferences
- **Preferences_Modal**: The detailed interface for managing granular cookie category settings
- **Essential_Cookies**: Cookies strictly necessary for website functionality (localStorage for consent preferences)
- **Analytics_Cookies**: Cookies used for website traffic analysis (Google Analytics)
- **Marketing_Cookies**: Cookies used for third-party marketing and tracking (Bandsintown widget)
- **Consent_Log**: A timestamped record of user consent decisions
- **Third_Party_Script**: External JavaScript loaded from domains other than the website's domain
- **Bandsintown_Widget**: Third-party embedded component displaying upcoming concert information
- **Cookie_Settings_Link**: Persistent UI element allowing users to reopen consent preferences
- **Consent_Version**: Numeric identifier for the consent schema version

## Requirements

### Requirement 1: Third-Party Script Blocking

**User Story:** As an EU visitor, I want third-party tracking scripts blocked until I provide consent, so that my privacy is protected by default and the website complies with ePrivacy Directive requirements.

#### Acceptance Criteria

1. WHEN the page loads and the User has not provided Marketing_Cookies consent, THE System SHALL prevent the Bandsintown_Widget script from loading
2. WHEN the User grants Marketing_Cookies consent, THE System SHALL immediately load the Bandsintown_Widget script
3. WHEN the Bandsintown_Widget is blocked, THE System SHALL display a fallback message explaining why the widget is not visible
4. WHEN the User withdraws Marketing_Cookies consent, THE System SHALL remove the Bandsintown_Widget script from the page
5. WHEN the page loads and the User has previously granted Marketing_Cookies consent, THE System SHALL load the Bandsintown_Widget script immediately

### Requirement 2: Enhanced Consent Banner Interface

**User Story:** As an EU visitor, I want clear and equal options to accept or reject cookies, so that I can make an informed decision without being nudged toward acceptance.

#### Acceptance Criteria

1. WHEN the Cookie_Banner is displayed, THE System SHALL show an "Accept All" button, a "Reject All" button, and a "Manage Preferences" button with equal visual prominence
2. WHEN the Cookie_Banner is displayed, THE System SHALL list all cookie categories (Essential_Cookies, Analytics_Cookies, Marketing_Cookies) with brief descriptions
3. WHEN the Cookie_Banner is displayed, THE System SHALL identify all third-party services by name (Google Analytics, Bandsintown)
4. WHEN the Cookie_Banner is displayed, THE System SHALL include a clickable link to the website's privacy policy
5. WHEN the User clicks "Accept All", THE System SHALL grant consent for all optional cookie categories
6. WHEN the User clicks "Reject All", THE System SHALL deny consent for all optional cookie categories while maintaining Essential_Cookies
7. WHEN the User clicks "Manage Preferences", THE System SHALL open the Preferences_Modal

### Requirement 3: Granular Cookie Category Control

**User Story:** As a privacy-conscious user, I want to choose which types of cookies to accept, so that I have granular control over my data and can accept analytics while rejecting marketing cookies.

#### Acceptance Criteria

1. WHEN the Preferences_Modal is displayed, THE System SHALL show toggle controls for Analytics_Cookies and Marketing_Cookies
2. WHEN the Preferences_Modal is displayed, THE System SHALL show Essential_Cookies as always enabled without a toggle control
3. WHEN the User toggles Analytics_Cookies to enabled, THE System SHALL load Google Analytics scripts
4. WHEN the User toggles Analytics_Cookies to disabled, THE System SHALL remove Google Analytics scripts
5. WHEN the User toggles Marketing_Cookies to enabled, THE System SHALL load the Bandsintown_Widget script
6. WHEN the User toggles Marketing_Cookies to disabled, THE System SHALL remove the Bandsintown_Widget script
7. WHEN the User saves preferences in the Preferences_Modal, THE System SHALL persist the selections to localStorage
8. WHEN the User saves preferences in the Preferences_Modal, THE System SHALL close the modal and apply changes immediately

### Requirement 4: Consent Withdrawal Interface

**User Story:** As a returning visitor, I want to easily change my cookie preferences at any time, so that I can withdraw or modify my consent as guaranteed by GDPR Article 7(3).

#### Acceptance Criteria

1. THE System SHALL display a Cookie_Settings_Link in the website footer on all pages
2. WHEN the User clicks the Cookie_Settings_Link, THE System SHALL open the Preferences_Modal
3. WHEN the Preferences_Modal opens, THE System SHALL display the User's current consent status for each cookie category
4. WHEN the User changes preferences and saves, THE System SHALL immediately apply the new settings without requiring a page reload
5. WHEN the User withdraws all consent, THE System SHALL remove all non-essential scripts and clear associated data

### Requirement 5: Consent Logging and Audit Trail

**User Story:** As a website owner, I need timestamped records of all consent decisions, so that I can demonstrate GDPR compliance during regulatory audits as required by Article 7(1).

#### Acceptance Criteria

1. WHEN the User makes any consent decision, THE System SHALL create a Consent_Log entry with timestamp, preferences, consent method, user agent, and Consent_Version
2. WHEN a Consent_Log is created, THE System SHALL store it in localStorage as part of a consent history array
3. WHEN the User grants consent via "Accept All", THE System SHALL record the consent method as "accept-all"
4. WHEN the User denies consent via "Reject All", THE System SHALL record the consent method as "reject-all"
5. WHEN the User grants consent via custom category selection, THE System SHALL record the consent method as "custom"
6. THE System SHALL provide a function to export all Consent_Log entries as JSON for audit purposes
7. WHEN the Consent_Version changes, THE System SHALL prompt the User to review and re-consent

### Requirement 6: Enhanced Transparency and Disclosure

**User Story:** As a user, I want detailed information about what cookies are used and why, so that I can make an informed decision about my privacy.

#### Acceptance Criteria

1. WHEN the Preferences_Modal is displayed, THE System SHALL list all cookies used within each category with their names and purposes
2. WHEN the Preferences_Modal is displayed, THE System SHALL explain the purpose of each cookie category in plain language
3. WHEN the Preferences_Modal is displayed, THE System SHALL list all third-party services (Google Analytics, Bandsintown) with links to their privacy policies
4. WHEN the Preferences_Modal is displayed, THE System SHALL state the data retention period for each cookie category
5. WHEN the Cookie_Banner is displayed, THE System SHALL include a link to the full privacy policy
6. IF the privacy policy page does not exist, THEN THE System SHALL link to a placeholder privacy policy page

### Requirement 7: Accessibility and User Experience

**User Story:** As a user with accessibility needs, I want to navigate and control cookie preferences using only my keyboard and screen reader, so that I have equal access to privacy controls.

#### Acceptance Criteria

1. WHEN the Cookie_Banner is displayed, THE System SHALL support full keyboard navigation with visible focus indicators
2. WHEN the Preferences_Modal is displayed, THE System SHALL support full keyboard navigation with visible focus indicators
3. WHEN the Cookie_Banner or Preferences_Modal opens, THE System SHALL announce the dialog to screen readers with appropriate ARIA attributes
4. WHEN the User presses the Escape key while the Preferences_Modal is open, THE System SHALL close the modal
5. WHEN the Cookie_Banner or Preferences_Modal is displayed, THE System SHALL trap keyboard focus within the dialog
6. WHEN the Cookie_Banner or Preferences_Modal is displayed on mobile devices, THE System SHALL render in a responsive layout
7. WHEN the User has prefers-reduced-motion enabled, THE System SHALL disable animations in the consent interfaces

### Requirement 8: Backward Compatibility and Migration

**User Story:** As a returning visitor with existing consent preferences, I want my previous choices to be respected, so that I don't have to re-consent unnecessarily.

#### Acceptance Criteria

1. WHEN the System detects existing consent preferences in the old format, THE System SHALL migrate them to the new format
2. WHEN migrating old preferences, THE System SHALL map the old "analytics" boolean to the new Analytics_Cookies category
3. WHEN migrating old preferences, THE System SHALL default Marketing_Cookies to false for existing users
4. WHEN migrating old preferences, THE System SHALL preserve the original timestamp
5. WHEN migrating old preferences, THE System SHALL update the Consent_Version to the current version
6. WHEN the migration is complete, THE System SHALL function identically to the previous implementation for users who accepted or declined analytics

### Requirement 9: Cookie Category Definitions

**User Story:** As a developer, I need clear definitions of cookie categories, so that I can correctly classify cookies and maintain compliance as the website evolves.

#### Acceptance Criteria

1. THE System SHALL define Essential_Cookies as cookies strictly necessary for website functionality
2. THE System SHALL classify localStorage entries for consent preferences as Essential_Cookies
3. THE System SHALL define Analytics_Cookies as cookies used solely for measuring website traffic and user behavior
4. THE System SHALL classify Google Analytics as Analytics_Cookies
5. THE System SHALL define Marketing_Cookies as cookies used for third-party marketing, advertising, or user tracking
6. THE System SHALL classify the Bandsintown_Widget as Marketing_Cookies
7. THE System SHALL maintain these category definitions in a centralized configuration

### Requirement 10: Consent State Synchronization

**User Story:** As a user, I want my cookie preferences to take effect immediately across all page components, so that my privacy choices are respected without requiring a page reload.

#### Acceptance Criteria

1. WHEN the User changes cookie preferences, THE System SHALL notify all components that depend on consent state
2. WHEN Analytics_Cookies consent changes from disabled to enabled, THE System SHALL load Google Analytics within 100 milliseconds
3. WHEN Analytics_Cookies consent changes from enabled to disabled, THE System SHALL remove Google Analytics scripts within 100 milliseconds
4. WHEN Marketing_Cookies consent changes from disabled to enabled, THE System SHALL load the Bandsintown_Widget within 100 milliseconds
5. WHEN Marketing_Cookies consent changes from enabled to disabled, THE System SHALL remove the Bandsintown_Widget within 100 milliseconds
6. WHEN consent state changes, THE System SHALL update the UI to reflect the new state without visual glitches
