/**
 * NavigationContext Rapid Navigation Clicks Test
 * Tests that rapid navigation clicks work correctly without race conditions
 * Feature: navigation-hash-sync-race-condition-fix
 * Requirements: 2.2, 7.1
 * Validates: Requirements 2.2 (multiple navigation clicks in rapid succession)
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

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: () => [],
})) as any;

describe("NavigationContext - Rapid Navigation Clicks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollIntoView.mockClear();
    mockPush.mockClear();
    mockReplace.mockClear();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
    
    // Reset window.location.hash
    window.location.hash = "";
  });

  describe("Rapid Navigation Clicks (Requirement 2.2)", () => {
    it("should handle rapid navigation clicks without race conditions", async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      // Create three sections
      const homeElement = document.createElement("section");
      const musicElement = document.createElement("section");
      const showsElement = document.createElement("section");

      const homeRef = { current: homeElement };
      const musicRef = { current: musicElement };
      const showsRef = { current: showsElement };

      // Register sections
      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
        result.current.registerSection("shows", showsRef, 2);
      });

      // Click nav item 1 (home)
      act(() => {
        result.current.navigateToSection("home");
      });

      // Verify flag is set during first navigation
      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Simulate scroll events for first navigation
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
      });

      // Wait 200ms (scroll completes, flag should clear)
      act(() => {
        jest.advanceTimersByTime(100); // Total 200ms
      });

      // Verify flag is cleared after first navigation
      expect(result.current.isProgrammaticScroll()).toBe(false);

      // Click nav item 2 (music) - wait 200ms after first click
      act(() => {
        result.current.navigateToSection("music");
      });

      // Verify flag is set during second navigation
      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Simulate scroll events for second navigation
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
      });

      // Wait 200ms (scroll completes, flag should clear)
      act(() => {
        jest.advanceTimersByTime(100); // Total 200ms
      });

      // Verify flag is cleared after second navigation
      expect(result.current.isProgrammaticScroll()).toBe(false);

      // Click nav item 3 (shows) - wait 200ms after second click
      act(() => {
        result.current.navigateToSection("shows");
      });

      // Verify flag is set during third navigation
      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Simulate scroll events for third navigation
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
      });

      // Wait for scroll to complete
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Verify flag is cleared after third navigation
      expect(result.current.isProgrammaticScroll()).toBe(false);

      // Verify all three navigations were executed
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("#home", { scroll: false });
        expect(mockPush).toHaveBeenCalledWith("#music", { scroll: false });
        expect(mockPush).toHaveBeenCalledWith("#shows", { scroll: false });
        expect(mockPush).toHaveBeenCalledTimes(3);
      });

      // Verify scrollIntoView was called for each navigation
      expect(mockScrollIntoView).toHaveBeenCalledTimes(3);

      jest.useRealTimers();
    });

    it("should clear flag even with very rapid clicks (no delay)", async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useNavigation(), {
        wrapper: NavigationProvider,
      });

      const homeElement = document.createElement("section");
      const musicElement = document.createElement("section");
      const showsElement = document.createElement("section");

      const homeRef = { current: homeElement };
      const musicRef = { current: musicElement };
      const showsRef = { current: showsElement };

      act(() => {
        result.current.registerSection("home", homeRef, 0);
        result.current.registerSection("music", musicRef, 1);
        result.current.registerSection("shows", showsRef, 2);
      });

      // Click all three nav items immediately (no delay)
      act(() => {
        result.current.navigateToSection("home");
        result.current.navigateToSection("music");
        result.current.navigateToSection("shows");
      });

      // Flag should be set (last navigation)
      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Simulate scroll events
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
      });

      // Wait for flag to clear (100ms after last scroll event)
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Flag should be cleared
      expect(result.current.isProgrammaticScroll()).toBe(false);

      // All navigations should be queued
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("#home", { scroll: false });
        expect(mockPush).toHaveBeenCalledWith("#music", { scroll: false });
        expect(mockPush).toHaveBeenCalledWith("#shows", { scroll: false });
      });

      jest.useRealTimers();
    });

    it("should handle interrupted scrolls during rapid clicks", async () => {
      jest.useFakeTimers();

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

      // Start first navigation
      act(() => {
        result.current.navigateToSection("home");
      });

      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Simulate scroll starting
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
      });

      // Interrupt with second navigation before first completes
      act(() => {
        result.current.navigateToSection("music");
      });

      // Flag should still be set (new navigation started)
      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Simulate scroll events for second navigation
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
      });

      // Wait for flag to clear
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Flag should be cleared
      expect(result.current.isProgrammaticScroll()).toBe(false);

      // Both navigations should be executed
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("#home", { scroll: false });
        expect(mockPush).toHaveBeenCalledWith("#music", { scroll: false });
      });

      jest.useRealTimers();
    });

    it("should use fallback timeout if scroll events don't fire", async () => {
      jest.useFakeTimers();

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

      // Navigate to home
      act(() => {
        result.current.navigateToSection("home");
      });

      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Don't fire any scroll events (simulates edge case)
      // Wait for fallback timeout (1500ms)
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      // Flag should be cleared by fallback
      expect(result.current.isProgrammaticScroll()).toBe(false);

      // Navigate to music (should work after fallback cleared flag)
      act(() => {
        result.current.navigateToSection("music");
      });

      expect(result.current.isProgrammaticScroll()).toBe(true);

      // Simulate scroll events for second navigation
      act(() => {
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(50);
        window.dispatchEvent(new Event("scroll"));
        jest.advanceTimersByTime(100);
      });

      // Flag should be cleared
      expect(result.current.isProgrammaticScroll()).toBe(false);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("#home", { scroll: false });
        expect(mockPush).toHaveBeenCalledWith("#music", { scroll: false });
      });

      jest.useRealTimers();
    });
  });
});
