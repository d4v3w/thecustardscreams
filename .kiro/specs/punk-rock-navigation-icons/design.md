# Design Document: Punk Rock Navigation Icons

## Overview

This design implements four pure CSS navigation icons (Home, Music, Shows, About) with a KISS-inspired punk rock aesthetic. Each icon is constructed using CSS pseudo-elements, borders, transforms, and geometric shapes to create bold, angular, high-contrast visuals without any external dependencies. The implementation integrates into the existing NavItem component and leverages Tailwind CSS for consistent styling.

The design prioritizes performance (zero HTTP requests for icons), maintainability (pure CSS), and aesthetic consistency (angular geometric shapes, high contrast, aggressive styling). All icons support hover, active, and focus states with smooth transitions.

## Architecture

### Component Structure

The implementation modifies the existing `NavItem.tsx` component to conditionally render CSS icons instead of emoji characters. The architecture follows a component-based approach:

```
NavItem Component
├── Icon Container (div)
│   ├── Icon Base Element (div with Tailwind classes)
│   ├── ::before pseudo-element (geometric shape 1)
│   └── ::after pseudo-element (geometric shape 2)
└── Label Text (existing)
```

### Icon Type System

Each icon is identified by a type string that determines which CSS classes and pseudo-element styles to apply:

- `"home"` → House/shelter icon with angular roof
- `"music"` → Lightning bolt icon (rock energy)
- `"shows"` → Star icon (performance/stage)
- `"about"` → Exclamation mark icon (information/impact)

### State Management

Icons respond to three visual states managed through CSS classes:
- **Default**: Base styling with primary colors
- **Hover**: Enhanced contrast, scale transform, color shift
- **Active**: Distinct color scheme indicating current section

### Styling Strategy

All styling uses Tailwind CSS utility classes combined with custom CSS for pseudo-elements. The design uses CSS custom properties for state-dependent colors to enable smooth transitions.

## Components and Interfaces

### NavItem Component Modifications

**File**: `src/components/navigation/NavItem.tsx`

The component receives an `iconType` prop to determine which icon to render:

```typescript
interface NavItemProps {
  label: string;
  section: string;
  isActive: boolean;
  iconType: 'home' | 'music' | 'shows' | 'about';
}
```

### Icon Rendering Logic

The component conditionally renders CSS icons based on `iconType`:

```typescript
const renderIcon = () => {
  return (
    <div className={`icon-container relative w-8 h-8 ${isActive ? 'active' : ''}`}>
      <div className={`icon-${iconType} transition-all duration-200`} />
    </div>
  );
};
```

### CSS Class Structure

Each icon type has dedicated CSS classes:

```css
.icon-home { /* Home icon base styles */ }
.icon-home::before { /* Roof shape */ }
.icon-home::after { /* House base */ }

.icon-music { /* Music icon base styles */ }
.icon-music::before { /* Lightning bolt top */ }
.icon-music::after { /* Lightning bolt bottom */ }

.icon-shows { /* Shows icon base styles */ }
.icon-shows::before { /* Star points */ }
.icon-shows::after { /* Star center */ }

.icon-about { /* About icon base styles */ }
.icon-about::before { /* Exclamation line */ }
.icon-about::after { /* Exclamation dot */ }
```

## Data Models

### Icon Configuration

Each icon is defined by a configuration object that specifies its geometric properties:

```typescript
interface IconConfig {
  type: 'home' | 'music' | 'shows' | 'about';
  baseClasses: string;
  beforeClasses: string;
  afterClasses: string;
  hoverTransform: string;
  activeColor: string;
}
```

### Color Scheme

The punk rock aesthetic uses high-contrast colors:

```typescript
const colorScheme = {
  default: {
    primary: '#ffffff',    // White for main shapes
    accent: '#ff0000',     // Red for highlights
    background: '#000000'  // Black background
  },
  hover: {
    primary: '#ff0000',    // Red on hover
    accent: '#ffffff',     // White accents
    glow: '#ff0000'        // Red glow effect
  },
  active: {
    primary: '#ff0000',    // Red when active
    accent: '#ffff00',     // Yellow accents
    glow: '#ff0000'        // Red glow
  }
};
```

## Detailed Icon Designs

### Home Icon (Angular House)

**Concept**: An angular house shape with a sharp triangular roof and rectangular base, creating an aggressive geometric shelter.

**Structure**:
- Base element: Container with relative positioning
- `::before`: Triangular roof using borders (CSS triangle technique)
- `::after`: Rectangular base using width/height

**CSS Implementation**:
```css
.icon-home {
  @apply relative w-full h-full;
}

.icon-home::before {
  content: '';
  @apply absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-bottom: 14px solid currentColor;
  transition: all 0.2s ease;
}

.icon-home::after {
  content: '';
  @apply absolute bg-current;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 14px;
  transition: all 0.2s ease;
}

.icon-home:hover::before {
  border-bottom-color: #ff0000;
  filter: drop-shadow(0 0 4px #ff0000);
}

.icon-home:hover::after {
  background-color: #ff0000;
  filter: drop-shadow(0 0 4px #ff0000);
}

.icon-container.active .icon-home::before {
  border-bottom-color: #ff0000;
}

.icon-container.active .icon-home::after {
  background-color: #ff0000;
}
```

### Music Icon (Lightning Bolt)

**Concept**: A jagged lightning bolt representing raw rock energy and power, using sharp angular zigzag shapes.

**Structure**:
- Base element: Container
- `::before`: Top half of lightning bolt (polygon using clip-path)
- `::after`: Bottom half of lightning bolt (polygon using clip-path)

**CSS Implementation**:
```css
.icon-music {
  @apply relative w-full h-full;
}

.icon-music::before {
  content: '';
  @apply absolute bg-current;
  top: 0;
  left: 50%;
  width: 18px;
  height: 16px;
  clip-path: polygon(50% 0%, 100% 40%, 60% 40%, 100% 100%, 40% 60%, 80% 60%, 0% 0%);
  transform: translateX(-50%) rotate(-10deg);
  transition: all 0.2s ease;
}

.icon-music:hover::before {
  background-color: #ff0000;
  filter: drop-shadow(0 0 6px #ff0000);
  transform: translateX(-50%) rotate(-10deg) scale(1.1);
}

.icon-container.active .icon-music::before {
  background-color: #ff0000;
  filter: drop-shadow(0 0 4px #ff0000);
}
```

### Shows Icon (Angular Star)

**Concept**: A sharp, angular star representing stage performance and spotlight, with aggressive pointed edges.

**Structure**:
- Base element: Container
- `::before`: Star shape using clip-path with sharp points
- `::after`: Center accent dot for additional detail

**CSS Implementation**:
```css
.icon-shows {
  @apply relative w-full h-full;
}

.icon-shows::before {
  content: '';
  @apply absolute bg-current;
  top: 50%;
  left: 50%;
  width: 28px;
  height: 28px;
  clip-path: polygon(
    50% 0%, 
    61% 35%, 
    98% 35%, 
    68% 57%, 
    79% 91%, 
    50% 70%, 
    21% 91%, 
    32% 57%, 
    2% 35%, 
    39% 35%
  );
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
}

.icon-shows::after {
  content: '';
  @apply absolute bg-current;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
}

.icon-shows:hover::before {
  background-color: #ff0000;
  filter: drop-shadow(0 0 6px #ff0000);
  transform: translate(-50%, -50%) rotate(15deg) scale(1.1);
}

.icon-shows:hover::after {
  background-color: #ff0000;
}

.icon-container.active .icon-shows::before {
  background-color: #ff0000;
}

.icon-container.active .icon-shows::after {
  background-color: #ff0000;
}
```

### About Icon (Exclamation Mark)

**Concept**: A bold exclamation mark representing information and impact, with angular geometric construction.

**Structure**:
- Base element: Container
- `::before`: Vertical line (rectangle)
- `::after`: Bottom dot (small rectangle or square)

**CSS Implementation**:
```css
.icon-about {
  @apply relative w-full h-full;
}

.icon-about::before {
  content: '';
  @apply absolute bg-current;
  top: 2px;
  left: 50%;
  width: 4px;
  height: 18px;
  transform: translateX(-50%);
  transition: all 0.2s ease;
}

.icon-about::after {
  content: '';
  @apply absolute bg-current;
  bottom: 2px;
  left: 50%;
  width: 4px;
  height: 4px;
  transform: translateX(-50%);
  transition: all 0.2s ease;
}

.icon-about:hover::before,
.icon-about:hover::after {
  background-color: #ff0000;
  filter: drop-shadow(0 0 4px #ff0000);
}

.icon-container.active .icon-about::before,
.icon-container.active .icon-about::after {
  background-color: #ff0000;
}
```

## State Transitions

### Hover State

All icons implement hover effects with:
- Color shift from white to red (#ff0000)
- Glow effect using `drop-shadow` filter
- Scale transform (1.1x) for emphasis
- Rotation for dynamic icons (music, shows)
- Transition duration: 200ms with ease timing

### Active State

Active icons display:
- Primary color: Red (#ff0000)
- Accent color: Yellow (#ffff00) for multi-element icons
- Persistent glow effect
- No scale transform (maintains size)

### Focus State

For keyboard navigation:
- Outline ring using Tailwind's `focus:ring-2 focus:ring-red-500`
- Outline offset for visibility
- Same color treatment as hover state

## Integration Approach

### Step 1: Add Icon Type Prop

Modify NavItem component to accept `iconType`:

```typescript
export default function NavItem({ 
  label, 
  section, 
  isActive,
  iconType 
}: NavItemProps) {
  // Component logic
}
```

### Step 2: Create CSS File

Create `src/styles/punk-icons.css` with all icon styles:

```css
/* Import in main CSS or component */
@import './punk-icons.css';
```

### Step 3: Conditional Rendering

Replace emoji rendering with icon rendering:

```typescript
const renderIcon = () => {
  if (iconType) {
    return (
      <div className={`icon-container relative w-8 h-8 ${isActive ? 'active' : ''}`}>
        <div className={`icon-${iconType} text-white`} />
      </div>
    );
  }
  // Fallback to emoji if needed
  return <span>{/* emoji */}</span>;
};
```

### Step 4: Update Navigation Component

Update parent navigation component to pass `iconType` to each NavItem:

```typescript
<NavItem label="Home" section="hero" isActive={activeSection === 'hero'} iconType="home" />
<NavItem label="Music" section="music" isActive={activeSection === 'music'} iconType="music" />
<NavItem label="Shows" section="shows" isActive={activeSection === 'shows'} iconType="shows" />
<NavItem label="About" section="about" isActive={activeSection === 'about'} iconType="about" />
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Icon Type Mapping

*For any* navigation section (home, music, shows, about), the rendered icon type must match the section identifier.

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

### Property 2: Pure CSS Implementation

*For any* rendered navigation icon, the DOM structure must contain no img elements, no svg elements, and no canvas elements—only div elements with CSS classes and pseudo-elements.

**Validates: Requirements 1.2, 4.1, 4.2, 4.4**

### Property 3: Zero External Resource Loading

*For any* page load with navigation icons, the network request log must contain zero requests for image files, icon fonts, or SVG assets.

**Validates: Requirements 4.2, 4.4**

### Property 4: Tailwind Class Usage

*For any* rendered icon element, the className attribute must contain at least one Tailwind CSS utility class.

**Validates: Requirements 2.4**

### Property 5: Hover State Visual Changes

*For any* icon element, when a hover event is triggered, the computed styles or CSS classes must change to reflect the hover state.

**Validates: Requirements 3.1**

### Property 6: Active State Application

*For any* navigation item with isActive prop set to true, the icon container must have the 'active' class applied.

**Validates: Requirements 3.2**

### Property 7: State Visual Distinction

*For any* icon element, the computed styles in default state, hover state, and active state must be distinct from each other (different color values or transform values).

**Validates: Requirements 3.4**

### Property 8: CSS Transition Presence

*For any* icon element, the computed style must include a transition property with a duration greater than 0ms.

**Validates: Requirements 3.5**

### Property 9: Proportional Scaling

*For any* icon container, when the container width changes by a factor of X, the icon's visual elements (pseudo-elements) must scale by the same factor X.

**Validates: Requirements 5.2**

### Property 10: Viewport Consistency

*For any* viewport width within the supported range, the icon DOM structure and CSS classes must remain identical.

**Validates: Requirements 5.3**

### Property 11: WCAG AA Contrast Compliance

*For any* icon color combination (foreground and background), the contrast ratio must meet or exceed 3:1 for large graphics (WCAG AA standard for graphical objects).

**Validates: Requirements 2.1, 5.4, 6.3**

### Property 12: Accessibility Label Presence

*For any* navigation item with an icon, the element must have either visible label text or an aria-label attribute.

**Validates: Requirements 6.1, 6.2**

### Property 13: Keyboard Focusability

*For any* navigation item, the element must be focusable via keyboard (tabIndex >= 0 or naturally focusable element like button/link).

**Validates: Requirements 6.4**

### Property 14: Focus Indicator Visibility

*For any* navigation item, when focused, the computed styles must include a visible outline or ring (outline-width > 0 or box-shadow present).

**Validates: Requirements 6.5**

## Error Handling

### Missing Icon Type

**Scenario**: NavItem component receives an invalid or undefined `iconType` prop.

**Handling**: 
- Component falls back to rendering a default icon (home) or the original emoji
- Console warning logged in development mode
- No runtime error thrown

**Implementation**:
```typescript
const iconType = props.iconType || 'home';
if (process.env.NODE_ENV === 'development' && !props.iconType) {
  console.warn('NavItem: iconType prop is missing, falling back to "home"');
}
```

### CSS Not Loaded

**Scenario**: The punk-icons.css file fails to load or is not imported.

**Handling**:
- Icons render as unstyled div elements
- Layout remains functional due to container sizing
- Graceful degradation to text labels

**Prevention**:
- Include CSS import in main application stylesheet
- Add build-time check to verify CSS file exists

### Browser Compatibility

**Scenario**: Older browsers don't support CSS features (clip-path, drop-shadow).

**Handling**:
- Provide fallback styles using simpler CSS properties
- Use @supports queries for progressive enhancement
- Ensure basic geometric shapes render even without advanced features

**Implementation**:
```css
/* Fallback for browsers without clip-path support */
@supports not (clip-path: polygon(50% 0%, 100% 100%, 0% 100%)) {
  .icon-music::before {
    /* Simpler triangle using borders */
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid currentColor;
  }
}
```

### Color Contrast Failure

**Scenario**: Background color changes cause contrast ratio to fall below WCAG standards.

**Handling**:
- Use CSS custom properties for colors that can be overridden
- Provide high-contrast mode styles
- Test against multiple background colors during development

**Implementation**:
```css
@media (prefers-contrast: high) {
  .icon-container {
    --icon-color: #ffffff;
    --icon-background: #000000;
    filter: contrast(1.5);
  }
}
```

### State Transition Conflicts

**Scenario**: Rapid state changes (hover + active simultaneously) cause visual conflicts.

**Handling**:
- CSS specificity ensures active state takes precedence
- Use clear selector hierarchy: `.active` > `:hover` > default
- Transitions smooth out rapid changes

**Implementation**:
```css
/* Default */
.icon-home::before { color: white; }

/* Hover (lower priority) */
.icon-home:hover::before { color: red; }

/* Active (highest priority) */
.icon-container.active .icon-home::before { color: red; }
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific icon renderings, state transitions, and edge cases
- **Property tests**: Verify universal properties across all icon types and states

### Unit Testing Focus

Unit tests should cover:

1. **Specific Icon Rendering**: Test that each icon type (home, music, shows, about) renders the correct DOM structure
2. **State Transitions**: Test specific examples of hover, active, and focus state changes
3. **Edge Cases**: Test missing props, invalid icon types, and fallback behavior
4. **Integration**: Test NavItem component integration with parent navigation component
5. **Accessibility**: Test specific ARIA attributes and keyboard navigation scenarios

**Example Unit Tests**:
```typescript
describe('NavItem Icon Rendering', () => {
  it('renders home icon with correct structure', () => {
    const { container } = render(<NavItem iconType="home" label="Home" section="hero" isActive={false} />);
    expect(container.querySelector('.icon-home')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(<NavItem iconType="music" label="Music" section="music" isActive={true} />);
    expect(container.querySelector('.icon-container.active')).toBeInTheDocument();
  });

  it('falls back to default icon when iconType is invalid', () => {
    const { container } = render(<NavItem iconType="invalid" label="Test" section="test" isActive={false} />);
    expect(container.querySelector('.icon-home')).toBeInTheDocument();
  });
});
```

### Property-Based Testing Focus

Property tests should verify universal properties that hold across all inputs:

1. **Icon Type Mapping**: For all valid icon types, correct icon is rendered
2. **Pure CSS Implementation**: For all rendered icons, no external resources are used
3. **State Consistency**: For all state combinations, visual distinction is maintained
4. **Contrast Compliance**: For all icon colors, WCAG standards are met
5. **Accessibility**: For all navigation items, labels and focus indicators are present

**Property Test Configuration**:
- Library: fast-check (for TypeScript/JavaScript)
- Minimum iterations: 100 per property test
- Each test references its design document property

**Example Property Tests**:
```typescript
import fc from 'fast-check';

describe('Property: Icon Type Mapping', () => {
  // Feature: punk-rock-navigation-icons, Property 1: Icon Type Mapping
  it('renders correct icon for any valid section', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'music', 'shows', 'about'),
        fc.boolean(),
        (iconType, isActive) => {
          const { container } = render(
            <NavItem iconType={iconType} label="Test" section={iconType} isActive={isActive} />
          );
          const iconElement = container.querySelector(`.icon-${iconType}`);
          expect(iconElement).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: Pure CSS Implementation', () => {
  // Feature: punk-rock-navigation-icons, Property 2: Pure CSS Implementation
  it('contains no img, svg, or canvas elements for any icon type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'music', 'shows', 'about'),
        (iconType) => {
          const { container } = render(
            <NavItem iconType={iconType} label="Test" section={iconType} isActive={false} />
          );
          expect(container.querySelector('img')).toBeNull();
          expect(container.querySelector('svg')).toBeNull();
          expect(container.querySelector('canvas')).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: WCAG AA Contrast Compliance', () => {
  // Feature: punk-rock-navigation-icons, Property 11: WCAG AA Contrast Compliance
  it('maintains contrast ratio >= 3:1 for any icon in any state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'music', 'shows', 'about'),
        fc.constantFrom('default', 'hover', 'active'),
        (iconType, state) => {
          const { container } = render(
            <NavItem 
              iconType={iconType} 
              label="Test" 
              section={iconType} 
              isActive={state === 'active'} 
            />
          );
          
          const iconElement = container.querySelector(`.icon-${iconType}`);
          const computedStyle = window.getComputedStyle(iconElement);
          const color = computedStyle.color;
          const backgroundColor = computedStyle.backgroundColor;
          
          const contrastRatio = calculateContrastRatio(color, backgroundColor);
          expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: Accessibility Label Presence', () => {
  // Feature: punk-rock-navigation-icons, Property 12: Accessibility Label Presence
  it('provides accessible label for any icon type', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'music', 'shows', 'about'),
        fc.string({ minLength: 1, maxLength: 20 }),
        (iconType, label) => {
          const { container } = render(
            <NavItem iconType={iconType} label={label} section={iconType} isActive={false} />
          );
          
          const hasVisibleLabel = container.textContent.includes(label);
          const hasAriaLabel = container.querySelector('[aria-label]') !== null;
          
          expect(hasVisibleLabel || hasAriaLabel).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Testing Tools

- **Unit Testing**: Jest + React Testing Library
- **Property Testing**: fast-check
- **Visual Regression**: Chromatic or Percy (optional, for visual validation)
- **Accessibility Testing**: jest-axe for automated a11y checks
- **Contrast Calculation**: Helper function using WCAG formula

### Test Coverage Goals

- Unit test coverage: 90%+ for NavItem component
- Property test coverage: All 14 correctness properties implemented
- Integration test coverage: Navigation component with all four icons
- Accessibility test coverage: All WCAG AA requirements verified

### Continuous Integration

- Run all tests on every commit
- Block merges if property tests fail
- Generate coverage reports
- Run visual regression tests on UI changes
