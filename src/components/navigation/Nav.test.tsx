/**
 * Unit tests for Nav component
 * Feature: skip-navigation-link
 * Requirements: 3.1, 3.3
 */

import { render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import Nav from "./Nav";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Nav", () => {
  const mockOnNavigate = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);
  });

  describe("Skip navigation link modifications", () => {
    it("should have id='main-navigation' on nav element", () => {
      render(
        <Nav activeSection="home" onNavigate={mockOnNavigate} />
      );

      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(nav).toHaveAttribute("id", "main-navigation");
    });

    it("should have tabIndex={-1} on nav element", () => {
      render(
        <Nav activeSection="home" onNavigate={mockOnNavigate} />
      );

      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(nav).toHaveAttribute("tabIndex", "-1");
    });

    it("should maintain existing role='navigation' attribute", () => {
      render(
        <Nav activeSection="home" onNavigate={mockOnNavigate} />
      );

      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(nav).toHaveAttribute("role", "navigation");
    });

    it("should maintain existing aria-label attribute", () => {
      render(
        <Nav activeSection="home" onNavigate={mockOnNavigate} />
      );

      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(nav).toHaveAttribute("aria-label", "Main navigation");
    });
  });

  describe("Basic functionality", () => {
    it("should render all navigation items", () => {
      render(
        <Nav activeSection="home" onNavigate={mockOnNavigate} />
      );

      expect(screen.getByRole("button", { name: /home section with band introduction/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /upcoming and past live shows/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /music streaming and downloads/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /about the band/i })).toBeInTheDocument();
    });

    it("should highlight active section", () => {
      render(
        <Nav activeSection="music" onNavigate={mockOnNavigate} />
      );

      const musicButton = screen.getByRole("button", { name: /music streaming and downloads/i });
      expect(musicButton).toHaveClass("bg-amber-400");
    });
  });
});
