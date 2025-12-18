export const metadata = {
  title: "Royal Flush - The Custard Screams",
  description:
    "Royal Flush song breakdown and lyrics, taken from the debut self-titled EP by The Custard Screams.",
};

export function Song() {
  return (
    <article className="p2 md:p-3">
      <h1 className="text-xl font-bold text-amber-400">
        Song: Royal Flush - The Custard Screams
      </h1>

      <p>
        Royal Flush song breakdown and lyrics, taken from the debut self-titled
        EP by The Custard Screams.
      </p>

      <blockquote className="my-4 border-l-4 border-amber-400 pl-4 italic">
        <p>
          "Royal Flush" is a song that delves into themes of chance, risk, and
          the allure of high stakes. The lyrics metaphorically compare life and
          relationships to a game of poker, where one must decide when to hold
          on and when to fold. The song captures the tension and excitement of
          taking risks, while also reflecting on the consequences that come with
          those choices.
        </p>
      </blockquote>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold text-amber-400">Lyrics</h2>
        <pre className="rounded-lg bg-gray-100 p-4 whitespace-pre-wrap text-black">
          Bow the head and drop the knee Proclaim your deepest loyalty Give it
          all to king and queen The NHS funds the royalty Not a lick of taxes
          paid You fund their estate Every time you state You feel the need to
          regurgitate Empty prisons, M.O.D Join the army, pay rent to the
          Landlord, commander in chief Train to defend costs a monthly fee Not a
          lick of taxes paid You fund their estate Every time you state You feel
          the need to throw a grenade I can see their happy faces 37 mill for
          all those empty places Who would hate this Its time to say enough Stop
          profiting from all our fuckin stuff These times are tough it’s a royal
          flush Its time to say enough Stop profiting from all our fuckin stuff
          These times are tough it’s a royal flush
        </pre>
      </section>
    </article>
  );
}
