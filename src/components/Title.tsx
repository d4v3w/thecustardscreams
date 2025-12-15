import Link from "next/link";

export const Title = () => (
  <>
    <header className="mb-2 md:mb-3">
      <h1>
        <Link href="/">
          <span className="sr-only">The Custard Screams</span>
          <img
            src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
            srcSet="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x, https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
            alt="The Custard Screams logo"
            width={250}
            className="mx-auto h-40 w-40 rounded-full sm:h-50 sm:w-50 md:mx-0 lg:h-60 lg:w-60"
          />
        </Link>
      </h1>
    </header>

    <nav className="mb-2 flex w-full gap-3 md:mb-3">
      <Link
        className="flex-1 flex-col gap-0 rounded-xl bg-white/10 p-3 text-white hover:bg-yellow-900"
        href="/"
      >
        Home
      </Link>
      <Link
        className="flex-1 flex-col gap-0 rounded-xl bg-white/10 p-3 text-white hover:bg-yellow-900"
        href="/music"
      >
        Music
      </Link>
      <Link
        className="flex-1 flex-col gap-0 rounded-xl bg-white/10 p-3 text-white hover:bg-yellow-900"
        href="/live-shows"
      >
        Shows
      </Link>
      <Link
        className="flex-1 flex-col gap-0 rounded-xl bg-white/10 p-3 text-white hover:bg-yellow-900"
        href="/about"
      >
        About
      </Link>
    </nav>

    <article className="mb-3 flex flex-col items-center gap-3 md:flex-row md:flex-wrap">
      <Link
        className="w-full flex-grow flex-col gap-1 rounded-xl bg-yellow-400 p-3 text-white hover:bg-yellow-500"
        href="https://www.instagram.com/thecustardscreams"
        target="_blank"
      >
        <h3 className="text-xl font-bold text-amber-900">Next Live Show →</h3>
        <div className="text-lg font-bold text-black">
          November 21st 2025 - Freaks and Geeks
          <br /> Stratford, London
        </div>
      </Link>
    </article>
  </>
);

Title.displayName = "Title";
export default Title;
