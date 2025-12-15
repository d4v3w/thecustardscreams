import Links from "~/components/Links";

export const metadata = {
  title: "About Us - The Custard Screams",
  description: "Learn more about The Custard Screams.",
};

export default async function AboutPage() {
  return (
    <article className="p2 md:p-3">
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
    </article>
  );
}
