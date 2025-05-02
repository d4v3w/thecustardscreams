import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-black bg-[url(https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX11TVvcM2zyFK0ROkwl3WSGv8XHuon7LfdbVrj)] bg-contain bg-no-repeat">
      <div className="bk-center flex min-h-screen flex-col items-center justify-center bg-black opacity-90">
        <main className="container flex flex-col items-center justify-center gap-12 bg-black px-4 py-16 text-white opacity-100">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            The <span className="text-amber-400">Custard</span> Screams
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://www.instagram.com/thecustardscreams"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-amber-400">
                Next Live Show →
              </h3>
              <div className="text-lg">
                May 31st 2025 - Freaks and Geeks
                <br /> Stratford, London
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://instagram.thecustardscreams.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-amber-400">Instagram →</h3>
              <div className="text-lg">@thecustardscreams</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://facebook.thecustardscreams.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-amber-400">Facebook →</h3>
              <div className="text-lg">@thecustardscreams</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://tiktok.thecustardscreams.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-amber-400">TikTok →</h3>
              <div className="text-lg">@the.custard.screams</div>
            </Link>
          </div>
        </main>
        <footer className="flex flex-col items-center text-white opacity-50">
          Copyright &copy; {new Date().getFullYear()} The Custard Screams
        </footer>
      </div>
    </div>
  );
}
