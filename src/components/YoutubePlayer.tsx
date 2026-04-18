/// <reference path="../types/youtube.d.ts" />
"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "~/hooks/useReducedMotion";

/**
 * YouTube Player component with custom controls and autoplay-on-scroll
 * Feature: youtube-video-music-section
 * Requirements: 1.1, 1.2, 4.1, 5.1
 */

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

declare namespace YT {
  class Player {
    constructor(el: HTMLIFrameElement | string, opts: PlayerOptions);
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
      onReady?: (e: OnReadyEvent) => void;
      onStateChange?: (e: OnStateChangeEvent) => void;
    };
  }

  interface OnReadyEvent {
    target: Player;
  }

  interface OnStateChangeEvent {
    data: number;
    target: Player;
  }

  const PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

interface YoutubePlayerProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function YoutubePlayer({
  videoId,
  title,
  className = "",
}: YoutubePlayerProps) {
  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const pendingPlay = useRef(false);
  const mountedRef = useRef(true);

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Inject YouTube IFrame API script idempotently
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="iframe_api"]'
    );

    if (!existingScript) {
      // Create and append script tag
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    // Store the existing onYouTubeIframeAPIReady handler if it exists
    const existingHandler = window.onYouTubeIframeAPIReady;

    // Implement onYouTubeIframeAPIReady callback that chains with any existing handler
    window.onYouTubeIframeAPIReady = () => {
      // Guard against unmounted component callbacks
      if (mountedRef.current) {
        // Call existing handler if it exists
        if (existingHandler) {
          existingHandler();
        }
      }
    };

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      // Restore the previous handler
      if (existingHandler) {
        window.onYouTubeIframeAPIReady = existingHandler;
      } else {
        delete window.onYouTubeIframeAPIReady;
      }
    };
  }, []);

  // Initialize YouTube Player when API is ready
  useEffect(() => {
    // Check if YT API is available
    if (typeof window === "undefined" || !window.YT || !iframeRef.current) {
      return;
    }

    // Create player instance
    const onReady = (event: YT.OnReadyEvent) => {
      if (!mountedRef.current) return;

      playerRef.current = event.target;

      // Handle deferred autoplay: if pendingPlay is true, play now
      if (pendingPlay.current && !prefersReducedMotion) {
        playerRef.current.playVideo();
      }
    };

    const onStateChange = (event: YT.OnStateChangeEvent) => {
      if (!mountedRef.current) return;

      // Sync internal state with YouTube player state
      const state = event.data;
      setIsPlaying(state === window.YT.PlayerState.PLAYING);
    };

    try {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady,
          onStateChange,
        },
      });
    } catch {
      // API not ready yet, will be called again when API loads
      console.debug("YouTube API not ready yet");
    }

    // Cleanup: destroy player on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  // Set up IntersectionObserver for autoplay-on-scroll
  useEffect(() => {
    // Guard against IntersectionObserver not being available
    if (typeof IntersectionObserver === "undefined" || !iframeRef.current) {
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (!mountedRef.current) return;

      entries.forEach((entry) => {
        if (!playerRef.current) return;

        if (entry.isIntersecting) {
          // Element is visible
          if (playerRef.current && !prefersReducedMotion) {
            playerRef.current.playVideo();
          } else if (!playerRef.current && !prefersReducedMotion) {
            // API not ready yet, set pending flag
            pendingPlay.current = true;
          }
        } else {
          // Element is not visible
          if (playerRef.current) {
            playerRef.current.pauseVideo();
          }
        }
      });
    };

    // Create IntersectionObserver with root: document.body (critical for scroll-snap layout)
    const observer = new IntersectionObserver(handleIntersection, {
      root: document.body,
      threshold: 0.5,
    });

    // Start observing the iframe
    observer.observe(iframeRef.current);

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  // Sync isMuted state with YouTube player mute state
  useEffect(() => {
    if (!playerRef.current) return;

    const syncMuteState = () => {
      if (playerRef.current && mountedRef.current) {
        setIsMuted(playerRef.current.isMuted());
      }
    };

    // Sync immediately
    syncMuteState();

    // Set up interval to periodically sync mute state
    const interval = setInterval(syncMuteState, 500);

    return () => clearInterval(interval);
  }, []);

  // Handle play/pause button click
  const handlePlayPauseClick = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Handle play/pause button keyboard events (Enter/Space)
  const handlePlayPauseKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlayPauseClick();
    }
  };

  // Handle mute/unmute button click
  const handleMuteUnmuteClick = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
  };

  // Handle mute/unmute button keyboard events (Enter/Space)
  const handleMuteUnmuteKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleMuteUnmuteClick();
    }
  };

  // Render
  return (
    <div className={`w-full ${className}`}>
      <div className="relative aspect-video w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden group">
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&mute=1&rel=0&playsinline=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Custom overlay with play/pause button (hover-visible) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
          <button
            onClick={handlePlayPauseClick}
            onKeyDown={handlePlayPauseKeyDown}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            tabIndex={0}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white/80 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <span className="text-2xl text-black">
              {isPlaying ? "⏸" : "▶"}
            </span>
          </button>
        </div>

        {/* Mute/unmute button (always visible, positioned in bottom-right) */}
        <button
          onClick={handleMuteUnmuteClick}
          onKeyDown={handleMuteUnmuteKeyDown}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          tabIndex={0}
          className="absolute bottom-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <span className="text-xl text-black">
            {isMuted ? "🔇" : "🔊"}
          </span>
        </button>
      </div>

      {/* YouTube policy compliance links footer */}
      <div className="w-full max-w-4xl mx-auto mt-3 flex flex-wrap gap-4 justify-center text-sm">
        <a
          href="https://www.youtube.com/watch?v=OzE7EgHfAx8"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 transition-colors underline"
        >
          Watch on YouTube
        </a>
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 transition-colors underline"
        >
          Google Privacy Policy
        </a>
      </div>
    </div>
  );
}
