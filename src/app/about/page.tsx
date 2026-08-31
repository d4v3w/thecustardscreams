import Link from "next/link";
import Links from "~/components/Links";
import { CookieSettingsLink } from "~/components/cookie/CookieSettingsLink";
import { getCanonicalUrl } from "~/lib/metadata";

export const metadata = {
  title: "About Us",
  description: "Learn more about The Custard Screams.",
  alternates: {
    canonical: getCanonicalUrl("/about"),
  },
};

export default async function AboutPage() {
  return (
    <article className="flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-bold text-amber-400">
          About The Custard Screams
        </h1>
        <p>
          The Custard Screams formed in Sept 2024 in London, England. It was
          originally a band to jam out riffs that didn't fit in our other bands.
          The riffage developed and the writing increased so the band decided to
          record a few demos and before they knew it they had their first EP
          complete.
        </p>
        <Links />

        <section>
          <h2 className="mt-4 text-lg font-bold text-amber-600">Band Members</h2>
          <ul className="list-inside list-disc">
            <li>Ali - Vocals, Guitar</li>
            <li>Dave - Drums, Guitar Overdubs</li>
            <li>Neil - Bass, Backing Vocals</li>
            <li>Steve - Guitar</li>
          </ul>
        </section>
        <h2 className="mt-4 text-lg font-bold text-amber-600">Band Info</h2>
        <p>
          <strong>Genres:</strong> Grunge, Heavy Rock, Punk Rock, Rock
        </p>
        <p>
          <strong>Hometown:</strong> London, United Kingdom
        </p>

        {/*
          Reachable with a single nav tap, regardless of scroll position -
          GDPR requires cookie preferences stay accessible, so this can't
          depend on scrolling all the way to the footer.
        */}
        <h2 className="mt-4 text-lg font-bold text-amber-600">
          Privacy &amp; Cookies
        </h2>
        <p>
          We use cookies to analyze site traffic and improve your experience.
          Read our{" "}
          <Link href="/privacy-policy" className="text-amber-400 underline">
            Privacy Policy
          </Link>{" "}
          or update your preferences at any time.
        </p>
        <CookieSettingsLink />
      </div>
    </article>
  );
}
