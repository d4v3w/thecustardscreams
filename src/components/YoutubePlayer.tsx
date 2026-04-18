/**
 * YouTube Player component - simplified default YouTube embed
 * Feature: youtube-video-music-section
 */

interface YoutubePlayerProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function YoutubePlayer({
  videoId,
  title,
  className = "",
}: YoutubePlayerProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-center">
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
