import { act, render, screen } from "@testing-library/react";
import { CookieConsentProvider } from "~/contexts/CookieConsentContext";
import { NavigationProvider } from "~/contexts/NavigationContext";
import HomePage from "./page";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the hooks
jest.mock("~/hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => "home",
}));

jest.mock("~/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("Home Page", () => {
  it("renders without errors", async () => {
    expect(() => render(
      <CookieConsentProvider>
        <NavigationProvider>
          <HomePage />
        </NavigationProvider>
      </CookieConsentProvider>
    )).not.toThrow();

    // CookieConsentProvider and ConditionalBandsintownWidget read their
    // client-only initial state in a microtask (queued from a mount
    // effect) to avoid a hydration mismatch. Flush it so that update is
    // wrapped in act() like any other state change during the test.
    await act(async () => {});
  });

  it("renders all main sections", async () => {
    render(
      <CookieConsentProvider>
        <NavigationProvider>
          <HomePage />
        </NavigationProvider>
      </CookieConsentProvider>
    );
    await act(async () => {});

    // Check that all section headings are present
    expect(screen.getByRole("heading", { name: /The Custard Screams/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Music$/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Live Shows/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /About The Custard Screams/i, level: 2 })).toBeInTheDocument();
  });
});
