# Design Document: GDPR Cookie Compliance Enhancement

## Overview

This design implements a comprehensive GDPR and ePrivacy Directive compliant cookie consent system for The Custard Screams website. The solution extends the existing cookie consent implementation to support granular cookie categories, third-party script blocking, consent logging, and enhanced transparency features.

The design follows a layered architecture with clear separation between consent state management, UI components, and script loading logic. It maintains backward compatibility with existing consent preferences while adding new capabilities required for EU compliance.

### Key Design Decisions

1. **Category-Based Consent Model**: Replace the binary analytics consent with a multi-category system (Essential, Analytics, Marketing) to provide granular control
2. **React Context for State Management**: Use React Context to propagate consent state changes across all components without prop drilling
3. **Conditional Script Loading**: Implement wrapper components that check consent before loading third-party scripts
4. **localStorage for Consent Logs**: Store consent history in localStorage for audit trail (can be migrated to backend later)
5. **Migration Strategy**: Automatically upgrade old consent format to new format on first load

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Application                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              CookieConsentProvider                     │  │
│  │  (React Context - manages consent state globally)     │  │
│  └───────────────────────────────────────────────────────┘  │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         │                 │                 │               │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐        │
│  │   Cookie    │  │  Preferences │  │   Cookie    │        │
│  │   Banner    │  │    Modal     │  │  Settings   │        │
│  │             │  │              │  │    Link     │        │
│  └─────────────┘  └──────────────┘  └─────────────┘        │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Conditional Script Loaders                     │  │
│  │  ┌──────────────┐  ┌──────────────────────────────┐   │  │
│  │  │   Google     │  │      Bandsintown             │   │  │
│  │  │  Analytics   │  │       Widget                 │   │  │
│  │  │   Loader     │  │       Loader                 │   │  │
│  │  └──────────────┘  └──────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Consent Storage Layer                     │  │
│  │  (localStorage with migration & logging)               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Initial Load**: CookieConsentProvider reads localStorage, migrates old format if needed, initializes state
2. **User Interaction**: User interacts with Cookie Banner or Preferences Modal
3. **State Update**: Provider updates consent state and triggers re-render
4. **Script Loading**: Conditional loaders observe state changes and load/unload scripts
5. **Persistence**: Provider saves preferences and logs to localStorage

## Components and Interfaces

### 1. CookieConsentProvider (React Context)

**Purpose**: Centralized consent state management with React Context API

**Interface**:
```typescript
interface CookieConsentContextValue {
  // Current consent state
  preferences: CookiePreferences | null;
  
  // Quick access to category states
  hasEssential: boolean;
  hasAnalytics: boolean;
  hasMarketing: boolean;
  
  // Actions
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<CookieCategoryPreferences>) => void;
  withdrawConsent: () => void;
  
  // UI state
  showBanner: boolean;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  
  // Audit
  exportConsentLogs: () => ConsentLog[];
}
```

**Behavior**:
- Initializes consent state from localStorage on mount
- Migrates old format preferences automatically
- Provides consent state to all child components via Context
- Handles all consent state mutations
- Logs all consent decisions with timestamps
- Triggers script loading/unloading via state changes

### 2. CookieConsentBanner (Enhanced)

**Purpose**: Initial consent interface with equal prominence for accept/reject

**Interface**:
```typescript
interface CookieConsentBannerProps {
  // No props needed - uses context
}
```

**UI Elements**:
- Heading: "Cookie Consent"
- Description: Brief explanation of cookie usage
- Third-party disclosure: "We use Google Analytics and Bandsintown"
- Privacy policy link
- Three buttons with equal prominence:
  - "Accept All" (primary style)
  - "Reject All" (secondary style, equal size)
  - "Manage Preferences" (tertiary style)

**Behavior**:
- Only renders when `showBanner === true` (no saved preferences)
- Calls context methods on button clicks
- Accessible with keyboard navigation and ARIA attributes
- Fixed position at bottom of viewport
- Backdrop prevents interaction with page until decision made

### 3. CookiePreferencesModal (New)

**Purpose**: Detailed interface for granular cookie category selection

**Interface**:
```typescript
interface CookiePreferencesModalProps {
  // No props needed - uses context
}
```

**UI Sections**:
1. **Header**: "Cookie Preferences" with close button
2. **Category List**: Three expandable sections
   - Essential Cookies (always on, no toggle)
   - Analytics Cookies (toggle, description, services list)
   - Marketing Cookies (toggle, description, services list)
3. **Details per Category**:
   - Purpose explanation
   - List of cookies/services
   - Data retention period
   - Links to third-party privacy policies
4. **Footer**: "Save Preferences" and "Cancel" buttons

**Behavior**:
- Renders as modal overlay when `showModal === true`
- Displays current consent state in toggles
- Updates local state as user toggles categories
- Saves to context on "Save Preferences" click
- Closes on "Cancel", Escape key, or backdrop click
- Traps keyboard focus within modal
- Accessible with ARIA dialog attributes

### 4. CookieSettingsLink (New)

**Purpose**: Persistent link in footer to reopen preferences

**Interface**:
```typescript
interface CookieSettingsLinkProps {
  className?: string;
}
```

**Behavior**:
- Renders as text link or button in footer
- Calls `openModal()` from context on click
- Always visible (even after consent decision)
- Accessible with keyboard and screen readers

### 5. ConditionalAnalyticsLoader (Enhanced)

**Purpose**: Loads Google Analytics only when Analytics consent granted

**Interface**:
```typescript
interface ConditionalAnalyticsLoaderProps {
  measurementId: string;
}
```

**Behavior**:
- Observes `hasAnalytics` from context
- Loads GA script when `hasAnalytics === true`
- Removes GA script when `hasAnalytics === false`
- Cleans up on unmount
- Idempotent (safe to call multiple times)

### 6. ConditionalBandsintownWidget (New)

**Purpose**: Loads Bandsintown widget only when Marketing consent granted

**Interface**:
```typescript
interface ConditionalBandsintownWidgetProps {
  artistId: string;
  // All existing Bandsintown data attributes
}
```

**Behavior**:
- Observes `hasMarketing` from context
- Loads Bandsintown script when `hasMarketing === true`
- Displays fallback message when `hasMarketing === false`
- Removes script when consent withdrawn
- Cleans up on unmount

**Fallback UI**:
```
┌─────────────────────────────────────────────┐
│  🎵 Upcoming Shows                          │
│                                             │
│  To see our upcoming shows, please enable   │
│  marketing cookies in your cookie settings. │
│                                             │
│  [Manage Cookie Preferences]                │
└─────────────────────────────────────────────┘
```

### 7. useCookieConsent Hook (Enhanced)

**Purpose**: Provides access to consent context (convenience hook)

**Interface**:
```typescript
function useCookieConsent(): CookieConsentContextValue
```

**Behavior**:
- Wraps `useContext(CookieConsentContext)`
- Throws error if used outside provider
- Provides type-safe access to consent state and actions

## Data Models

### CookieCategory

Defines the three cookie categories with metadata:

```typescript
interface CookieCategory {
  id: 'essential' | 'analytics' | 'marketing';
  name: string;
  description: string;
  required: boolean;
  services: CookieService[];
  retentionPeriod: string;
}

interface CookieService {
  name: string;
  purpose: string;
  cookies: string[];
  privacyPolicyUrl: string;
}
```

**Category Definitions**:

```typescript
const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for the website to function. These cannot be disabled.',
    required: true,
    services: [
      {
        name: 'Consent Preferences',
        purpose: 'Stores your cookie consent choices',
        cookies: ['custard-screams-cookie-consent'],
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
];
```

### CookiePreferences (Enhanced)

Stores user's consent choices with additional metadata:

```typescript
interface CookieCategoryPreferences {
  essential: boolean;  // Always true
  analytics: boolean;
  marketing: boolean;
}

interface CookiePreferences {
  categories: CookieCategoryPreferences;
  timestamp: number;
  version: number;
  method: ConsentMethod;
}

type ConsentMethod = 'accept-all' | 'reject-all' | 'custom';
```

**Storage Key**: `custard-screams-cookie-consent` (unchanged for backward compatibility)

**Current Version**: `2` (incremented from existing version 1)

### ConsentLog

Records each consent decision for audit trail:

```typescript
interface ConsentLog {
  id: string;  // UUID
  timestamp: number;
  preferences: CookiePreferences;
  userAgent: string;
  version: number;
}

interface ConsentHistory {
  logs: ConsentLog[];
}
```

**Storage Key**: `custard-screams-consent-logs`

**Behavior**:
- Append-only log (never delete entries)
- Maximum 50 entries (FIFO when exceeded)
- Each consent change creates new log entry
- Exportable as JSON for audits

### Migration Logic

Handles upgrading from old format to new format:

```typescript
// Old format (version 1)
interface OldCookiePreferences {
  analytics: boolean;
  timestamp: number;
  version: 1;
}

// Migration function
function migratePreferences(old: OldCookiePreferences): CookiePreferences {
  return {
    categories: {
      essential: true,
      analytics: old.analytics,
      marketing: false  // Default to false for existing users
    },
    timestamp: old.timestamp,  // Preserve original timestamp
    version: 2,
    method: old.analytics ? 'accept-all' : 'reject-all'
  };
}
```

**Migration Trigger**: Automatically runs when version mismatch detected

**Backward Compatibility**: Migrated preferences maintain user's original analytics choice

## Data Models

### TypeScript Type Definitions

All types will be added to `src/lib/types.ts`:

```typescript
// Cookie Categories
export type CookieCategoryId = 'essential' | 'analytics' | 'marketing';

export interface CookieService {
  name: string;
  purpose: string;
  cookies: string[];
  privacyPolicyUrl: string;
}

export interface CookieCategory {
  id: CookieCategoryId;
  name: string;
  description: string;
  required: boolean;
  services: CookieService[];
  retentionPeriod: string;
}

// Consent Preferences
export interface CookieCategoryPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export type ConsentMethod = 'accept-all' | 'reject-all' | 'custom';

export interface CookiePreferences {
  categories: CookieCategoryPreferences;
  timestamp: number;
  version: number;
  method: ConsentMethod;
}

// Consent Logging
export interface ConsentLog {
  id: string;
  timestamp: number;
  preferences: CookiePreferences;
  userAgent: string;
  version: number;
}

export interface ConsentHistory {
  logs: ConsentLog[];
}

// Context
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

// Component Props
export interface CookieSettingsLinkProps {
  className?: string;
}

export interface ConditionalBandsintownWidgetProps {
  artistId: string;
  fallbackMessage?: string;
}

export interface ConditionalAnalyticsLoaderProps {
  measurementId: string;
}

// Constants
export const COOKIE_CONSENT_KEY = 'custard-screams-cookie-consent';
export const CONSENT_LOGS_KEY = 'custard-screams-consent-logs';
export const CONSENT_VERSION = 2;
export const MAX_CONSENT_LOGS = 50;
```

### Storage Schema

**localStorage Keys**:
1. `custard-screams-cookie-consent`: Current preferences (CookiePreferences)
2. `custard-screams-consent-logs`: Audit trail (ConsentHistory)

**Example Stored Data**:

```json
// custard-screams-cookie-consent
{
  "categories": {
    "essential": true,
    "analytics": true,
    "marketing": false
  },
  "timestamp": 1704067200000,
  "version": 2,
  "method": "custom"
}

// custard-screams-consent-logs
{
  "logs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "timestamp": 1704067200000,
      "preferences": {
        "categories": {
          "essential": true,
          "analytics": true,
          "marketing": false
        },
        "timestamp": 1704067200000,
        "version": 2,
        "method": "custom"
      },
      "userAgent": "Mozilla/5.0...",
      "version": 2
    }
  ]
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Script Blocking Without Consent

*For any* page load or state where Marketing consent is false or null, the Bandsintown widget script should not be present in the DOM, and a fallback message should be displayed.

**Validates: Requirements 1.1, 1.3**

### Property 2: Script Loading on Consent Grant

*For any* consent state transition from false/null to true for a cookie category (Analytics or Marketing), the corresponding script (Google Analytics or Bandsintown) should load within 100 milliseconds.

**Validates: Requirements 1.2, 1.5, 3.3, 3.5, 10.2, 10.4**

### Property 3: Script Removal on Consent Withdrawal

*For any* consent state transition from true to false for a cookie category (Analytics or Marketing), the corresponding script should be removed from the DOM within 100 milliseconds.

**Validates: Requirements 1.4, 3.4, 3.6, 10.3, 10.5**

### Property 4: Accept All Grants All Categories

*For any* initial consent state, clicking "Accept All" should result in all optional cookie categories (Analytics and Marketing) being set to true, while Essential remains true.

**Validates: Requirements 2.5**

### Property 5: Reject All Denies Optional Categories

*For any* initial consent state, clicking "Reject All" should result in all optional cookie categories (Analytics and Marketing) being set to false, while Essential remains true.

**Validates: Requirements 2.6**

### Property 6: Manage Preferences Opens Modal

*For any* UI state, clicking "Manage Preferences" should transition the modal state from closed to open.

**Validates: Requirements 2.7**

### Property 7: Preferences Persistence Round Trip

*For any* valid cookie category preferences, saving those preferences to localStorage and then reading them back should produce equivalent preferences.

**Validates: Requirements 3.7**

### Property 8: Modal Save Applies Changes Immediately

*For any* preference changes made in the modal, clicking "Save" should close the modal and apply the changes (load/unload scripts) without requiring a page reload.

**Validates: Requirements 3.8, 4.4**

### Property 9: Settings Link Opens Modal

*For any* page state, clicking the Cookie Settings Link should open the Preferences Modal.

**Validates: Requirements 4.2**

### Property 10: Modal Displays Current State

*For any* saved consent preferences, opening the Preferences Modal should display toggle states that match the saved preferences.

**Validates: Requirements 4.3**

### Property 11: Withdraw Consent Removes Scripts

*For any* consent state where some categories are enabled, withdrawing all consent should remove all non-essential scripts and clear the consent preferences.

**Validates: Requirements 4.5**

### Property 12: Consent Logging Structure

*For any* consent decision (accept all, reject all, or custom), a consent log entry should be created with all required fields: id, timestamp, preferences, userAgent, and version.

**Validates: Requirements 5.1, 5.2**

### Property 13: Consent Method Recording

*For any* consent action, the recorded method should match the action type: "accept-all" for Accept All button, "reject-all" for Reject All button, and "custom" for manual category selection.

**Validates: Requirements 5.3, 5.4, 5.5**

### Property 14: Consent Log Export

*For any* consent history, calling the export function should return all log entries in valid JSON format.

**Validates: Requirements 5.6**

### Property 15: Version Mismatch Triggers Re-consent

*For any* stored preferences with a version number less than the current version, the system should display the consent banner to prompt re-consent.

**Validates: Requirements 5.7**

### Property 16: Keyboard Navigation Completeness

*For any* interactive element in the Cookie Banner or Preferences Modal, it should be reachable and operable using only keyboard navigation (Tab, Shift+Tab, Enter, Space, Escape).

**Validates: Requirements 7.1, 7.2**

### Property 17: Escape Key Closes Modal

*For any* state where the Preferences Modal is open, pressing the Escape key should close the modal.

**Validates: Requirements 7.4**

### Property 18: Focus Trap in Dialogs

*For any* open dialog (Cookie Banner or Preferences Modal), tabbing through all elements should cycle focus within the dialog without escaping to the page behind.

**Validates: Requirements 7.5**

### Property 19: Responsive Layout Rendering

*For any* viewport width (mobile, tablet, desktop), the Cookie Banner and Preferences Modal should render without horizontal scrolling or content overflow.

**Validates: Requirements 7.6**

### Property 20: Reduced Motion Compliance

*For any* user with prefers-reduced-motion enabled, the consent interfaces should not display animations or transitions.

**Validates: Requirements 7.7**

### Property 21: Migration Preserves Analytics Choice

*For any* old format preferences (version 1), migrating to the new format should preserve the analytics boolean value in the new Analytics category, set Marketing to false, preserve the timestamp, and update the version to 2.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 22: Post-Migration Behavioral Equivalence

*For any* migrated preferences, the system should load or not load Google Analytics based on the migrated Analytics category value, maintaining the same behavior as the old implementation.

**Validates: Requirements 8.6**

### Property 23: State Change Propagation

*For any* consent preference change, all components that depend on consent state (script loaders, UI elements) should receive the updated state within one React render cycle.

**Validates: Requirements 10.1**

## Error Handling

### Script Loading Failures

**Scenario**: Third-party script (Google Analytics or Bandsintown) fails to load due to network error, ad blocker, or CSP violation.

**Handling**:
- Catch script loading errors in `onerror` handler
- Log error to console for debugging
- Do not show error to user (graceful degradation)
- Do not retry automatically (respect user's environment)
- Maintain consent state (user consented, script just failed to load)

**Implementation**:
```typescript
script.onerror = (error) => {
  console.error(`Failed to load ${scriptName}:`, error);
  // Do not throw - fail silently
};
```

### localStorage Unavailable

**Scenario**: localStorage is disabled, full, or unavailable (private browsing mode).

**Handling**:
- Catch localStorage errors in try-catch blocks
- Fall back to in-memory state (session-only consent)
- Show banner on every page load (cannot persist)
- Log warning to console
- System remains functional without persistence

**Implementation**:
```typescript
try {
  localStorage.setItem(key, value);
} catch (error) {
  console.warn('localStorage unavailable, using session-only consent');
  // Continue with in-memory state
}
```

### Invalid Stored Data

**Scenario**: localStorage contains corrupted or invalid JSON data.

**Handling**:
- Catch JSON.parse errors
- Clear invalid data from localStorage
- Treat as no saved preferences (show banner)
- Log error to console
- Do not crash the application

**Implementation**:
```typescript
try {
  const data = JSON.parse(stored);
  if (!isValidPreferences(data)) {
    throw new Error('Invalid preferences structure');
  }
  return data;
} catch (error) {
  console.error('Invalid stored preferences:', error);
  localStorage.removeItem(key);
  return null;
}
```

### Migration Failures

**Scenario**: Old format data cannot be migrated due to unexpected structure.

**Handling**:
- Catch migration errors
- Clear invalid old data
- Treat as new user (show banner)
- Log error with old data structure for debugging
- Do not crash the application

**Implementation**:
```typescript
try {
  return migratePreferences(oldData);
} catch (error) {
  console.error('Migration failed:', error, oldData);
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  return null;
}
```

### React Context Outside Provider

**Scenario**: Component tries to use `useCookieConsent` hook outside of `CookieConsentProvider`.

**Handling**:
- Throw descriptive error immediately
- Error message guides developer to wrap app in provider
- Fail fast during development (not production issue)

**Implementation**:
```typescript
export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      'useCookieConsent must be used within CookieConsentProvider'
    );
  }
  return context;
}
```

### Consent Log Overflow

**Scenario**: Consent log array exceeds maximum size (50 entries).

**Handling**:
- Remove oldest entries (FIFO)
- Keep most recent 50 entries
- No error shown to user
- Automatic cleanup on each new log entry

**Implementation**:
```typescript
function addConsentLog(log: ConsentLog, history: ConsentHistory) {
  const logs = [...history.logs, log];
  if (logs.length > MAX_CONSENT_LOGS) {
    logs.shift(); // Remove oldest
  }
  return { logs };
}
```

### Script Already Loaded

**Scenario**: Attempt to load script that's already in DOM.

**Handling**:
- Check for existing script before loading
- Skip loading if already present (idempotent)
- No error thrown
- Prevents duplicate scripts

**Implementation**:
```typescript
function loadScript(src: string, id: string) {
  if (document.getElementById(id)) {
    return; // Already loaded
  }
  // Proceed with loading
}
```

### Modal Open During Banner Display

**Scenario**: User clicks "Manage Preferences" while banner is still showing.

**Handling**:
- Close banner when modal opens
- Show only modal (not both simultaneously)
- Maintain state consistency
- No visual glitches

**Implementation**:
```typescript
function openModal() {
  setShowBanner(false);
  setShowModal(true);
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit testing and property-based testing for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs
- Both approaches are complementary and necessary

### Unit Testing

Unit tests focus on specific scenarios and edge cases:

**Test Categories**:
1. **Component Rendering**: Verify UI elements render correctly
   - Banner shows three buttons with correct text
   - Modal shows all cookie categories
   - Settings link appears in footer
   - Fallback message displays when widget blocked

2. **User Interactions**: Test specific user actions
   - Clicking "Accept All" grants all consent
   - Clicking "Reject All" denies optional consent
   - Clicking "Manage Preferences" opens modal
   - Clicking settings link opens modal
   - Escape key closes modal

3. **Edge Cases**: Test boundary conditions
   - Empty localStorage
   - Corrupted localStorage data
   - localStorage unavailable (private browsing)
   - Old format migration with missing fields
   - Consent log overflow (>50 entries)

4. **Error Conditions**: Test failure scenarios
   - Script loading failures
   - JSON parse errors
   - Invalid preference structures
   - Context used outside provider

5. **Integration Points**: Test component interactions
   - Banner closes when modal opens
   - Modal displays current preferences
   - Script loaders respond to consent changes
   - Multiple components receive state updates

**Testing Framework**: Jest with React Testing Library

**Example Unit Test**:
```typescript
describe('CookieConsentBanner', () => {
  it('should show three buttons with equal prominence', () => {
    render(<CookieConsentBanner />);
    expect(screen.getByText('Accept All')).toBeInTheDocument();
    expect(screen.getByText('Reject All')).toBeInTheDocument();
    expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
  });
});
```

### Property-Based Testing

Property tests verify universal properties across many generated inputs:

**Testing Library**: fast-check (JavaScript/TypeScript property-based testing)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: gdpr-cookie-compliance-enhancement, Property N: [property text]`

**Property Test Categories**:

1. **Script Lifecycle Properties** (Properties 1, 2, 3)
   - Generate random consent states
   - Verify scripts load/unload correctly
   - Verify timing constraints (<100ms)

2. **Consent Action Properties** (Properties 4, 5, 6)
   - Generate random initial states
   - Verify button actions produce correct final states
   - Verify state transitions are consistent

3. **Persistence Properties** (Property 7)
   - Generate random valid preferences
   - Verify round-trip through localStorage
   - Verify data integrity

4. **State Synchronization Properties** (Properties 8, 9, 10, 23)
   - Generate random preference changes
   - Verify all components receive updates
   - Verify UI reflects current state

5. **Logging Properties** (Properties 12, 13, 14)
   - Generate random consent actions
   - Verify log structure and content
   - Verify export functionality

6. **Migration Properties** (Properties 21, 22)
   - Generate random old format preferences
   - Verify migration correctness
   - Verify behavioral equivalence

7. **Accessibility Properties** (Properties 16, 17, 18, 19, 20)
   - Generate random UI states
   - Verify keyboard navigation
   - Verify responsive rendering
   - Verify reduced motion compliance

**Example Property Test**:
```typescript
// Feature: gdpr-cookie-compliance-enhancement, Property 7: Preferences Persistence Round Trip
describe('Property 7: Preferences Persistence Round Trip', () => {
  it('should preserve preferences through localStorage round trip', () => {
    fc.assert(
      fc.property(
        fc.record({
          essential: fc.constant(true),
          analytics: fc.boolean(),
          marketing: fc.boolean(),
        }),
        (categories) => {
          const preferences: CookiePreferences = {
            categories,
            timestamp: Date.now(),
            version: CONSENT_VERSION,
            method: 'custom',
          };
          
          // Save to localStorage
          localStorage.setItem(
            COOKIE_CONSENT_KEY,
            JSON.stringify(preferences)
          );
          
          // Read back
          const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
          const parsed = JSON.parse(stored!);
          
          // Verify equivalence
          expect(parsed.categories).toEqual(categories);
          expect(parsed.version).toBe(CONSENT_VERSION);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Generators for Property Tests**:

```typescript
// Generate random consent preferences
const consentPreferencesArbitrary = fc.record({
  categories: fc.record({
    essential: fc.constant(true),
    analytics: fc.boolean(),
    marketing: fc.boolean(),
  }),
  timestamp: fc.integer({ min: 0 }),
  version: fc.constant(CONSENT_VERSION),
  method: fc.constantFrom('accept-all', 'reject-all', 'custom'),
});

// Generate random old format preferences
const oldPreferencesArbitrary = fc.record({
  analytics: fc.boolean(),
  timestamp: fc.integer({ min: 0 }),
  version: fc.constant(1),
});

// Generate random consent actions
const consentActionArbitrary = fc.constantFrom(
  'accept-all',
  'reject-all',
  'custom-analytics-only',
  'custom-marketing-only',
  'custom-both',
  'custom-neither'
);
```

### End-to-End Testing

E2E tests verify complete user workflows:

**Testing Framework**: Playwright (already integrated in project)

**Test Scenarios**:
1. First-time visitor sees banner and can accept/reject
2. Returning visitor with saved preferences doesn't see banner
3. User can open settings and change preferences
4. Scripts load/unload based on consent
5. Preferences persist across page reloads
6. Migration from old format works correctly

**Example E2E Test**:
```typescript
test('first-time visitor can accept cookies', async ({ page }) => {
  await page.goto('/');
  
  // Banner should be visible
  await expect(page.getByText('Cookie Consent')).toBeVisible();
  
  // Click Accept All
  await page.getByRole('button', { name: 'Accept All' }).click();
  
  // Banner should disappear
  await expect(page.getByText('Cookie Consent')).not.toBeVisible();
  
  // Google Analytics script should load
  await expect(page.locator('script[src*="googletagmanager"]')).toBeAttached();
  
  // Bandsintown script should load
  await expect(page.locator('script[src*="bandsintown"]')).toBeAttached();
});
```

### Test Coverage Goals

- **Unit Test Coverage**: >90% line coverage for consent logic
- **Property Test Coverage**: All 23 properties implemented
- **E2E Test Coverage**: All critical user workflows
- **Accessibility Testing**: WCAG 2.1 AA compliance verified

### Continuous Integration

All tests run on every commit:
1. Unit tests (Jest)
2. Property tests (fast-check)
3. E2E tests (Playwright)
4. Accessibility tests (axe-core)
5. Type checking (TypeScript)
6. Linting (ESLint)

Tests must pass before merging to main branch.
