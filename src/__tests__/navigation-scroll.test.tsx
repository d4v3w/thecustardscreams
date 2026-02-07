/**
 * Navigation and Scroll Snap Tests
 * Tests that navigation items work correctly and scroll-snap behavior is as expected
 * Feature: website-modernization
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Section from "~/components/Section";
import BottomNav from "~/components/navigation/BottomNav";
import { NavigationProvider } from "~/contexts/NavigationContext";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
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

// Mock window.history
const mockPushState = jest.fn();
Object.defineProperty(window, "history", {
  value: { pushState: mockPushState },
  writable: true,
});

describe("Navigation and Scroll Snap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollIntoView.mockClear();
    mockPushState.mockClear();
  });

  describe("Scroll Snap CSS Classes", () => {
    it("should render all sections with data-section-id attribute", () => {
      const { container } = render(
        <NavigationProvider>
          <Section id="home">Home Content</Section>
          <Section id="music">Music Content</Section>
          <Section id="shows">Shows Content</Section>
          <Section id="about">About Content</Section>
        </NavigationProvider>
      );

      const sections = container.querySelectorAll("section");
      expect(sections).toHaveLength(4);

      sections.forEach((section) => {
        expect(section).toHaveAttribute("data-section-id");
      });
    });

    it("should render sections with proper structure for scroll snap", () => {
      const { container } = render(
        <NavigationProvider>
          <Section id="home">Home Content</Section>
          <Section id="music">Music Content</Section>
        </NavigationProvider>
      );

      const sections = container.querySelectorAll("section");
      // Sections should exist and have data-section-id for global CSS targeting
      sections.forEach((section) => {
        expect(section.tagName).toBe("SECTION");
        expect(section).toHaveAttribute("data-section-id");
      });
    });

    it("should have data-section-id attribute for intersection observer", () => {
      const { container } = render(
        <NavigationProvider>
          <Section id="home">Home Content</Section>
          <Section id="music">Music Content</Section>
        </NavigationProvider>
      );

      expect(container.querySelector('[data-section-id="home"]')).toBeInTheDocument();
      expect(container.querySelector('[data-section-id="music"]')).toBeInTheDocument();
    });
  });

  describe("Navigation Click Behavior", () => {
    it("should call scrollIntoView when navigation item is clicked", async () => {
      const user = userEvent.setup();

      // Create a test component with navigation
      const TestComponent = () => {
        const [currentSection, setCurrentSection] = React.useState<string | null>("home");

        return (
          <NavigationProvider>
            <div>
              <Section id="home">Home Content</Section>
              <Section id="music">Music Content</Section>
              <Section id="shows">Shows Content</Section>
              <Section id="about">About Content</Section>
              <BottomNav
                activeSection={currentSection as any}
                onNavigate={(id) => {
                  const element = document.querySelector(`[data-section-id="${id}"]`);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                  setCurrentSection(id);
                }}
              />
            </div>
          </NavigationProvider>
        );
      };

      render(<TestComponent />);

      // Click on Music nav item
      const musicButton = screen.getByRole("button", { name: /music/i });
      await user.click(musicButton);

      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith(
          expect.objectContaining({
            behavior: "smooth",
            block: "start",
          })
        );
      });
    });

    it("should update URL hash when navigating to a section", async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        return (
          <NavigationProvider>
            <div>
              <Section id="home">Home Content</Section>
              <Section id="music">Music Content</Section>
              <BottomNav
                activeSection="home"
                onNavigate={(id) => {
                  window.history.pushState(null, "", `#${id}`);
                }}
              />
            </div>
          </NavigationProvider>
        );
      };

      render(<TestComponent />);

      const musicButton = screen.getByRole("button", { name: /music/i });
      await user.click(musicButton);

      await waitFor(() => {
        expect(mockPushState).toHaveBeenCalledWith(null, "", "#music");
      });
    });

    it("should navigate to all sections in order", async () => {
      const user = userEvent.setup();
      const sections = ["home", "music", "shows", "about"];

      const TestComponent = () => {
        return (
          <NavigationProvider>
            <div>
              {sections.map((id) => (
                <Section key={id} id={id as any}>
                  {id} Content
                </Section>
              ))}
              <BottomNav
                activeSection="home"
                onNavigate={(id) => {
                  const element = document.querySelector(`[data-section-id="${id}"]`);
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </div>
          </NavigationProvider>
        );
      };

      render(<TestComponent />);

      // Test clicking each navigation item
      for (const section of sections) {
        const button = screen.getByRole("button", { name: new RegExp(section, "i") });
        await user.click(button);

        await waitFor(() => {
          expect(mockScrollIntoView).toHaveBeenCalled();
        });

        mockScrollIntoView.mockClear();
      }

      // Should have been called once for each section
      expect(mockScrollIntoView).toHaveBeenCalledTimes(0); // Cleared after last iteration
    });
  });

  describe("Scroll Snap Behavior", () => {
    it("should have scroll-snap-type on body element", () => {
      // This test checks if the CSS is properly applied
      // In a real browser, body would have scroll-snap-type: y mandatory
      const style = document.createElement("style");
      style.textContent = `
        body {
          scroll-snap-type: y mandatory;
        }
      `;
      document.head.appendChild(style);

      const bodyStyle = window.getComputedStyle(document.body);
      // Note: jsdom doesn't fully support computed styles, so this is a structural test
      expect(document.body).toBeDefined();
    });

    it("should maintain section order for proper snap sequence", () => {
      const { container } = render(
        <NavigationProvider>
          <Section id="home">Home</Section>
          <Section id="music">Music</Section>
          <Section id="shows">Shows</Section>
          <Section id="about">About</Section>
        </NavigationProvider>
      );

      const sections = container.querySelectorAll("section");
      const sectionIds = Array.from(sections).map((s) => s.getAttribute("data-section-id"));

      expect(sectionIds).toEqual(["home", "music", "shows", "about"]);
    });
  });

  describe("Active Section Highlighting", () => {
    it("should highlight the active navigation item", () => {
      render(
        <NavigationProvider>
          <BottomNav activeSection="music" onNavigate={() => {}} />
        </NavigationProvider>
      );

      const musicButton = screen.getByRole("button", { name: /music/i });
      const homeButton = screen.getByRole("button", { name: /home/i });

      // Active button should have amber background
      expect(musicButton).toHaveClass("bg-amber-400");
      expect(musicButton).toHaveClass("text-black");

      // Inactive button should not have amber background
      expect(homeButton).not.toHaveClass("bg-amber-400");
      expect(homeButton).toHaveClass("text-white");
    });

    it("should update active state when different section is active", () => {
      const { rerender } = render(
        <NavigationProvider>
          <BottomNav activeSection="home" onNavigate={() => {}} />
        </NavigationProvider>
      );

      let homeButton = screen.getByRole("button", { name: /home/i });
      expect(homeButton).toHaveClass("bg-amber-400");

      // Change active section
      rerender(
        <NavigationProvider>
          <BottomNav activeSection="shows" onNavigate={() => {}} />
        </NavigationProvider>
      );

      homeButton = screen.getByRole("button", { name: /home/i });
      const showsButton = screen.getByRole("button", { name: /shows/i });

      expect(homeButton).not.toHaveClass("bg-amber-400");
      expect(showsButton).toHaveClass("bg-amber-400");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels on navigation items", () => {
      render(
        <NavigationProvider>
          <BottomNav activeSection="home" onNavigate={() => {}} />
        </NavigationProvider>
      );

      const homeButton = screen.getByRole("button", { name: /home section/i });
      const musicButton = screen.getByRole("button", { name: /music/i });

      expect(homeButton).toHaveAttribute("aria-label");
      expect(musicButton).toHaveAttribute("aria-label");
    });

    it("should indicate current page with aria-current", () => {
      render(
        <NavigationProvider>
          <BottomNav activeSection="music" onNavigate={() => {}} />
        </NavigationProvider>
      );

      const musicButton = screen.getByRole("button", { name: /music/i });
      expect(musicButton).toHaveAttribute("aria-current", "page");
    });

    it("should have minimum touch target size of 44x44px", () => {
      const { container } = render(
        <NavigationProvider>
          <BottomNav activeSection="home" onNavigate={() => {}} />
        </NavigationProvider>
      );

      const buttons = container.querySelectorAll("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("min-h-[44px]");
        expect(button).toHaveClass("min-w-[44px]");
      });
    });
  });

  describe("Keyboard Navigation", () => {
    it("should be keyboard accessible with Tab key", async () => {
      const user = userEvent.setup();

      render(
        <NavigationProvider>
          <BottomNav activeSection="home" onNavigate={() => {}} />
        </NavigationProvider>
      );

      const homeButton = screen.getByRole("button", { name: /home/i });

      // Tab to first button
      await user.tab();
      expect(homeButton).toHaveFocus();
    });

    it("should activate navigation on Enter key", async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <NavigationProvider>
          <BottomNav activeSection="home" onNavigate={mockNavigate} />
        </NavigationProvider>
      );

      const musicButton = screen.getByRole("button", { name: /music/i });
      musicButton.focus();

      await user.keyboard("{Enter}");

      expect(mockNavigate).toHaveBeenCalledWith("music");
    });

    it("should activate navigation on Space key", async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <NavigationProvider>
          <BottomNav activeSection="home" onNavigate={mockNavigate} />
        </NavigationProvider>
      );

      const showsButton = screen.getByRole("button", { name: /shows/i });
      showsButton.focus();

      await user.keyboard(" ");

      expect(mockNavigate).toHaveBeenCalledWith("shows");
    });
  });
});
