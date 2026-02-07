export const metadata = {
  title: "Tomorrow",
  description:
    "Tomorrow song breakdown and lyrics, taken from the debut self-titled EP by The Custard Screams.",
};

export function Song({ songNavigation }: { songNavigation?: React.ReactNode }) {
  return (
    <article className="p2 md:p-3">
      <h1 className="text-xl font-bold text-amber-400">Song: Tomorrow</h1>
      
      {songNavigation}

      <p>
        Tomorrow song breakdown and lyrics, taken from the debut self-titled EP
        by The Custard Screams.
      </p>

      <blockquote className="my-4 border-l-4 border-amber-400 pl-4 italic">
        <p>
          "Tomorrow" is a song that delves into themes of anxiety and the
          struggle to maintain control over one's life. It reflects on the
          internal battles faced when trying to prevent negative emotions from
          affecting the future.
        </p>
      </blockquote>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold text-amber-400">Lyrics</h2>
        <pre className="rounded-lg bg-gray-100 p-4 whitespace-pre-wrap text-black">
          It's a little too late to wonder why Unsaid conversations live in my
          mind Endless loop of words I couldn't say It's a little too late to
          save today So I say oh no Won't infect tomorrow Constant feelings I
          have that I despise Can't form words for what's inside I become what I
          don't recognise Can't save today but I will try To say oh no Won't
          infect tomorrow I say oh no Won't infect tomorrow Wish I could take
          control of my life Isolate all the bad shit I have inside This anxiety
          makes me Feel like I'm going crazy So I say oh no Don't infect
          tomorrow You won't Infect tomorrow I won't reject tomorrow
        </pre>
      </section>
    </article>
  );
}
