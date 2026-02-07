"use client";

import { usePathname, useRouter } from "next/navigation";
import type { BottomNavProps } from "~/lib/types";
import { SECTIONS } from "~/lib/types";
import NavItem from "./NavItem";

/**
 * Fixed bottom navigation bar with section links
 * Highlights active section and provides smooth scroll navigation
 * Feature: website-modernization, persistent-navigation-breadcrumbs
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 1.3, 1.4, 6.1, 6.2, 6.3
 */
export default function BottomNav({
  activeSection,
  onNavigate,
}: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const handleNavigate = (sectionId: string) => {
    if (isHomePage) {
      // On home page: use existing scroll behavior
      onNavigate(sectionId as any);
    } else {
      // On nested page: navigate to home with section anchor
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-around gap-2 px-2 py-2">
        {SECTIONS.map((section) => {
          // Map section IDs to icon types
          const iconType = section.id === "home" ? "home" : section.id;
          
          return (
            <NavItem
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              onClick={() => handleNavigate(section.id)}
              iconType={iconType as "home" | "music" | "shows" | "about"}
            />
          );
        })}
      </div>
    </nav>
  );
}
