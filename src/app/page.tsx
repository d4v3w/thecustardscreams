/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const Title = () => (
  <header className="mb-2 md:mb-3">
    <h1>
      <span className="sr-only">The Custard Screams</span>
      <img
        src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
        srcSet="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x, https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
        alt="The Custard Screams logo"
        width={250}
        className="mx-auto h-40 w-40 rounded-full sm:h-50 sm:w-50 md:mx-0 lg:h-60 lg:w-60"
      />
    </h1>
  </header>
);

const Music = () => (
  <article className="p-2 md:p-3">
    <h2 className="text-xl font-bold text-amber-400">Music</h2>
    <p>
      The Custard Screams are avilable to listen and download on Bandcamp now!
    </p>
    <div className="mt-3 flex flex-col gap-3 md:flex-row md:flex-wrap">
      <section className="rounded-xl">
        <iframe
          style={{ border: 0, maxWidth: 400, height: 120 }}
          title="The Custard Screams - Bandcamp - Royal Flush"
          src="https://bandcamp.com/EmbeddedPlayer/track=593440947/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
          seamless
        >
          <a href="https://thecustardscreams.bandcamp.com/track/royal-flush">
            Royal Flush by The Custard Screams
          </a>
        </iframe>
      </section>
      <section className="rounded-xl">
        <iframe
          style={{ border: 0, maxWidth: 400, height: 120 }}
          title="The Custard Screams - Bandcamp - Tomorrow"
          src="https://bandcamp.com/EmbeddedPlayer/track=2403260668/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
          seamless
        >
          <a href="https://thecustardscreams.bandcamp.com/track/tomorrow">
            Tomorrow by The Custard Screams
          </a>
        </iframe>
      </section>
      <section className="rounded-xl">
        <iframe
          style={{ border: 0, maxWidth: 400, height: 120 }}
          title="The Custard Screams - Bandcamp - Would You (Breathe)"
          src="https://bandcamp.com/EmbeddedPlayer/track=1319783194/size=large/bgcol=333333/linkcol=e99708/tracklist=false/artwork=small/transparent=true/"
          seamless
        >
          <a href="https://thecustardscreams.bandcamp.com/track/would-you-breathe">
            Would You (Breathe) by The Custard Screams
          </a>
        </iframe>
      </section>
    </div>
  </article>
);

const Links = () => (
  <>
    <nav className="mb-3 flex flex-col items-center gap-3 md:flex-row md:flex-wrap">
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
      <Link
        className="flex w-full flex-1 flex-col gap-0 rounded-xl bg-white/10 p-3 text-white hover:bg-yellow-900"
        href="https://instagram.thecustardscreams.com/"
        target="_blank"
      >
        <h3 className="text-lg font-bold text-amber-400">Instagram →</h3>
        <div className="text-lg">@thecustardscreams</div>
      </Link>
      <Link
        className="flex w-full flex-1 flex-col gap-0 rounded-xl bg-white/10 p-3 text-white hover:bg-yellow-900"
        href="https://www.facebook.com/profile.php?id=61572629866193"
        target="_blank"
      >
        <h3 className="text-lg font-bold text-amber-400">Facebook →</h3>
        <div className="text-lg">@thecustardscreams</div>
      </Link>
      <Link
        className="flex w-full flex-1 flex-col gap-0 rounded-xl bg-white/10 p-3 text-white hover:bg-yellow-900"
        href="https://tiktok.thecustardscreams.com/"
        target="_blank"
      >
        <h3 className="text-lg font-bold text-amber-400">TikTok →</h3>
        <div className="text-lg">@the.custard.screams</div>
      </Link>
    </nav>
  </>
);

const Shows = () => (
  <article className="p2 md:p-3">
    <h2 className="text-xl font-bold text-amber-400">Upcoming shows</h2>
    <p>Come and see The Custard Screams play live at these upcoming shows</p>
    <section className="mt-3 columns-1 gap-3 sm:columns-2 lg:columns-3">
      <img
        src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jhiX7K9CW63sKRVJPxiQH09w81nhzYZI5bMg"
        alt="The Custard Screams at Freaks and Geeks - Stratford, London, November 21st 2025"
        className="mb-3 w-full rounded-lg object-cover"
      />
    </section>
    <h2 className="text-xl font-bold text-amber-400">Previous shows</h2>
    <p>The Custard Screams previous shows</p>
    <section className="mt-3 columns-1 gap-3 sm:columns-2 lg:columns-3">
      <img
        src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM"
        alt="The Custard Screams at Freaks and Geeks - Stratford, London, May 31st 2025"
        className="mb-3 w-full rounded-lg object-cover"
      />
      <img
        src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX11TVvcM2zyFK0ROkwl3WSGv8XHuon7LfdbVrj"
        alt="The Custard Screams Skull Logo"
      />
    </section>
  </article>
);

const Footer = () => {
  const currentYear: number = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center p-2 text-amber-400 opacity-50">
      Copyright &copy; {currentYear} The Custard Screams
    </footer>
  );
};

interface DialogOverlayProps {
  initialState: boolean;
}

const DialogOverlay = ({ initialState }: DialogOverlayProps) => {
  const [showOverlay, setShowOverlay] = React.useState(initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleVideoError = () => {
    setShowOverlay(false); // Hide if video fails to load/play
  };

  // Check browser support on mount
  React.useEffect(() => {
    const videoEl = document.createElement("video");
    const supportsWebM = videoEl.canPlayType("video/webm") !== "";
    const supportsMP4 = videoEl.canPlayType("video/mp4") !== "";

    if (!supportsWebM && !supportsMP4) {
      setShowOverlay(false); // Hide if neither format is supported
      return null;
    }

    if (showOverlay && dialogRef.current && !dialogRef.current.open) {
      openDialog();
    }
  }, []);

  return (
    <dialog
      onClick={stopPropagation}
      open={showOverlay}
      className="flex flex-col items-center"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      }}
      ref={dialogRef}
    >
      <video
        autoPlay
        loop
        controls
        className="h-screen object-cover aspect-[9/16]"
        onError={handleVideoError}
      >
        <source
          src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1VmoiNTAuIT0qi4yXtg9SldF37jxKBDaPcHZr"
          type="video/webm"
        />
        <source
          src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1vCABEku14NJBxIZe9ydb5S7Ko2ADc3qwMT0G"
          type="video/mp4"
        />
        <p>Your browser does not support the video tag.</p>
      </video>
    </dialog>
  );
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl min-w-[320px] bg-black p-2 md:p-3">
      <DialogOverlay initialState={true} />
      <Title />
      <Links />
      <main>
        <Music />
        <Shows />
      </main>
      <Footer />
    </div>
  );
}

HomePage.displayName = "HomePage";
DialogOverlay.displayName = "DialogOverlay";
Title.displayName = "Title";
Links.displayName = "Links";
Music.displayName = "Music";
Shows.displayName = "Shows";
Footer.displayName = "Footer";
