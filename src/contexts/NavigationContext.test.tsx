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
    updateHash: jest.fn((section: SectionId, addToHistory?: boolean) => {
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
