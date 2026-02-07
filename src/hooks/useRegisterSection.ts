"use client";

import { useEffect, useRef } from "react";
import { useNavigation } from "~/contexts/NavigationContext";
import type { SectionId } from "~/lib/types";

/**
 * Hook for sections to register themselves with navigation context
 * Automatically handles registration and cleanup
 * Feature: website-modernization
 */
export function useRegisterSection(id: SectionId, order: number) {
  const { registerSection, unregisterSection } = useNavigation();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Register section on mount
    registerSection(id, sectionRef, order);

    // Unregister on unmount
    return () => {
      unregisterSection(id);
    };
  }, [id, order, registerSection, unregisterSection]);

  return sectionRef;
}
