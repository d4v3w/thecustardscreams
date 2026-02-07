import { act, renderHook } from '@testing-library/react';
import type { CarouselImage } from '../types';
import { useLightbox } from '../useLightbox';

describe('useLightbox hook', () => {
  const mockImage: CarouselImage = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
    id: 'test-1',
  };

  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useLightbox());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedImage).toBeNull();
  });

  it('should open lightbox with selected image', () => {
    const { result } = renderHook(() => useLightbox());

    act(() => {
      result.current.openLightbox(mockImage);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedImage).toEqual(mockImage);
  });

  it('should close lightbox and clear selected image', () => {
    const { result } = renderHook(() => useLightbox());

    act(() => {
      result.current.openLightbox(mockImage);
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeLightbox();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedImage).toBeNull();
  });

  it('should handle multiple open/close cycles', () => {
    const { result } = renderHook(() => useLightbox());

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.openLightbox(mockImage);
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.closeLightbox();
      });
      expect(result.current.isOpen).toBe(false);
    }
  });
});
