/**
 * Unit tests for SkipLink component
 * Feature: skip-navigation-link
 * Requirements: 1.3, 1.5, 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { render, screen } from "@testing-library/react";
import fc from "fast-check";
import SkipLink from "./SkipLink";

describe("SkipLink", () => {
  describe("Basic rendering", () => {
    it("should render with correct text", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toBeInTheDocument();
    });

    it("should render as an anchor element", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink.tagName).toBe("A");
    });

    it("should have correct href attribute", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveAttribute("href", "#main-navigation");
    });
  });

  describe("Positioning and visibility", () => {
    it("should have off-screen positioning classes", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("absolute");
      expect(skipLink).toHaveClass("-left-[9999px]");
      expect(skipLink).toHaveClass("top-0");
    });

    it("should have focus-visible positioning classes", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("focus-visible:left-4");
      expect(skipLink).toHaveClass("focus-visible:top-4");
    });

    it("should have z-index for layering above content", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("z-50");
    });
  });

  describe("Typography and styling", () => {
    it("should use Bebas Neue font (font-display class)", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("font-display");
    });

    it("should have correct color scheme (bg-black text-white)", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("bg-black");
      expect(skipLink).toHaveClass("text-white");
    });

    it("should have text size class", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("text-lg");
    });

    it("should have padding classes", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("px-4");
      expect(skipLink).toHaveClass("py-2");
    });

    it("should have rounded corners", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("rounded");
    });

    it("should have border styling", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("border-2");
      expect(skipLink).toHaveClass("border-white");
    });
  });

  describe("Focus indicator", () => {
    it("should have focus-visible outline and ring classes", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("focus-visible:outline-none");
      expect(skipLink).toHaveClass("focus-visible:ring-2");
      expect(skipLink).toHaveClass("focus-visible:ring-amber-400");
    });
  });

  describe("Transitions and animations", () => {
    it("should have transition classes", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("transition-all");
      expect(skipLink).toHaveClass("duration-200");
    });

    it("should have motion-reduce:transition-none class", () => {
      render(<SkipLink />);
      
      const skipLink = screen.getByText("Skip to navigation");
      expect(skipLink).toHaveClass("motion-reduce:transition-none");
    });
  });

  describe("Property-Based Tests", () => {
    /**
     * Property 3: Skip link has correct semantic structure
     * **Validates: Requirements 1.3, 1.5, 3.4, 5.3**
     * 
     * For any render of the skip link, it should be an anchor element 
     * with href="#main-navigation" and contain the text "Skip to navigation".
     */
    it("should always have correct semantic structure (anchor with correct href and text)", () => {
      fc.assert(
        fc.property(
          // Generate arbitrary render attempts (we don't need input variation for this component)
          fc.integer({ min: 1, max: 100 }),
          (_renderAttempt) => {
            // Render the component
            const { container } = render(<SkipLink />);
            
            // Verify it's an anchor element
            const skipLink = screen.getByText("Skip to navigation");
            expect(skipLink.tagName).toBe("A");
            
            // Verify it has the correct href
            expect(skipLink).toHaveAttribute("href", "#main-navigation");
            
            // Verify it contains the correct text
            expect(skipLink).toHaveTextContent("Skip to navigation");
            
            // Clean up for next iteration
            container.remove();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
