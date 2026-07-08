"use client";

import { motion } from "framer-motion";
import { Mail, FileText, ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ResumeModal } from "./ResumeModal";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

const FLOAT_BADGES = [
  { label: "React & Next.js",    color: "from-cyan-500/20 to-blue-500/20",    border: "border-cyan-400/30",    text: "text-cyan-700 dark:text-cyan-300",    top: "top-6",    left: "-left-2", delay: 0 },
  { label: "Data Engineering",   color: "from-blue-500/20 to-indigo-500/20",  border: "border-blue-400/30",    text: "text-blue-700 dark:text-blue-300",    top: "top-20",   left: "right-0",delay: 1 },
  { label: "System Design",      color: "from-pink-500/20 to-rose-500/20",    border: "border-pink-400/30",    text: "text-pink-700 dark:text-pink-300",    top: "bottom-20",left: "-left-4",delay: 2 },
  { label: "Python & Node.js",   color: "from-teal-500/20 to-green-500/20",   border: "border-teal-400/30",    text: "text-teal-700 dark:text-teal-300",    top: "bottom-8", left: "right-0",delay: 0.5 },
];

const STATS = [
  { value: "4.5+", label: "Years Exp." },
  { value: "10+",  label: "Projects"   },
  { value: "30+",  label: "Skills"     },
];

export function Hero() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  return (
    <>
      <section id="hero" className="scroll-mt-20 py-4 sm:py-6">
        <div className="glass-raised p-6 sm:p-10 lg:p-14 xl:p-16">
          {/* Inner radial tint */}
          <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none
            bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(124,58,237,0.10),transparent_60%),
               radial-gradient(ellipse_50%_50%_at_100%_100%,rgba(59,130,246,0.08),transparent_60%)]"
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            {/* ── Left column ── */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for new opportunities
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                Hi, I&apos;m{" "}
                <span className="gradient-text">Hrishi</span>
                <br />
                <span className="text-slate-700 dark:text-slate-200">Bhattacharyya</span>
              </h1>

              {/* Role */}
              <p className="mt-4 text-lg font-semibold text-purple-600 dark:text-purple-400 tracking-wide sm:text-xl">
                Senior Software Developer
              </p>

              {/* Tagline */}
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
                Full Stack Engineer specialising in scalable web applications, multi-tenant SaaS platforms, and data engineering solutions.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href="#contact" className="btn-primary">
                  <Mail className="h-4 w-4" />
                  Get In Touch
                </Link>
                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="btn-outline"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </button>
              </div>

              {/* Social quick links */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://github.com/Hrishi1176"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </a>
                <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                <a
                  href="https://www.linkedin.com/in/hrishi-bhattacharyya-b78332204/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 grid w-full max-w-xs grid-cols-3 gap-3 rounded-2xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.04] p-4 sm:max-w-sm">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-extrabold gradient-text sm:text-3xl">{value}</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
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

            {/* ── Right column — avatar ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="relative flex justify-center"
            >
              <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80 lg:h-[400px] lg:w-[400px]">
                {/* Spinning rings */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/30 dark:border-purple-500/25"
                  style={{ animation: "spin-slow 22s linear infinite" }}
                />
                <div
                  className="absolute inset-5 rounded-full border border-dashed border-blue-400/20 dark:border-blue-500/18"
                  style={{ animation: "spin-slow 32s linear infinite reverse" }}
                />

                {/* Glow ring */}
                <div
                  className="absolute inset-8 rounded-full"
                  style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
                />

                {/* Avatar frame */}
                <div className="relative z-10 h-52 w-52 sm:h-64 sm:w-64 lg:h-80 lg:w-80">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-violet-500 to-blue-500 p-[3px]">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-white dark:bg-[#0d0b1e]">
                      <Image
                        src="/Hrishi.Bhattacharyya.jpg"
                        alt="Hrishi Bhattacharya — Senior Software Developer"
                        fill
                        sizes="(max-width: 640px) 13rem, (max-width: 1024px) 16rem, 20rem"
                        priority
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating skill badges */}
                {FLOAT_BADGES.map(({ label, color, border, text, top, left, delay }) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4 + delay * 0.5, repeat: Infinity, ease: "easeInOut", delay }}
                    className={`absolute ${top} ${left} hidden sm:block`}
                  >
                    <div
                      className={`flex items-center gap-1.5 rounded-full border ${border} bg-gradient-to-r ${color}
                        backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold ${text}
                        shadow-lg dark:bg-black/40`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
                      {label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {isResumeModalOpen && (
        <ResumeModal onClose={() => setIsResumeModalOpen(false)} />
      )}
    </>
  );
}
