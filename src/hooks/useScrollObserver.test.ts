/**
 * Unit tests for useScrollObserver hook
 * Feature: navigation-hash-sync
 * Requirements: 1.1, 1.3, 5.1
 */

import { renderHook } from "@testing-library/react";
import type { SectionId } from "~/lib/types";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { useScrollObserver } from "./useScrollObserver";

// Mock the useIntersectionObserver hook
jest.mock("./useIntersectionObserver");

describe("useScrollObserver", () => {
  let mockUpdateHash: jest.Mock;
  let mockIsProgrammaticScroll: jest.Mock;
  let mockRefs: Map<SectionId, React.RefObject<HTMLElement | null>>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    mockUpdateHash = jest.fn();
    mockIsProgrammaticScroll = jest.fn().mockReturnValue(false);
    
    // Create mock refs
    mockRefs = new Map([
      ["home", { current: document.createElement("div") }],
      ["music", { current: document.createElement("div") }],
      ["shows", { current: document.createElement("div") }],
      ["about", { current: document.createElement("div") }],
    ]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call updateHash when active section changes", () => {
    // Mock intersection observer to return "music" section
    (useIntersectionObserver as jest.Mock).mockReturnValue("music");

    renderHook(() =>
      useScrollObserver(mockRefs, {
        updateHash: mockUpdateHash,
        isProgrammaticScroll: mockIsProgrammaticScroll,
      })
    );

    // Fast-forward past debounce delay (150ms)
    jest.advanceTimersByTime(150);

    // Should call updateHash with section and addToHistory=false
    expect(mockUpdateHash).toHaveBeenCalledWith("music", false);
  });

  it("should debounce hash updates by 150ms", () => {
    const { rerender } = renderHook(() =>
      useScrollObserver(mockRefs, {
        updateHash: mockUpdateHash,
        isProgrammaticScroll: mockIsProgrammaticScroll,
      })
    );

    // Change active section multiple times rapidly
    (useIntersectionObserver as jest.Mock).mockReturnValue("music");
    rerender();
    
    jest.advanceTimersByTime(50);
    
    (useIntersectionObserver as jest.Mock).mockReturnValue("shows");
    rerender();
    
    jest.advanceTimersByTime(50);
    
    (useIntersectionObserver as jest.Mock).mockReturnValue("about");
    rerender();

    // Should not have called updateHash yet
    expect(mockUpdateHash).not.toHaveBeenCalled();

    // Fast-forward past debounce delay
    jest.advanceTimersByTime(150);

    // Should only call updateHash once with the final section
    expect(mockUpdateHash).toHaveBeenCalledTimes(1);
    expect(mockUpdateHash).toHaveBeenCalledWith("about", false);
  });

  it("should skip hash update during programmatic scroll", () => {
    // Mock programmatic scroll flag as true
    mockIsProgrammaticScroll.mockReturnValue(true);
    
    (useIntersectionObserver as jest.Mock).mockReturnValue("music");

    renderHook(() =>
      useScrollObserver(mockRefs, {
        updateHash: mockUpdateHash,
        isProgrammaticScroll: mockIsProgrammaticScroll,
      })
    );

    // Fast-forward past debounce delay
    jest.advanceTimersByTime(150);

    // Should NOT call updateHash during programmatic scroll
    expect(mockUpdateHash).not.toHaveBeenCalled();
  });

  it("should not update hash if section hasn't changed", () => {
    (useIntersectionObserver as jest.Mock).mockReturnValue("music");

    const { rerender } = renderHook(() =>
      useScrollObserver(mockRefs, {
        updateHash: mockUpdateHash,
        isProgrammaticScroll: mockIsProgrammaticScroll,
      })
    );

    // Fast-forward past debounce delay
    jest.advanceTimersByTime(150);

    expect(mockUpdateHash).toHaveBeenCalledTimes(1);

    // Rerender with same section
    rerender();
    jest.advanceTimersByTime(150);

    // Should still only be called once
    expect(mockUpdateHash).toHaveBeenCalledTimes(1);
  });

  it("should not update hash if active section is null", () => {
    (useIntersectionObserver as jest.Mock).mockReturnValue(null);

    renderHook(() =>
      useScrollObserver(mockRefs, {
        updateHash: mockUpdateHash,
        isProgrammaticScroll: mockIsProgrammaticScroll,
      })
    );

    // Fast-forward past debounce delay
    jest.advanceTimersByTime(150);

    // Should not call updateHash when section is null
    expect(mockUpdateHash).not.toHaveBeenCalled();
  });

  it("should pass threshold and rootMargin to useIntersectionObserver", () => {
    (useIntersectionObserver as jest.Mock).mockReturnValue("home");

    renderHook(() =>
      useScrollObserver(mockRefs, {
        updateHash: mockUpdateHash,
        isProgrammaticScroll: mockIsProgrammaticScroll,
        threshold: 0.7,
        rootMargin: "-50px",
      })
    );

    // Verify useIntersectionObserver was called with correct options
    expect(useIntersectionObserver).toHaveBeenCalledWith(mockRefs, {
      threshold: 0.7,
      rootMargin: "-50px",
    });
  });

  it("should cleanup debounce timer on unmount", () => {
    (useIntersectionObserver as jest.Mock).mockReturnValue("music");

    const { unmount } = renderHook(() =>
      useScrollObserver(mockRefs, {
        updateHash: mockUpdateHash,
        isProgrammaticScroll: mockIsProgrammaticScroll,
      })
    );

    // Unmount before debounce completes
    unmount();

    // Fast-forward past debounce delay
    jest.advanceTimersByTime(150);

    // Should not call updateHash after unmount
    expect(mockUpdateHash).not.toHaveBeenCalled();
  });
});
