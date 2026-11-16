"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, MapPin, Building, ChevronRight, ShieldCheck } from "lucide-react";
import type { RoleConfig } from "@/config/portfolioConfig";
import { SectionHeader, Badge } from "@/components/ui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ExperienceProps {
  roles?: RoleConfig[];
}

export function ExperienceElevator({ roles: initialRoles }: ExperienceProps = {}) {
  const roles = initialRoles || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFloor, setActiveFloor] = useState<number>(0);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".elevator-card");
    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, index) => {
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top center+=100",
        end: "bottom center-=50",
        onEnter: () => setActiveFloor(index),
        onEnterBack: () => setActiveFloor(index),
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [roles.length]);

  return (
    <section id="experience" ref={containerRef} className="scroll-mt-24 py-16 sm:py-24 relative">
      <SectionHeader
        number="04."
        badge="Career Trajectory"
        title="Going Up ·"
        gradientText="Experience Elevator"
        description="Engineering high-scale cloud platforms, distributed systems, and real-time frontend architectures floor by floor."
      />

      {/* Main Grid: Elevator Shaft Telemetry + Milestone Floors */}
      <div className="relative mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* ── Left Column: Cybernetic Elevator Shaft & Telemetry HUD ── */}
        <div className="sticky top-28 hidden lg:flex flex-col gap-4 rounded-2xl border border-white/5 bg-transparent p-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                SHAFT TELEMETRY
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              SYS·OK
            </span>
          </div>

          {/* Current Level Display */}
          <div className="rounded-xl border border-white/5 bg-transparent p-3">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-purple-300">
              Current Altitude
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono gradient-text">
                FL 0{activeFloor + 1}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                / 0{roles.length}
              </span>
            </div>
            <div className="mt-2 text-xs font-medium text-slate-300 truncate">
              {roles[activeFloor]?.company || "Corporate HQ"}
            </div>
          </div>

          {/* Floor Progression Indicators */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Floors Navigation
            </div>
            {roles.map((r, idx) => {
              const isActive = activeFloor === idx;
              return (
                <button
                  key={r.role + idx}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setActiveFloor(idx);
                    const el = document.getElementById(`elevator-floor-${idx}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border border-cyan-500/40 bg-cyan-950/30 text-white shadow-md"
                      : "border border-transparent bg-slate-900/40 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? "text-cyan-400" : "text-slate-500"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-medium truncate">{r.role}</span>
                  </div>
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive ? "text-cyan-400 translate-x-0.5" : "text-slate-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Elevator Safety Protocol */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Continuous Deployment Verified</span>
          </div>
        </div>

        {/* ── Right Column: Interactive Floor Milestone Cards ── */}
        <div className="relative space-y-8">
          {/* Vertical Elevator Cable Rail (Visible on larger screens) */}
          <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-purple-500 via-cyan-400 to-slate-800 hidden sm:block pointer-events-none" />

          {roles.map((exp, idx) => {
            const isCurrent = exp.type === "current";
            const isActive = activeFloor === idx;

            return (
              <div
                key={exp.role + idx}
                id={`elevator-floor-${idx}`}
                className={`elevator-card relative sm:pl-16 transition-all duration-500`}
              >
                {/* Elevation Beacon Dot on the Cable Rail */}
                <div
                  className={`absolute left-3.5 top-6 hidden sm:flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "border-cyan-400 bg-cyan-950 shadow-[0_0_15px_#22d3ee] scale-125"
                      : "border-slate-600 bg-slate-900"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                      isActive ? "bg-cyan-400" : "bg-slate-500"
                    }`}
                  />
                </div>

                {/* 3D Glass Floor Container */}
                <div
                  className={`group relative rounded-2xl border transition-all duration-500 overflow-hidden p-6 sm:p-8 ${
                    isActive
                      ? "border-purple-500/40 bg-white/[0.02] shadow-[0_15px_35px_rgba(168,85,247,0.1)]"
                      : "border-white/5 bg-transparent hover:border-purple-500/30 hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Subtle Top Border Ambient Neon Beam */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r transition-all duration-500 ${
                      isActive
                        ? "from-transparent via-cyan-400 to-purple-500 opacity-100"
                        : "from-transparent via-slate-700 to-transparent opacity-30"
                    }`}
                  />

                  {/* Header Row: Floor Number Badge & Meta */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                          FLOOR 0{idx + 1}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                            CURRENT POSITION
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors pt-1">
                        {exp.role}
                      </h3>
                    </div>

                    {exp.badge && (
                      <Badge variant="primary" size="sm">
                        {exp.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Company & Details Bar */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-medium text-slate-300 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-purple-400" />
                      <span className="font-bold text-white">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="h-4 w-4 text-rose-400" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Responsibilities list */}
                  <div className="mt-5 space-y-3">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 text-xs">
                          ▹
                        </span>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies Used Grid */}
                  {exp.tech && exp.tech.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-800/80">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Technologies Deployed
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exp.tech.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-lg border border-slate-700/60 bg-slate-900/60 px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-purple-500/40 hover:text-white transition-colors"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
