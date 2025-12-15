import Music from "~/components/Music";

export const metadata = {
  title: "Music Downloads and Streaming - The Custard Screams",
  description: "The Custard Screams music downloads and streaming links.",
};

export default async function MusicPage() {
  return (
    <article className="p2 md:p-3">
      <h1 className="text-xl font-bold text-amber-400">
        About Custard Screams
      </h1>
      <Music />

      <div className="mt-8 flex justify-center">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/BR6U5TuXlAM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      </div>
    </article>
  );
}
