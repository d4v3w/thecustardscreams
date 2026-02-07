# Design Document: Punk Rock Typeface

## Overview

This design transforms the website's heading typography from clean and minimal to bold, aggressive, and iconic punk rock styling. The approach focuses on selecting appropriate display fonts, applying visual effects, and ensuring the typography integrates seamlessly with the existing punk aesthetic while maintaining accessibility and performance.

### Design Philosophy

The punk rock typography system follows these principles:

1. **Bold and Unapologetic**: Headings should command attention and convey energy
2. **High Contrast**: Strong visual weight against the black background
3. **Readable Rebellion**: Aggressive styling that remains legible
4. **Performance First**: Fast loading with graceful degradation
5. **Accessible Aggression**: Punk aesthetic that works for all users

### Key Design Decisions

- Use Google Fonts for reliable hosting and performance
- Implement CSS custom properties for easy theming
- Apply effects through CSS rather than font variations
- Maintain existing color scheme (amber/yellow on black)
- Use progressive enhancement for visual effects

## Architecture

### Font Stack Strategy

The typography system uses a three-tier font stack:

```
Primary: Display Font (Google Fonts - bold, condensed punk aesthetic)
Secondary: System Fallbacks (Impact, Arial Black, sans-serif-black)
Tertiary: Generic Fallback (sans-serif with bold weight)
```

### CSS Architecture

```
src/styles/
├── globals.css          # Existing global styles
├── punk-icons.css       # Existing icon styles
└── punk-typography.css  # NEW: Heading typography system
```

The new `punk-typography.css` file will contain:
- Font imports and declarations
- CSS custom properties for typography
- Heading element styles (h1-h6)
- Responsive typography scales
- Visual effects and animations
- Accessibility overrides

### Integration Points

1. **Layout Integration**: Import punk-typography.css in layout.tsx
2. **Tailwind Integration**: Typography styles work alongside Tailwind utilities
3. **Existing Styles**: Preserve current className attributes on headings
4. **Theme Variables**: Use CSS custom properties for easy customization

## Components and Interfaces

### Font Selection

**Primary Display Font: "Bebas Neue"**
- Bold, condensed, all-caps aesthetic
- Excellent readability at large sizes
- Free and open source via Google Fonts
- Strong punk/rock concert poster vibe
- Available in Regular (400) and Bold (700) weights

**Alternative Option: "Anton"**
- Similar condensed, bold aesthetic
- Slightly more geometric
- Single weight (400, but very bold)
- Backup if Bebas Neue doesn't meet needs

**Fallback Stack:**
```css
font-family: 'Bebas Neue', Impact, 'Arial Black', 'Franklin Gothic Bold', sans-serif;
```

### CSS Custom Properties

```css
:root {
  /* Font Families */
  --font-display: 'Bebas Neue', Impact, 'Arial Black', sans-serif;
  --font-body: var(--font-geist-sans);
  
  /* Heading Sizes - Mobile First */
  --text-h1-mobile: 2.5rem;      /* 40px */
  --text-h1-tablet: 3.5rem;      /* 56px */
  --text-h1-desktop: 5rem;       /* 80px */
  
  --text-h2-mobile: 2rem;        /* 32px */
  --text-h2-tablet: 2.75rem;     /* 44px */
  --text-h2-desktop: 3.5rem;     /* 56px */
  
  --text-h3-mobile: 1.5rem;      /* 24px */
  --text-h3-tablet: 2rem;        /* 32px */
  --text-h3-desktop: 2.5rem;     /* 40px */
  
  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  
  /* Text Effects */
  --text-shadow-punk: 2px 2px 0 rgba(0, 0, 0, 0.8);
  --text-shadow-glow: 0 0 20px rgba(251, 191, 36, 0.3);
  --text-outline: 2px solid rgba(0, 0, 0, 0.5);
}
```

### Heading Styles

#### H1 - Hero/Page Titles
```css
h1 {
  font-family: var(--font-display);
  font-size: var(--text-h1-mobile);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: var(--tracking-tight);
  text-transform: uppercase;
  color: #fbbf24; /* amber-400 */
  text-shadow: var(--text-shadow-punk);
}

@media (min-width: 768px) {
  h1 { font-size: var(--text-h1-tablet); }
}

@media (min-width: 1024px) {
  h1 { 
    font-size: var(--text-h1-desktop);
    text-shadow: var(--text-shadow-punk), var(--text-shadow-glow);
  }
}
```

#### H2 - Section Headings
```css
h2 {
  font-family: var(--font-display);
  font-size: var(--text-h2-mobile);
  font-weight: 700;
  line-height: 1;
  letter-spacing: var(--tracking-normal);
  text-transform: uppercase;
  color: #fbbf24;
  text-shadow: var(--text-shadow-punk);
}

@media (min-width: 768px) {
  h2 { font-size: var(--text-h2-tablet); }
}

@media (min-width: 1024px) {
  h2 { font-size: var(--text-h2-desktop); }
}
```

#### H3 - Subsection Headings
```css
h3 {
  font-family: var(--font-display);
  font-size: var(--text-h3-mobile);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: var(--tracking-normal);
  text-transform: uppercase;
  color: #fbbf24;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
}

@media (min-width: 768px) {
  h3 { font-size: var(--text-h3-tablet); }
}

@media (min-width: 1024px) {
  h3 { font-size: var(--text-h3-desktop); }
}
```

#### H4-H6 - Smaller Headings
```css
h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  color: #fbbf24;
  letter-spacing: var(--tracking-wide);
}

h4 { font-size: 1.25rem; line-height: 1.2; }
h5 { font-size: 1.125rem; line-height: 1.3; }
h6 { font-size: 1rem; line-height: 1.4; }
```

### Visual Effects

#### Text Shadow Strategy
- **Mobile**: Single hard shadow for depth (2px 2px 0)
- **Desktop**: Hard shadow + subtle glow for impact
- **Purpose**: Creates depth and ensures readability on black background

#### Text Transform
- All headings use `text-transform: uppercase` for aggressive, poster-like aesthetic
- Maintains readability while adding visual impact

#### Line Height
- Tight line heights (0.9-1.1) for display headings
- Creates compact, impactful text blocks
- Prevents excessive vertical space

#### Letter Spacing
- H1: Tight tracking (-0.02em) for maximum impact
- H2-H3: Normal tracking for balance
- H4-H6: Wide tracking (0.05em) for smaller sizes

### Animation Effects

#### Subtle Entrance Animation (Optional Enhancement)
```css
@media (prefers-reduced-motion: no-preference) {
  h1, h2, h3 {
    animation: punk-fade-in 0.6s ease-out;
  }
  
  @keyframes punk-fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

#### Hover Effects (For Interactive Headings)
```css
a h1:hover, a h2:hover, a h3:hover {
  color: #ff0000; /* Red accent on hover */
  text-shadow: 
    2px 2px 0 rgba(0, 0, 0, 0.8),
    0 0 30px rgba(255, 0, 0, 0.5);
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  a h1:hover, a h2:hover, a h3:hover {
    transition: none;
  }
}
```

## Data Models

### Font Loading Configuration

```typescript
// In layout.tsx or a new fonts.ts file
import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
  preload: true,
});

// Apply to html element
<html className={`${geist.variable} ${bebasNeue.variable}`}>
```

### CSS Variable Structure

```typescript
interface TypographyTokens {
  fonts: {
    display: string;
    body: string;
  };
  sizes: {
    h1: { mobile: string; tablet: string; desktop: string };
    h2: { mobile: string; tablet: string; desktop: string };
    h3: { mobile: string; tablet: string; desktop: string };
  };
  effects: {
    shadow: string;
    glow: string;
    outline: string;
  };
  spacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}
```

### Tailwind Configuration Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bebas-neue)', 'Impact', 'Arial Black', 'sans-serif'],
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
};
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Font Stack Includes Display Font and Fallbacks

*For any* heading element (h1-h6), the computed font-family value should include the display font ('Bebas Neue') as the primary font and appropriate fallback fonts (Impact, Arial Black) in the stack.

**Validates: Requirements 1.1, 1.2**

### Property 2: Graceful Font Loading Degradation

*For any* heading element, when the display font fails to load, the element should render using fallback fonts without layout shifts or broken styling.

**Validates: Requirements 1.3**

### Property 3: Distinct Heading Level Styling

*For any* pair of different heading levels (h1 vs h2, h2 vs h3, etc.), the computed font-size values should be distinct, ensuring visual hierarchy.

**Validates: Requirements 2.1**

### Property 4: H1 Maximum Size Hierarchy

*For any* heading element, if it is an h1, its font-size should be greater than or equal to all other heading levels (h2-h6) at the same viewport width.

**Validates: Requirements 2.2**

### Property 5: WCAG AA Contrast Compliance

*For any* heading element with its background, the contrast ratio between the text color and background color should meet WCAG AA requirements (minimum 3:1 for large text, 4.5:1 for normal text).

**Validates: Requirements 2.5, 5.2**

### Property 6: Effects Work on Light and Dark Backgrounds

*For any* heading element with text effects (shadows, glows), the text should maintain sufficient contrast (minimum 3:1) on both black (#000000) and white (#FFFFFF) backgrounds.

**Validates: Requirements 3.3**

### Property 7: Effects Prevent Layout Shifts

*For any* heading element, applying text effects (shadows, transforms) should not change the element's bounding box dimensions or cause layout shifts.

**Validates: Requirements 3.4**

### Property 8: Responsive Typography Scaling

*For any* heading element, the font-size should scale appropriately across viewport widths: smallest at mobile (<768px), intermediate at tablet (768px-1023px), and largest at desktop (≥1024px).

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 9: Text Overflow Prevention

*For any* heading element at any viewport width (320px to 1920px), the text content should not overflow its container's boundaries.

**Validates: Requirements 4.4**

### Property 10: Amber Color Scheme Consistency

*For any* heading element, the computed color value should match the amber/yellow brand color (#fbbf24 or equivalent) unless explicitly overridden by component-specific styling.

**Validates: Requirements 5.1, 7.2**

### Property 11: Reduced Motion Disables Animations

*For any* heading element with animations, when the user's prefers-reduced-motion setting is "reduce", all animations should be disabled or have duration ≤ 0.01s.

**Validates: Requirements 6.2**

### Property 12: Tailwind Utility Preservation

*For any* heading element with Tailwind utility classes (e.g., mb-6, text-center), those utility styles should remain applied and not be overridden by the typography system's base styles.

**Validates: Requirements 7.3**

### Property 13: Text Selectability

*For any* heading element, the computed user-select property should not be "none", ensuring text remains selectable and copyable.

**Validates: Requirements 9.2**

### Property 14: Zoom Support Without Overflow

*For any* heading element at 200% browser zoom, the text should remain within its container boundaries without causing horizontal overflow.

**Validates: Requirements 9.4**

### Property 15: Focus Indicator Visibility

*For any* interactive heading element (within a link or button), when focused, a visible focus indicator (outline or ring) should be present with sufficient contrast against the background.

**Validates: Requirements 9.5**

## Error Handling

### Font Loading Failures

**Scenario**: Display font (Bebas Neue) fails to load from Google Fonts

**Handling**:
- `font-display: swap` ensures fallback fonts render immediately
- Fallback stack (Impact, Arial Black) provides similar visual weight
- No JavaScript error handling needed - CSS handles gracefully
- Layout remains stable due to similar font metrics

**Testing**: Simulate font load failure by blocking Google Fonts CDN

### Missing CSS Variables

**Scenario**: CSS custom properties are not defined or fail to load

**Handling**:
- Provide fallback values in CSS declarations
- Example: `font-size: var(--text-h1-mobile, 2.5rem);`
- Ensures headings still render with reasonable sizing
- Graceful degradation to inline fallback values

**Testing**: Remove CSS variable definitions and verify fallback values apply

### Viewport Edge Cases

**Scenario**: Extremely narrow viewports (<320px) or wide viewports (>2560px)

**Handling**:
- Use `clamp()` for fluid typography with min/max bounds
- Example: `font-size: clamp(2rem, 5vw, 5rem);`
- Prevents text from becoming too small or too large
- Maintains readability at extreme viewport sizes

**Testing**: Test at 280px, 320px, 1920px, 2560px, 3840px widths

### High Contrast Mode

**Scenario**: User enables high contrast mode in OS or browser

**Handling**:
```css
@media (prefers-contrast: high) {
  h1, h2, h3, h4, h5, h6 {
    text-shadow: none; /* Remove shadows for clarity */
    font-weight: 700; /* Ensure maximum weight */
    outline: 2px solid currentColor; /* Add outline for definition */
  }
}
```

**Testing**: Enable high contrast mode and verify text remains legible

### Reduced Motion

**Scenario**: User has prefers-reduced-motion enabled

**Handling**:
```css
@media (prefers-reduced-motion: reduce) {
  h1, h2, h3, h4, h5, h6 {
    animation: none !important;
    transition: none !important;
  }
}
```

**Testing**: Enable reduced motion preference and verify no animations play

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and configuration validation
- Verify font-display: swap is configured
- Check that preload links exist for critical fonts
- Validate CSS custom property definitions
- Test specific viewport breakpoint values
- Verify high contrast mode styles apply
- Check reduced motion overrides

**Property-Based Tests**: Verify universal properties across all inputs
- Test contrast ratios across generated color combinations
- Verify responsive scaling across random viewport widths
- Test text overflow prevention with random content lengths
- Validate font stack application across all heading levels
- Test layout stability with random text effects

### Property-Based Testing Configuration

**Library**: Use `fast-check` for JavaScript/TypeScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `Feature: punk-rock-typeface, Property {number}: {property_text}`

**Example Test Structure**:
```typescript
// Feature: punk-rock-typeface, Property 5: WCAG AA Contrast Compliance
test('heading colors meet WCAG AA contrast requirements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('h1', 'h2', 'h3', 'h4', 'h5', 'h6'),
      fc.hexaColor(),
      (headingLevel, backgroundColor) => {
        const heading = document.createElement(headingLevel);
        document.body.appendChild(heading);
        const color = getComputedStyle(heading).color;
        const contrast = calculateContrastRatio(color, backgroundColor);
        document.body.removeChild(heading);
        
        // Large text (>= 18pt or >= 14pt bold) needs 3:1, normal text needs 4.5:1
        const isLargeText = ['h1', 'h2', 'h3'].includes(headingLevel);
        const minContrast = isLargeText ? 3 : 4.5;
        
        return contrast >= minContrast;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Test Examples

**Font Configuration Test**:
```typescript
test('Bebas Neue font is configured with correct properties', () => {
  expect(bebasNeue.variable).toBe('--font-bebas-neue');
  expect(bebasNeue.style.fontDisplay).toBe('swap');
  expect(bebasNeue.style.fontWeight).toContain('400');
  expect(bebasNeue.style.fontWeight).toContain('700');
});
```

**CSS Variable Test**:
```typescript
test('typography CSS variables are defined', () => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  
  expect(styles.getPropertyValue('--font-display')).toContain('Bebas Neue');
  expect(styles.getPropertyValue('--text-h1-mobile')).toBe('2.5rem');
  expect(styles.getPropertyValue('--text-shadow-punk')).toBeTruthy();
});
```

**Reduced Motion Test**:
```typescript
test('animations are disabled when prefers-reduced-motion is set', () => {
  // Set reduced motion preference
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
  }));
  
  const h1 = document.createElement('h1');
  document.body.appendChild(h1);
  const styles = getComputedStyle(h1);
  
  expect(styles.animationDuration).toBe('0s');
  document.body.removeChild(h1);
});
```

### Integration Testing

**Visual Regression Testing**:
- Capture screenshots of headings at different viewport sizes
- Compare against baseline images
- Detect unintended visual changes

**Cross-Browser Testing**:
- Test in Chrome, Firefox, Safari, Edge
- Verify font rendering consistency
- Check fallback font behavior

**Accessibility Testing**:
- Run axe-core or similar accessibility testing tools
- Verify WCAG compliance
- Test with screen readers (NVDA, JAWS, VoiceOver)

### Performance Testing

**Font Loading Performance**:
- Measure time to first contentful paint (FCP)
- Verify font-display: swap prevents FOIT (Flash of Invisible Text)
- Check that preload improves loading time for above-the-fold headings

**Rendering Performance**:
- Measure layout shift (CLS - Cumulative Layout Shift)
- Verify text effects don't cause excessive repaints
- Test animation performance (should maintain 60fps)

**Metrics to Track**:
- Font download size (should be <50KB for subsetted fonts)
- Time to font load (should be <1s on 3G)
- Layout shift score (should be <0.1)
- Animation frame rate (should be ≥60fps)
