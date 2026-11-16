"use client";

import { motion } from "framer-motion";
import { Sparkles, Terminal, Cpu, Database, Layers, Code2 } from "lucide-react";
import type { AboutConfig } from "@/config/portfolioConfig";
import { SectionHeader, Badge } from "@/components/ui";
import { TiltCard } from "@/components/3d/TiltCard";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Layers,
  Database,
  Terminal,
  Code2,
};

interface AboutProps {
  about?: AboutConfig;
}

export function About({ about: aboutProp }: AboutProps = {}) {
  const bioParagraphs = aboutProp?.bioParagraphs || [];
  const traits = aboutProp?.traits || [];
  const focusAreas = aboutProp?.focusAreas || [];

  return (
    <section id="about" className="scroll-mt-24 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65 }}
      >
        <SectionHeader
          number="01."
          badge="About Me"
          title="Crafting digital experiences"
          gradientText="that scale & endure"
        />

        <div className="p-0 sm:p-2 lg:p-4 relative">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 items-center">
            {/* ── Bio ── */}
            <div className="space-y-5">
              {bioParagraphs.map((paragraph, idx) => (
                <p key={idx} className="text-base leading-[1.85] text-slate-800 dark:text-slate-200 sm:text-lg">
                  {paragraph}
                </p>
              ))}

              {/* Trait chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {traits.map((t) => (
                  <motion.div key={t} whileHover={{ scale: 1.06 }}>
                    <Badge variant="primary" className="cursor-default shadow-sm hover:scale-105 transition-transform">
                      {t}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Focus Areas Cards ── */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
                  Core Focus Areas
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {focusAreas.map(({ label, icon, color }, idx) => {
                  const IconComponent = (icon && ICON_MAP[icon]) || Cpu;
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.45 }}
                      className="h-full"
                    >
                      <TiltCard maxTilt={8} scale={1.03} glareEffect={true} className="h-full rounded-2xl">
                        <div className="flex flex-col gap-3 p-5 h-full rounded-2xl border border-white/5 bg-transparent group transition-all duration-300 cursor-default hover:border-purple-500/30 hover:bg-white/[0.02]">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                            {label}
                          </span>
                        </div>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
