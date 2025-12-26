import Link from "next/link";
import Music from "~/components/Music";
import { getCanonicalUrl } from "~/lib/metadata";

export const metadata = {
  title: "The Custard Screams",
  description:
    "The Custard Screams from London, England. Grunge, Heavy Rock, Punk Rock, Rock band.",
  alternates: {
    canonical: getCanonicalUrl("/"),
  },
  openGraph: {
    images: [
      {
        url: "https://punkrockmag.com/wp-content/uploads/2025/12/custard-screams-band.jpg",
        width: 1200,
        height: 630,
        alt: "The Custard Screams band photo, four members standing in a rehearsal studio.",
      },
    ],
  },
};

export default function HomePage() {
  const jsonLd = {
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
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Custard Screams",
    url: "https://www.thecustardscreams.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.thecustardscreams.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <article className="p2 md:p-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Music />
      <img
        src="https://punkrockmag.com/wp-content/uploads/2025/12/custard-screams-band.jpg"
        alt="The Custard Screams band photo, four members standing in a rehearsal studio."
        className="my-4 w-full rounded-xl"
      />
      <blockquote className="border-l-4 border-amber-400 pl-4 italic">
        "The Custard Screams’ new three-track ST/EP feels like a solid snapshot
        of where the band is right now. Rooted in punk rock, the songs don’t
        rely on speed alone—they breathe, groove, and give space for the message
        to land. It’s straightforward music, but it’s tight, well-executed, and
        honest, which makes it stick.” –{" "}
        <Link href="https://punkrockmag.com/2025/12/14/the-custard-scream/">
          Punk Rock Magazine
        </Link>
      </blockquote>
    </article>
  );
}

HomePage.displayName = "HomePage";
