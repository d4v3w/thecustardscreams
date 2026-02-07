'use client'

import { useEffect, useRef } from 'react';
import type { ImageLightboxProps } from './types';

/**
 * Lightbox modal component for displaying full-size images
 */
export default function ImageLightbox({
  image,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync dialog state with isOpen prop
  useEffect(() => {
    if (!dialogRef.current) return;

    if (isOpen && !dialogRef.current.open) {
      dialogRef.current.showModal();
    } else if (!isOpen && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="max-h-full max-w-full bg-transparent p-0 backdrop:bg-black/80"
      onClose={onClose}
      onClick={handleDialogClick}
    >
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <span className="text-xl" aria-hidden="true">✕</span>
        </button>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt}
            className="max-h-[90vh] max-w-full object-contain"
          />
        )}
      </div>
    </dialog>
  );
}

