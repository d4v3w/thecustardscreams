import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            The Custard Screams
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://instagram.thecustardscreams.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Share with our Socials →</h3>
              <div className="text-lg">@thecustardscreams</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://www.instagram.com/thecustardscreams"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">The Custard Screams Live →</h3>
              <div className="text-lg">
                May 31st 2025 - Freaks and Geeks - Stratford, London
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer>Copyright (c) 2025 The Custard Screams</footer>
    </>
  );
}
