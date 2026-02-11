"use client";

import AboutSection from "./_components/AboutSection";
import HeroSection from "./_components/HeroSection";
import MusicSection from "./_components/MusicSection";
import ShowsSection from "./_components/ShowsSection";

/**
 * Single-page home with smooth scrolling sections
 * Uses NavigationContext for state management
 * Feature: website-modernization, persistent-navigation-breadcrumbs, navigation-hash-sync
 * Requirements: 1.1, 1.2, 1.3, 2.1, 3.4, 10.4, 9.7
 */
export default function HomePage() {
  // Navigation observer and hash sync now handled in NavigationContext

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: "The Custard Screams",
            url: "https://www.thecustardscreams.com",
            logo: "https://www.thecustardscreams.com/android-chrome-512x512.png",
            genre: ["Post-Hardcore", "Punk Rock", "Rock"],
            location: {
              "@type": "Place",
              name: "London",
            },
            sameAs: [
              "https://thecustardscreams.bandcamp.com/",
              "https://www.youtube.com/@TheCustardScreams",
              "https://www.instagram.com/thecustardscreams",
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "The Custard Screams",
            url: "https://www.thecustardscreams.com",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://www.thecustardscreams.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* Main content */}
      <HeroSection />
      <ShowsSection />
      <MusicSection />
      <AboutSection />

      {/* BottomNav now rendered in layout */}
    </>
  );
}

HomePage.displayName = "HomePage";
