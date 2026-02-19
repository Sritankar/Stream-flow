import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Video } from "@/data/videos";

interface PlayerState {
  currentVideo: Video | null;
  isMinimized: boolean;
  isPlaying: boolean;
  isPlayerOpen: boolean;
}

interface PlayerContextType extends PlayerState {
  openVideo: (video: Video) => void;
  closePlayer: () => void;
  minimizePlayer: () => void;
  restorePlayer: () => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentVideo: null,
    isMinimized: false,
    isPlaying: false,
    isPlayerOpen: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openVideo = useCallback((video: Video) => {
    setState({
      currentVideo: video,
      isMinimized: false,
      isPlaying: true,
      isPlayerOpen: true,
    });
  }, []);

  const closePlayer = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setState({
      currentVideo: null,
      isMinimized: false,
      isPlaying: false,
      isPlayerOpen: false,
    });
  }, []);

  const minimizePlayer = useCallback(() => {
    setState((s) => ({ ...s, isMinimized: true }));
  }, []);

  const restorePlayer = useCallback(() => {
    setState((s) => ({ ...s, isMinimized: false }));
  }, []);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setState((s) => ({ ...s, isPlaying: true }));
    } else {
      vid.pause();
      setState((s) => ({ ...s, isPlaying: false }));
    }
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setState((s) => ({ ...s, isPlaying: playing }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        openVideo,
        closePlayer,
        minimizePlayer,
        restorePlayer,
        togglePlay,
        setIsPlaying,
        videoRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
