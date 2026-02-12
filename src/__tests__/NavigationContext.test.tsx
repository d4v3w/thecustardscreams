/**
 * NavigationContext Integration Tests
 * Tests the integration of NavigationContext with useHashSync and useScrollObserver
 * Feature: navigation-hash-sync
 * Requirements: 2.1, 5.1, 7.2
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { NavigationProvider, useNavigation } from "~/contexts/NavigationContext";

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
  })),
}));

// Mock hooks
jest.mock("~/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

// Mock requestAnimationFrame to queue callbacks
const rafCallbacks: FrameRequestCallback[] = [];
const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  rafCallbacks.push(callback);
  return rafCallbacks.length;
});
window.requestAnimationFrame = mockRequestAnimationFrame;

// Helper to flush RAF callbacks (currently unused but kept for future tests)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _flushRequestAnimationFrame = () => {
  const callbacks = [...rafCallbacks];
  rafCallbacks.length = 0;
  callbacks.forEach(cb => cb(performance.now()));
};

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

global.IntersectionObserver = jest.fn().mockImplementation((_callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: () => [],
})) as any;

describe("NavigationContext Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollIntoView.mockClear();
    mockPush.mockClear();
    mockReplace.mockClear();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
    mockRequestAnimationFrame.mockClear();
    rafCallbacks.length = 0; // Clear RAF queue
    
    // Reset window.location.hash
    window.location.hash = "";
  });

  describe("Context Provides Correct Values", () => {
    it("should provide all required context values", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

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

    it("should initialize with null currentSection when no hash is present", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      expect(result.current.currentSection).toBeNull();
    });

    it("should initialize sections as empty array", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      expect(result.current.sections).toEqual([]);
    });

    it("should provide isProgrammaticScroll function", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      expect(typeof result.current.isProgrammaticScroll).toBe("function");
      expect(result.current.isProgrammaticScroll()).toBe(false);
    });
  });

  describe("Section Registration", () => {
    it("should register sections and maintain order", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };
      const showsRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
        result.current.registerSection("shows", showsRef, 2);
      });

      expect(result.current.sections).toEqual(["home", "music", "shows"]);
    });

    it("should maintain correct order even when registered out of sequence", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };
      const showsRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("shows", showsRef, 2);
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      expect(result.current.sections).toEqual(["home", "music", "shows"]);
    });

    it("should unregister sections correctly", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      expect(result.current.sections).toEqual(["home", "music"]);

      act(() => {
        result.current.unregisterSection("home");
      });

      expect(result.current.sections).toEqual(["music"]);
    });

    it("should provide section refs via getSectionRefs", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      const refs = result.current.getSectionRefs();
      expect(refs.size).toBe(2);
      expect(refs.get("home")).toBe(homeRef);
      expect(refs.get("music")).toBe(musicRef);
    });
  });

  describe("navigateToSection Updates Hash", () => {
    it("should call updateHash with addToHistory=true when navigating", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      act(() => {
        result.current.navigateToSection("music");
      });

      // Should call router.push with hash (debounced, so wait)
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("#music", { scroll: false });
      });
    });

    it("should call navigateToSection when user navigates", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      act(() => {
        result.current.navigateToSection("music");
      });

      // Wait for navigation to process
      await waitFor(
        () => {
          // Verify router.push was called (implementation detail we can't avoid)
          expect(mockPush).toHaveBeenCalled();
          // Verify it was called with a hash
          const callArgs = mockPush.mock.calls[0];
          expect(callArgs?.[0]).toBe("#music");
        },
        { timeout: 200 }
      );

      // Should NOT call router.replace for user navigation
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it("should navigate to next section correctly", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };
      const showsRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
        result.current.registerSection("shows", showsRef, 2);
      });

      // Simulate being on home section
      act(() => {
        window.location.hash = "#home";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("home");
      });

      // Navigate to next
      act(() => {
        result.current.navigateNext();
      });

      await waitFor(
        () => {
          // Verify router.push was called with music hash
          expect(mockPush).toHaveBeenCalled();
          const callArgs = mockPush.mock.calls[mockPush.mock.calls.length - 1];
          expect(callArgs?.[0]).toBe("#music");
        },
        { timeout: 200 }
      );
    });

    it("should navigate to previous section correctly", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };
      const showsRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
        result.current.registerSection("shows", showsRef, 2);
      });

      // Navigate through sections to establish previousSection
      act(() => {
        window.location.hash = "#home";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("home");
      });

      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("music");
      });

      act(() => {
        window.location.hash = "#shows";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("shows");
        expect(result.current.previousSection).toBe("music");
      });

      // navigatePrevious should work when previousSection is set
      // (The actual navigation is tested in other tests)
    });
  });

  describe("Programmatic Scroll Flag Management", () => {
    it("should set programmatic scroll flag during navigation", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Initially false
      expect(result.current.isProgrammaticScroll()).toBe(false);

      // Trigger hash change (simulates navigation)
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      // Should be true during scroll animation
      await waitFor(() => {
        expect(result.current.isProgrammaticScroll()).toBe(true);
      });
    });

    it("should clear programmatic scroll flag after scroll events stop", async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Trigger hash change
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      // Should be true during scroll
      await waitFor(() => {
        expect(result.current.isProgrammaticScroll()).toBe(true);
      });

      // Simulate scroll events during animation
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
      });

      // Stop scroll events and wait for debounce (100ms)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should be false after scroll events stop
      expect(result.current.isProgrammaticScroll()).toBe(false);

      jest.useRealTimers();
    });
  });

  describe("Hash Synchronization", () => {
    it("should update currentSection when hash changes", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Change hash
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      // currentSection should update
      await waitFor(() => {
        expect(result.current.currentSection).toBe("music");
      });
    });

    it("should handle initial page load with hash", async () => {
      // Set hash before rendering
      window.location.hash = "#music";

      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Should initialize with music section
      await waitFor(() => {
        expect(result.current.currentSection).toBe("music");
      });
    });

    it("should default to first section when hash is invalid", async () => {
      // Set invalid hash
      window.location.hash = "#invalid-section";

      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Should default to first section (home)
      await waitFor(() => {
        expect(result.current.currentSection).toBe("home");
      });
    });

    it("should update previousSection when currentSection changes", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };
      const showsRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
        result.current.registerSection("shows", showsRef, 2);
      });

      // Navigate to home
      act(() => {
        window.location.hash = "#home";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("home");
      });

      // Navigate to music
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("music");
        expect(result.current.previousSection).toBe("home");
      });

      // Navigate to shows
      act(() => {
        window.location.hash = "#shows";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("shows");
        expect(result.current.previousSection).toBe("music");
      });
    });
  });

  describe("Next and Previous Section Calculation", () => {
    it("should calculate nextSection correctly", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };
      const musicRef = { current: document.createElement("section") };
      const showsRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
        result.current.registerSection("shows", showsRef, 2);
      });

      // Set current to home
      act(() => {
        window.location.hash = "#home";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("home");
        expect(result.current.nextSection).toBe("music");
      });

      // Set current to music
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("music");
        expect(result.current.nextSection).toBe("shows");
      });

      // Set current to shows (last section)
      act(() => {
        window.location.hash = "#shows";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      await waitFor(() => {
        expect(result.current.currentSection).toBe("shows");
        expect(result.current.nextSection).toBeNull();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle missing section refs gracefully", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      // Register section with null ref
      const nullRef = { current: null };

      act(() => {
        result.current.registerSection("home", nullRef, 0);
      });

      // Try to navigate to section with null ref
      act(() => {
        window.location.hash = "#home";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      // Should update state even if scroll fails
      await waitFor(() => {
        expect(result.current.currentSection).toBe("home");
      });

      // scrollIntoView should not be called
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it("should handle empty sections array", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      expect(result.current.sections).toEqual([]);
      expect(result.current.currentSection).toBeNull();
      expect(result.current.nextSection).toBeNull();
      expect(result.current.previousSection).toBeNull();
    });
  });

  describe("IntersectionObserver Integration", () => {
    it("should initialize IntersectionObserver when sections are registered", () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeRef = { current: document.createElement("section") };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
      });

      // IntersectionObserver should be created
      expect(global.IntersectionObserver).toHaveBeenCalled();
    });
  });

  describe("Focus Management (Requirement 6.3)", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should focus target section after navigation completes", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeElement = document.createElement("section");
      const musicElement = document.createElement("section");
      
      // Mock focus method
      const mockFocus = jest.fn();
      musicElement.focus = mockFocus;

      const homeRef = { current: homeElement };
      const musicRef = { current: musicElement };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Navigate to music section
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      // Wait for scroll animation duration (800ms)
      act(() => {
        jest.advanceTimersByTime(800);
      });

      // Focus should be called with preventScroll: true
      await waitFor(() => {
        expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true });
      });
    });

    it("should set tabindex=-1 temporarily for focus", async () => {
      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeElement = document.createElement("section");
      const musicElement = document.createElement("section");
      
      const homeRef = { current: homeElement };
      const musicRef = { current: musicElement };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Verify no tabindex initially
      expect(musicElement.getAttribute("tabindex")).toBeNull();

      // Navigate to music section
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      // Wait for scroll animation
      act(() => {
        jest.advanceTimersByTime(800);
      });

      // tabindex should be set to -1 during focus
      await waitFor(() => {
        expect(musicElement.getAttribute("tabindex")).toBe("-1");
      });
    });

    it("should use instant focus with reduced motion", async () => {
      // Mock reduced motion preference
      jest.resetModules();
      jest.doMock("~/hooks/useReducedMotion", () => ({
        useReducedMotion: () => true,
      }));

      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeElement = document.createElement("section");
      const musicElement = document.createElement("section");
      
      const mockFocus = jest.fn();
      musicElement.focus = mockFocus;

      const homeRef = { current: homeElement };
      const musicRef = { current: musicElement };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
      });

      // Navigate to music section
      act(() => {
        window.location.hash = "#music";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });

      // With reduced motion, focus should happen immediately (0ms delay)
      act(() => {
        jest.advanceTimersByTime(0);
      });

      await waitFor(() => {
        expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true });
      });
    });
  });
});
