/**
 * Validation tests for punk rock navigation icons
 * Feature: punk-rock-navigation-icons
 * Task: 6.1 Visual validation
 */

import { render } from "@testing-library/react";
import NavItem from "~/components/navigation/NavItem";
import { SECTIONS } from "~/lib/types";

describe("Punk Icons CSS Validation", () => {
  it("should render icon elements with correct classes", () => {
    const { container } = render(
      <NavItem
        section={SECTIONS[0]}
        isActive={false}
        onClick={() => {}}
        iconType="home"
      />
    );

    // Check icon container exists
    const iconContainer = container.querySelector(".icon-container");
    expect(iconContainer).toBeInTheDocument();

    // Check icon element exists with correct class
    const iconElement = container.querySelector(".icon-home");
    expect(iconElement).toBeInTheDocument();
    
    // Log for debugging
    console.log("Icon container HTML:", iconContainer?.outerHTML);
    console.log("Icon element HTML:", iconElement?.outerHTML);
  });

  it("should have text-current class for color inheritance", () => {
    const { container } = render(
      <NavItem
        section={SECTIONS[0]}
        isActive={false}
        onClick={() => {}}
        iconType="home"
      />
    );

    const iconElement = container.querySelector(".icon-home");
    expect(iconElement).toHaveClass("text-current");
  });

  it("should render all four icon types", () => {
    const iconTypes: Array<"home" | "music" | "shows" | "about"> = ["home", "music", "shows", "about"];
    
    iconTypes.forEach((iconType) => {
      const { container } = render(
        <NavItem
          section={SECTIONS[0]}
          isActive={false}
          onClick={() => {}}
          iconType={iconType}
        />
      );

      const iconElement = container.querySelector(`.icon-${iconType}`);
      expect(iconElement).toBeInTheDocument();
      console.log(`${iconType} icon rendered:`, iconElement?.outerHTML);
    });
  });

  it("should apply active class to container when isActive is true", () => {
    const { container } = render(
      <NavItem
        section={SECTIONS[0]}
        isActive={true}
        onClick={() => {}}
        iconType="home"
      />
    );

    const iconContainer = container.querySelector(".icon-container");
    expect(iconContainer).toHaveClass("active");
  });

  it("should have correct button text colors", () => {
    // Inactive button - should have text-white
    const { container: inactiveContainer } = render(
      <NavItem
        section={SECTIONS[0]}
        isActive={false}
        onClick={() => {}}
        iconType="home"
      />
    );

    const inactiveButton = inactiveContainer.querySelector("button");
    expect(inactiveButton).toHaveClass("text-white");

    // Active button - should have text-black
    const { container: activeContainer } = render(
      <NavItem
        section={SECTIONS[0]}
        isActive={true}
        onClick={() => {}}
        iconType="home"
      />
    );

    const activeButton = activeContainer.querySelector("button");
    expect(activeButton).toHaveClass("text-black");
    expect(activeButton).toHaveClass("bg-amber-400");
  });

  it("should have relative positioning on icon container", () => {
    const { container } = render(
      <NavItem
        section={SECTIONS[0]}
        isActive={false}
        onClick={() => {}}
        iconType="home"
      />
    );

    const iconContainer = container.querySelector(".icon-container");
    expect(iconContainer).toHaveClass("relative");
    expect(iconContainer).toHaveClass("w-8");
    expect(iconContainer).toHaveClass("h-8");
  });
});
