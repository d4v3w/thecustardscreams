/**
 * Unit tests for Logo component
 * Feature: logo-on-subpages
 * Requirements: 1.1, 2.1, 4.1, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2
 */

import { render, screen } from "@testing-library/react";
import Logo from "./Logo";

describe("Logo", () => {
  describe("Rendering and Elements (Sub-task 2.1)", () => {
    it("should render a Link element", () => {
      const { container } = render(<Logo />);
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
    });

    it("should render an img element", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
    });

    it("should have correct src attribute", () => {
      render(<Logo />);
      const img = screen.getByRole("img") as HTMLImageElement;
      expect(img.src).toBe(
        "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
      );
    });

    it("should have correct srcSet attribute", () => {
      render(<Logo />);
      const img = screen.getByRole("img") as HTMLImageElement;
      expect(img.srcset).toContain(
        "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x"
      );
      expect(img.srcset).toContain(
        "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
      );
    });

    it("should have correct alt attribute", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "The Custard Screams logo");
    });

    it("should have correct aria-label on Link", () => {
      const { container } = render(<Logo />);
      const link = container.querySelector("a");
      expect(link).toHaveAttribute(
        "aria-label",
        "The Custard Screams - Back to home"
      );
    });

    it("should have Link href pointing to home", () => {
      const { container } = render(<Logo />);
      const link = container.querySelector("a");
      expect(link).toHaveAttribute("href", "/");
    });
  });

  describe("CSS Classes and Styling (Sub-task 2.2)", () => {
    it("should have h-20 class for height", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("h-20");
    });

    it("should have w-20 class for width", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("w-20");
    });

    it("should have rounded-full class for circular shape", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("rounded-full");
    });

    it("should have transition-opacity class", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("transition-opacity");
    });

    it("should have duration-300 class for transition duration", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("duration-300");
    });

    it("should have hover:opacity-80 class for hover state", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("hover:opacity-80");
    });

    it("should have all required Tailwind classes", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      const classList = img.className;
      expect(classList).toContain("h-20");
      expect(classList).toContain("w-20");
      expect(classList).toContain("rounded-full");
      expect(classList).toContain("transition-opacity");
      expect(classList).toContain("duration-300");
      expect(classList).toContain("hover:opacity-80");
    });
  });

  describe("Props and Display Name (Sub-task 2.3)", () => {
    it("should accept optional className prop", () => {
      render(<Logo className="custom-class" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("custom-class");
    });

    it("should merge custom className with default classes", () => {
      render(<Logo className="custom-class" />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("h-20");
      expect(img).toHaveClass("w-20");
      expect(img).toHaveClass("custom-class");
    });

    it("should render without className prop", () => {
      render(<Logo />);
      const img = screen.getByRole("img");
      expect(img).toHaveClass("h-20");
      expect(img).toHaveClass("w-20");
    });

    it("should have correct display name", () => {
      expect(Logo.displayName).toBe("Logo");
    });

    it("should have display name for debugging", () => {
      const component = Logo;
      expect(component.displayName).toBeDefined();
      expect(typeof component.displayName).toBe("string");
    });
  });

  describe("Image Attributes Consistency", () => {
    it("should use same image URL as HeroSection", () => {
      render(<Logo />);
      const img = screen.getByRole("img") as HTMLImageElement;
      // Verify the URL is the expected one from design
      expect(img.src).toBe(
        "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
      );
    });

    it("should have responsive image loading with srcSet", () => {
      render(<Logo />);
      const img = screen.getByRole("img") as HTMLImageElement;
      expect(img.srcset).toBeTruthy();
      expect(img.srcset.split(",")).toHaveLength(2); // 1x and 2x
    });
  });

  describe("Accessibility", () => {
    it("should be accessible with alt text", () => {
      render(<Logo />);
      const img = screen.getByAltText("The Custard Screams logo");
      expect(img).toBeInTheDocument();
    });

    it("should have aria-label on link for screen readers", () => {
      const { container } = render(<Logo />);
      const link = container.querySelector("a");
      expect(link?.getAttribute("aria-label")).toBe(
        "The Custard Screams - Back to home"
      );
    });

    it("should be keyboard navigable", () => {
      const { container } = render(<Logo />);
      const link = container.querySelector("a");
      expect(link?.tagName).toBe("A");
      expect(link).toHaveAttribute("href");
    });
  });
});
