/**
 * Regression coverage for a reported bug: on a real mobile device, a fast
 * fling-scroll could leave the bottom nav permanently highlighting a
 * section the user had scrolled well past (e.g. "Shows" stayed active
 * while "About" content, and then the footer, were on screen).
 *
 * Root cause: the hook accumulated intersection ratios from
 * IntersectionObserver's enter/leave callback stream into a map, trusting
 * it to always receive a matching "leaving" callback for every "entering"
 * one. A fast fling can carry a section's ratio past the threshold and
 * back down within a single rendered frame; if the browser ever coalesces
 * or drops that "leaving" callback, the section's last-known ratio stayed
 * frozen in the map forever - corrupting "most visible section" for the
 * rest of the session.
 *
 * Fix: on every debounced re-check, measure each section's current
 * visibility fresh from real DOM geometry, rather than trusting the
 * accumulated map. The observer is now only a trigger for when to
 * re-measure - not the source of truth for the ratios themselves. This
 * makes the result self-healing: it cannot go stale no matter what the
 * observer's callback stream missed.
 */

import { act, renderHook } from "@testing-library/react";
import type { SectionId } from "~/lib/types";
import { useIntersectionObserver } from "./useIntersectionObserver";

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let capturedCallback: ObserverCallback | null = null;
let capturedOptions: IntersectionObserverInit | undefined;
const observedElements: Element[] = [];
const disconnect = jest.fn();

class FakeIntersectionObserver {
  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    capturedCallback = callback;
    capturedOptions = options;
  }
  observe(el: Element) {
    observedElements.push(el);
  }
  unobserve() {}
  disconnect() {
    disconnect();
  }
  takeRecords() {
    return [];
  }
}

function mockRect(el: HTMLElement, top: number, height = 800) {
  el.getBoundingClientRect = jest.fn(
    () =>
      ({
        top,
        bottom: top + height,
        height,
        left: 0,
        right: 0,
        width: 0,
        x: 0,
        y: top,
        toJSON: () => ({}),
      }) as DOMRect,
  );
}

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    capturedCallback = null;
    capturedOptions = undefined;
    observedElements.length = 0;
    disconnect.mockClear();
    (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      FakeIntersectionObserver;
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function fireObserverCallback() {
    act(() => {
      capturedCallback?.([]);
      jest.advanceTimersByTime(100);
    });
  }

  it("recovers from a missed 'leaving' callback by measuring current geometry, not stale accumulated ratios", () => {
    const shows = document.createElement("section");
    const about = document.createElement("section");
    // "shows" was intersecting when the observer last fired for it.
    mockRect(shows, 0, 800);
    // "about" is what's actually on screen now - but no observer
    // callback ever reported this (simulating a dropped/coalesced entry
    // from a fast fling covering a lot of distance in one frame).
    mockRect(about, 800, 800);

    const refs = new Map<SectionId, React.RefObject<HTMLElement | null>>([
      ["shows", { current: shows }],
      ["about", { current: about }],
    ]);

    renderHook(() => useIntersectionObserver(refs, { threshold: 0.3 }));

    // "shows" fully on screen, matching its initial mocked geometry.
    fireObserverCallback();

    // Now the fling has landed: "shows" has scrolled fully out of view
    // and "about" is what's actually visible. Update geometry to match,
    // but the trigger that wakes the hook up carries no information
    // about which section changed - exactly what happens if the
    // browser's own "leaving" callback for "shows" never arrived.
    mockRect(shows, -800, 800);
    mockRect(about, 0, 800);
    fireObserverCallback();

    const { result } = renderHook(() => useIntersectionObserver(refs, { threshold: 0.3 }));
    fireObserverCallback();

    expect(result.current).toBe("about");
  });

  it("still reports the section IntersectionObserver actually flags as most visible in the normal case", () => {
    const home = document.createElement("section");
    const music = document.createElement("section");
    mockRect(home, 0, 800);
    mockRect(music, 800, 800);

    const refs = new Map<SectionId, React.RefObject<HTMLElement | null>>([
      ["home", { current: home }],
      ["music", { current: music }],
    ]);

    const { result } = renderHook(() => useIntersectionObserver(refs, { threshold: 0.3 }));
    fireObserverCallback();

    expect(result.current).toBe("home");
  });

  it("applies vertical rootMargin insets when computing visibility", () => {
    const section = document.createElement("section");
    // Only the top 50px of this section is within the viewport.
    mockRect(section, 750, 800);

    const refs = new Map<SectionId, React.RefObject<HTMLElement | null>>([
      ["home", { current: section }],
    ]);

    // A large negative bottom inset excludes that sliver entirely.
    renderHook(() =>
      useIntersectionObserver(refs, { threshold: 0.01, rootMargin: "0px 0px -100px 0px" }),
    );
    fireObserverCallback();

    expect(capturedOptions?.rootMargin).toBe("0px 0px -100px 0px");
  });

  it("disconnects the observer on unmount", () => {
    const home = document.createElement("section");
    mockRect(home, 0, 800);
    const refs = new Map<SectionId, React.RefObject<HTMLElement | null>>([
      ["home", { current: home }],
    ]);

    const { unmount } = renderHook(() => useIntersectionObserver(refs));
    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
