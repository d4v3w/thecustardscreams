/**
 * Unit tests for breadcrumb utility functions
 * Feature: persistent-navigation-breadcrumbs
 */

import { formatSegmentLabel, generateBreadcrumbs, shouldShowBreadcrumbs } from "./breadcrumbs";

describe("formatSegmentLabel", () => {
  it("should convert kebab-case to Title Case", () => {
    expect(formatSegmentLabel("royal-flush")).toBe("Royal Flush");
    expect(formatSegmentLabel("would-you")).toBe("Would You");
    expect(formatSegmentLabel("tomorrow")).toBe("Tomorrow");
  });

  it("should handle special cases", () => {
    expect(formatSegmentLabel("ep")).toBe("EP");
    expect(formatSegmentLabel("the-custard-screams-ep")).toBe("The Custard Screams EP");
    expect(formatSegmentLabel("music")).toBe("Music");
    expect(formatSegmentLabel("about")).toBe("About");
    expect(formatSegmentLabel("live-shows")).toBe("Live Shows");
  });

  it("should handle single words", () => {
    expect(formatSegmentLabel("songs")).toBe("Songs");
    expect(formatSegmentLabel("album")).toBe("Album");
  });

  it("should handle multiple hyphens", () => {
    expect(formatSegmentLabel("this-is-a-test")).toBe("This Is A Test");
  });

  it("should handle empty strings", () => {
    expect(formatSegmentLabel("")).toBe("");
  });
});

describe("generateBreadcrumbs", () => {
  it("should generate breadcrumbs for single-segment path", () => {
    const breadcrumbs = generateBreadcrumbs("/music");
    
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toEqual({ label: "Home", href: "/", isActive: false });
    expect(breadcrumbs[1]).toEqual({ label: "Music", href: "/music", isActive: true });
  });

  it("should generate breadcrumbs for multi-segment path", () => {
    const breadcrumbs = generateBreadcrumbs("/music/the-custard-screams-ep/royal-flush");
    
    expect(breadcrumbs).toHaveLength(4);
    expect(breadcrumbs[0]).toEqual({ label: "Home", href: "/", isActive: false });
    expect(breadcrumbs[1]).toEqual({ label: "Music", href: "/music", isActive: false });
    expect(breadcrumbs[2]).toEqual({ 
      label: "The Custard Screams EP", 
      href: "/music/the-custard-screams-ep", 
      isActive: false 
    });
    expect(breadcrumbs[3]).toEqual({ 
      label: "Royal Flush", 
      href: "/music/the-custard-screams-ep/royal-flush", 
      isActive: true 
    });
  });

  it("should handle home page", () => {
    const breadcrumbs = generateBreadcrumbs("/");
    
    expect(breadcrumbs).toHaveLength(1);
    expect(breadcrumbs[0]).toEqual({ label: "Home", href: "/", isActive: true });
  });

  it("should handle empty path", () => {
    const breadcrumbs = generateBreadcrumbs("");
    
    expect(breadcrumbs).toHaveLength(1);
    expect(breadcrumbs[0]).toEqual({ label: "Home", href: "/", isActive: true });
  });

  it("should handle trailing slashes", () => {
    const breadcrumbs = generateBreadcrumbs("/music/");
    
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toEqual({ label: "Home", href: "/", isActive: false });
    expect(breadcrumbs[1]).toEqual({ label: "Music", href: "/music", isActive: true });
  });

  it("should handle malformed URLs gracefully", () => {
    const breadcrumbs1 = generateBreadcrumbs(null as any);
    expect(breadcrumbs1).toHaveLength(1);
    expect(breadcrumbs1[0]).toEqual({ label: "Home", href: "/", isActive: true });

    const breadcrumbs2 = generateBreadcrumbs(undefined as any);
    expect(breadcrumbs2).toHaveLength(1);
    expect(breadcrumbs2[0]).toEqual({ label: "Home", href: "/", isActive: true });

    const breadcrumbs3 = generateBreadcrumbs(123 as any);
    expect(breadcrumbs3).toHaveLength(1);
    expect(breadcrumbs3[0]).toEqual({ label: "Home", href: "/", isActive: true });
  });

  it("should mark only the last breadcrumb as active", () => {
    const breadcrumbs = generateBreadcrumbs("/music/the-custard-screams-ep");
    
    expect(breadcrumbs[0]?.isActive).toBe(false);
    expect(breadcrumbs[1]?.isActive).toBe(false);
    expect(breadcrumbs[2]?.isActive).toBe(true);
  });

  it("should build cumulative paths correctly", () => {
    const breadcrumbs = generateBreadcrumbs("/music/the-custard-screams-ep/royal-flush");
    
    expect(breadcrumbs[0]?.href).toBe("/");
    expect(breadcrumbs[1]?.href).toBe("/music");
    expect(breadcrumbs[2]?.href).toBe("/music/the-custard-screams-ep");
    expect(breadcrumbs[3]?.href).toBe("/music/the-custard-screams-ep/royal-flush");
  });
});

describe("shouldShowBreadcrumbs", () => {
  it("should return false for home page", () => {
    expect(shouldShowBreadcrumbs("/")).toBe(false);
    expect(shouldShowBreadcrumbs("")).toBe(false);
  });

  it("should return true for nested pages", () => {
    expect(shouldShowBreadcrumbs("/music")).toBe(true);
    expect(shouldShowBreadcrumbs("/music/the-custard-screams-ep")).toBe(true);
    expect(shouldShowBreadcrumbs("/about")).toBe(true);
  });

  it("should handle trailing slashes", () => {
    expect(shouldShowBreadcrumbs("/music/")).toBe(true);
    expect(shouldShowBreadcrumbs("/")).toBe(false);
  });
});
