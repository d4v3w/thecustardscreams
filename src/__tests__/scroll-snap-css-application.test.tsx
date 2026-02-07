/**
 * Test to verify CSS scroll-snap properties are correctly applied in real components
 * This tests the actual Section component to ensure no Tailwind conflicts
 */

import { render } from "@testing-library/react";
import Section from "~/components/Section";
import { NavigationProvider } from "~/contexts/NavigationContext";

describe("Scroll-Snap CSS Application", () => {
  it("should apply scroll-snap-align to Section component", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="hero">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="hero"]');
    expect(section).toBeInTheDocument();

    // Check computed styles
    const computedStyle = window.getComputedStyle(section!);
    const scrollSnapAlign = computedStyle.getPropertyValue("scroll-snap-align");

    // Should have scroll-snap-align set (either from Tailwind or CSS)
    expect(scrollSnapAlign).toBeTruthy();
    expect(scrollSnapAlign).toContain("start");
  });

  it("should have min-h-screen class applied", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="hero">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="hero"]');
    expect(section).toHaveClass("min-h-screen");
  });

  it("should have snap-start class applied", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="hero">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="hero"]');
    expect(section).toHaveClass("snap-start");
  });

  it("should have data-section-id attribute", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="hero">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="hero"]');
    expect(section).toHaveAttribute("data-section-id", "hero");
  });
});
