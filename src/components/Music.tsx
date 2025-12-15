import Socials from "./Socials";

const Music = () => (
  <>
    <article className="p-2 md:p-3">
      <h2 className="text-xl font-bold text-amber-400">
        Available on all streaming platforms
      </h2>
      <p>
        The Custard Screams are avilable to stream on Spotify, Apple, Amazon and
        Youtube.
      </p>

      <Socials type="streaming" />
    </article>
    <article className="p-2 md:p-3">
      <h2 className="text-xl font-bold text-amber-400">Bandcamp</h2>
      <p>
        The Custard Screams are avilable to listen and download on Bandcamp now!
      </p>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:flex-wrap">
        <section className="rounded-xl">
          <iframe
            style={{ border: 0, maxWidth: 400, height: 120 }}
            title="The Custard Screams - Bandcamp - Royal Flush"
            src="https://bandcamp.com/EmbeddedPlayer/track=593440947/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
            seamless
          >
            <a href="https://thecustardscreams.bandcamp.com/track/royal-flush">
              Royal Flush by The Custard Screams
            </a>
          </iframe>
        </section>
        <section className="rounded-xl">
          <iframe
            style={{ border: 0, maxWidth: 400, height: 120 }}
            title="The Custard Screams - Bandcamp - Tomorrow"
            src="https://bandcamp.com/EmbeddedPlayer/track=2403260668/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
            seamless
          >
            <a href="https://thecustardscreams.bandcamp.com/track/tomorrow">
              Tomorrow by The Custard Screams
            </a>
          </iframe>
        </section>
        <section className="rounded-xl">
          <iframe
            style={{ border: 0, maxWidth: 400, height: 120 }}
            title="The Custard Screams - Bandcamp - Would You (Breathe)"
            src="https://bandcamp.com/EmbeddedPlayer/track=1319783194/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
            seamless
          >
            <a href="https://thecustardscreams.bandcamp.com/track/would-you-breathe">
              Would You (Breathe) by The Custard Screams
            </a>
          </iframe>
        </section>
      </div>
    </article>
  </>
);

Music.displayName = "Music";
export default Music;
