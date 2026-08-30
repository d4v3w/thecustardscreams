# Navigation Context System

## Overview

The Navigation Context provides a centralized state management system for page/section navigation. It allows dynamic section registration, tracks current/previous/next sections, and provides navigation methods.

## Architecture

The URL hash is the single source of truth for the current section.

```
NavigationProvider (Context)
    ↓
    ├── Sections register themselves via useRegisterSection hook
    ├── useHashSync reads/writes the URL hash and scrolls to the target section
    ├── useScrollObserver watches section visibility (IntersectionObserver) and
    │   updates the hash as the user scrolls, without disturbing history
    └── Components access navigation state via useNavigation hook
```

## Key Features

1. **Dynamic Section Registration**: Sections can be added/removed dynamically
2. **Current/Previous/Next Tracking**: Always know where you are and where you can go
3. **Centralized Navigation**: Single source of truth for navigation state
4. **Debounced Updates**: Prevents over-polling with 100ms debounce
5. **Order Management**: Sections are ordered automatically

## Usage

### 1. Wrap your app with NavigationProvider

```tsx
// In layout.tsx
import { NavigationProvider } from "~/contexts/NavigationContext";

export default function Layout({ children }) {
  return (
    <NavigationProvider>
      {children}
    </NavigationProvider>
  );
}
```

### 2. Sections auto-register via Section component

```tsx
// Section component handles registration automatically
import Section from "~/components/Section";

export default function MySection() {
  return (
    <Section id="my-section" className="...">
      {/* Content */}
    </Section>
  );
}
```

### 3. Access navigation state anywhere

```tsx
import { useNavigation } from "~/contexts/NavigationContext";

export default function MyComponent() {
  const {
    currentSection,
    previousSection,
    nextSection,
    sections,
    navigateToSection,
    navigateNext,
    navigatePrevious,
  } = useNavigation();
  
  return (
    <div>
      <p>Current: {currentSection}</p>
      <button onClick={() => navigateToSection("hero")}>Go to Hero</button>
      <button onClick={navigateNext}>Next Section</button>
      <button onClick={navigatePrevious}>Previous Section</button>
    </div>
  );
}
```

## API Reference

### NavigationContext

#### State
- `currentSection: SectionId | null` - Currently visible section
- `previousSection: SectionId | null` - Previously visible section
- `nextSection: SectionId | null` - Next section in order
- `sections: SectionId[]` - All registered sections in order

#### Methods
- `registerSection(id, ref, order)` - Register a section (auto-called by Section component)
- `unregisterSection(id)` - Unregister a section (auto-called on unmount)
- `navigateToSection(id)` - Navigate to specific section
- `navigateNext()` - Navigate to next section
- `navigatePrevious()` - Navigate to previous section
- `getSectionRefs()` - Get map of all section refs (for intersection observer)
- `updateHash(section, addToHistory?)` - Update the URL hash (used internally by navigateToSection and the scroll observer)
- `isProgrammaticScroll()` - Whether a scroll triggered by navigation is currently in flight

### Hooks

#### `useNavigation()`
Access navigation context state and methods. The intersection observer that tracks
the active section (`useScrollObserver`) and the hash listener (`useHashSync`) are
wired up automatically inside `NavigationProvider` - no per-page setup needed.

#### `useRegisterSection(id, order)`
Register a section with navigation context. Returns ref to attach to section element.

## Benefits Over Previous Approach

1. **Scalability**: Easy to add new sections without modifying page component
2. **Reusability**: Navigation state accessible from any component
3. **Maintainability**: Single source of truth, no prop drilling
4. **Flexibility**: Can add sections dynamically at runtime
5. **Performance**: Debounced updates prevent excessive re-renders
6. **Type Safety**: Full TypeScript support with proper types

## Adding New Sections

To add a new section:

1. Create section component using `Section` wrapper
2. Add section ID to `SectionId` type in `~/lib/types.ts`
3. Add section to `SECTION_ORDER` in `~/components/Section.tsx`
4. Add section to `SECTIONS` config in `~/lib/types.ts`
5. Render section in page component

That's it! The context handles the rest automatically.
