"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.85; // Smooth ambient playback speed
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay was prevented
          setIsPlaying(false);
        });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none select-none">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-30 dark:opacity-45" : "opacity-0"
        } filter contrast-125 saturate-125`}
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>

      {/* Cyberpunk & Glassmorphism Ambient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7ff]/70 via-[#f8f7ff]/50 to-[#f8f7ff]/90 dark:from-[#080612]/75 dark:via-[#080612]/55 dark:to-[#080612]/95 mix-blend-normal" />
      
      {/* High-tech Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />

      {/* Subtle Background Play/Pause Control Widget (Interactive) */}
      <div className="pointer-events-auto fixed bottom-6 left-6 z-40 hidden sm:block">
        <button
          onClick={togglePlay}
          title={isPlaying ? "Pause Background Motion" : "Play Background Motion"}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/20 bg-slate-950/60 text-slate-400 backdrop-blur-md transition-all hover:scale-110 hover:border-purple-500/50 hover:text-white shadow-lg"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
