/**
 * Test to verify CSS scroll-snap properties are correctly applied in real components
 * This tests the actual Section component structure for global CSS targeting
 * Note: scroll-snap styles are applied via globals.css using section[data-section-id] selector
 */

import { render } from "@testing-library/react";
import Section from "~/components/Section";
import { NavigationProvider } from "~/contexts/NavigationContext";

describe("Scroll-Snap CSS Application", () => {
  it("should render Section component with data-section-id attribute for CSS targeting", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="home">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="home"]');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("data-section-id", "home");
  });

  it("should render as a section element for semantic HTML", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="home">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="home"]');
    expect(section?.tagName).toBe("SECTION");
  });

  it("should have aria-labelledby for accessibility", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="home">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="home"]');
    expect(section).toHaveAttribute("aria-labelledby", "home-heading");
  });

  it("should accept and apply custom className prop", () => {
    const { container } = render(
      <NavigationProvider>
        <Section id="home" className="custom-class">
          <h1>Test Section</h1>
        </Section>
      </NavigationProvider>
    );

    const section = container.querySelector('section[data-section-id="home"]');
    expect(section).toHaveClass("custom-class");
  });
});
