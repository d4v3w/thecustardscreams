import Links from "~/components/Links";
import Music from "~/components/Music";

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
