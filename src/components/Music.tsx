import Link from "next/link";
import Socials from "./Socials";

const Music = () => (
  <article className="p-2 md:p-3">
    <h2 className="text-xl font-bold text-amber-400">
      The Custard Screams EP - Available on all streaming platforms
    </h2>
    <p>
      The Custard Screams are available to stream on Spotify, Apple, Amazon and
      Youtube. For more download and steaming options visit the{" "}
      <Link href="/music" className="text-amber-400 underline">
        Music page
      </Link>
      .
    </p>

    <Socials type="streaming" />
  </article>
);

Music.displayName = "Music";
export default Music;
