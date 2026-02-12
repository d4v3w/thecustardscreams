"use client";

import Footer from "~/components/Footer";
import Nav from "~/components/navigation/Nav";
import { useNavigation } from "~/contexts/NavigationContext";

/**
 * Client-side layout wrapper for navigation
 * Feature: website-modernization, persistent-navigation-breadcrumbs
 * Requirements: 13.1, 1.1, 4.1, 4.7, 9.1
 */
export function LayoutClient({ children }: { children: React.ReactNode }) {
  const { currentSection, navigateToSection } = useNavigation();

  return (
    <>
      <div className="pb-24">
        {children}
        <Footer />
      </div>
      <Nav activeSection={currentSection} onNavigate={navigateToSection} />
    </>
  );
}

LayoutClient.displayName = "LayoutClient";
