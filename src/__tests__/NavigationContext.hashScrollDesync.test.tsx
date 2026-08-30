/**
 * Regression test for a hash/scroll desync bug found while auditing the
 * navigation system: a burst of rapid nav clicks could leave the URL hash
 * (and active nav highlight) pointing at one section while the page was
 * actually still scrolled to a different one.
 *
 * Root cause: scrollToSection() skipped scrolling whenever the target
 * section already looked "visible" via a static getBoundingClientRect
 * check. During a rapid burst, all clicks fire before any scroll animation
 * has actually moved the page, so that check was evaluated against a STALE
 * position. If a later click's target geometrically overlapped the
 * viewport from that stale position, its scrollIntoView call was skipped -
 * even though an earlier click's scroll was still animating toward a
 * different section. The hash still updated (untouched by the check), so
 * the URL and nav highlight ended up disagreeing with what was on screen.
 *
 * Fix: only trust the "already visible, skip the scroll" optimization when
 * no programmatic scroll is currently in flight (src/hooks/useHashSync.ts).
 */

import { act, renderHook } from "@testing-library/react";
import { NavigationProvider, useNavigation } from "~/contexts/NavigationContext";

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

jest.mock("~/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

const mockScrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: () => [],
})) as any;

// Fixed 800px-tall viewport, matching a real single-viewport-per-section layout.
const WINDOW_HEIGHT = 800;

function mockRect(sectionOffsetTop: number, height = 800): DOMRect {
  return {
    top: sectionOffsetTop,
    bottom: sectionOffsetTop + height,
    height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: sectionOffsetTop,
    toJSON: () => ({}),
  } as DOMRect;
}

describe("NavigationContext - hash/scroll desync (rapid click burst)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "innerHeight", { value: WINDOW_HEIGHT, configurable: true });
    window.location.hash = "";
  });

  it("still scrolls to the final target even when it appears already-visible from a stale (pre-scroll) position", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    const home = document.createElement("section");
    const music = document.createElement("section");

    // Home occupies the top of the (unscrolled) viewport - it will read as
    // "already visible" from the stale scroll position the whole burst runs at.
    home.getBoundingClientRect = jest.fn(() => mockRect(0));
    // Music is off-screen below the fold.
    music.getBoundingClientRect = jest.fn(() => mockRect(1600));

    act(() => {
      result.current.registerSection("home", { current: home }, 0);
      result.current.registerSection("music", { current: music }, 1);
    });

    // Burst: click music (off-screen -> scrolls), then immediately click
    // home again while that scroll is still in flight (flag still true).
    act(() => {
      result.current.navigateToSection("music");
      result.current.navigateToSection("home");
    });

    // Both navigations must actually scroll: the second click should not
    // be silently dropped just because "home" looked visible from the
    // position the page hadn't yet animated away from.
    expect(mockScrollIntoView).toHaveBeenCalledTimes(2);

    // And the hash must reflect the section we actually end up scrolling to.
    expect(mockPush).toHaveBeenLastCalledWith("#home", { scroll: false });
  });

  it("still skips the scroll when the target is genuinely visible and nothing is in flight", () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: NavigationProvider,
    });

    const home = document.createElement("section");
    home.getBoundingClientRect = jest.fn(() => mockRect(0));

    act(() => {
      result.current.registerSection("home", { current: home }, 0);
    });

    act(() => {
      result.current.navigateToSection("home");
    });

    // No prior scroll was in flight and home is genuinely on-screen already,
    // so the jarring re-jump should still be avoided.
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });
});
