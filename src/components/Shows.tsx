const Shows = () => (
  <article className="p2 md:p-3">
    <h2 className="text-xl font-bold text-amber-400">Previous shows</h2>
    <p>The Custard Screams previous shows</p>
    <section className="mt-3 columns-1 gap-3 sm:columns-2 lg:columns-3">
      <img
        src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jhiX7K9CW63sKRVJPxiQH09w81nhzYZI5bMg"
        alt="The Custard Screams at Freaks and Geeks - Stratford, London, November 21st 2025"
        className="mb-3 w-full rounded-lg object-cover"
      />
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

Shows.displayName = "Shows";
export default Shows;
