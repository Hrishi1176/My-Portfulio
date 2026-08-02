"use client";

import { motion } from "framer-motion";
import { Activity, Eye, Zap, ShieldCheck, Server, Sparkles, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const LIVE_EVENTS = [
  "⚡ Visitor from San Francisco viewed CloudLedger Demo",
  "⭐ New star received on Hrishi1176/WorkPilot-AI",
  "🚀 Visitor from London explored Experience Certificate",
  "💬 Inquiry form submission recorded via MongoDB API",
  "⚡ Visitor from Tokyo checked OpenConnect Render deployment",
];

export function LiveAnalytics() {
  const [activeVisitors, setActiveVisitors] = useState(14);
  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  const [latency, setLatency] = useState(38);

  // Simulate real-time active visitor fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(8, prev + delta);
      });
      setLatency(Math.floor(32 + Math.random() * 12));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Rotate live activity feed ticker
  useEffect(() => {
    const eventInterval = setInterval(() => {
      setCurrentEventIdx((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 5000);
    return () => clearInterval(eventInterval);
  }, []);

  return (
    <section id="analytics" className="scroll-mt-24 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass-raised p-6 sm:p-8 lg:p-10 rounded-3xl border border-purple-500/20 shadow-2xl relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  Live Telemetry & Performance
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Real-Time <span className="gradient-text">Live Analytics</span>
              </h3>
            </div>

            {/* Live Active Visitor Counter Badge */}
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm backdrop-blur-md">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span>{activeVisitors} Active Live Visitors</span>
            </div>
          </div>

          {/* Animated SVG Traffic Wave Graph */}
          <div className="relative mb-8 rounded-2xl border border-[var(--border)] bg-slate-950/40 p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-cyan-400" /> Live Request Throughput Stream
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                {latency} ms API Latency
              </span>
            </div>

            <div className="relative h-24 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 60 Q 50 20, 100 50 T 200 40 T 300 70 T 400 30 T 500 50 L 500 100 L 0 100 Z"
                  fill="url(#waveGradient)"
                />
                <motion.path
                  d="M 0 60 Q 50 20, 100 50 T 200 40 T 300 70 T 400 30 T 500 50"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.03] backdrop-blur-md text-center">
              <Eye className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-black gradient-text">14,290+</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1">Total Page Views</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.03] backdrop-blur-md text-center">
              <Zap className="h-5 w-5 text-cyan-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-cyan-500 dark:text-cyan-400">&lt; 0.3s</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1">Lighthouse Speed</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.03] backdrop-blur-md text-center">
              <Server className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400">99.98%</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1">Global Uptime</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-white/50 dark:bg-white/[0.03] backdrop-blur-md text-center">
              <ShieldCheck className="h-5 w-5 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-black text-amber-500 dark:text-amber-400">100 / 100</div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1">SEO & Security</div>
            </div>
          </div>

          {/* Live Activity Ticker */}
          <div className="flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="h-4 w-4 text-purple-500 shrink-0 animate-spin" />
            <span className="font-bold text-purple-600 dark:text-purple-400 shrink-0 uppercase tracking-wider">Live Activity:</span>
            <motion.span
              key={currentEventIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="truncate font-medium text-slate-600 dark:text-slate-400"
            >
              {LIVE_EVENTS[currentEventIdx]}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
