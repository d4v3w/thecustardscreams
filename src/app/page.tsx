import Link from "next/link";
import Music from "~/components/Music";

export const metadata = {
  title: "The Custard Screams",
  description:
    "The Custard Screams from London, England. Grunge, Heavy Rock, Punk Rock, Rock band.",
};
export default function HomePage() {
  return (
    <article className="p2 md:p-3">
      <Music />
      <img
        src="https://punkrockmag.com/wp-content/uploads/2025/12/custard-screams-band.jpg"
        alt="The Custard Screams Band Photo 2025"
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
