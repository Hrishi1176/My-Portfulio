"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.95; // Crisp, steady motion
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Video autoPlay notice:", err);
            setIsPlaying(false);
          });
      }
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
      {/* ── Background Video ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-75 dark:opacity-85" : "opacity-0"
        } filter contrast-110 saturate-125 brightness-95 dark:brightness-90`}
      >
        <source src="/Background.mp4" type="video/mp4" />
      </video>

      {/* ── Translucent Cyber Mesh & Vignette Overlay ── */}
      {/* Light Mode subtle tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7ff]/45 via-[#f8f7ff]/30 to-[#f8f7ff]/60 dark:hidden" />

      {/* Dark Mode high-tech deep vignette */}
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-[#080612]/60 via-[#080612]/35 to-[#080612]/75" />

      {/* Radial depth focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_0%,rgba(8,6,18,0.55)_100%)]" />

      {/* ── Ambient Floating Play/Pause Controller ── */}
      <div className="pointer-events-auto fixed bottom-6 left-6 z-40 hidden sm:block">
        <button
          onClick={togglePlay}
          title={isPlaying ? "Pause Background Video Motion" : "Play Background Video Motion"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-500/30 bg-slate-950/70 text-slate-300 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-purple-400 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] shadow-lg"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
