import { render } from "@testing-library/react";
import HomePage from "./page";

describe("Home Page", () => {
  it("renders without errors", () => {
    expect(() => render(<HomePage />)).not.toThrow();
  });
});
