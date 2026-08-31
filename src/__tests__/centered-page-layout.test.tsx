/**
 * Centered Page Layout Tests
 * 
 * Phase 1: Bug Condition Exploration
 * Tests that music, live-shows, and about pages have the centered layout pattern
 * with flex centering, max-width constraint, and responsive padding.
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 * EXPECTED OUTCOME ON UNFIXED CODE: Test FAILS
 * 
 * Phase 2: Preservation Testing
 * Tests that non-buggy pages (home, privacy policy) maintain their existing layout
 * and that embedded content, semantic HTML, and metadata are preserved.
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 * EXPECTED OUTCOME ON UNFIXED CODE: Tests PASS
 */

import { render } from "@testing-library/react";
import AboutPage from "~/app/about/page";
import LiveShowsPage from "~/app/live-shows/page";
import MusicPage from "~/app/music/page";
import PrivacyPolicyPage from "~/app/privacy-policy/page";

describe("Centered Page Layout - Bug Condition Exploration", () => {
  describe("Music Page Layout", () => {
    it("should have flex centering classes on outer article", async () => {
      const { container } = render(await MusicPage());
      const article = container.querySelector("article");
      
      expect(article).toHaveClass("flex");
      expect(article).toHaveClass("flex-col");
      expect(article).toHaveClass("items-center");
      expect(article).toHaveClass("justify-center");
    });

    it("should have responsive padding p-4 md:p-6 on outer article", async () => {
      const { container } = render(await MusicPage());
      const article = container.querySelector("article");
      
      expect(article).toHaveClass("p-4");
      expect(article).toHaveClass("md:p-6");
    });

    it("should have max-w-4xl wrapper constraint", async () => {
      const { container } = render(await MusicPage());
      const maxWidthWrapper = container.querySelector(".max-w-4xl");
      
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it("should NOT have incorrect padding p2 md:p-3", async () => {
      const { container } = render(await MusicPage());
      const article = container.querySelector("article");
      
      // p2 is not a valid Tailwind class, but checking for p-2 and md:p-3
      expect(article).not.toHaveClass("p-2");
      expect(article).not.toHaveClass("md:p-3");
    });
  });

  describe("Live Shows Page Layout", () => {
    it("should have flex centering classes on outer article", async () => {
      const { container } = render(await LiveShowsPage());
      const article = container.querySelector("article");
      
      expect(article).toHaveClass("flex");
      expect(article).toHaveClass("flex-col");
      expect(article).toHaveClass("items-center");
      expect(article).toHaveClass("justify-center");
    });

    it("should have responsive padding p-4 md:p-6 on outer article", async () => {
      const { container } = render(await LiveShowsPage());
      const article = container.querySelector("article");
      
      expect(article).toHaveClass("p-4");
      expect(article).toHaveClass("md:p-6");
    });

    it("should have max-w-4xl wrapper constraint", async () => {
      const { container } = render(await LiveShowsPage());
      const maxWidthWrapper = container.querySelector(".max-w-4xl");
      
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it("should NOT have incorrect padding p2 md:p-3", async () => {
      const { container } = render(await LiveShowsPage());
      const article = container.querySelector("article");
      
      expect(article).not.toHaveClass("p-2");
      expect(article).not.toHaveClass("md:p-3");
    });
  });

  describe("About Page Layout", () => {
    it("should have flex centering classes on outer article", async () => {
      const { container } = render(await AboutPage());
      const article = container.querySelector("article");
      
      expect(article).toHaveClass("flex");
      expect(article).toHaveClass("flex-col");
      expect(article).toHaveClass("items-center");
      expect(article).toHaveClass("justify-center");
    });

    it("should have responsive padding p-4 md:p-6 on outer article", async () => {
      const { container } = render(await AboutPage());
      const article = container.querySelector("article");
      
      expect(article).toHaveClass("p-4");
      expect(article).toHaveClass("md:p-6");
    });

    it("should have max-w-4xl wrapper constraint", async () => {
      const { container } = render(await AboutPage());
      const maxWidthWrapper = container.querySelector(".max-w-4xl");
      
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it("should NOT have incorrect padding p2 md:p-3", async () => {
      const { container } = render(await AboutPage());
      const article = container.querySelector("article");
      
      expect(article).not.toHaveClass("p-2");
      expect(article).not.toHaveClass("md:p-3");
    });
  });

  describe("Property-Based: All Pages Have Consistent Centered Layout", () => {
    it("should verify music page has the centered layout pattern", async () => {
      const { container } = render(await MusicPage());
      const article = container.querySelector("article");
      const maxWidthWrapper = container.querySelector(".max-w-4xl");

      // Music page should have flex centering
      expect(article).toHaveClass("flex");
      expect(article).toHaveClass("flex-col");
      expect(article).toHaveClass("items-center");
      expect(article).toHaveClass("justify-center");

      // Music page should have responsive padding
      expect(article).toHaveClass("p-4");
      expect(article).toHaveClass("md:p-6");

      // Music page should have max-width constraint
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it("should verify live-shows page has the centered layout pattern", async () => {
      const { container } = render(await LiveShowsPage());
      const article = container.querySelector("article");
      const maxWidthWrapper = container.querySelector(".max-w-4xl");

      // Live shows page should have flex centering
      expect(article).toHaveClass("flex");
      expect(article).toHaveClass("flex-col");
      expect(article).toHaveClass("items-center");
      expect(article).toHaveClass("justify-center");

      // Live shows page should have responsive padding
      expect(article).toHaveClass("p-4");
      expect(article).toHaveClass("md:p-6");

      // Live shows page should have max-width constraint
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it("should verify about page has the centered layout pattern", async () => {
      const { container } = render(await AboutPage());
      const article = container.querySelector("article");
      const maxWidthWrapper = container.querySelector(".max-w-4xl");

      // About page should have flex centering
      expect(article).toHaveClass("flex");
      expect(article).toHaveClass("flex-col");
      expect(article).toHaveClass("items-center");
      expect(article).toHaveClass("justify-center");

      // About page should have responsive padding
      expect(article).toHaveClass("p-4");
      expect(article).toHaveClass("md:p-6");

      // About page should have max-width constraint
      expect(maxWidthWrapper).toBeInTheDocument();
    });
  });
});

describe("Centered Page Layout - Preservation Testing", () => {
  describe("Privacy Policy Page Preservation", () => {
    it("should preserve privacy policy page structure", async () => {
      const { container } = render(await PrivacyPolicyPage());
      
      // Check for main heading
      const h1 = container.querySelector("h1");
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain("Privacy Policy");
    });

    it("should preserve privacy policy page semantic sections", async () => {
      const { container } = render(await PrivacyPolicyPage());
      
      // Check for section elements
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
      
      // Check for specific section headings
      const h2Elements = container.querySelectorAll("h2");
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it("should preserve privacy policy page max-width constraint", async () => {
      const { container } = render(await PrivacyPolicyPage());
      const maxWidthWrapper = container.querySelector(".max-w-4xl");
      
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it("should preserve privacy policy page back link", async () => {
      const { container } = render(await PrivacyPolicyPage());
      const allLinks = container.querySelectorAll('a[href="/"]');
      
      // Find the link that contains "Back to Home" text
      let backLink = null;
      allLinks.forEach((link) => {
        if (link.textContent?.includes("Back to Home")) {
          backLink = link;
        }
      });
      
      expect(backLink).toBeInTheDocument();
      expect(backLink?.textContent).toContain("Back to Home");
    });

    it("should preserve privacy policy page external links", async () => {
      const { container } = render(await PrivacyPolicyPage());
      
      // Check for Google Privacy Policy link
      const googleLink = container.querySelector('a[href*="policies.google.com"]');
      expect(googleLink).toBeInTheDocument();
      
      // Check for Bandsintown Privacy Policy link
      const bandsinLink = container.querySelector('a[href*="bandsintown.com/privacy"]');
      expect(bandsinLink).toBeInTheDocument();
    });
  });

  describe("Embedded Content Preservation", () => {
    it("should preserve Bandcamp iframes on music page", async () => {
      const { container } = render(await MusicPage());
      
      // Check for Bandcamp iframes
      const iframes = container.querySelectorAll('iframe[title*="Bandcamp"]');
      expect(iframes.length).toBeGreaterThan(0);
      
      // Verify iframe attributes
      iframes.forEach((iframe) => {
        expect(iframe).toHaveAttribute("src");
        expect(iframe.getAttribute("src")).toContain("bandcamp.com");
      });
    });

    it("should preserve YouTube embed on music page", async () => {
      const { container } = render(await MusicPage());
      
      // Check for YouTube iframe by title - look for "Official Performance Video"
      const youtubeIframe = container.querySelector('iframe[title*="Official Performance Video"]');
      expect(youtubeIframe).toBeInTheDocument();
      expect(youtubeIframe).toHaveAttribute("src");
      expect(youtubeIframe?.getAttribute("src")).toContain("youtube.com");
    });

    it("should preserve Bandsintown widget script on live-shows page", async () => {
      const { container } = render(await LiveShowsPage());
      
      // Check for Bandsintown widget script
      const script = container.querySelector('script[src*="bandsintown"]');
      expect(script).toBeInTheDocument();
      
      // Check for widget initializer element
      const widgetInit = container.querySelector(".bit-widget-initializer");
      expect(widgetInit).toBeInTheDocument();
    });
  });

  describe("Semantic HTML Structure Preservation", () => {
    it("should preserve semantic structure on music page", async () => {
      const { container } = render(await MusicPage());
      
      // Check for article elements
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBeGreaterThan(0);
      
      // Check for heading hierarchy
      const h1 = container.querySelector("h1");
      const h2 = container.querySelector("h2");
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    it("should preserve semantic structure on live-shows page", async () => {
      const { container } = render(await LiveShowsPage());
      
      // Check for article elements
      const articles = container.querySelectorAll("article");
      expect(articles.length).toBeGreaterThan(0);
      
      // Check for heading hierarchy
      const h1 = container.querySelector("h1");
      const h2 = container.querySelector("h2");
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    it("should preserve semantic structure on about page", async () => {
      const { container } = render(await AboutPage());
      
      // Check for article element
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
      
      // Check for section element
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
      
      // Check for heading hierarchy
      const h1 = container.querySelector("h1");
      const h2 = container.querySelector("h2");
      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    it("should preserve list structure on about page", async () => {
      const { container } = render(await AboutPage());
      
      // Check for unordered list
      const ul = container.querySelector("ul");
      expect(ul).toBeInTheDocument();
      
      // Check for list items
      const listItems = container.querySelectorAll("li");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("Page Metadata Preservation", () => {
    it("should preserve music page metadata", async () => {
      const { container } = render(await MusicPage());

      // Check for page title in heading
      const h1 = container.querySelector("h1");
      expect(h1?.textContent).toContain("The Custard Screams Music");
    });

    it("should preserve live-shows page metadata", async () => {
      const { container } = render(await LiveShowsPage());
      
      // Check for page title in heading
      const h1 = container.querySelector("h1");
      expect(h1?.textContent).toContain("Custard Screams Live Shows");
    });

    it("should preserve about page metadata", async () => {
      const { container } = render(await AboutPage());
      
      // Check for page title in heading
      const h1 = container.querySelector("h1");
      expect(h1?.textContent).toContain("About The Custard Screams");
    });
  });

  describe("Property-Based: Preservation Across All Non-Buggy Pages", () => {
    it("should preserve privacy policy page structure", async () => {
      const { container } = render(await PrivacyPolicyPage());
      
      // Verify consistent structure
      const h1 = container.querySelector("h1");
      expect(h1?.textContent).toContain("Privacy Policy");
      
      const maxWidthWrapper = container.querySelector(".max-w-4xl");
      expect(maxWidthWrapper).toBeInTheDocument();
    });

    it("should preserve embedded content on music page", async () => {
      const { container } = render(await MusicPage());
      
      // Verify Bandcamp iframes are preserved
      const bandcampIframes = container.querySelectorAll('iframe[title*="Bandcamp"]');
      expect(bandcampIframes.length).toBeGreaterThan(0);
    });
  });
});
