/**
 * Unit tests for Breadcrumb component
 * Feature: persistent-navigation-breadcrumbs
 */

import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Breadcrumb from "./Breadcrumb";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("Breadcrumb", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render on home page", () => {
    mockUsePathname.mockReturnValue("/");
    const { container } = render(<Breadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  it("should render on nested pages", () => {
    mockUsePathname.mockReturnValue("/music");
    render(<Breadcrumb />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("should display correct number of breadcrumb items", () => {
    mockUsePathname.mockReturnValue("/music/the-custard-screams-ep");
    render(<Breadcrumb />);
    
    const breadcrumbList = screen.getByRole("list");
    const items = breadcrumbList.querySelectorAll("li");
    expect(items).toHaveLength(3); // Home, Music, The Custard Screams EP
  });

  it("should have Home as first breadcrumb", () => {
    mockUsePathname.mockReturnValue("/music");
    render(<Breadcrumb />);
    
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should mark last breadcrumb as current page", () => {
    mockUsePathname.mockReturnValue("/music/the-custard-screams-ep");
    render(<Breadcrumb />);
    
    const currentPage = screen.getByText("The Custard Screams EP");
    expect(currentPage).toHaveAttribute("aria-current", "page");
    expect(currentPage.tagName).toBe("SPAN"); // Not a link
  });

  it("should make intermediate breadcrumbs clickable", () => {
    mockUsePathname.mockReturnValue("/music/the-custard-screams-ep/royal-flush");
    render(<Breadcrumb />);
    
    const musicLink = screen.getByRole("link", { name: "Music" });
    expect(musicLink).toBeInTheDocument();
    expect(musicLink).toHaveAttribute("href", "/music");
    
    const epLink = screen.getByRole("link", { name: "The Custard Screams EP" });
    expect(epLink).toBeInTheDocument();
    expect(epLink).toHaveAttribute("href", "/music/the-custard-screams-ep");
  });

  it("should apply correct ARIA attributes", () => {
    mockUsePathname.mockReturnValue("/music");
    render(<Breadcrumb />);
    
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("should apply custom className", () => {
    mockUsePathname.mockReturnValue("/music");
    const { container } = render(<Breadcrumb className="custom-class" />);
    
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("custom-class");
  });

  it("should have amber color for clickable links", () => {
    mockUsePathname.mockReturnValue("/music");
    render(<Breadcrumb />);
    
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveClass("text-amber-400");
  });

  it("should have muted color for active breadcrumb", () => {
    mockUsePathname.mockReturnValue("/music");
    render(<Breadcrumb />);
    
    const activeBreadcrumb = screen.getByText("Music");
    expect(activeBreadcrumb).toHaveClass("text-gray-400");
  });

  it("should display separators between breadcrumbs", () => {
    mockUsePathname.mockReturnValue("/music/the-custard-screams-ep");
    const { container } = render(<Breadcrumb />);
    
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBeGreaterThan(0);
  });

  it("should have minimum touch target size", () => {
    mockUsePathname.mockReturnValue("/music");
    render(<Breadcrumb />);
    
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveClass("min-h-[44px]");
    expect(homeLink).toHaveClass("min-w-[44px]");
  });
});
