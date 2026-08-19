"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Sparkles,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Sliders,
  Star,
  GitFork,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { GithubIcon } from "@/components/SocialIcons";
import { portfolioConfig, ProjectConfig } from "@/config/portfolioConfig";

const initialProjects: ProjectConfig[] = portfolioConfig.projects;

export function Projects() {
  const [projectsList, setProjectsList] = useState<ProjectConfig[]>(initialProjects);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");

  // Fetch dynamic projects from GitHub via our API
  const fetchDynamicProjects = async (showLoadingState = false) => {
    if (showLoadingState) setIsSyncing(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjectsList(data.projects);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch dynamic projects from GitHub:", err);
    } finally {
      if (showLoadingState) {
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchDynamicProjects();
  }, []);

  // Compute all unique tech tags from loaded projects
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add("All");
    projectsList.forEach((p) => {
      p.tech.forEach((t) => tags.add(t));
      if (p.language) tags.add(p.language);
    });
    return Array.from(tags).slice(0, 8); // Top tags
  }, [projectsList]);

  // Filter projects based on selected tag and search query
  const filteredProjects = useMemo(() => {
    return projectsList.filter((p) => {
      const matchesTag =
        selectedTag === "All" ||
        p.tech.some((t) => t.toLowerCase() === selectedTag.toLowerCase()) ||
        p.language?.toLowerCase() === selectedTag.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));

      return matchesTag && matchesSearch;
    });
  }, [projectsList, selectedTag, searchQuery]);

  // Handle active index clamping when filtered list changes
  useEffect(() => {
    if (currentIndex >= filteredProjects.length) {
      setCurrentIndex(0);
    }
  }, [filteredProjects.length, currentIndex]);

  // Auto-play slider in slider mode
  useEffect(() => {
    if (viewMode !== "slider" || filteredProjects.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [viewMode, filteredProjects.length]);

  const handleNext = () => {
    if (filteredProjects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    if (filteredProjects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  const activeProject = filteredProjects[currentIndex] || projectsList[0];

  return (
    <section id="projects" className="scroll-mt-24 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        {/* Top Header & View Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="section-num text-base">04.</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Featured Work & Repositories
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live GitHub Telemetry Indicator */}
            <div className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">GitHub Auto-Sync</span>
              <span className="text-[10px] text-slate-400">({projectsList.length} Repos)</span>
              <button
                onClick={() => fetchDynamicProjects(true)}
                disabled={isSyncing}
                title="Refresh GitHub Repositories"
                className="ml-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-transform active:scale-90"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-purple-500" : ""}`} />
              </button>
            </div>

            {/* View Mode Toggle Controls */}
            <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-white/80 dark:bg-white/[0.05] p-1 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setViewMode("slider")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === "slider"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                Slider View
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Grid View
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Featured <span className="gradient-text">Projects & Systems</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Real-time dynamically fetched public repositories from GitHub with live deployment links and architecture highlights.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[220px] sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-white/70 dark:bg-white/[0.05] border border-[var(--border)] focus:outline-none focus:border-purple-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tech Stack Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 overflow-x-auto pb-1">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                selectedTag === tag
                  ? "bg-purple-600 text-white shadow-sm"
                  : "border border-[var(--border)] bg-white/60 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-500/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-[var(--border)] bg-white/40 dark:bg-white/[0.02] backdrop-blur-md">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No repositories matched &quot;{searchQuery || selectedTag}&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedTag("All");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-bold text-purple-600 dark:text-purple-400 underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === "slider" ? (
          /* ── Slider Mode ── */
          <div className="relative glass p-6 sm:p-10 lg:p-12 rounded-3xl min-h-[400px] overflow-hidden flex flex-col justify-between border border-[var(--border)] shadow-md">
            {/* Background Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${activeProject.gradient} opacity-40 pointer-events-none transition-all duration-700`}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentIndex}-${activeProject.title}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 space-y-6"
              >
                {/* Project Header Badges & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-black gradient-text">
                      {activeProject.number}
                    </span>
                    {activeProject.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        <Sparkles className="h-3.5 w-3.5" /> Featured Architecture
                      </span>
                    )}
                    {typeof activeProject.stars === "number" && activeProject.stars > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {activeProject.stars}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeProject.isPrivate ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-500/20">
                        <Lock className="h-3 w-3" /> Private Repo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <Globe className="h-3 w-3" /> Public Repo
                      </span>
                    )}

                    {activeProject.github && (
                      <a
                        href={activeProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/40 transition-colors shadow-sm"
                        title="GitHub Code"
                      >
                        <GithubIcon className="h-4.5 w-4.5" />
                      </a>
                    )}

                    {activeProject.live && (
                      <a
                        href={activeProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                        title="Live Demo"
                      >
                        <ExternalLink className="h-4.5 w-4.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {activeProject.title}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed max-w-3xl">
                    {activeProject.description}
                  </p>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeProject.tech.map((t) => (
                    <span
                      key={t}
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${activeProject.tagColor}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls & Pagination Dots */}
            <div className="relative z-10 flex items-center justify-between pt-6 border-t border-[var(--border)] mt-8">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 flex-wrap max-w-[60%]">
                {filteredProjects.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      dotIdx === currentIndex
                        ? "w-8 bg-purple-600"
                        : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-purple-400"
                    }`}
                  />
                ))}
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 hover:bg-purple-600 hover:text-white transition-colors shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 dark:bg-white/[0.08] text-slate-800 dark:text-slate-200 hover:bg-purple-600 hover:text-white transition-colors shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Grid Mode ── */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`card group relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 transition-all duration-300 ${proj.accentBorder} hover:border-purple-500/40`}
              >
                <div
                  className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${proj.gradient} opacity-80 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black gradient-text">{proj.number}</span>
                        {typeof proj.stars === "number" && proj.stars > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {proj.stars}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {proj.github && (
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                            title="GitHub Repository"
                          >
                            <GithubIcon className="h-4 w-4" />
                          </a>
                        )}
                        {proj.live && (
                          <a
                            href={proj.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {proj.tech.map((t) => (
                      <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${proj.tagColor}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
