# Project Structure

## Root Directory

```
/
├── .kiro/              # Kiro AI assistant configuration
│   ├── specs/          # Feature specifications and implementation plans
│   └── steering/       # AI guidance documents (this file)
├── e2e/                # Playwright end-to-end tests
├── public/             # Static assets (images, icons, sitemap, robots.txt)
├── src/                # Source code (see detailed structure below)
└── [config files]      # Root-level configuration files
```

## Source Directory (`src/`)

### Application (`src/app/`)

Next.js App Router structure with file-based routing:

- `layout.tsx` - Root layout with providers, fonts, and global styles
- `page.tsx` - Home page (single-page app with sections)
- `metadata.ts` - SEO metadata configuration
- `LayoutClient.tsx` - Client-side layout wrapper
- `LayoutCookieComponents.tsx` - Cookie consent UI components
- `_components/` - Page-specific components (HeroSection, MusicSection, ShowsSection, AboutSection)
- `music/` - Music section routes
- `live-shows/` - Live shows section routes
- `about/` - About section routes
- `privacy-policy/` - Privacy policy page

### Components (`src/components/`)

Reusable UI components organized by feature:

- `navigation/` - Navigation components (BottomNav, NavItem, Breadcrumb)
- `carousel/` - Image carousel and lightbox components
- `cookie/` - Cookie consent components (banner, modal, conditional loaders)
- Top-level components: Section, Footer, Title, Links, Socials, Shows, Music

### Contexts (`src/contexts/`)

React Context providers for global state:

- `NavigationContext.tsx` - Section navigation and active section tracking
- `CookieConsentContext.tsx` - GDPR cookie consent state management

### Hooks (`src/hooks/`)

Custom React hooks:

- `useNavigationObserver.ts` - Intersection observer for section tracking
- `useSmoothScroll.ts` - Smooth scrolling behavior
- `useIntersectionObserver.ts` - Generic intersection observer
- `useRegisterSection.ts` - Register sections with navigation context
- `useReducedMotion.ts` - Respect user motion preferences
- `useCookieConsent.ts` - Cookie consent state access

### Library (`src/lib/`)

Utility functions and shared logic:

- `types.ts` - TypeScript type definitions and constants
- `breadcrumbs.ts` - Breadcrumb generation logic
- `metadata.ts` - SEO metadata helpers
- `cookieConsentStorage.ts` - Cookie consent persistence
- `cookieConsentLogs.ts` - Consent audit trail management

### Styles (`src/styles/`)

Global CSS and theme files:

- `globals.css` - Global styles and Tailwind directives
- `punk-typography.css` - Custom punk rock typography
- `punk-icons.css` - Custom icon styles

### Tests (`src/__tests__/`)

Unit tests co-located with source or in dedicated test directory:

- Component tests use `.test.tsx` suffix next to components
- Feature tests in `src/__tests__/` directory
- Test utilities in `src/test-utils/`

## Key Conventions

### File Naming

- React components: PascalCase (e.g., `BottomNav.tsx`)
- Utilities and hooks: camelCase (e.g., `useSmoothScroll.ts`)
- Tests: Same name as file with `.test.ts(x)` suffix
- Types: Defined in `src/lib/types.ts` or co-located with components

### Component Organization

- Client components: Use `"use client"` directive at top
- Server components: Default (no directive needed)
- Component props: Defined as TypeScript interfaces in `types.ts`
- Display names: Set for debugging (e.g., `HomePage.displayName = "HomePage"`)

### Import Aliases

- Use `~/` for imports from `src/` (e.g., `import { foo } from "~/lib/types"`)
- Use `@/components/` for component imports (alternative to `~/components/`)

### Feature Documentation

Components include feature tags in comments:
```typescript
/**
 * Component description
 * Feature: feature-name
 * Requirements: 1.1, 1.2, 2.3
 */
```

### Testing Structure

- Unit tests: Co-located with components or in `__tests__` directories
- E2E tests: In `e2e/tests/` directory
- Test utilities: In `src/test-utils/`
- Playwright config: `playwright.config.ts` at root

### Spec-Driven Development

Feature specifications in `.kiro/specs/{feature-name}/`:
- `requirements.md` - User stories and acceptance criteria
- `design.md` - Technical design and architecture
- `tasks.md` - Implementation task list

## State Management Pattern

1. Global state via React Context (Navigation, Cookie Consent)
2. Local state via useState/useReducer in components
3. Server state via Next.js server components and data fetching
4. URL state via Next.js routing and hash navigation

## Accessibility Patterns

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Reduced motion preferences
- Focus management
- Screen reader announcements
