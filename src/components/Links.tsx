import Link from "next/link";

const Links = () => (
  <>
    <div className="mb-3 flex flex-col items-center gap-3 md:flex-row md:flex-wrap">
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
    </div>
  </>
);

Links.displayName = "Links";
export default Links;
