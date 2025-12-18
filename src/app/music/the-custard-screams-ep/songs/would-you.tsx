export const metadata = {
  title: "Would You - The Custard Screams",
  description:
    "Would You song breakdown and lyrics, taken from the debut self-titled EP by The Custard Screams.",
};

export function Song() {
  return (
    <article className="p2 md:p-3">
      <h1 className="text-xl font-bold text-amber-400">
        Song: Would You - The Custard Screams
      </h1>

      <p>
        Would You song breakdown and lyrics, taken from the debut self-titled EP
        by The Custard Screams.
      </p>

      <blockquote className="my-4 border-l-4 border-amber-400 pl-4 italic">
        <p>
          "Would You" is a powerful track that questions commitment and
          challenges the listener to consider what they would do in difficult
          circumstances.
        </p>
      </blockquote>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold text-amber-400">Lyrics</h2>
        <pre className="rounded-lg bg-gray-100 p-4 whitespace-pre-wrap text-black">
          Loosen your grip on my chest Would you Give me peace and finally rest
          Would you Let me live, let me live again Would you Break the bars off
          of my cell Would you Could you Let me breathe Would you Finally close
          those watching eyes Would you Remove that legacy disguise Would you
          Don't make me, don't make me regret Would you Believe that I don't
          want to forget Would you Could you Set me free Would you Panicking
          Falling down It's gripping It's gripping and I can't breathe I'm
          condemning myself I'm condemning myself Breathe, breathe I'm
          condemning myself I'm the warden of my own cell Breathe Would you
          Could you Would you Could you Would you Let me breathe Would you
        </pre>
      </section>
    </article>
  );
}
