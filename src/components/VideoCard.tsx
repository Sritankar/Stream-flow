import { Video, formatDuration } from "@/data/videos";
import { usePlayer } from "@/context/PlayerContext";

interface VideoCardProps {
  video: Video;
  compact?: boolean;
}

export default function VideoCard({ video, compact = false }: VideoCardProps) {
  const { openVideo } = usePlayer();

  if (compact) {
    return (
      <button
        onClick={() => openVideo(video)}
        className="flex gap-3 w-full text-left p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <div className="relative w-36 min-w-[9rem] aspect-video rounded-md overflow-hidden bg-secondary">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute bottom-1 right-1 bg-background/80 text-foreground text-[10px] font-medium px-1 rounded">
            {formatDuration(video.duration)}
          </span>
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
            {video.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">{video.creator}</p>
          <p className="text-xs text-muted-foreground">
            {video.views} views · {video.uploadedAt}
          </p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => openVideo(video)}
      className="w-full text-left group animate-fade-in"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary shadow-card">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-1.5 py-0.5 rounded-md">
          {formatDuration(video.duration)}
        </span>
        <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {video.category}
        </span>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {video.creator} · {video.views} views · {video.uploadedAt}
        </p>
      </div>
    </button>
  );
}
