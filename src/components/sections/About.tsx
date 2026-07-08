"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FOCUS_AREAS = [
  { label: "Scalable systems",     emoji: "🏗️" },
  { label: "Team leadership",      emoji: "🤝" },
  { label: "Cloud data platforms", emoji: "☁️" },
  { label: "Product thinking",     emoji: "💡" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65 }}
      >
        {/* Section label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="section-num text-base">01.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            About Me
          </span>
        </div>

        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Crafting digital experiences<br />
          <span className="gradient-text">that scale & endure</span>
        </h2>

        <div className="glass p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            {/* ── Bio ── */}
            <div className="space-y-5">
              <p className="text-base leading-[1.85] text-slate-700 dark:text-slate-300 sm:text-lg">
                I&apos;m a <strong className="font-semibold text-slate-900 dark:text-white">Senior Full Stack Developer</strong> with over{" "}
                <strong className="font-semibold text-slate-900 dark:text-white">4.5 years</strong> of experience designing and delivering
                scalable web applications, multi-tenant SaaS platforms, workflow automation systems, and data engineering solutions.
              </p>
              <p className="text-base leading-[1.85] text-slate-700 dark:text-slate-300 sm:text-lg">
                My journey involves leading teams, architecting enterprise applications, and building robust end-to-end solutions.
                I have strong expertise in software architecture, REST APIs, database design, and cloud-based data solutions — always
                aiming to deliver high-quality, performant software that makes a real difference.
              </p>

              {/* Trait chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {["Problem Solver", "Tech Lead", "Full-Stack", "Open Source Contributor"].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>

            {/* ── Focus Areas ── */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                  Focus areas
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                {FOCUS_AREAS.map(({ label, emoji }) => (
                  <div
                    key={label}
                    className="card flex flex-col gap-2 p-4"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
