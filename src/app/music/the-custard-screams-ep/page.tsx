import Link from "next/link";
import { getCanonicalUrl } from "~/lib/metadata";

export const metadata = {
  title: "The Custard Screams EP",
  description:
    "The Custard Screams debut self-titled EP, available on all major streaming platforms - with song-by-song breakdowns and lyrics.",
  alternates: {
    canonical: getCanonicalUrl("/music/the-custard-screams-ep"),
  },
};

export default async function EPPage() {
  return (
    <article className="flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-bold text-amber-400">
          The Custard Screams EP
        </h1>
      <p>
        The Custard Screams debut self titled EP - "The Custard Screams EP" is
        available on all major streaming platforms. Follow the links below
        for detailed breakdown and lyrics for each song on the record.
      </p>
      <ol className="m-3 list-decimal pl-6">
        <li>
          <Link
            href="/music/the-custard-screams-ep/royal-flush"
            className="text-amber-400 underline"
          >
            Royal Flush
          </Link>
        </li>
        <li>
          <Link
            href="/music/the-custard-screams-ep/would-you"
            className="text-amber-400 underline"
          >
            Would You
          </Link>
        </li>
        <li>
          <Link
            href="/music/the-custard-screams-ep/tomorrow"
            className="text-amber-400 underline"
          >
            Tomorrow
          </Link>
        </li>
      </ol>

      <div className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
          srcSet="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x, https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
          alt="The Custard Screams logo"
          width={250}
          className="mx-auto h-40 w-40 rounded-full sm:h-50 sm:w-50 md:mx-0 lg:h-60 lg:w-60"
        />
      </div>
      </div>
    </article>
  );
}
