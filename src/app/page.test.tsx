import { render, screen } from "@testing-library/react";
import { NavigationProvider } from "~/contexts/NavigationContext";
import HomePage from "./page";

// Mock the hooks
jest.mock("~/hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => "home",
}));

jest.mock("~/hooks/useSmoothScroll", () => ({
  useSmoothScroll: () => jest.fn(),
}));

jest.mock("~/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("Home Page", () => {
  it("renders without errors", () => {
    expect(() => render(
      <NavigationProvider>
        <HomePage />
      </NavigationProvider>
    )).not.toThrow();
  });

  it("renders all main sections", () => {
    render(
      <NavigationProvider>
        <HomePage />
      </NavigationProvider>
    );
    
    // Check that all section headings are present
    expect(screen.getByRole("heading", { name: /The Custard Screams/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Music$/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Live Shows/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /About The Custard Screams/i, level: 2 })).toBeInTheDocument();
  });
});
