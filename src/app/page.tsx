"use client";

import { useEffect } from "react";
import BottomNav from "~/components/navigation/BottomNav";
import Footer from "~/components/Footer";
import { useNavigation } from "~/contexts/NavigationContext";
import { useNavigationObserver } from "~/hooks/useNavigationObserver";
import AboutSection from "./_components/AboutSection";
import HeroSection from "./_components/HeroSection";
import MusicSection from "./_components/MusicSection";
import ShowsSection from "./_components/ShowsSection";

/**
 * Single-page home with smooth scrolling sections
 * Uses NavigationContext for state management
 * Feature: website-modernization
 * Requirements: 1.1, 1.2, 1.3, 2.1, 3.4, 10.4
 */
export default function HomePage() {
  const { currentSection, navigateToSection } = useNavigation();

  // Set up intersection observer to track active section
  useNavigationObserver({
    threshold: 0.3,
    rootMargin: "-80px 0px -80px 0px",
  });

  // Handle initial hash navigation
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.slice(1);
      if (hash) {
        // Small delay to ensure sections are registered
        setTimeout(() => {
          navigateToSection(hash as any);
        }, 100);
      }
    }
  }, [navigateToSection]);

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
      <MusicSection />
      <ShowsSection />
      <AboutSection />
      
      {/* Footer - outside scroll-snap flow */}
      <div className="pb-20">
        <Footer />
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeSection={currentSection} onNavigate={navigateToSection} />
    </>
  );
}

HomePage.displayName = "HomePage";
