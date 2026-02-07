"use client";

import BottomNav from "~/components/navigation/BottomNav";
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
      {children}
      <BottomNav activeSection={currentSection} onNavigate={navigateToSection} />
    </>
  );
}

LayoutClient.displayName = "LayoutClient";
