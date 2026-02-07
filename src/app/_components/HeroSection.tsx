import Link from "next/link";
import Section from "~/components/Section";

/**
 * Home section with band introduction and next show banner
 * Feature: website-modernization
 * Requirements: 1.1, 5.1, 10.2
 */
export default function HeroSection() {
  return (
    <Section id="home" className="flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        {/* Band Logo */}
        <div className="mb-6 text-center md:mb-8">
          <img
            src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
            srcSet="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x, https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
            alt="The Custard Screams logo"
            width={250}
            className="mx-auto h-40 w-40 rounded-full sm:h-50 sm:w-50 lg:h-60 lg:w-60"
          />
        </div>

        {/* Band Name */}
        <h1 id="home-heading" className="mb-4 text-center text-4xl font-bold text-amber-400 md:text-5xl lg:text-6xl">
          The Custard Screams
        </h1>

        <p className="mb-8 text-center text-lg text-white md:text-xl">
          London based Post Hardcore Punk Rock Band
        </p>

        {/* Band Photo */}
        <img
          src="https://punkrockmag.com/wp-content/uploads/2025/12/custard-screams-band.jpg"
          alt="The Custard Screams band photo, four members standing in a rehearsal studio."
          className="mb-6 w-full rounded-xl"
        />

        {/* Featured Quote */}
        <blockquote className="border-l-4 border-amber-400 pl-4 italic text-white">
          "The Custard Screams' new three-track ST/EP feels like a solid snapshot
          of where the band is right now. Rooted in punk rock, the songs don't
          rely on speed alone—they breathe, groove, and give space for the message
          to land. It's straightforward music, but it's tight, well-executed, and
          honest, which makes it stick." –{" "}
          <Link 
            href="https://punkrockmag.com/2025/12/14/the-custard-scream/"
            className="text-amber-400 underline hover:text-amber-500"
          >
            Punk Rock Magazine
          </Link>
        </blockquote>
      </div>
    </Section>
  );
}
