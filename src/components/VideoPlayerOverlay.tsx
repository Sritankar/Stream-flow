import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { getRelatedVideos } from "@/data/videos";
import VideoControls from "./VideoControls";
import VideoCard from "./VideoCard";

export default function VideoPlayerOverlay() {
  const {
    currentVideo,
    isPlayerOpen,
    isMinimized,
    isPlaying,
    minimizePlayer,
    restorePlayer,
    closePlayer,
    togglePlay,
    setIsPlaying,
    videoRef,
    openVideo,
  } = usePlayer();

  const [showRelated, setShowRelated] = useState(false);
  const dragY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play when video changes
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !currentVideo || isMinimized) return;
    vid.src = currentVideo.videoUrl;
    vid.play().catch(() => {});
    setIsPlaying(true);
    setShowRelated(false);
  }, [currentVideo, videoRef, setIsPlaying, isMinimized]);

  // Auto-play next
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !currentVideo) return;

    const onEnded = () => {
      setIsPlaying(false);
      const related = getRelatedVideos(currentVideo);
      if (related.length > 0) {
        setCountdown(2);
      }
    };

    vid.addEventListener("ended", onEnded);
    return () => vid.removeEventListener("ended", onEnded);
  }, [currentVideo, videoRef, setIsPlaying]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      const related = getRelatedVideos(currentVideo!);
      if (related.length > 0) {
        openVideo(related[0]);
      }
      setCountdown(null);
      return;
    }
    countdownTimer.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(countdownTimer.current);
  }, [countdown, currentVideo, openVideo]);

  const cancelCountdown = () => {
    clearTimeout(countdownTimer.current);
    setCountdown(null);
  };

  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      if (info.offset.y > 100) {
        minimizePlayer();
      }
      dragY.set(0);
    },
    [minimizePlayer, dragY]
  );

  if (!isPlayerOpen || !currentVideo) return null;

  const related = getRelatedVideos(currentVideo);

  // Minimized mini-player
  if (isMinimized) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-mini"
      >
        <div className="flex items-center gap-3 p-2">
          <button onClick={restorePlayer} className="relative w-28 min-w-[7rem] aspect-video rounded-md overflow-hidden bg-secondary">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={false}
              playsInline
            />
          </button>
          <div className="flex-1 min-w-0" onClick={restorePlayer}>
            <p className="text-sm font-medium text-foreground truncate">{currentVideo.title}</p>
            <p className="text-xs text-muted-foreground">{currentVideo.creator}</p>
          </div>
          <button
            onClick={togglePlay}
            className="p-2 text-foreground hover:text-primary transition-colors"
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z"/></svg>
            )}
          </button>
          <button
            onClick={closePlayer}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mini progress bar */}
        <MiniProgress videoRef={videoRef} />
      </motion.div>
    );
  }

  // Full player
  return (
    <motion.div
      ref={containerRef}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Video area - draggable */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        style={{ y: dragY }}
        className="relative w-full aspect-video bg-black flex-shrink-0"
        data-player-root
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          onClick={togglePlay}
        />
        <VideoControls />

        {/* Minimize button */}
        <button
          onClick={minimizePlayer}
          className="absolute top-4 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground"
        >
          <ChevronDown size={22} />
        </button>

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm z-30">
            <p className="text-foreground text-lg font-semibold mb-2">
              Next video in {countdown}...
            </p>
            <button
              onClick={cancelCountdown}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>

      {/* Video info + related list */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4">
          <h2 className="text-lg font-bold text-foreground">{currentVideo.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentVideo.creator} · {currentVideo.views} views · {currentVideo.uploadedAt}
          </p>
          <span className="inline-block mt-2 bg-primary/15 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
            {currentVideo.category}
          </span>
          <p className="text-sm text-secondary-foreground mt-3 leading-relaxed">
            {currentVideo.description}
          </p>
        </div>

        {/* Related videos */}
        {related.length > 0 && (
          <div className="px-4 pb-6">
            <button
              onClick={() => setShowRelated(!showRelated)}
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3"
            >
              <span>Related in {currentVideo.category}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showRelated ? "rotate-180" : ""}`}
              />
            </button>
            {showRelated && (
              <div className="space-y-1 animate-fade-in">
                {related.map((v) => (
                  <VideoCard key={v.id} video={v} compact />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MiniProgress({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onTime = () => {
      if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
    };
    vid.addEventListener("timeupdate", onTime);
    return () => vid.removeEventListener("timeupdate", onTime);
  }, [videoRef]);

  return (
    <div className="h-0.5 bg-muted">
      <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
    </div>
  );
}
