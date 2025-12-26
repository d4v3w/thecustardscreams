import type { Metadata } from "next";
import Link from "next/dist/client/link";
import { getCanonicalUrl } from "~/lib/metadata";

const validSongs = ["royal-flush", "tomorrow", "would-you"];

// Convert slug to display name (e.g., "royal-flush" -> "Royal Flush")
function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function generateStaticParams() {
  return validSongs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!validSongs.includes(slug)) {
    return {
      title: "Song Not Found",
    };
  }

  const songTitle = formatSlugToTitle(slug);
  const pathname = `/music/the-custard-screams-ep/${slug}`;

  return {
    title: `${songTitle}`,
    description: `${songTitle} song breakdown and lyrics, taken from the debut self-titled EP by The Custard Screams.`,
    alternates: {
      canonical: getCanonicalUrl(pathname),
    },
  };
}

export default async function SongPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!validSongs.includes(slug)) {
    return (
      <article className="p2 md:p-3">
        <h1 className="text-xl font-bold text-amber-400">
          404 - Song Not Found
        </h1>
        <p>The song "{slug}" could not be found.</p>
      </article>
    );
  }

  const { Song: SongComponent } = await import(`../songs/${slug}`);

  return (
    <>
      <ol className="inline-sep m-3">
        <li>
          <Link
            href="/music/the-custard-screams-ep/royal-flush"
            className="text-amber-400 underline"
          >
            Royal Flush
          </Link>
        </li>
        <li>
          <Link
            href="/music/the-custard-screams-ep/would-you"
            className="text-amber-400 underline"
          >
            Would You
          </Link>
        </li>
        <li>
          <Link
            href="/music/the-custard-screams-ep/tomorrow"
            className="text-amber-400 underline"
          >
            Tomorrow
          </Link>
        </li>
      </ol>
      <SongComponent />
      <p>
        <Link href="/music/the-custard-screams-ep">
          Read more about{" "}
          <span className="text-amber-400">The Custard Screams EP</span> here
        </Link>
        .
      </p>
    </>
  );
}
