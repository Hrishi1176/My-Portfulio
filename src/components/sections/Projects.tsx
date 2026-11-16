"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Sparkles,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
  Search,
} from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { portfolioConfig, ProjectConfig } from "@/config/portfolioConfig";
import { SectionHeader } from "@/components/ui";
import { TiltCard } from "@/components/3d/TiltCard";
import { useRobotCompanion } from "@/context/RobotCompanionContext";

const defaultProjects: ProjectConfig[] = portfolioConfig.projects;

interface ProjectsProps {
  initialProjects?: ProjectConfig[];
}

export function Projects({ initialProjects }: ProjectsProps = {}) {
  const { triggerProjectShift } = useRobotCompanion();
  const [projectsList, setProjectsList] = useState<ProjectConfig[]>(
    initialProjects && initialProjects.length > 0 ? initialProjects : defaultProjects
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data.success && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjectsList(data.projects);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic projects from GitHub:", err);
      }
    };

    loadProjects();
    return () => {
      ignore = true;
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjectsList(data.projects);
        }
      }
    } catch (err) {
      console.error("Failed to fetch dynamic projects from GitHub:", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  // Compute all unique tech tags from loaded projects
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    tags.add("All");
    projectsList.forEach((p) => {
      p.tech.forEach((t) => tags.add(t));
      if (p.language) tags.add(p.language);
    });
    return Array.from(tags).slice(0, 8);
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

  // Auto-play slider
  useEffect(() => {
    if (filteredProjects.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [filteredProjects.length]);

  const handleNext = () => {
    if (filteredProjects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    triggerProjectShift();
  };

  const handlePrev = () => {
    if (filteredProjects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    triggerProjectShift();
  };

  const safeIndex = filteredProjects.length > 0 ? currentIndex % filteredProjects.length : 0;
  const activeProject = filteredProjects[safeIndex] || projectsList[0];

  const prevIndex =
    filteredProjects.length > 1
      ? (safeIndex - 1 + filteredProjects.length) % filteredProjects.length
      : null;
  const nextIndex =
    filteredProjects.length > 1 ? (safeIndex + 1) % filteredProjects.length : null;

  return (
    <section id="projects" className="scroll-mt-24 py-16 sm:py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        {/* Top Header & View Controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <SectionHeader
            number="05."
            badge="Featured Work & Repositories"
            title="Spatial Showcase ·"
            gradientText="3D Coverflow Systems"
            description="Dynamically synchronized public engineering repositories and live cloud deployments presented with real-time 3D depth physics."
            className="mb-0 sm:mb-0"
          />

          <div className="flex flex-wrap items-center gap-3">
            {/* Live GitHub Telemetry Indicator */}
            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-transparent px-3.5 py-1.5 text-xs font-mono font-medium text-purple-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">LIVE SYNC</span>
              <span className="text-[10px] text-slate-400">({projectsList.length} Repos)</span>
              <button
                suppressHydrationWarning
                onClick={handleManualSync}
                disabled={isSyncing}
                title="Refresh GitHub Repositories"
                className="ml-1 text-slate-400 hover:text-cyan-300 transition-transform active:scale-90 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-cyan-400" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Search & Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tech Stack Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {availableTags.map((tag) => (
              <button
                suppressHydrationWarning
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? "bg-purple-600 text-white shadow-sm"
                    : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-purple-500/30"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              suppressHydrationWarning
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 text-white placeholder:text-slate-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/5 bg-transparent">
            <p className="text-sm font-semibold text-slate-400">
              No repositories matched &quot;{searchQuery || selectedTag}&quot;.
            </p>
            <button
              onClick={() => {
                setSelectedTag("All");
                setSearchQuery("");
              }}
              className="mt-3 text-xs font-bold text-purple-400 underline underline-offset-4 cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* ── 3D Coverflow Stage ── */
          <div className="relative py-6">
            {/* Spatial 3D Perspective Container */}
            <div
              className="relative mx-auto max-w-5xl flex items-center justify-center min-h-[460px] overflow-hidden sm:overflow-visible"
              style={{ perspective: "1400px" }}
            >
              {/* Previous Neighbor Card (Left) */}
              {prevIndex !== null && filteredProjects[prevIndex] && (
                <div
                  onClick={handlePrev}
                  className="hidden md:block absolute left-0 w-[420px] rounded-2xl border border-white/5 bg-transparent p-6 opacity-45 cursor-pointer transition-all duration-500 hover:opacity-75 z-10 select-none"
                  style={{
                    transform: "translateX(-45%) translateZ(-90px) rotateY(24deg) scale(0.85)",
                    transformStyle: "preserve-3d",
                  }}
                  title="Click to view previous project"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold font-mono text-slate-400">
                      {filteredProjects[prevIndex].number}
                    </span>
                    <span className="text-xs font-mono text-slate-400">PREV</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-200 truncate">
                    {filteredProjects[prevIndex].title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                    {filteredProjects[prevIndex].description}
                  </p>
                </div>
              )}

              {/* Center Active Project Card with Tilt & Depth */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${safeIndex}-${activeProject.title}`}
                  initial={{ opacity: 0, scale: 0.94, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;
                    if (swipe < -8000 || offset.x < -60) {
                      handleNext();
                    } else if (swipe > 8000 || offset.x > 60) {
                      handlePrev();
                    }
                  }}
                  className="relative z-20 w-full max-w-2xl cursor-grab active:cursor-grabbing select-none"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard
                    maxTilt={10}
                    perspective={1200}
                    scale={1.01}
                    glareEffect={true}
                    className="w-full rounded-3xl"
                  >
                    <div className="relative rounded-3xl border border-white/10 bg-transparent p-7 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                      {/* Ambient Glowing Gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${activeProject.gradient} opacity-25 pointer-events-none transition-all duration-700`}
                      />

                      {/* Header in Z-Depth */}
                      <div
                        style={{ transform: "translateZ(30px)" }}
                        className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl sm:text-4xl font-black font-mono gradient-text">
                            {activeProject.number}
                          </span>
                          {activeProject.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                              <Sparkles className="h-3.5 w-3.5" /> Featured Architecture
                            </span>
                          )}
                          {typeof activeProject.stars === "number" && activeProject.stars > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/20">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {activeProject.stars}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {activeProject.isPrivate ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 border border-slate-700">
                              <Lock className="h-3 w-3" /> Private
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/50 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                              <Globe className="h-3 w-3" /> Public
                            </span>
                          )}

                          {activeProject.github && (
                            <a
                              href={activeProject.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:border-purple-500/50 transition-colors shadow-sm"
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
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-500 hover:text-white transition-all shadow-sm"
                              title="Live Demo"
                            >
                              <ExternalLink className="h-4.5 w-4.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Title & Description in Z-Depth */}
                      <div style={{ transform: "translateZ(20px)" }} className="relative z-10 space-y-3 mb-6">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                          {activeProject.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                          {activeProject.description}
                        </p>
                      </div>

                      {/* Tech Stack Tags in Z-Depth */}
                      <div style={{ transform: "translateZ(15px)" }} className="relative z-10 flex flex-wrap gap-2 pt-2">
                        {activeProject.tech.map((t) => (
                          <span
                            key={t}
                            className="text-xs font-mono font-medium px-3 py-1 rounded-lg border border-white/5 bg-transparent text-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </AnimatePresence>

              {/* Next Neighbor Card (Right) */}
              {nextIndex !== null && filteredProjects[nextIndex] && (
                <div
                  onClick={handleNext}
                  className="hidden md:block absolute right-0 w-[420px] rounded-2xl border border-white/5 bg-transparent p-6 opacity-45 cursor-pointer transition-all duration-500 hover:opacity-75 z-10 select-none"
                  style={{
                    transform: "translateX(45%) translateZ(-90px) rotateY(-24deg) scale(0.85)",
                    transformStyle: "preserve-3d",
                  }}
                  title="Click to view next project"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-400">NEXT</span>
                    <span className="text-xl font-bold font-mono text-slate-400">
                      {filteredProjects[nextIndex].number}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-200 truncate">
                    {filteredProjects[nextIndex].title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                    {filteredProjects[nextIndex].description}
                  </p>
                </div>
              )}
            </div>

            {/* Controls & Pagination Dots */}
            <div className="mx-auto max-w-2xl flex items-center justify-between pt-6 mt-6">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {filteredProjects.map((_, dotIdx) => (
                  <button
                    suppressHydrationWarning
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIdx === safeIndex
                        ? "w-8 bg-purple-500"
                        : "w-2 bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>

              {/* Slider Arrows */}
              <div className="flex items-center gap-2">
                <button
                  suppressHydrationWarning
                  onClick={handlePrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-transparent text-slate-300 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
                  title="Previous project"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  suppressHydrationWarning
                  onClick={handleNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-transparent text-slate-300 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
                  title="Next project"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
