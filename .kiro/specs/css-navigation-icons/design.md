# Design Document: CSS Navigation Icons

## Overview

This design replaces emoji-based navigation icons with pure CSS geometric icons that embody a punk rock/KISS-inspired aesthetic - bold, aggressive, high contrast, and angular. Each icon is constructed using CSS borders, transforms, and pseudo-elements to create sharp, edgy geometric shapes that match the hard rock band's visual identity.

The implementation focuses on:
- **Zero dependencies**: Pure CSS with no external libraries or image files
- **Performance**: No additional HTTP requests, minimal DOM nodes
- **Accessibility**: ARIA attributes preserved, icons hidden from screen readers
- **Maintainability**: Tailwind CSS integration with scoped custom styles
- **Aesthetic**: Bold, angular, high-contrast geometric shapes with punk rock edge

## Architecture

### Component Structure

```
NavItem (existing component)
├── CSS Icon Container (new)
│   ├── Base geometric shape (div or span)
│   └── Pseudo-elements (::before, ::after) for additional shapes
└── Existing label and accessibility attributes
```

### Icon Construction Approach

Each icon uses a minimal DOM structure with CSS to create geometric shapes:
- **Base element**: Primary shape container
- **::before pseudo-element**: Secondary shape or accent
- **::after pseudo-element**: Tertiary shape or accent
- **CSS properties**: borders, transforms, positioning, clip-path for angular shapes

### State Management

Icons respond to two states:
- **Inactive**: White color (`text-white`)
- **Active**: Black color (`text-black` with `bg-amber-400` background)

State transitions use existing Tailwind transition utilities for smooth animations.

## Components and Interfaces

### Icon Component Structure

Each icon is a self-contained CSS module that can be applied to a container element:

```tsx
interface CSSIconProps {
  isActive: boolean;
  className?: string;
}

// Icon container structure
<span 
  className={`css-icon ${iconType} ${isActive ? 'active' : 'inactive'}`}
  aria-hidden="true"
/>
```

### Integration with NavItem

The existing NavItem component will be modified to render CSS icons instead of emojis:

```tsx
// Before (current)
<span className="text-2xl">{emoji}</span>

// After (new)
<CSSIcon type={iconType} isActive={isActive} />
```

## Data Models

### Icon Type Enumeration

```typescript
type IconType = 'home' | 'music' | 'shows' | 'about';
```

### Icon Configuration

```typescript
interface IconConfig {
  type: IconType;
  label: string;
  ariaLabel: string;
}

const ICON_CONFIGS: IconConfig[] = [
  { type: 'home', label: 'Hero', ariaLabel: 'Navigate to hero section' },
  { type: 'music', label: 'Music', ariaLabel: 'Navigate to music section' },
  { type: 'shows', label: 'Shows', ariaLabel: 'Navigate to shows section' },
  { type: 'about', label: 'About', ariaLabel: 'Navigate to about section' },
];
```

## CSS Icon Implementations

### Design Principles

All icons follow these punk rock/KISS aesthetic principles:
- **Bold geometric shapes**: Thick lines (3-4px), sharp angles
- **High contrast**: Pure white on dark, pure black on amber when active
- **Angular construction**: Prefer straight lines and sharp corners over curves
- **Aggressive stance**: Slightly tilted or dynamic positioning
- **Minimal but impactful**: 2-3 geometric shapes maximum per icon

### 1. Home Icon (House)

**Concept**: Angular house with sharp roof and bold base - aggressive geometric interpretation

```css
.css-icon.home {
  position: relative;
  width: 24px;
  height: 24px;
  display: inline-block;
}

/* Roof - sharp triangle */
.css-icon.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-bottom: 12px solid currentColor;
}

/* Base - bold rectangle */
.css-icon.home::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 2px;
  width: 20px;
  height: 14px;
  border: 3px solid currentColor;
  border-top: none;
}
```

### 2. Music Icon (Note)

**Concept**: Bold eighth note with angular stem and aggressive note head

```css
.css-icon.music {
  position: relative;
  width: 24px;
  height: 24px;
  display: inline-block;
}

/* Stem - thick vertical line */
.css-icon.music::before {
  content: '';
  position: absolute;
  top: 2px;
  right: 6px;
  width: 4px;
  height: 16px;
  background: currentColor;
  transform: skewX(-5deg); /* Slight angle for edge */
}

/* Note head - angular oval/circle */
.css-icon.music::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: currentColor;
  border-radius: 50% 50% 50% 0; /* Angular bottom-right */
  transform: rotate(-45deg);
}
```

### 3. Shows Icon (Calendar)

**Concept**: Bold calendar grid with sharp edges and aggressive binding

```css
.css-icon.shows {
  position: relative;
  width: 24px;
  height: 24px;
  display: inline-block;
}

/* Calendar body - bold rectangle */
.css-icon.shows {
  border: 3px solid currentColor;
  border-radius: 2px;
}

/* Top binding bar - thick horizontal */
.css-icon.shows::before {
  content: '';
  position: absolute;
  top: 6px;
  left: -3px;
  right: -3px;
  height: 4px;
  background: currentColor;
}

/* Date grid indicator - angular marks */
.css-icon.shows::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 2px;
  background: currentColor;
  box-shadow: 
    0 -5px 0 currentColor,
    -5px 0 0 currentColor,
    5px 0 0 currentColor;
}
```

### 4. About Icon (Info)

**Concept**: Bold "i" with angular dot and aggressive stem

```css
.css-icon.about {
  position: relative;
  width: 24px;
  height: 24px;
  display: inline-block;
}

/* Dot - angular diamond shape */
.css-icon.about::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 6px;
  height: 6px;
  background: currentColor;
}

/* Stem - bold vertical bar */
.css-icon.about::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 14px;
  background: currentColor;
  clip-path: polygon(
    20% 0%,
    80% 0%,
    100% 100%,
    0% 100%
  ); /* Tapered for aggression */
}
```

### Color States

```css
/* Inactive state - white */
.css-icon.inactive {
  color: white;
}

/* Active state - black */
.css-icon.active {
  color: black;
}

/* Transition */
.css-icon {
  transition: color 200ms ease-in-out;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

