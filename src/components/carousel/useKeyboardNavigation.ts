'use client'

import { useEffect } from 'react';

/**
 * Props for useKeyboardNavigation hook
 */
export interface UseKeyboardNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

/**
 * Custom hook for handling keyboard navigation in carousel
 * @param props - Callback functions for keyboard actions
 */
export function useKeyboardNavigation({
  onPrevious,
  onNext,
  onEscape,
  enabled = true,
}: UseKeyboardNavigationProps): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext();
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrevious, onNext, onEscape, enabled]);
}
