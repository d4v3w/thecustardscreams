/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-black">
      <div className="bk-center flex min-h-screen flex-col items-center justify-center bg-black opacity-90">
        <main className="container flex flex-col items-center justify-center gap-4 bg-black px-4 py-16 text-white opacity-100">
          <h1>
            <span className="invisible">The Custard Screams</span>
            <img
              src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX11TVvcM2zyFK0ROkwl3WSGv8XHuon7LfdbVrj"
              alt="The Custard Screams logo"
            />
          </h1>
          <div className="grid grid-cols-1 justify-center gap-2">
            <iframe
              style={{ border: 0, maxWidth: 400, height: 120 }}
              title="The Custard Screams - Bandcamp - Royal Flush"
              src="https://bandcamp.com/EmbeddedPlayer/track=4158228932/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/artwork=none/transparent=true/"
              seamless
            >
              <a href="https://thecustardscreams.bandcamp.com/track/royal-flush">
                Royal Flush by The Custard Screams
              </a>
            </iframe>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-2 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
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
              className="flex max-w-xs flex-col gap-2 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://instagram.thecustardscreams.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-amber-400">Instagram →</h3>
              <div className="text-lg">@thecustardscreams</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-2 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://facebook.thecustardscreams.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-amber-400">Facebook →</h3>
              <div className="text-lg">@thecustardscreams</div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-2 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://tiktok.thecustardscreams.com/"
              target="_blank"
            >
              <h3 className="text-2xl font-bold text-amber-400">TikTok →</h3>
              <div className="text-lg">@the.custard.screams</div>
            </Link>
          </div>
          <div>
            <h2>Shows</h2>
            <p>The Custard Screams are playing at the upcoming shows:</p>
            <img
              src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM"
              alt="Freaks and Geeks - Stratford, London, May 31st 2025"
              width={678}
            />
          </div>
        </main>
        <footer className="flex flex-col items-center text-white opacity-50">
          Copyright &copy; {new Date().getFullYear()} The Custard Screams
        </footer>
      </div>
    </div>
  );
}
