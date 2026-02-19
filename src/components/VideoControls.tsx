import { useRef, useState, useCallback, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, PictureInPicture2, Volume2, Volume1, VolumeX, Maximize, Minimize } from "lucide-react";
import { formatDuration } from "@/data/videos";
import { usePlayer } from "@/context/PlayerContext";

export default function VideoControls() {
  const { currentVideo, isPlaying, togglePlay, videoRef } = usePlayer();
  const progressRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [skipFeedback, setSkipFeedback] = useState<"fwd" | "bwd" | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onTime = () => setCurrentTime(vid.currentTime);
    const onLoaded = () => setDuration(vid.duration);

    vid.addEventListener("timeupdate", onTime);
    vid.addEventListener("loadedmetadata", onLoaded);
    if (vid.duration) setDuration(vid.duration);

    return () => {
      vid.removeEventListener("timeupdate", onTime);
      vid.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [videoRef, currentVideo]);

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [isPlaying, resetHideTimer]);

  const skip = (seconds: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Math.max(0, Math.min(vid.duration, vid.currentTime + seconds));
    setSkipFeedback(seconds > 0 ? "fwd" : "bwd");
    setTimeout(() => setSkipFeedback(null), 500);
    resetHideTimer();
  };

  const seek = (e: React.MouseEvent | React.TouchEvent) => {
    const bar = progressRef.current;
    const vid = videoRef.current;
    if (!bar || !vid) return;
    const rect = bar.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    vid.currentTime = pct * vid.duration;
    resetHideTimer();
  };

  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleVolumeChange = (e: React.MouseEvent | React.TouchEvent) => {
    const bar = volumeRef.current;
    const vid = videoRef.current;
    if (!bar || !vid) return;
    const rect = bar.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    vid.volume = pct;
    setVolume(pct);
    resetHideTimer();
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (volume > 0) {
      setPrevVolume(volume);
      vid.volume = 0;
      setVolume(0);
    } else {
      vid.volume = prevVolume;
      setVolume(prevVolume);
    }
    resetHideTimer();
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const [isPip, setIsPip] = useState(false);
  const pipSupported = "pictureInPictureEnabled" in document && (document as any).pictureInPictureEnabled;

  const togglePip = async () => {
    const vid = videoRef.current;
    if (!vid) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await vid.requestPictureInPicture();
      }
    } catch {}
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onEnter = () => setIsPip(true);
    const onLeave = () => setIsPip(false);
    vid.addEventListener("enterpictureinpicture", onEnter);
    vid.addEventListener("leavepictureinpicture", onLeave);
    return () => {
      vid.removeEventListener("enterpictureinpicture", onEnter);
      vid.removeEventListener("leavepictureinpicture", onLeave);
    };
  }, [videoRef, currentVideo]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        const container = videoRef.current?.closest("[data-player-root]") as HTMLElement | null;
        if (container) await container.requestFullscreen();
      }
    } catch {}
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300 ${
        showControls ? "opacity-100" : "opacity-0"
      }`}
      onClick={resetHideTimer}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-player-controls pointer-events-none" />

      {/* Skip feedback */}
      {skipFeedback && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 animate-skip-flash text-primary-foreground text-3xl font-bold ${
            skipFeedback === "fwd" ? "right-12" : "left-12"
          }`}
        >
          {skipFeedback === "fwd" ? "+10s" : "-10s"}
        </div>
      )}

      {/* Center play/pause */}
      <div className="absolute inset-0 flex items-center justify-center gap-12 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); skip(-10); }}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-colors"
        >
          <SkipBack size={22} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-colors"
        >
          {isPlaying ? <Pause size={30} /> : <Play size={30} className="ml-1" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); skip(10); }}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-colors"
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="relative z-20 px-4 pb-4 space-y-2">
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="h-1.5 bg-muted/50 rounded-full cursor-pointer group"
          onClick={seek}
          onTouchStart={seek}
        >
          <div
            className="h-full bg-primary rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Time + Volume + PiP */}
        <div className="flex justify-between items-center text-xs text-secondary-foreground">
          <span>{formatDuration(currentTime)}</span>
          <div className="flex items-center gap-3">
            {/* Volume */}
            <div
              className="flex items-center gap-1.5"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="p-1 rounded text-secondary-foreground hover:text-foreground transition-colors"
              >
                <VolumeIcon size={16} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${showVolume ? "w-16 opacity-100" : "w-0 opacity-0"}`}
              >
                <div
                  ref={volumeRef}
                  className="h-1 bg-muted/50 rounded-full cursor-pointer group"
                  onClick={(e) => { e.stopPropagation(); handleVolumeChange(e); }}
                  onTouchStart={(e) => { e.stopPropagation(); handleVolumeChange(e); }}
                >
                  <div
                    className="h-full bg-foreground rounded-full relative"
                    style={{ width: `${volume * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </div>
            {pipSupported && (
              <button
                onClick={(e) => { e.stopPropagation(); togglePip(); }}
                className={`p-1 rounded transition-colors ${isPip ? "text-primary" : "text-secondary-foreground hover:text-foreground"}`}
                title="Picture-in-Picture"
              >
                <PictureInPicture2 size={16} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className={`p-1 rounded transition-colors ${isFullscreen ? "text-primary" : "text-secondary-foreground hover:text-foreground"}`}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
