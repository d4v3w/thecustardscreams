/**
 * Stress tests for rapid nav-button pressing, added from a production
 * report: pressing every nav item one after another (a few ms apart, while
 * the previous scroll was still animating) and mashing a single nav item
 * repeatedly both left navigation "stuck" - the hash/nav highlight stopped
 * responding to further clicks - and produced visible judder while the same
 * item was pressed mid-scroll.
 *
 * See also NavigationContext.hashScrollDesync.test.tsx for the closely
 * related hash/scroll-position desync bug found in the same area.
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

function mockRect(offsetTop: number, height = 800): DOMRect {
  return {
    top: offsetTop,
    bottom: offsetTop + height,
    height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: offsetTop,
    toJSON: () => ({}),
  } as DOMRect;
}

function makeSection(offsetTop: number): HTMLElement {
  const el = document.createElement("section");
  el.getBoundingClientRect = jest.fn(() => mockRect(offsetTop));
  return el;
}

describe("NavigationContext - rapid nav-button pressing stress tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    window.location.hash = "";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("keeps responding after every nav item is pressed one after another, several ms apart", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useNavigation(), { wrapper: NavigationProvider });

    const home = makeSection(0);
    const music = makeSection(800);
    const shows = makeSection(1600);
    const about = makeSection(2400);

    act(() => {
      result.current.registerSection("home", { current: home }, 0);
      result.current.registerSection("music", { current: music }, 1);
      result.current.registerSection("shows", { current: shows }, 2);
      result.current.registerSection("about", { current: about }, 3);
    });

    // Press every item in turn, a few ms apart - each is still mid-scroll
    // (in this environment, "mid-scroll" == the programmatic flag hasn't
    // cleared, which takes up to 1500ms) when the next one is pressed.
    for (const id of ["music", "shows", "about", "home"] as const) {
      act(() => {
        result.current.navigateToSection(id);
        jest.advanceTimersByTime(5);
      });
    }

    expect(mockPush).toHaveBeenLastCalledWith("#home", { scroll: false });

    // The bug report: after a burst like this, navigation stopped
    // responding entirely. A fresh click on any section must still scroll.
    mockScrollIntoView.mockClear();
    act(() => {
      result.current.navigateToSection("shows");
    });
    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenLastCalledWith("#shows", { scroll: false });
  });

  it("does not break navigation when the same item is clicked rapidly 6 times", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useNavigation(), { wrapper: NavigationProvider });

    const home = makeSection(0);
    const about = makeSection(2400);

    act(() => {
      result.current.registerSection("home", { current: home }, 0);
      result.current.registerSection("about", { current: about }, 1);
    });

    // Mash "about" 6 times in a row, a few ms apart - the reported repro.
    for (let i = 0; i < 6; i++) {
      act(() => {
        result.current.navigateToSection("about");
        jest.advanceTimersByTime(10);
      });
    }

    expect(mockPush).toHaveBeenLastCalledWith("#about", { scroll: false });

    // Clicking a different section immediately afterward (still well
    // within the in-flight window) must still work - this is the exact
    // "sticks and then nothing works" failure mode from the report.
    mockScrollIntoView.mockClear();
    act(() => {
      result.current.navigateToSection("home");
    });
    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenLastCalledWith("#home", { scroll: false });
  });

  it("does not restart the scroll animation (judder) when the same item is mashed mid-scroll", () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useNavigation(), { wrapper: NavigationProvider });

    const home = makeSection(0);
    const about = makeSection(2400);

    act(() => {
      result.current.registerSection("home", { current: home }, 0);
      result.current.registerSection("about", { current: about }, 1);
    });

    for (let i = 0; i < 6; i++) {
      act(() => {
        result.current.navigateToSection("about");
        jest.advanceTimersByTime(10);
      });
    }

    // Only the first press should have actually kicked off a scroll -
    // the other 5 were already headed to the same target. Calling
    // scrollIntoView again on every press is what produced the judder.
    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);

    // Once the in-flight scroll has fully settled, pressing the same
    // target again is a genuine new navigation and should scroll again.
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    mockScrollIntoView.mockClear();
    act(() => {
      result.current.navigateToSection("about");
    });
    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
  });
});
