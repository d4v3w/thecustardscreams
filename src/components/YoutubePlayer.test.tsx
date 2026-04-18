import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import YoutubePlayer from './YoutubePlayer';

// Mock useReducedMotion hook
jest.mock('~/hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}));

import { useReducedMotion } from '~/hooks/useReducedMotion';

// Mock YouTube API
const mockYTPlayer = {
  playVideo: jest.fn(),
  pauseVideo: jest.fn(),
  mute: jest.fn(),
  unMute: jest.fn(),
  isMuted: jest.fn(() => true),
  getPlayerState: jest.fn(() => 2), // PLAYING
  destroy: jest.fn(),
};

const mockYTPlayerConstructor = jest.fn((el, opts) => {
  // Call onReady callback
  if (opts?.events?.onReady) {
    opts.events.onReady({ target: mockYTPlayer });
  }
  return mockYTPlayer;
});

// Setup window.YT mock
const setupYTMock = () => {
  (window as any).YT = {
    Player: mockYTPlayerConstructor,
    PlayerState: {
      UNSTARTED: -1,
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      CUED: 5,
    },
  };
};

// Setup IntersectionObserver mock with trigger capability
let intersectionObserverCallback: IntersectionObserverCallback | null = null;
let observedElements: Set<Element> = new Set();

const setupIntersectionObserverMock = () => {
  (global.IntersectionObserver as any) = class IntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
      intersectionObserverCallback = callback;
    }
    observe(element: Element) {
      observedElements.add(element);
    }
    unobserve(element: Element) {
      observedElements.delete(element);
    }
    disconnect() {
      observedElements.clear();
      intersectionObserverCallback = null;
    }
  };
};

const triggerIntersection = (isIntersecting: boolean) => {
  if (intersectionObserverCallback && observedElements.size > 0) {
    const entries = Array.from(observedElements).map((element) => ({
      target: element,
      isIntersecting,
      intersectionRatio: isIntersecting ? 0.5 : 0,
    })) as IntersectionObserverEntry[];
    intersectionObserverCallback(entries, {} as IntersectionObserver);
  }
};

describe('YoutubePlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupYTMock();
    setupIntersectionObserverMock();
    intersectionObserverCallback = null;
    observedElements.clear();
    (useReducedMotion as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    delete (window as any).YT;
  });

  // 14.1 Test iframe renders with correct src URL
  describe('14.1 iframe src URL', () => {
    it('should render iframe with youtube-nocookie.com domain', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const iframe = screen.getByTitle(
        'The Custard Screams - Would You [Official Performance Video]'
      ) as HTMLIFrameElement;
      expect(iframe.src).toContain('youtube-nocookie.com');
    });

    it('should render iframe with correct video ID', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const iframe = screen.getByTitle(
        'The Custard Screams - Would You [Official Performance Video]'
      ) as HTMLIFrameElement;
      expect(iframe.src).toContain('OzE7EgHfAx8');
    });

    it('should include all required query parameters', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const iframe = screen.getByTitle(
        'The Custard Screams - Would You [Official Performance Video]'
      ) as HTMLIFrameElement;
      expect(iframe.src).toContain('enablejsapi=1');
      expect(iframe.src).toContain('controls=0');
      expect(iframe.src).toContain('modestbranding=1');
      expect(iframe.src).toContain('mute=1');
      expect(iframe.src).toContain('rel=0');
      expect(iframe.src).toContain('playsinline=1');
    });
  });

  // 14.2 Test iframe has correct title attribute
  describe('14.2 iframe title attribute', () => {
    it('should render iframe with correct title attribute', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const iframe = screen.getByTitle(
        'The Custard Screams - Would You [Official Performance Video]'
      );
      expect(iframe).toBeInTheDocument();
    });
  });

  // 14.3 Test play/pause toggle functionality
  describe('14.3 play/pause toggle functionality', () => {
    it('should call playVideo() when clicking play/pause button while paused', async () => {
      mockYTPlayer.getPlayerState.mockReturnValue(2); // PAUSED
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const playPauseButton = screen.getByLabelText('Play video');
      fireEvent.click(playPauseButton);

      expect(mockYTPlayer.playVideo).toHaveBeenCalled();
    });

    it('should call pauseVideo() when clicking play/pause button while playing', async () => {
      mockYTPlayer.getPlayerState.mockReturnValue(1); // PLAYING
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      // Simulate state change to playing
      if (intersectionObserverCallback && mockYTPlayerConstructor.mock.calls[0]) {
        const stateChangeEvent = {
          data: 1, // PLAYING
          target: mockYTPlayer,
        };
        const opts = mockYTPlayerConstructor.mock.calls[0][1] as any;
        if (opts?.events?.onStateChange) {
          opts.events.onStateChange(stateChangeEvent);
        }
      }

      await waitFor(() => {
        const playPauseButton = screen.getByLabelText('Pause video');
        fireEvent.click(playPauseButton);
      });

      expect(mockYTPlayer.pauseVideo).toHaveBeenCalled();
    });

    it('should update button icon based on playback state', async () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      // Initially paused
      expect(screen.getByLabelText('Play video')).toBeInTheDocument();

      // Simulate state change to playing
      if (intersectionObserverCallback && mockYTPlayerConstructor.mock.calls[0]) {
        const stateChangeEvent = {
          data: 1, // PLAYING
          target: mockYTPlayer,
        };
        const opts = mockYTPlayerConstructor.mock.calls[0][1] as any;
        if (opts?.events?.onStateChange) {
          opts.events.onStateChange(stateChangeEvent);
        }
      }

      await waitFor(() => {
        expect(screen.getByLabelText('Pause video')).toBeInTheDocument();
      });
    });
  });

  // 14.4 Test mute/unmute toggle functionality
  describe('14.4 mute/unmute toggle functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call unMute() when clicking mute/unmute button while muted', async () => {
      mockYTPlayer.isMuted.mockReturnValue(true);
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      await waitFor(() => {
        const muteButton = screen.getByLabelText('Unmute video');
        fireEvent.click(muteButton);
      });

      expect(mockYTPlayer.unMute).toHaveBeenCalled();
    });

    it('should call mute() when clicking mute/unmute button while unmuted', async () => {
      mockYTPlayer.isMuted.mockReturnValue(false);
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      await waitFor(() => {
        const muteButton = screen.getByLabelText('Mute video');
        fireEvent.click(muteButton);
      });

      expect(mockYTPlayer.mute).toHaveBeenCalled();
    });

    it('should update button icon based on mute state', async () => {
      mockYTPlayer.isMuted.mockReturnValue(true);
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Unmute video')).toBeInTheDocument();
      });

      // Simulate mute state change
      mockYTPlayer.isMuted.mockReturnValue(false);
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.getByLabelText('Mute video')).toBeInTheDocument();
      });
    });
  });

  // 14.5 Test autoplay on scroll
  describe('14.5 autoplay on scroll', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call playVideo() when element intersects and API is ready', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      triggerIntersection(true);

      expect(mockYTPlayer.playVideo).toHaveBeenCalled();
    });

    it('should call pauseVideo() when element exits viewport', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      triggerIntersection(true);
      mockYTPlayer.playVideo.mockClear();

      triggerIntersection(false);

      expect(mockYTPlayer.pauseVideo).toHaveBeenCalled();
    });
  });

  // 14.6 Test reduced motion preference
  describe('14.6 reduced motion preference', () => {
    it('should not call playVideo() on intersection when reduced motion is enabled', () => {
      (useReducedMotion as jest.Mock).mockReturnValue(true);

      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      triggerIntersection(true);

      expect(mockYTPlayer.playVideo).not.toHaveBeenCalled();
    });

    it('should still allow manual play button to work with reduced motion enabled', async () => {
      (useReducedMotion as jest.Mock).mockReturnValue(true);

      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const playPauseButton = screen.getByLabelText('Play video');
      fireEvent.click(playPauseButton);

      expect(mockYTPlayer.playVideo).toHaveBeenCalled();
    });
  });

  // 14.7 Test deferred autoplay
  describe('14.7 deferred autoplay', () => {
    it('should call playVideo() when intersection fires after player creation', async () => {
      // Create a fresh mock player that doesn't call onReady
      const delayedMockPlayer = {
        playVideo: jest.fn(),
        pauseVideo: jest.fn(),
        mute: jest.fn(),
        unMute: jest.fn(),
        isMuted: jest.fn(() => true),
        getPlayerState: jest.fn(() => 2),
        destroy: jest.fn(),
      };

      // Create a new mock constructor that doesn't call onReady
      const delayedMockConstructor = jest.fn((_el: any, _opts: any) => {
        // Don't call onReady - just return the mock player
        // playerRef.current will be set to this player object
        return delayedMockPlayer;
      });

      // Override the YT.Player constructor
      (window as any).YT.Player = delayedMockConstructor;

      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      // The component will create a player and assign it to playerRef.current
      // even though onReady won't be called
      
      // Clear any calls from render
      delayedMockPlayer.playVideo.mockClear();

      // Trigger intersection after player creation
      // Since playerRef.current is now set, the handler will call playVideo
      triggerIntersection(true);

      // playVideo should be called because playerRef.current is set
      expect(delayedMockPlayer.playVideo).toHaveBeenCalled();
    });

    it('should call playVideo() when API becomes ready after deferred autoplay', () => {
      // Create a new mock that calls onReady after intersection
      const callbackRef: { current: ((e: any) => void) | null } = { current: null };
      const delayedMockConstructor = jest.fn((el: any, opts: any) => {
        callbackRef.current = opts?.events?.onReady || null;
        return mockYTPlayer;
      });

      (window as any).YT.Player = delayedMockConstructor;

      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      // Trigger intersection before API is ready
      triggerIntersection(true);

      // Now call onReady
      if (callbackRef.current) {
        callbackRef.current({ target: mockYTPlayer });
      }

      expect(mockYTPlayer.playVideo).toHaveBeenCalled();
    });
  });

  // 14.8 Test accessibility attributes
  describe('14.8 accessibility attributes', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should have aria-label on play/pause button', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      expect(screen.getByLabelText('Play video')).toBeInTheDocument();
    });

    it('should have aria-label on mute/unmute button', async () => {
      mockYTPlayer.isMuted.mockReturnValue(true);
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Unmute video')).toBeInTheDocument();
      });
    });

    it('should update aria-labels when state changes', async () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      // Initially paused
      expect(screen.getByLabelText('Play video')).toBeInTheDocument();

      // Simulate state change to playing
      if (intersectionObserverCallback && mockYTPlayerConstructor.mock.calls[0]) {
        const stateChangeEvent = {
          data: 1, // PLAYING
          target: mockYTPlayer,
        };
        const opts = mockYTPlayerConstructor.mock.calls[0][1] as any;
        if (opts?.events?.onStateChange) {
          opts.events.onStateChange(stateChangeEvent);
        }
      }

      await waitFor(() => {
        expect(screen.getByLabelText('Pause video')).toBeInTheDocument();
      });
    });
  });

  // 14.9 Test keyboard support
  describe('14.9 keyboard support', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should have keyboard-focusable buttons', () => {
      mockYTPlayer.isMuted.mockReturnValue(true);
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const playPauseButton = screen.getByLabelText('Play video');
      const muteButton = screen.getByLabelText('Unmute video');

      expect(playPauseButton).toHaveAttribute('tabIndex', '0');
      expect(muteButton).toHaveAttribute('tabIndex', '0');
    });

    it('should activate play/pause button with Enter key', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const playPauseButton = screen.getByLabelText('Play video');
      fireEvent.keyDown(playPauseButton, { key: 'Enter' });

      expect(mockYTPlayer.playVideo).toHaveBeenCalled();
    });

    it('should activate play/pause button with Space key', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const playPauseButton = screen.getByLabelText('Play video');
      fireEvent.keyDown(playPauseButton, { key: ' ' });

      expect(mockYTPlayer.playVideo).toHaveBeenCalled();
    });

    it('should activate mute/unmute button with Enter key', async () => {
      mockYTPlayer.isMuted.mockReturnValue(true);
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      await waitFor(() => {
        const muteButton = screen.getByLabelText('Unmute video');
        fireEvent.keyDown(muteButton, { key: 'Enter' });
      });

      expect(mockYTPlayer.unMute).toHaveBeenCalled();
    });

    it('should activate mute/unmute button with Space key', async () => {
      mockYTPlayer.isMuted.mockReturnValue(true);
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      await waitFor(() => {
        const muteButton = screen.getByLabelText('Unmute video');
        fireEvent.keyDown(muteButton, { key: ' ' });
      });

      expect(mockYTPlayer.unMute).toHaveBeenCalled();
    });
  });

  // 14.10 Test YouTube policy compliance links
  describe('14.10 YouTube policy compliance links', () => {
    it('should have YouTube watch link with correct href', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const youtubeLink = screen.getByRole('link', { name: /Watch on YouTube/i });
      expect(youtubeLink).toHaveAttribute(
        'href',
        'https://www.youtube.com/watch?v=OzE7EgHfAx8'
      );
    });

    it('should have Google privacy policy link with correct href', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const privacyLink = screen.getByRole('link', {
        name: /Google Privacy Policy/i,
      });
      expect(privacyLink).toHaveAttribute(
        'href',
        'https://policies.google.com/privacy'
      );
    });

    it('should have links with target="_blank" and rel="noopener noreferrer"', () => {
      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const youtubeLink = screen.getByRole('link', { name: /Watch on YouTube/i });
      const privacyLink = screen.getByRole('link', {
        name: /Google Privacy Policy/i,
      });

      expect(youtubeLink).toHaveAttribute('target', '_blank');
      expect(youtubeLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(privacyLink).toHaveAttribute('target', '_blank');
      expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  // 14.11 Test error handling
  describe('14.11 error handling', () => {
    it('should render gracefully when IntersectionObserver is not supported', () => {
      const originalIO = global.IntersectionObserver;
      delete (global as any).IntersectionObserver;

      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const iframe = screen.getByTitle(
        'The Custard Screams - Would You [Official Performance Video]'
      );
      expect(iframe).toBeInTheDocument();

      (global as any).IntersectionObserver = originalIO;
    });

    it('should render gracefully when YouTube API fails to load', () => {
      delete (window as any).YT;

      render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      const iframe = screen.getByTitle(
        'The Custard Screams - Would You [Official Performance Video]'
      );
      expect(iframe).toBeInTheDocument();
    });

    it('should call cleanup on unmount', () => {
      const { unmount } = render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      unmount();

      expect(mockYTPlayer.destroy).toHaveBeenCalled();
    });

    it('should disconnect IntersectionObserver on unmount', () => {
      const disconnectSpy = jest.fn();
      (global.IntersectionObserver as any) = class IntersectionObserver {
        constructor(callback: IntersectionObserverCallback) {
          intersectionObserverCallback = callback;
        }
        observe(element: Element) {
          observedElements.add(element);
        }
        unobserve(element: Element) {
          observedElements.delete(element);
        }
        disconnect() {
          disconnectSpy();
          observedElements.clear();
          intersectionObserverCallback = null;
        }
      };

      const { unmount } = render(
        <YoutubePlayer
          videoId="OzE7EgHfAx8"
          title="The Custard Screams - Would You [Official Performance Video]"
        />
      );

      unmount();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
