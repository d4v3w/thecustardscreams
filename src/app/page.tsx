import Links from "~/components/Links";
import Music from "~/components/Music";

export const metadata = {
  title: "The Custard Screams",
  description:
    "The Custard Screams from London, England. Grunge, Heavy Rock, Punk Rock, Rock band.",
};
export default function HomePage() {
  return (
    <>
      <Links />
      <main>
        <Music />
      </main>
    </>
  );
}

HomePage.displayName = "HomePage";
