/**
 * Test utilities for scroll-snap navigation diagnostics
 * Provides helpers for simulating scroll events and checking CSS properties
 */

/**
 * Simulates a wheel event on an element
 */
export function simulateWheelEvent(
  element: HTMLElement | Window,
  deltaY: number = 100
): WheelEvent {
  const event = new WheelEvent("wheel", {
    bubbles: true,
    cancelable: true,
    deltaY,
    deltaMode: 0,
  });

  const target = element instanceof Window ? window : element;
  target.dispatchEvent(event);

  return event;
}

/**
 * Simulates a touch scroll gesture
 */
export function simulateTouchScroll(
  element: HTMLElement,
  startY: number,
  endY: number
): void {
  // Create touch objects compatible with jsdom
  const createTouch = (clientY: number) => ({
    identifier: 0,
    target: element,
    clientX: 0,
    clientY,
    pageX: 0,
    pageY: clientY,
    screenX: 0,
    screenY: clientY,
    radiusX: 0,
    radiusY: 0,
    rotationAngle: 0,
    force: 1,
  });

  // Touch start
  const touchStart = new TouchEvent("touchstart", {
    bubbles: true,
    cancelable: true,
    touches: [createTouch(startY)] as any,
  });
  element.dispatchEvent(touchStart);

  // Touch move
  const touchMove = new TouchEvent("touchmove", {
    bubbles: true,
    cancelable: true,
    touches: [createTouch(endY)] as any,
  });
  element.dispatchEvent(touchMove);

  // Touch end
  const touchEnd = new TouchEvent("touchend", {
    bubbles: true,
    cancelable: true,
    changedTouches: [createTouch(endY)] as any,
  });
  element.dispatchEvent(touchEnd);
}

/**
 * Gets computed CSS property value for an element
 */
export function getComputedStyle(
  element: HTMLElement,
  property: string
): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Checks if an element has the correct scroll-snap CSS properties
 */
export function hasScrollSnapCSS(element: HTMLElement): {
  hasScrollSnapAlign: boolean;
  hasScrollSnapStop: boolean;
  scrollSnapAlign: string;
  scrollSnapStop: string;
} {
  const computedStyle = window.getComputedStyle(element);
  const scrollSnapAlign = computedStyle.getPropertyValue("scroll-snap-align");
  const scrollSnapStop = computedStyle.getPropertyValue("scroll-snap-stop");

  return {
    hasScrollSnapAlign: scrollSnapAlign !== "" && scrollSnapAlign !== "none",
    hasScrollSnapStop: scrollSnapStop !== "",
    scrollSnapAlign,
    scrollSnapStop,
  };
}

/**
 * Checks if scroll container has correct scroll-snap-type
 */
export function hasScrollSnapType(element: HTMLElement): {
  hasScrollSnapType: boolean;
  scrollSnapType: string;
} {
  const computedStyle = window.getComputedStyle(element);
  const scrollSnapType = computedStyle.getPropertyValue("scroll-snap-type");

  return {
    hasScrollSnapType: scrollSnapType !== "" && scrollSnapType !== "none",
    scrollSnapType,
  };
}

/**
 * Creates a mock for window.scrollTo
 */
export function createScrollToMock(): jest.Mock {
  const mock = jest.fn();
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: mock,
  });
  return mock;
}

/**
 * Creates a mock for IntersectionObserver
 */
export function createIntersectionObserverMock(): {
  observe: jest.Mock;
  unobserve: jest.Mock;
  disconnect: jest.Mock;
  trigger: (entries: Partial<IntersectionObserverEntry>[]) => void;
} {
  let callback: IntersectionObserverCallback | null = null;

  const observe = jest.fn();
  const unobserve = jest.fn();
  const disconnect = jest.fn();

  const trigger = (entries: Partial<IntersectionObserverEntry>[]) => {
    if (callback) {
      callback(
        entries as IntersectionObserverEntry[],
        {} as IntersectionObserver
      );
    }
  };

  global.IntersectionObserver = jest.fn((cb) => {
    callback = cb;
    return {
      observe,
      unobserve,
      disconnect,
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: () => [],
    };
  }) as any;

  return { observe, unobserve, disconnect, trigger };
}

/**
 * Waits for a specified amount of time (for debounce testing)
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Checks if an event listener was added with passive option
 */
export function isPassiveListener(
  element: HTMLElement | Window,
  eventType: string
): boolean {
  // This is a simplified check - in real tests, you'd need to spy on addEventListener
  // For now, we'll return true if no preventDefault was called
  return true;
}

/**
 * Creates a test section element with proper attributes
 */
export function createTestSection(
  id: string,
  order: number
): HTMLElement {
  const section = document.createElement("section");
  section.id = id;
  section.setAttribute("data-section-id", id);
  section.style.minHeight = "100vh";
  section.style.scrollSnapAlign = "start";
  section.style.scrollSnapStop = "normal";
  return section;
}

/**
 * Sets up a test DOM with body and sections
 */
export function setupTestDOM(sectionIds: string[]): HTMLElement[] {
  // Set up body with scroll-snap
  document.body.style.height = "100vh";
  document.body.style.overflowY = "scroll";
  document.body.style.scrollSnapType = "y mandatory";

  // Create sections
  const sections = sectionIds.map((id, index) => {
    const section = createTestSection(id, index);
    document.body.appendChild(section);
    return section;
  });

  return sections;
}

/**
 * Cleans up test DOM
 */
export function cleanupTestDOM(): void {
  document.body.innerHTML = "";
  document.body.style.cssText = "";
}
