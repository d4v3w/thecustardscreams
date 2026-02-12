/**
 * Unit tests for NavigationContext
 * Feature: navigation-hash-sync
 * Requirements: 5.1, 5.2, 5.3
 */

// Mock dependencies BEFORE imports
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("~/hooks/useHashSync");
jest.mock("~/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));
jest.mock("~/hooks/useScrollObserver", () => ({
  useScrollObserver: jest.fn(),
}));

import { renderHook } from "@testing-library/react";
import { useHashSync } from "~/hooks/useHashSync";
import type { SectionId } from "~/lib/types";
import { NavigationProvider, useNavigation } from "./NavigationContext";

// Configure mocks after imports
const mockUseHashSync = useHashSync as jest.MockedFunction<typeof useHashSync>;
mockUseHashSync.mockImplementation(({ onHashChange }: { onHashChange?: (section: SectionId) => void }) => {
  return {
    currentSection: "home" as SectionId,
    updateHash: jest.fn((section: SectionId, _addToHistory?: boolean) => {
      onHashChange?.(section);
    }),
  };
});

describe("NavigationContext - Programmatic Scroll Flag Management", () => {
  it("should provide isProgrammaticScroll function", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    expect(result.current.isProgrammaticScroll).toBeDefined();
    expect(typeof result.current.isProgrammaticScroll).toBe("function");
  });

  it("should return false initially for isProgrammaticScroll", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    expect(result.current.isProgrammaticScroll()).toBe(false);
  });

  it("should expose updateHash function from useHashSync", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    expect(result.current.updateHash).toBeDefined();
    expect(typeof result.current.updateHash).toBe("function");
  });

  it("should provide all required context values", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    // Verify all required properties exist
    expect(result.current).toHaveProperty("currentSection");
    expect(result.current).toHaveProperty("previousSection");
    expect(result.current).toHaveProperty("nextSection");
    expect(result.current).toHaveProperty("sections");
    expect(result.current).toHaveProperty("registerSection");
    expect(result.current).toHaveProperty("unregisterSection");
    expect(result.current).toHaveProperty("navigateToSection");
    expect(result.current).toHaveProperty("navigateNext");
    expect(result.current).toHaveProperty("navigatePrevious");
    expect(result.current).toHaveProperty("getSectionRefs");
    expect(result.current).toHaveProperty("updateHash");
    expect(result.current).toHaveProperty("isProgrammaticScroll");
  });

  it("should call updateHash with addToHistory=true when navigateToSection is called", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    const updateHashSpy = jest.spyOn(result.current, "updateHash");

    result.current.navigateToSection("music");

    expect(updateHashSpy).toHaveBeenCalledWith("music", true);
  });
});

describe("NavigationContext - Scroll Completion Detection", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Clear any existing event listeners
    window.removeEventListener = jest.fn();
    window.addEventListener = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should clear programmatic scroll flag after scroll events stop", () => {
    // Mock useHashSync to provide setProgrammaticScroll
    let capturedSetProgrammaticScroll: ((value: boolean) => void) | null = null;
    
    mockUseHashSync.mockImplementation(({ setProgrammaticScroll }: { setProgrammaticScroll?: (value: boolean) => void }) => {
      capturedSetProgrammaticScroll = setProgrammaticScroll || null;
      return {
        currentSection: "home" as SectionId,
        updateHash: jest.fn(),
      };
    });

    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    // Verify setProgrammaticScroll was captured
    expect(capturedSetProgrammaticScroll).not.toBeNull();

    // Simulate programmatic scroll by calling setProgrammaticScroll(true)
    capturedSetProgrammaticScroll!(true);

    // Verify flag is set
    expect(result.current.isProgrammaticScroll()).toBe(true);

    // Get the scroll event handler that was registered
    const addEventListenerCalls = (window.addEventListener as jest.Mock).mock.calls;
    const scrollListenerCall = addEventListenerCalls.find(
      (call) => call[0] === "scroll"
    );
    expect(scrollListenerCall).toBeDefined();
    const handleScroll = scrollListenerCall![1] as () => void;

    // Simulate scroll events firing during animation
    handleScroll();
    jest.advanceTimersByTime(50);
    handleScroll();
    jest.advanceTimersByTime(50);
    handleScroll();

    // Flag should still be true during scrolling
    expect(result.current.isProgrammaticScroll()).toBe(true);

    // Stop firing scroll events and advance timer by 100ms
    jest.advanceTimersByTime(100);

    // Flag should now be cleared
    expect(result.current.isProgrammaticScroll()).toBe(false);

    // Verify scroll listener was removed
    expect(window.removeEventListener).toHaveBeenCalledWith("scroll", handleScroll);
  });

  it("should clear programmatic scroll flag with fallback timeout when no scroll events fire", () => {
    // Mock useHashSync to provide setProgrammaticScroll
    let capturedSetProgrammaticScroll: ((value: boolean) => void) | null = null;
    
    mockUseHashSync.mockImplementation(({ setProgrammaticScroll }: { setProgrammaticScroll?: (value: boolean) => void }) => {
      capturedSetProgrammaticScroll = setProgrammaticScroll || null;
      return {
        currentSection: "home" as SectionId,
        updateHash: jest.fn(),
      };
    });

    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    // Verify setProgrammaticScroll was captured
    expect(capturedSetProgrammaticScroll).not.toBeNull();

    // Simulate programmatic scroll by calling setProgrammaticScroll(true)
    capturedSetProgrammaticScroll!(true);

    // Verify flag is set
    expect(result.current.isProgrammaticScroll()).toBe(true);

    // Don't fire any scroll events - simulate case where scroll events don't fire
    // (e.g., section already at exact position, or browser quirk)

    // Advance timers by 1500ms (fallback timeout duration)
    jest.advanceTimersByTime(1500);

    // Flag should now be cleared by fallback timeout
    expect(result.current.isProgrammaticScroll()).toBe(false);

    // Verify scroll listener was removed
    const removeEventListenerCalls = (window.removeEventListener as jest.Mock).mock.calls;
    const scrollListenerRemoved = removeEventListenerCalls.some(
      (call) => call[0] === "scroll"
    );
    expect(scrollListenerRemoved).toBe(true);
  });
});
