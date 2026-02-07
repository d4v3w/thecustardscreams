import Links from "~/components/Links";
import Section from "~/components/Section";

/**
 * About section with band information and member list
 * Feature: website-modernization
 * Requirements: 1.1, 10.2
 */
export default function AboutSection() {
  return (
    <Section id="about" className="flex flex-col items-center justify-start p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <h2 id="about-heading" className="mb-6 text-3xl font-bold text-amber-400 md:text-4xl">
          About The Custard Screams
        </h2>
        
        <p className="mb-6 text-lg text-white">
          The Custard Screams formed in Sept 2024 in London, England. It was
          originally a band to jam out riffs that didn't fit in our other bands.
          The riffage developed and the writing increased so the band decided to
          record a few demos and before they knew it they had their first EP
          complete.
        </p>

        <Links />

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-amber-400">Band Members</h3>
          <ul className="mb-6 list-inside list-disc space-y-2 text-lg text-white">
            <li>Ali - Vocals, Guitar</li>
            <li>Dave - Drums, Guitar Overdubs</li>
            <li>Neil - Bass, Backing Vocals</li>
            <li>Steve - Guitar</li>
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-bold text-amber-400">Band Info</h3>
          <p className="mb-2 text-lg text-white">
            <strong>Genres:</strong> Grunge, Heavy Rock, Punk Rock, Rock
          </p>
          <p className="text-lg text-white">
            <strong>Hometown:</strong> London, United Kingdom
          </p>
        </div>
      </div>
    </Section>
  );
}
