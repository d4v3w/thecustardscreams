# Design Document: YouTube Video Music Section

## Overview

This feature adds the "Would You [Official Performance Video]" YouTube video (`OzE7EgHfAx8`) to the website in two places:

1. **Home page (`MusicSection.tsx`)** — a minimal custom player with autoplay-on-scroll (muted), hover-revealed play/pause controls, and a persistent mute/unmute button. Implemented as a new `YoutubePlayer.tsx` client component placed above the existing `Music` component.
2. **`/music` page (`music/page.tsx`)** — a simple video ID swap on the existing standard YouTube `<iframe>` embed.

The shared `Music` component (`src/components/Music.tsx`) is not touched by either task.

---

## Architecture

### Task 1 — Home Page Custom Player

```
MusicSection.tsx (server component)
└── YoutubePlayer.tsx  ("use client" — new component)
    ├── <div> wrapper  (aspect-ratio container, max-width, centred)
    │   ├── <iframe>   (youtube-nocookie embed, enablejsapi=1, controls=0)
    │   └── Custom_Player_Overlay
    │       ├── Play/Pause button  (hover-visible)
    │       └── Mute/Unmute button (always visible)
└── Music component    (unchanged)
```

`YoutubePlayer.tsx` is a self-contained client component. It:
- Loads the YouTube IFrame Player API via a `<script>` tag appended to `document.head` (idempotent — checks for existing tag).
- Wires up an `IntersectionObserver` against the `body` scroll container (required because the site uses `scroll-snap-type: y mandatory` on `body`).
- Reads `useReducedMotion()` to gate autoplay.
- Manages three pieces of local state: `isPlaying`, `isMuted`, `isReady`.

### Task 2 — `/music` Page Embed Swap

A single-line change in `src/app/music/page.tsx`: replace video ID `BR6U5TuXlAM` with `OzE7EgHfAx8` and update the `title` attribute. No new components or hooks needed.

---

## Components and Interfaces

### `YoutubePlayer.tsx` (new)

```typescript
// src/components/YoutubePlayer.tsx
"use client";

interface YoutubePlayerProps {
  videoId: string;
  title: string;
  className?: string;
}
```

Internal state:

| State      | Type    | Initial | Description                                  |
|------------|---------|---------|----------------------------------------------|
| `isReady`  | boolean | false   | YouTube IFrame API `onReady` has fired        |
| `isPlaying`| boolean | false   | Current playback state                        |
| `isMuted`  | boolean | true    | Current mute state (starts muted for autoplay)|

Refs:

| Ref            | Type                        | Purpose                                  |
|----------------|-----------------------------|------------------------------------------|
| `iframeRef`    | `RefObject<HTMLIFrameElement>` | Target for IFrame API                  |
| `playerRef`    | `RefObject<YT.Player>`      | YouTube Player instance                  |
| `pendingPlay`  | `RefObject<boolean>`        | Deferred autoplay flag (API not yet ready)|

### YouTube IFrame API Type Augmentation

A minimal ambient declaration is added to `src/types/youtube.d.ts` (or inline in the component file) to type `window.YT` and `window.onYouTubeIframeAPIReady` without pulling in a third-party types package:

```typescript
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}
namespace YT {
  class Player {
    constructor(el: HTMLIFrameElement, opts: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    getPlayerState(): number;
    destroy(): void;
  }
  interface PlayerOptions {
    events?: {
      onReady?: (e: { target: Player }) => void;
      onStateChange?: (e: { data: number }) => void;
    };
  }
  const PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}
```

### `MusicSection.tsx` (modified)

`MusicSection` remains a server component. It imports `YoutubePlayer` (a client component) and renders it above `<Music />`:

```tsx
import YoutubePlayer from "~/components/YoutubePlayer";
import Music from "~/components/Music";
import Section from "~/components/Section";

export default function MusicSection() {
  return (
    <Section id="music" className="flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <h2 id="music-heading" className="mb-6 text-3xl font-bold text-amber-400 md:text-4xl">
          Music
        </h2>
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
          className="mb-6"
        />
        <Music />
      </div>
    </Section>
  );
}
```

---

## Data Models

### Embed URL Construction

The iframe `src` is built from a fixed base URL with query parameters:

```
https://www.youtube-nocookie.com/embed/{videoId}?enablejsapi=1&controls=0&modestbranding=1&mute=1&rel=0&playsinline=1
```

| Parameter       | Value | Reason                                              |
|-----------------|-------|-----------------------------------------------------|
| `enablejsapi`   | 1     | Required for IFrame Player API control              |
| `controls`      | 0     | Hide default YouTube controls (custom overlay used) |
| `modestbranding`| 1     | Minimise YouTube branding                           |
| `mute`          | 1     | Required for autoplay in browsers                   |
| `rel`           | 0     | Suppress related videos at end                      |
| `playsinline`   | 1     | Prevent fullscreen takeover on iOS                  |

### Intersection Observer Configuration

```typescript
const observer = new IntersectionObserver(handleIntersection, {
  root: document.body,   // body is the scroll container (scroll-snap)
  threshold: 0.5,        // 50% visible triggers play/pause
});
```

`root: document.body` is critical — the site uses `overflow-y: scroll` on `body` with `scroll-snap-type: y mandatory`, so the default `root: null` (viewport) would not fire correctly.

### Player State Machine

```
IDLE ──(API ready)──► READY
READY ──(intersect in, !reducedMotion)──► PLAYING
PLAYING ──(intersect out)──► PAUSED
PAUSED ──(intersect in, !reducedMotion)──► PLAYING
PLAYING ──(click play/pause)──► PAUSED
PAUSED ──(click play/pause)──► PLAYING
```

Deferred autoplay: if the element intersects before `onReady` fires, a `pendingPlay` ref is set to `true`. When `onReady` fires, if `pendingPlay` is true and `!reducedMotion`, `playVideo()` is called immediately.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Reduced motion disables autoplay

*For any* intersection event that would normally trigger autoplay (player entering the viewport), if the user's `prefers-reduced-motion` media query is set to `reduce`, then `playVideo()` shall never be called regardless of intersection state.

**Validates: Requirements 3.5**

### Property 2: Play/pause toggle is a round-trip

*For any* initial playback state (playing or paused), clicking the play/pause button once changes the state, and clicking it a second time returns to the original state.

**Validates: Requirements 4.3**

### Property 3: Mute/unmute toggle is a round-trip

*For any* initial mute state (muted or unmuted), clicking the mute/unmute button once changes the mute state, and clicking it a second time returns to the original mute state.

**Validates: Requirements 4.5**

### Property 4: Aria-labels accurately reflect current state

*For any* combination of playback state (playing/paused) and mute state (muted/unmuted), the `aria-label` on the play/pause button and the `aria-label` on the mute/unmute button shall each accurately describe the current state and the action that clicking will perform.

**Validates: Requirements 5.3**

---

## Error Handling

| Scenario | Handling |
|---|---|
| `IntersectionObserver` not supported | Guard with `typeof IntersectionObserver !== "undefined"` — autoplay silently disabled, manual controls still work |
| YouTube IFrame API script fails to load | `onReady` never fires; `pendingPlay` is never consumed; player renders but autoplay and programmatic controls are unavailable; the iframe itself still renders and the user can interact via YouTube's fallback |
| API ready fires before intersection | `pendingPlay` is false; no spurious playback |
| Component unmounts before API ready | `useEffect` cleanup calls `player.destroy()` if the player was created; the `onYouTubeIframeAPIReady` global callback is a no-op after unmount (guarded by a mounted ref) |
| `window.YT` already loaded (hot reload / multiple instances) | Script injection is skipped if `document.querySelector('script[src*="iframe_api"]')` already exists; `onYouTubeIframeAPIReady` chains with any existing handler |

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

Co-located at `src/components/YoutubePlayer.test.tsx`.

**Example-based tests** cover:
- Iframe renders with correct `src` URL (nocookie domain, video ID, all required query params)
- Iframe has correct `title` attribute
- Play icon shown when paused; pause icon shown when playing
- Mute icon shown when muted; unmute icon shown when unmuted
- Clicking play/pause calls `playVideo()` / `pauseVideo()` on the player mock
- Clicking mute/unmute calls `mute()` / `unMute()` on the player mock
- YouTube watch link and Google privacy policy link are present in the DOM
- Script tag for IFrame API is appended to `document.head`
- Autoplay deferred: intersection fires before `onReady` → `playVideo` not called until `onReady` fires
- Autoplay on intersection: `onReady` fires, then intersection → `playVideo` called
- Pause on exit: intersection exit → `pauseVideo` called

**Property-based tests** (fast-check, minimum 100 iterations each):

- **Property 1** — Generate arbitrary `isIntersecting` boolean sequences with `prefersReducedMotion = true`; assert `playVideo` is never called.
  - Tag: `Feature: youtube-video-music-section, Property 1: Reduced motion disables autoplay`

- **Property 2** — Generate arbitrary initial `isPlaying` state; simulate two clicks on play/pause; assert state returns to initial.
  - Tag: `Feature: youtube-video-music-section, Property 2: Play/pause toggle is a round-trip`

- **Property 3** — Generate arbitrary initial `isMuted` state; simulate two clicks on mute/unmute; assert state returns to initial.
  - Tag: `Feature: youtube-video-music-section, Property 3: Mute/unmute toggle is a round-trip`

- **Property 4** — Generate arbitrary combinations of `isPlaying` and `isMuted`; assert aria-labels on both buttons match expected strings for that state.
  - Tag: `Feature: youtube-video-music-section, Property 4: Aria-labels accurately reflect current state`

### Integration / Smoke Tests

- `music/page.tsx` renders an iframe with `src` containing `OzE7EgHfAx8` (not `BR6U5TuXlAM`).
- `music/page.tsx` iframe retains `allowFullScreen`, `allow` attributes, and `rounded-lg` class.

### Mocking Strategy

- `window.YT` and `window.onYouTubeIframeAPIReady` are mocked in Jest setup.
- `IntersectionObserver` is mocked using a standard Jest mock that exposes `triggerIntersection(isIntersecting: boolean)` helper.
- `useReducedMotion` is mocked via `jest.mock('~/hooks/useReducedMotion')` to control the return value per test.
