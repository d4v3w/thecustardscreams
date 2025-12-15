import Music from "~/components/Music";

export const metadata = {
  title: "The Custard Screams",
  description:
    "The Custard Screams from London, England. Grunge, Heavy Rock, Punk Rock, Rock band.",
};
export default function HomePage() {
  return (
    <article className="p2 md:p-3">
      <h2 className="text-xl font-bold text-amber-400">The Custard Screams</h2>
      <Music />
    </article>
  );
}

HomePage.displayName = "HomePage";
