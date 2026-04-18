# Requirements Document

## Introduction

This feature adds the YouTube video "The Custard Screams - Would You [Official Performance Video]" (video ID: `OzE7EgHfAx8`) to the website in two distinct places, each with a different implementation approach:

- **Task 1 (Home Page):** Add a minimal custom video player directly in `MusicSection.tsx` (`src/app/_components/MusicSection.tsx`). This player autoplays on scroll (muted), supports play/pause on hover, and includes a mute/unmute button. The shared `Music` component (`src/components/Music.tsx`) is NOT modified.
- **Task 2 (/music Page):** Replace the existing YouTube embed (video ID: `BR6U5TuXlAM`) in `src/app/music/page.tsx` with the "Would You" video (`OzE7EgHfAx8`). This uses a standard full YouTube embed (not the minimal custom player), since the `/music` page is a dedicated music page with more space.

The `Music` component (`src/components/Music.tsx`) is shared between the home page and the `/music` page and MUST NOT be modified as part of this feature.

## Glossary

- **MusicSection**: The home page section component at `src/app/_components/MusicSection.tsx` that renders the `Music_Component` inside a `Section` wrapper.
- **Music_Component**: The shared reusable React component at `src/components/Music.tsx`. This component is used by both `MusicSection` and the `/music` page and MUST NOT be modified.
- **Music_Page**: The dedicated music page at `src/app/music/page.tsx`.
- **Minimal_Custom_Player**: The custom video player added directly to `MusicSection.tsx`, consisting of a `YouTube_Embed` with a `Custom_Player_Overlay` providing play/pause on hover and a mute/unmute button.
- **Standard_YouTube_Embed**: A standard responsive `<iframe>` embedding a YouTube video with default YouTube controls enabled, used on the `/music` page.
- **YouTube_Embed**: A responsive `<iframe>` embedding a YouTube video using the YouTube privacy-enhanced embed URL format (`https://www.youtube-nocookie.com/embed/...`).
- **Would_You_Video**: The specific YouTube video at `https://www.youtube.com/watch?v=OzE7EgHfAx8` titled "The Custard Screams - Would You [Official Performance Video]".
- **Existing_Music_Page_Embed**: The existing `<iframe>` in `src/app/music/page.tsx` using `src="https://www.youtube.com/embed/BR6U5TuXlAM"`, which is to be replaced.
- **Custom_Player_Overlay**: The custom UI layer rendered over the `YouTube_Embed` in `MusicSection.tsx` providing a play/pause icon and a mute/unmute button, replacing the default YouTube controls.
- **YouTube_Player_API**: The YouTube IFrame Player API (`https://www.youtube.com/iframe_api`) used to programmatically control playback and mute state.
- **Intersection_Observer**: The browser API used to detect when the `YouTube_Embed` scrolls into the viewport.

## Requirements

---

## Task 1: Minimal Custom Player on Home Page (MusicSection.tsx)

### Requirement 1: Display Minimal Custom Player in MusicSection

**User Story:** As a visitor to the home page, I want to watch the official "Would You" performance video directly in the Music section, so that I can experience the band's music visually without leaving the page.

#### Acceptance Criteria

1. THE `MusicSection` SHALL render the `Minimal_Custom_Player` above the `Music_Component`.
2. THE `Minimal_Custom_Player` SHALL embed the `Would_You_Video` using the `YouTube_Embed` with video ID `OzE7EgHfAx8`.
3. THE `YouTube_Embed` SHALL use the privacy-enhanced embed URL `https://www.youtube-nocookie.com/embed/OzE7EgHfAx8`.
4. THE `YouTube_Embed` SHALL include a descriptive `title` attribute with the value "The Custard Screams - Would You [Official Performance Video]" for accessibility.
5. THE `Music_Component` SHALL NOT be modified as part of this task.

### Requirement 2: Responsive Video Layout (Home Page)

**User Story:** As a visitor on any device, I want the video on the home page to display correctly on both mobile and desktop screen sizes, so that I have a good viewing experience regardless of my device.

#### Acceptance Criteria

1. THE `Minimal_Custom_Player` SHALL maintain a 16:9 aspect ratio on all viewport sizes.
2. THE `Minimal_Custom_Player` SHALL scale to the full available width of its container on mobile viewports.
3. THE `Minimal_Custom_Player` SHALL be constrained to a maximum width consistent with the existing content layout on desktop viewports.
4. THE `Minimal_Custom_Player` SHALL be centred horizontally within the `MusicSection` container.

### Requirement 3: Autoplay on Scroll Into View (Home Page)

**User Story:** As a visitor scrolling through the home page, I want the video to start playing automatically when it comes into view, so that I am drawn into the band's music without needing to manually press play.

#### Acceptance Criteria

1. WHEN the `Minimal_Custom_Player` enters the viewport, THE `MusicSection` SHALL begin playback of the `Would_You_Video` automatically.
2. WHEN the `Minimal_Custom_Player` exits the viewport, THE `MusicSection` SHALL pause playback automatically.
3. THE `YouTube_Embed` SHALL begin playback in a muted state when autoplaying on scroll.
4. WHEN the `YouTube_Player_API` is not yet ready, THE `MusicSection` SHALL defer autoplay until the API signals readiness.
5. WHERE the user has indicated a preference for reduced motion, THE `MusicSection` SHALL not autoplay on scroll.

### Requirement 4: Custom Minimal Player Controls (Home Page)

**User Story:** As a visitor on the home page, I want a clean, minimal video player that fits the band's aesthetic, so that the experience feels intentional rather than like a generic YouTube embed.

#### Acceptance Criteria

1. THE `Custom_Player_Overlay` SHALL display a play icon when the video is paused and a pause icon when the video is playing.
2. WHEN a visitor hovers over the `Minimal_Custom_Player`, THE play/pause icon SHALL become visible.
3. WHEN a visitor clicks the play/pause icon, THE `MusicSection` SHALL toggle playback state via the `YouTube_Player_API`.
4. THE `Custom_Player_Overlay` SHALL display a mute/unmute button that reflects the current mute state of the `YouTube_Player_API`.
5. WHEN a visitor clicks the mute/unmute button, THE `MusicSection` SHALL toggle the mute state via the `YouTube_Player_API`.
6. THE `YouTube_Embed` SHALL be initialised with `controls=0` to hide the default YouTube player controls.
7. THE `YouTube_Embed` SHALL be initialised with `modestbranding=1` to minimise YouTube branding within the player.

### Requirement 5: Accessible Custom Player (Home Page)

**User Story:** As a visitor using assistive technology on the home page, I want the video player to be properly labelled and keyboard-operable, so that I can understand and interact with the embedded content.

#### Acceptance Criteria

1. THE `YouTube_Embed` SHALL include `title="The Custard Screams - Would You [Official Performance Video]"` on the `<iframe>` element.
2. THE `Custom_Player_Overlay` controls SHALL be keyboard-focusable and operable via keyboard.
3. THE `Custom_Player_Overlay` buttons SHALL include descriptive `aria-label` attributes that update to reflect current state (e.g. "Play video" / "Pause video", "Unmute video" / "Mute video").

### Requirement 6: YouTube Policy Compliance (Home Page)

**User Story:** As the website owner, I want the home page video embed to comply with YouTube's terms of service, so that the website avoids policy violations.

#### Acceptance Criteria

1. THE `YouTube_Embed` in `MusicSection` SHALL use the privacy-enhanced domain `https://www.youtube-nocookie.com/embed/OzE7EgHfAx8` to reduce third-party cookie exposure.
2. THE `MusicSection` SHALL include a visible link to the `Would_You_Video` on YouTube (`https://www.youtube.com/watch?v=OzE7EgHfAx8`) so visitors can view the full experience on YouTube.
3. THE `MusicSection` SHALL include a visible link to Google's privacy policy (`https://policies.google.com/privacy`) in proximity to the `YouTube_Embed`.
4. THE `YouTube_Embed` SHALL load the `YouTube_Player_API` script (`https://www.youtube.com/iframe_api`) to enable programmatic control.

---

## Task 2: Replace YouTube Embed on /music Page (music/page.tsx)

### Requirement 7: Replace Existing YouTube Embed on /music Page

**User Story:** As a visitor to the /music page, I want to watch the latest official "Would You" performance video, so that I can see the band's most recent video content on the dedicated music page.

#### Acceptance Criteria

1. THE `Music_Page` SHALL replace the `Existing_Music_Page_Embed` (video ID `BR6U5TuXlAM`) with a `Standard_YouTube_Embed` of the `Would_You_Video` (video ID `OzE7EgHfAx8`).
2. THE `Standard_YouTube_Embed` SHALL use the URL `https://www.youtube.com/embed/OzE7EgHfAx8`.
3. THE `Standard_YouTube_Embed` SHALL retain the existing `allow` attributes: `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share`.
4. THE `Standard_YouTube_Embed` SHALL retain the `allowFullScreen` attribute.
5. THE `Standard_YouTube_Embed` SHALL include a descriptive `title` attribute with the value "The Custard Screams - Would You [Official Performance Video]".
6. THE `Music_Component` SHALL NOT be modified as part of this task.

### Requirement 8: Responsive Layout for /music Page Embed

**User Story:** As a visitor on any device, I want the video on the /music page to display correctly at all screen sizes, so that I have a good viewing experience.

#### Acceptance Criteria

1. THE `Standard_YouTube_Embed` SHALL maintain a 16:9 aspect ratio on all viewport sizes.
2. THE `Standard_YouTube_Embed` SHALL be centred horizontally within the `Music_Page` layout, consistent with the existing embed's layout.
3. THE `Standard_YouTube_Embed` SHALL retain the existing `rounded-lg` styling of the replaced embed.
