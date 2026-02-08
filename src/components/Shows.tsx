import { ImageCarousel, type CarouselImage } from './carousel';

const Shows = () => {
  const images: CarouselImage[] = [
    {
      src: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jhiX7K9CW63sKRVJPxiQH09w81nhzYZI5bMg",
      alt: "The Custard Screams at Freaks and Geeks - Stratford, London, November 21st 2025",
      id: "show-1",
    },
    {
      src: "https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM",
      alt: "The Custard Screams at Freaks and Geeks - Stratford, London, May 31st 2025",
      id: "show-2",
    },
  ];

  return (
    <article className="p-2 md:p-3">
      <h2 className="text-xl font-bold text-amber-400">Previous shows</h2>
      <p>The Custard Screams previous shows</p>
      <ImageCarousel
        images={images}
        ariaLabel="Previous shows gallery"
        className="mt-3"
      />
    </article>
  );
};

Shows.displayName = "Shows";
export default Shows;
