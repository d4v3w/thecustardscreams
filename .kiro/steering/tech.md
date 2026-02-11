# Technology Stack

## Core Framework

- **Next.js 16** (App Router) - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript 5.9** - Type-safe JavaScript with strict mode enabled
- **Node.js** - Runtime environment

## Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Custom CSS** - Punk-themed typography and icons in `src/styles/`

## Fonts

- **Geist** - Primary sans-serif font
- **Bebas Neue** - Display font for punk rock aesthetic

## State Management

- **React Context API** - Global state for navigation and cookie consent
- Custom contexts in `src/contexts/`:
  - `NavigationContext` - Section navigation state
  - `CookieConsentContext` - GDPR consent management

## Testing

- **Jest 30** - Unit testing framework with jsdom environment
- **@testing-library/react** - React component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **Playwright** - End-to-end browser testing
- **fast-check** - Property-based testing library

## Code Quality

- **ESLint 10** - Linting with Next.js, TypeScript, and React rules
- **Prettier 3** - Code formatting with Tailwind plugin
- **TypeScript strict mode** - Enhanced type safety with `noUncheckedIndexedAccess`

## Build Tools

- **pnpm** - Package manager (v10.28.2)
- **Turbopack** - Fast bundler for development (via `--turbo` flag)
- **next-sitemap** - Automatic sitemap generation

## Third-Party Integrations

- **Google Analytics** - Analytics tracking (consent-gated)
- **Bandsintown** - Live show widget (consent-gated)
- **@t3-oss/env-nextjs** - Environment variable validation with Zod

## Common Commands

### Development
```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm build:prod       # Full build with lint, typecheck, and tests
pnpm start            # Start production server
pnpm preview          # Build and start production server
```

### Testing
```bash
pnpm test             # Run Jest unit tests
pnpm test:watch       # Run Jest in watch mode
pnpm test:e2e         # Run Playwright e2e tests
pnpm test:e2e:ui      # Run Playwright with UI
pnpm test:e2e:debug   # Debug Playwright tests
pnpm test:all         # Run all tests (unit + e2e)
```

### Code Quality
```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Run TypeScript compiler check
pnpm check            # Run both lint and typecheck
pnpm format:check     # Check Prettier formatting
pnpm format:write     # Apply Prettier formatting
```

### Playwright
```bash
pnpm playwright:install  # Install Playwright browsers
```

## Configuration Files

- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript compiler options with path aliases
- `eslint.config.js` - ESLint rules (flat config format)
- `jest.config.js` - Jest testing configuration
- `playwright.config.ts` - Playwright e2e test configuration
- `prettier.config.js` - Prettier formatting rules
- `postcss.config.js` - PostCSS configuration
- `next-sitemap.config.js` - Sitemap generation settings

## Path Aliases

- `~/` - Maps to `src/`
- `@/components/` - Maps to `src/components/`

## Environment Variables

Validated using `@t3-oss/env-nextjs` in `src/env.js`. See `.env.example` for required variables.
