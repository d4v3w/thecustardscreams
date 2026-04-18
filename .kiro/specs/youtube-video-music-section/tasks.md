# Implementation Plan: YouTube Video Music Section

## Overview

This implementation adds the "Would You [Official Performance Video]" YouTube video to the website in two places:

1. **Home page (MusicSection)** — A custom minimal player with autoplay-on-scroll (muted), hover-revealed play/pause controls, and a persistent mute/unmute button via a new `YoutubePlayer.tsx` client component.
2. **/music page** — A simple video ID swap on the existing standard YouTube iframe embed.

The implementation follows a requirements-first approach, building from the design specifications with incremental validation through unit tests and property-based tests.

## Tasks

- [x] 1. Set up YouTube Player component structure and types
  - Create `src/components/YoutubePlayer.tsx` as a client component with TypeScript interfaces
  - Create `src/types/youtube.d.ts` with YouTube IFrame API type declarations
  - Define `YoutubePlayerProps` interface with `videoId`, `title`, and optional `className`
  - Set up internal state management for `isReady`, `isPlaying`, and `isMuted`
  - Set up refs for `iframeRef`, `playerRef`, and `pendingPlay`
  - _Requirements: 1.1, 1.2, 4.1, 5.1_

- [x] 2. Implement YouTube IFrame API script injection
  - Add idempotent script injection logic to load `https://www.youtube.com/iframe_api`
  - Check for existing script tag before appending to prevent duplicates
  - Implement `onYouTubeIframeAPIReady` global callback handler
  - Guard against multiple component instances with mounted ref tracking
  - _Requirements: 6.4_

- [x] 3. Implement YouTube iframe element and player initialization
  - Render iframe with privacy-enhanced URL: `https://www.youtube-nocookie.com/embed/{videoId}`
  - Include all required query parameters: `enablejsapi=1&controls=0&modestbranding=1&mute=1&rel=0&playsinline=1`
  - Set iframe attributes: `title`, `frameBorder="0"`, `allow` permissions
  - Implement player initialization via YouTube IFrame API in `onReady` callback
  - Handle deferred autoplay: consume `pendingPlay` ref when API is ready
  - _Requirements: 1.2, 1.3, 1.4, 4.6, 4.7_

- [x] 4. Implement IntersectionObserver for autoplay-on-scroll
  - Create IntersectionObserver with `root: document.body` and `threshold: 0.5`
  - Implement intersection callback to trigger play/pause based on visibility
  - Integrate `useReducedMotion()` hook to gate autoplay when user prefers reduced motion
  - Handle deferred intersection: if element intersects before API ready, set `pendingPlay` flag
  - Clean up observer on component unmount
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Implement play/pause state management and controls
  - Add play/pause button to custom overlay with hover visibility
  - Implement click handler to toggle `isPlaying` state and call `playVideo()` / `pauseVideo()`
  - Update button icon based on `isPlaying` state (play icon when paused, pause icon when playing)
  - Sync internal state with YouTube player state via `onStateChange` callback
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 6. Implement mute/unmute state management and controls
  - Add mute/unmute button to custom overlay (always visible)
  - Implement click handler to toggle `isMuted` state and call `mute()` / `unMute()`
  - Update button icon based on `isMuted` state (mute icon when muted, unmute icon when unmuted)
  - Sync internal state with YouTube player mute state via `isMuted()` API call
  - _Requirements: 4.4, 4.5_

- [x] 7. Implement accessibility features
  - Add `aria-label` attributes to play/pause button that reflect current state and action
  - Add `aria-label` attributes to mute/unmute button that reflect current state and action
  - Implement keyboard support: Enter/Space to activate buttons
  - Ensure buttons are focusable and keyboard-operable
  - Add semantic HTML structure with proper heading hierarchy
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 8. Implement responsive layout and styling
  - Create aspect-ratio container (16:9) using Tailwind utilities
  - Set max-width constraint for desktop viewports
  - Ensure full-width scaling on mobile viewports
  - Center player horizontally within container
  - Apply custom overlay styling with hover effects
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 9. Add YouTube policy compliance links
  - Add visible link to YouTube watch page: `https://www.youtube.com/watch?v={videoId}`
  - Add visible link to Google privacy policy: `https://policies.google.com/privacy`
  - Position links in proximity to the video embed
  - _Requirements: 6.2, 6.3_

- [x] 10. Implement error handling and edge cases
  - Guard IntersectionObserver with `typeof IntersectionObserver !== "undefined"` check
  - Handle YouTube API script load failure gracefully (autoplay disabled, manual controls still work)
  - Implement cleanup in useEffect to call `player.destroy()` on unmount
  - Handle component unmount before API ready scenario
  - _Requirements: 3.4_

- [x] 11. Update MusicSection component to use YoutubePlayer
  - Import `YoutubePlayer` component in `src/app/_components/MusicSection.tsx`
  - Render `YoutubePlayer` above the existing `Music` component
  - Pass props: `videoId="OzE7EgHfAx8"`, `title="The Custard Screams - Would You [Official Performance Video]"`, `className="mb-6"`
  - Verify `Music` component is not modified
  - _Requirements: 1.1, 1.5_

- [x] 12. Update /music page YouTube embed
  - Replace video ID `BR6U5TuXlAM` with `OzE7EgHfAx8` in `src/app/music/page.tsx`
  - Update iframe `title` attribute to "The Custard Screams - Would You [Official Performance Video]"
  - Verify all existing attributes are retained: `allow`, `allowFullScreen`, `rounded-lg` class
  - Verify `Music` component is not modified
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3_

- [ ] 13. Checkpoint - Verify component renders correctly
  - Ensure YoutubePlayer component renders without errors
  - Verify iframe renders with correct src URL and all query parameters
  - Verify custom overlay renders with play/pause and mute/unmute buttons
  - Verify MusicSection renders YoutubePlayer above Music component
  - Verify /music page renders with updated video ID
  - Ask the user if questions arise.

- [-] 14. Create unit tests for YoutubePlayer component
  - [ ] 14.1 Test iframe renders with correct src URL
    - Verify iframe src contains `youtube-nocookie.com` domain
    - Verify iframe src contains correct video ID `OzE7EgHfAx8`
    - Verify all required query parameters are present: `enablejsapi=1&controls=0&modestbranding=1&mute=1&rel=0&playsinline=1`
    - _Requirements: 1.2, 1.3, 4.6, 4.7_

  - [ ] 14.2 Test iframe has correct title attribute
    - Verify iframe title is "The Custard Screams - Would You [Official Performance Video]"
    - _Requirements: 1.4, 5.1_

  - [ ] 14.3 Test play/pause toggle functionality
    - Mock YouTube Player API
    - Verify clicking play/pause button calls `playVideo()` when paused
    - Verify clicking play/pause button calls `pauseVideo()` when playing
    - Verify button icon updates based on playback state
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 14.4 Test mute/unmute toggle functionality
    - Mock YouTube Player API
    - Verify clicking mute/unmute button calls `mute()` when unmuted
    - Verify clicking mute/unmute button calls `unMute()` when muted
    - Verify button icon updates based on mute state
    - _Requirements: 4.4, 4.5_

  - [ ] 14.5 Test autoplay on scroll
    - Mock IntersectionObserver
    - Verify `playVideo()` is called when element intersects and API is ready
    - Verify `pauseVideo()` is called when element exits viewport
    - _Requirements: 3.1, 3.2_

  - [ ] 14.6 Test reduced motion preference
    - Mock `useReducedMotion()` to return true
    - Verify `playVideo()` is never called on intersection
    - Verify manual play button still works
    - _Requirements: 3.5_

  - [ ] 14.7 Test deferred autoplay
    - Mock IntersectionObserver to fire before API ready
    - Verify `pendingPlay` flag is set
    - Verify `playVideo()` is called when API becomes ready
    - _Requirements: 3.4_

  - [ ] 14.8 Test accessibility attributes
    - Verify play/pause button has `aria-label` attribute
    - Verify mute/unmute button has `aria-label` attribute
    - Verify aria-labels update when state changes
    - _Requirements: 5.1, 5.3_

  - [ ] 14.9 Test keyboard support
    - Verify buttons are keyboard-focusable
    - Verify Enter key activates play/pause button
    - Verify Space key activates mute/unmute button
    - _Requirements: 5.2_

  - [ ] 14.10 Test YouTube policy compliance links
    - Verify YouTube watch link is present with correct href
    - Verify Google privacy policy link is present with correct href
    - _Requirements: 6.2, 6.3_

  - [ ] 14.11 Test error handling
    - Verify component renders gracefully when IntersectionObserver is not supported
    - Verify component renders gracefully when YouTube API fails to load
    - Verify cleanup is called on unmount
    - _Requirements: 3.4_

- [ ]* 15. Create property-based tests for YoutubePlayer
  - [ ]* 15.1 Property test: Reduced motion disables autoplay
    - **Property 1: Reduced motion disables autoplay**
    - **Validates: Requirements 3.5**
    - Generate arbitrary sequences of intersection events with `prefersReducedMotion = true`
    - Assert `playVideo()` is never called regardless of intersection state
    - Minimum 100 iterations

  - [ ]* 15.2 Property test: Play/pause toggle is a round-trip
    - **Property 2: Play/pause toggle is a round-trip**
    - **Validates: Requirements 4.3**
    - Generate arbitrary initial `isPlaying` state (true or false)
    - Simulate two clicks on play/pause button
    - Assert state returns to initial value
    - Minimum 100 iterations

  - [ ]* 15.3 Property test: Mute/unmute toggle is a round-trip
    - **Property 3: Mute/unmute toggle is a round-trip**
    - **Validates: Requirements 4.5**
    - Generate arbitrary initial `isMuted` state (true or false)
    - Simulate two clicks on mute/unmute button
    - Assert state returns to initial value
    - Minimum 100 iterations

  - [ ]* 15.4 Property test: Aria-labels accurately reflect current state
    - **Property 4: Aria-labels accurately reflect current state**
    - **Validates: Requirements 5.3**
    - Generate arbitrary combinations of `isPlaying` (true/false) and `isMuted` (true/false)
    - Assert play/pause button aria-label matches expected string for that state
    - Assert mute/unmute button aria-label matches expected string for that state
    - Minimum 100 iterations

- [ ]* 16. Create integration tests
  - [ ]* 16.1 Test MusicSection renders YoutubePlayer
    - Render MusicSection component
    - Verify YoutubePlayer is rendered
    - Verify Music component is rendered below YoutubePlayer
    - _Requirements: 1.1, 1.5_

  - [ ]* 16.2 Test /music page renders correct video ID
    - Render /music page
    - Verify iframe src contains `OzE7EgHfAx8` (not `BR6U5TuXlAM`)
    - Verify iframe title is updated
    - Verify all existing attributes are retained
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 16.3 Test responsive layout
    - Verify YoutubePlayer maintains 16:9 aspect ratio on mobile
    - Verify YoutubePlayer maintains 16:9 aspect ratio on desktop
    - Verify YoutubePlayer is centered horizontally
    - Verify YoutubePlayer respects max-width constraint on desktop
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 8.1, 8.2, 8.3_

- [x] 17. Checkpoint - Ensure all tests pass
  - Run all unit tests and verify they pass
  - Run all property-based tests and verify they pass
  - Run all integration tests and verify they pass
  - Verify no TypeScript errors or ESLint warnings
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The `Music` component is shared and MUST NOT be modified
- YouTube IFrame API script injection is idempotent to support multiple instances
- IntersectionObserver uses `document.body` as root because the site uses `scroll-snap-type: y mandatory` on body
