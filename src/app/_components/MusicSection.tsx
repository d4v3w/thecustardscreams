import Music from "~/components/Music";
import Section from "~/components/Section";

/**
 * Music section with streaming links and music information
 * Feature: website-modernization
 * Requirements: 1.1, 5.1, 10.2
 */
export default function MusicSection() {
  return (
    <Section id="music" className="flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <h2 id="music-heading" className="mb-6 text-3xl font-bold text-amber-400 md:text-4xl">
          Music
        </h2>
        <Music />
      </div>
    </Section>
  );
}
