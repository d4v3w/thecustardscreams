import Music from "~/components/Music";
import { getCanonicalUrl } from "~/lib/metadata";

export const metadata = {
  title: "Music Downloads and Streaming",
  description: "The Custard Screams music downloads and streaming links.",
  alternates: {
    canonical: getCanonicalUrl("/music"),
  },
};

export default async function MusicPage() {
  return (
    <article className="flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-bold text-amber-400">
          The Custard Screams Music
        </h1>
        <Music />

        <article>
          <h2 className="text-xl font-bold text-amber-400">Bandcamp</h2>
          <p>
            The Custard Screams music is available right now to listen and
            download on Bandcamp for free or pay what you want to own high quality
            lossless WAV files.
          </p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:flex-wrap">
            <section className="rounded-xl">
              <iframe
                style={{ border: 0, maxWidth: 400, height: 120 }}
                title="The Custard Screams - Bandcamp - Royal Flush"
                src="https://bandcamp.com/EmbeddedPlayer/track=593440947/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
                seamless
              />
            </section>
            <section className="rounded-xl">
              <iframe
                style={{ border: 0, maxWidth: 400, height: 120 }}
                title="The Custard Screams - Bandcamp - Tomorrow"
                src="https://bandcamp.com/EmbeddedPlayer/track=2403260668/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
                seamless
              />
            </section>
            <section className="rounded-xl">
              <iframe
                style={{ border: 0, maxWidth: 400, height: 120 }}
                title="The Custard Screams - Bandcamp - Would You (Breathe)"
                src="https://bandcamp.com/EmbeddedPlayer/track=1319783194/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
                seamless
              />
            </section>
          </div>
        </article>
        <article className="mt-8 flex justify-center">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/OzE7EgHfAx8"
            title="The Custard Screams - Would You [Official Performance Video]"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </article>
      </div>
    </article>
  );
}
