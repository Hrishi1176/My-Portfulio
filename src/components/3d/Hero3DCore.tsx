"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Zap } from "lucide-react";

export function Hero3DCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isImpulseActive, setIsImpulseActive] = useState<boolean>(false);

  // Sync saved pokes on mount to guarantee 100% server/client initial render match
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("hero_core_pokes");
      if (saved) {
        const parsed = parseInt(saved, 10) || 0;
        queueMicrotask(() => {
          setPokeCount(parsed);
        });
      }
    } catch {}

    const handleUpdate = () => {
      try {
        const saved = sessionStorage.getItem("hero_core_pokes");
        setPokeCount(saved ? parseInt(saved, 10) || 0 : 0);
      } catch {}
    };

    window.addEventListener("hero_core_poke_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("hero_core_poke_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    setTilt({ x: rotX, y: rotY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const handlePoke = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("hero_core_pokes");
        const current = saved ? parseInt(saved, 10) || 0 : 0;
        const next = current + 1;
        sessionStorage.setItem("hero_core_pokes", next.toString());
        setPokeCount(next);
        window.dispatchEvent(new Event("hero_core_poke_update"));
      } catch (err) {
        console.error("Failed to save poke count:", err);
      }
    }

    setIsImpulseActive(true);
    setTimeout(() => {
      setIsImpulseActive(false);
    }, 600);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* 3D Stage Container with Perspective */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handlePoke}
        title="Click to interact with 3D Holographic Avatar"
        className="relative flex aspect-square w-[280px] sm:w-[340px] md:w-[380px] lg:w-[410px] xl:w-[440px] items-center justify-center cursor-pointer group"
        style={{ perspective: "1200px" }}
      >
        {/* Ambient Neon Backglow */}
        <div
          className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-600/15 via-violet-500/10 to-cyan-500/15 blur-2xl pointer-events-none transition-all duration-700"
          style={{
            transform: isHovered ? "scale(1.15)" : "scale(1)",
            opacity: isHovered ? 0.6 : 0.35,
          }}
        />

        {/* Outer 3D Orbital Dashed Rings (Clockwise & Counter-Clockwise) */}
        <div
          className="absolute -inset-4 sm:-inset-6 rounded-full border border-dashed border-purple-500/25 pointer-events-none animate-spin"
          style={{
            animationDuration: "36s",
            transform: `rotateX(65deg) rotateY(${tilt.y * 0.4}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        />
        <div
          className="absolute inset-1 sm:inset-2 rounded-full border border-dashed border-cyan-400/30 pointer-events-none animate-spin"
          style={{
            animationDuration: "24s",
            animationDirection: "reverse",
            transform: `rotateX(-60deg) rotateY(${tilt.y * 0.4}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        />

        {/* Kinetic Shockwave Impulse Ring on click */}
        {isImpulseActive && (
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping pointer-events-none opacity-80" />
        )}

        {/* 3D Holographic Card Disc */}
        <div
          className="relative h-[220px] w-[220px] sm:h-[270px] sm:w-[270px] md:h-[300px] md:w-[300px] lg:h-[330px] lg:w-[330px] rounded-full p-[3px] bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-500 shadow-[0_0_50px_rgba(168,85,247,0.45)] transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Inner Disc Mask with DP Image */}
          <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-950 shadow-inner">
            <Image
              src="/hrishi-dp.jpg"
              alt="Hrishi Bhattacharyya — Senior Software Developer"
              fill
              sizes="(max-width: 640px) 14rem, (max-width: 768px) 17rem, 21rem"
              priority
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {/* Futuristic Holographic Specular Glare Reflection */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300"
              style={{
                opacity: glare.opacity,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(56, 189, 248, 0.15) 30%, transparent 60%)`,
              }}
            />

            {/* Subtle Gradient Shadow Depth on Rim */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20 pointer-events-none" />
          </div>

          {/* High-Tech HUD Bezel Accents */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950/90 border border-purple-500/40 text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest shadow-md">
            HOLO·ID: 01
          </div>
        </div>

        {/* Telemetry Status Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full border border-purple-500/30 bg-slate-950/80 backdrop-blur-md px-3.5 py-1 shadow-lg pointer-events-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span
            suppressHydrationWarning
            className="text-[11px] font-mono font-medium text-slate-300 tracking-wider"
          >
            3D AVATAR · {pokeCount} {pokeCount === 1 ? "POKE" : "POKES"}
          </span>
          <button
            type="button"
            suppressHydrationWarning
            onClick={(e) => {
              e.stopPropagation();
              handlePoke();
            }}
            className="ml-1 p-0.5 rounded text-purple-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
            title="Trigger Impulse Wave"
          >
            <Zap className="h-3 w-3 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
