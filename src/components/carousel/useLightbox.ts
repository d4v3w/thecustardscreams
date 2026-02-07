'use client'

import { useEffect, useRef, useState } from 'react';
import type { CarouselImage, UseLightboxReturn } from './types';

/**
 * Custom hook for managing lightbox modal state and focus management
 * @returns Lightbox state and control functions
 */
export function useLightbox(): UseLightboxReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CarouselImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /**
   * Open lightbox with selected image
   */
  const openLightbox = (image: CarouselImage) => {
    // Store currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    setSelectedImage(image);
    setIsOpen(true);
    
    // Open dialog using native showModal method
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  /**
   * Close lightbox and restore focus
   */
  const closeLightbox = () => {
    // Close dialog
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    
    setIsOpen(false);
    setSelectedImage(null);
    
    // Restore focus to previously focused element
    if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
      previousFocusRef.current.focus();
    }
  };

  /**
   * Sync dialog state with isOpen prop
   */
  useEffect(() => {
    if (!dialogRef.current) return;

    if (isOpen && !dialogRef.current.open) {
      dialogRef.current.showModal();
    } else if (!isOpen && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return {
    isOpen,
    selectedImage,
    openLightbox,
    closeLightbox,
    dialogRef,
  };
}
