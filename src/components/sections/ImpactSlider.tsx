"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Server, CloudLightning } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { TiltCard } from "@/components/3d/TiltCard";

export interface ImpactMetric {
  label: string;
  before: string;
  after: string;
  unit: string;
  detail: string;
}

interface ImpactSliderProps {
  metrics?: ImpactMetric[];
}

export function ImpactSlider({ metrics = [] }: ImpactSliderProps = {}) {
  const [sliderPos, setSliderPos] = useState<number>(50);

  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section id="impact" className="scroll-mt-24 py-16 sm:py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        <SectionHeader
          number="02."
          badge="Architectural Evolution"
          title="Then vs Now ·"
          gradientText="System Transformation"
          description="Rewiring brittle legacy architectures into resilient, high-throughput cloud ecosystems with sub-50ms global latency."
        />

        {/* ── Interactive Split Comparison Deck ── */}
        <div className="mt-10">
          <TiltCard maxTilt={6} perspective={1400} scale={1.01} glareEffect={true} className="rounded-2xl sm:rounded-3xl">
            <div className="relative p-2 sm:p-4 lg:p-6 overflow-hidden">
              {/* Top Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 mb-5 sm:mb-6">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    ARCHITECTURE IMPACT TELEMETRY
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-slate-400">
                  <span className="hidden sm:inline">DRAG TO COMPARE</span>
                  <span className="text-purple-400 font-bold">{sliderPos}% NOW</span>
                </div>
              </div>

              {/* Split Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 items-stretch">
                {/* Left: Legacy Monolith */}
                <div className="rounded-2xl border border-rose-500/20 bg-transparent p-4 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-950/50 border border-rose-500/30 px-3 py-1 rounded-full">
                        LEGACY MONOLITH (THEN)
                      </span>
                      <Server className="h-5 w-5 text-rose-400/60" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                      Coupled Monolithic Debt
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Single database bottleneck, cascading cascade failures, multi-hour deployment downtime, and unoptimized relational queries.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-rose-500/20">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>AVERAGE LATENCY:</span>
                      <span className="text-rose-400 font-bold">~480ms</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>FAILURE BLAST RADIUS:</span>
                      <span className="text-rose-400 font-bold">100% (GLOBAL DOWNTIME)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>RELEASE CADENCE:</span>
                      <span className="text-rose-400 font-bold">BI-WEEKLY MANUAL</span>
                    </div>
                  </div>
                </div>

                {/* Right: Modern Distributed Cloud */}
                <div className="rounded-2xl border border-cyan-500/30 bg-transparent p-4 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden">

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-cyan-400 fill-current" />
                        MODERN CLOUD SAAS (NOW)
                      </span>
                      <CloudLightning className="h-5 w-5 text-cyan-400" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                      Decoupled Reactive Ecosystem
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Micro-frontends, multi-tenant RBAC, Payload 3.x with MongoDB, Redis caching layers, and automated GitHub Actions CI/CD.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-cyan-500/30">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>AVERAGE LATENCY:</span>
                      <span className="text-cyan-300 font-bold">38ms (12x FASTER)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>FAILURE BLAST RADIUS:</span>
                      <span className="text-emerald-400 font-bold">ISOLATED MICRO-CONTAINER</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>RELEASE CADENCE:</span>
                      <span className="text-emerald-400 font-bold">CONTINUOUS ZERO-DOWNTIME</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Scrub Control */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-ew-resize h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Metric Counter Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-purple-500/40"
                  >
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                      {m.label}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white gradient-text">
                        {m.after}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">{m.unit}</span>
                      <span className="text-xs font-mono text-slate-500 line-through ml-auto">
                        {m.before}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400 truncate">{m.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>
      </motion.div>
    </section>
  );
}
