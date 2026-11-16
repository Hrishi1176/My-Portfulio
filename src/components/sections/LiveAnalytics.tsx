"use client";

import { motion } from "framer-motion";
import { Activity, Eye, ShieldCheck, Server, Star, FolderGit2, MessageSquare, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface AnalyticsData {
  totalViews: number;
  activeVisitors: number;
  totalInquiries: number;
  totalReviews: number;
  githubStars: number;
  publicReposCount: number;
  githubFollowers: number;
  uptime: string;
  status: string;
}

export function LiveAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React StrictMode dev
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // 1. Record page view in MongoDB (fire & forget once)
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname }),
    }).catch((err) => console.error("Error logging page view:", err));

    // 2. Fetch real analytics data exactly once on mount
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setAnalytics(json.data);
        }
      })
      .catch((err) => console.error("Error fetching analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="analytics" className="scroll-mt-24 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-0 sm:p-2 lg:p-4 relative">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
                  07 // MISSION CONTROL · Real-Time Telemetry
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Real-Time <span className="gradient-text">Live Analytics</span>
              </h3>
            </div>

            {/* Real Active Visitor Counter */}
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm backdrop-blur-md">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span>
                {loading ? (
                  "Syncing..."
                ) : (
                  `${analytics?.activeVisitors || 1} Active Session${(analytics?.activeVisitors || 1) > 1 ? "s" : ""}`
                )}
              </span>
            </div>
          </div>

          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* 1. Real Page Views */}
            <div className="p-4 rounded-2xl border border-white/5 bg-transparent text-center">
              <Eye className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black gradient-text">
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-purple-500" /> : analytics?.totalViews.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-1">
                Real Page Views
              </div>
            </div>

            {/* 2. Real GitHub Stars */}
            <div className="p-4 rounded-2xl border border-white/5 bg-transparent text-center">
              <Star className="h-5 w-5 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-amber-500" /> : analytics?.githubStars}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-1">
                GitHub Stars
              </div>
            </div>

            {/* 3. Real GitHub Public Repos */}
            <div className="p-4 rounded-2xl border border-white/5 bg-transparent text-center">
              <FolderGit2 className="h-5 w-5 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-blue-500 dark:text-blue-400">
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" /> : analytics?.publicReposCount}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-1">
                Public Repositories
              </div>
            </div>

            {/* 4. Real Form Inquiries Saved in MongoDB */}
            <div className="p-4 rounded-2xl border border-white/5 bg-transparent text-center">
              <MessageSquare className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400">
                {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-500" /> : analytics?.totalInquiries}
              </div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-1">
                Client Inquiries
              </div>
            </div>
          </div>

          {/* Infrastructure Health Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-500" />
              <span>Production Infrastructure: <strong className="text-emerald-600 dark:text-emerald-400">MongoDB + Vercel Cloud</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-500" />
              <span>Global Availability: <strong className="text-purple-600 dark:text-purple-400">{analytics?.uptime || "99.98%"}</strong></span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
