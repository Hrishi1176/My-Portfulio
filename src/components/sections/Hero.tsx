"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, FileText, ArrowDown, Play, Pause, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";
import { ResumeModal } from "./ResumeModal";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import type { HeroConfig, DeveloperConfig } from "@/config/portfolioConfig";
import { Badge, Button, Dialog } from "@/components/ui";
import { Hero3DCore } from "@/components/3d/Hero3DCore";
import { useRobotCompanion } from "@/context/RobotCompanionContext";

interface HeroProps {
  hero?: HeroConfig;
  developer?: DeveloperConfig;
}

const DEFAULT_HERO: HeroConfig = {
  availabilityBadge: "Available for new opportunities",
  tagline: "Senior Full Stack Engineer & System Architect",
  stats: [],
  floatingBadges: [],
  techStreams: [],
};

const DEFAULT_DEV: DeveloperConfig = {
  name: "Hrishi Bhattacharya",
  firstName: "Hrishi",
  lastName: "Bhattacharyya",
  initials: "HB",
  role: "Senior Software Developer",
  title: "Senior Full Stack Engineer & System Architect",
  experienceYears: "4.4",
  email: "hrishisgp97@gmail.com",
  phone: "+91 62946 60141",
  whatsapp: "+91 62946 60141",
  location: "Kolkata, India",
  github: "https://github.com/Hrishi1176",
  linkedin: "https://linkedin.com/in/hrishi-bhattacharyya",
  instagram: "",
  facebook: "",
};

export function Hero({ hero: heroProp, developer: devProp }: HeroProps = {}) {
  const hero = heroProp || DEFAULT_HERO;
  const dev = devProp || DEFAULT_DEV;
  const FLOAT_BADGES = hero.floatingBadges;
  const STATS = hero.stats;
  const TECH_VIDEO_STREAMS = hero.techStreams;

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStreamIdx, setActiveStreamIdx] = useState(0);
  const { playSound } = useRobotCompanion();

  return (
    <>
      <section id="hero" className="scroll-mt-24 min-h-[calc(100vh-6rem)] lg:min-h-[85vh] flex flex-col justify-center py-6 sm:py-10 lg:py-14 relative w-full">
        <div className="relative w-full">
          {/* Top HUD Telemetry Ribbon */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-5 text-[11px] sm:text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-emerald-400 font-bold tracking-wider">SYSTEM: ACTIVE</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 tracking-wider">NODE: {dev.location || "BENGALURU, INDIA"}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-purple-400 tracking-wider font-semibold">CORE LATENCY: 24ms</span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-cyan-400 tracking-wider font-semibold hidden sm:inline">STACK: NEXT 16 / PAYLOAD 3</span>
            </div>
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 xl:gap-16">
            {/* ── Left column ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              {/* Status badge */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <Badge variant="emerald" ping={true}>
                  {hero.availabilityBadge}
                </Badge>

                {/* Tech Reel Video Showcase Badge */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-300 hover:bg-purple-500/20 transition-all shadow-sm group cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 text-purple-500 fill-purple-500 group-hover:scale-110 transition-transform" />
                  Tech Stack Reel
                </button>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white break-words">
                Hi, I&apos;m{" "}
                <span className="gradient-text">{dev.firstName}</span>
                <br />
                <span className="text-slate-700 dark:text-slate-200">{dev.lastName}</span>
              </h1>

              {/* Role */}
              <p className="mt-4 text-lg font-semibold text-purple-600 dark:text-purple-400 tracking-wide sm:text-xl flex items-center justify-center lg:justify-start gap-2">
                {dev.role}
                <Sparkles className="h-4 w-4 text-amber-400" />
              </p>

              {/* Tagline */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                {hero.tagline}
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href="#contact" onMouseEnter={() => playSound("beep")}>
                  <Button variant="primary" size="md" leftIcon={<Mail className="h-4 w-4" />}>
                    Get In Touch
                  </Button>
                </Link>
                <div onMouseEnter={() => playSound("beep")}>
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<FileText className="h-4 w-4" />}
                    onClick={() => setIsResumeModalOpen(true)}
                  >
                    View Resume
                  </Button>
                </div>
              </div>

              {/* Social quick links */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
                <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                <a
                  href={dev.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>

              {/* Stats HUD */}
              <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-3 p-2 sm:max-w-sm">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-black font-mono gradient-text sm:text-3xl">{value}</div>
                    <div className="mt-1 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll hint */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-8 hidden items-center gap-2 text-xs text-slate-400 dark:text-slate-600 lg:flex"
              >
                <ArrowDown className="h-3.5 w-3.5" />
                Scroll to explore
              </motion.div>
            </motion.div>

            {/* ── Right column — 3D Holographic DP Avatar & animated floating skill badges ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="relative flex justify-center py-6"
            >
              <div className="relative flex w-full items-center justify-center">
                {/* 3D Holographic Avatar DP */}
                <Hero3DCore />

                {/* Animated Floating Skill Badges */}
                {FLOAT_BADGES.map(({ label, color, border, text, top, left, delay }) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay,
                    }}
                    whileHover={{ scale: 1.1, rotate: [-1, 1, 0] }}
                    className={`absolute ${top} ${left} z-20 cursor-pointer hidden md:block pointer-events-auto`}
                  >
                    <div
                      className={`flex items-center gap-2 rounded-full border ${border} bg-gradient-to-r ${color}
                        backdrop-blur-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold ${text}
                        shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-500/20 hover:shadow-lg`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                      </span>
                      {label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      {isResumeModalOpen && (
        <ResumeModal
          onClose={() => setIsResumeModalOpen(false)}
          developerName={dev.name}
        />
      )}

      {/* ── Interactive Technology Stack Video Showcase Modal ── */}
      <Dialog
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        maxWidth="3xl"
        title={
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                Technology Stack Video Reel
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  4K 60FPS
                </span>
              </h3>
            </div>
          </div>
        }
        description="Interactive Technical Architecture Stream"
      >
        <div className="relative h-auto min-h-[340px] sm:h-96 w-full rounded-2xl bg-slate-950 flex flex-col justify-between p-4 sm:p-8 overflow-hidden">
          {/* Background Tech Stream Animation */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${TECH_VIDEO_STREAMS[activeStreamIdx].color} opacity-15 blur-2xl transition-all duration-700 pointer-events-none`}
          />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest">
                LIVE ARCHITECTURE STREAM
              </span>
            </div>

            <span className="text-[10px] sm:text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
              {TECH_VIDEO_STREAMS[activeStreamIdx].speed}
            </span>
          </div>

          {/* Active Tech Video Card Info */}
          <div className="relative z-10 space-y-2 sm:space-y-3 my-4 sm:my-0">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              {TECH_VIDEO_STREAMS[activeStreamIdx].tag}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white gradient-text">
              {TECH_VIDEO_STREAMS[activeStreamIdx].name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Designed for high-throughput enterprise performance, multi-tenant RBAC security, and scalable cloud deployment.
            </p>
          </div>

          {/* Player Controls Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3.5 sm:pt-4 border-t border-slate-800/80">
            <button
              suppressHydrationWarning
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg cursor-pointer"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pause Stream" : "Play Stream"}
            </button>

            {/* Channel Stream Selectors */}
            <div className="flex items-center gap-2">
              {TECH_VIDEO_STREAMS.map((s, idx) => (
                <button
                  suppressHydrationWarning
                  key={s.name}
                  onClick={() => setActiveStreamIdx(idx)}
                  aria-label={`Select stream channel ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeStreamIdx === idx ? "w-8 bg-purple-500" : "w-2.5 bg-slate-700 hover:bg-slate-500"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
