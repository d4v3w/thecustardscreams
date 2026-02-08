"use client";

import Section from "~/components/Section";
import Shows from "~/components/Shows";
import { ConditionalBandsintownWidget } from "~/components/cookie/ConditionalBandsintownWidget";

/**
 * Shows section with Bandsintown widget and past shows gallery
 * Feature: website-modernization, gdpr-cookie-compliance-enhancement
 * Requirements: 1.1, 1.2, 1.5, 3.2, 10.2
 */
export default function ShowsSection() {
  return (
    <Section id="shows" className="flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <h2 id="shows-heading" className="mb-6 text-3xl font-bold text-amber-400 md:text-4xl">
          Live Shows
        </h2>
        
        {/* Upcoming Shows - Bandsintown Widget (conditional on marketing consent) */}
        <div className="mb-8">
          <h3 className="mb-4 text-xl font-bold text-amber-400">Upcoming Shows</h3>
          <p className="mb-4 text-white">
            Come and see The Custard Screams play live at these upcoming shows
          </p>
          <ConditionalBandsintownWidget artistId="id_15623695" />
        </div>

        {/* Past Shows */}
        <Shows />
      </div>
    </Section>
  );
}
