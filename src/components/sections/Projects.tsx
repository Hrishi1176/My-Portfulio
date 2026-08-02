"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code2, Sparkles, FolderGit2, Lock, Globe } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

const projects = [
  {
    number: "01",
    title: "CloudLedger — Financial Ledger & Analytics Platform",
    description:
      "Cloud-native financial management and double-entry ledger platform. Built with Next.js 16 and TypeScript, featuring multi-currency accounting, automated transaction auditing, real-time analytics dashboards, and invoice processing.",
    tech: ["Next.js 16", "TypeScript", "React", "TailwindCSS", "Financial API"],
    github: "https://github.com/Hrishi1176/CloudLedger",
    live: "https://cloud-ledger-coral.vercel.app",
    isPrivate: false,
    featured: true,
    gradient: "from-cyan-500/15 via-blue-500/10 to-transparent",
    accentBorder: "border-cyan-500/35 dark:border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.12)]",
    tagColor: "text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    number: "02",
    title: "Developer Portfolio & Interactive Experience Portal",
    description:
      "High-performance interactive developer portfolio showcasing professional work history, verified experience certificates, skills matrix, and GitHub projects. Built with glassmorphic UI, Framer Motion, particle background canvas, and theme controls.",
    tech: ["Next.js 16", "TypeScript", "TailwindCSS", "Framer Motion", "Vercel"],
    github: "https://github.com/Hrishi1176/My-Portfulio",
    live: "https://my-portfulio-ten.vercel.app",
    isPrivate: false,
    featured: true,
    gradient: "from-purple-500/15 via-violet-500/10 to-transparent",
    accentBorder: "border-purple-500/35 dark:border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.12)]",
    tagColor: "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  {
    number: "03",
    title: "WorkPilot-AI — AI Workspace & Workflow Automation",
    description:
      "Intelligent workspace & task automation platform built with AI agents, automated workflow orchestration, LLM integration, real-time activity tracking, and enterprise team collaboration.",
    tech: ["TypeScript (97.5%)", "Next.js", "React", "CSS3", "Vercel"],
    github: "https://github.com/Hrishi1176/WorkPilot-AI",
    live: "https://work-pilot-ai.vercel.app",
    isPrivate: true,
    featured: true,
    gradient: "from-blue-500/15 via-indigo-500/10 to-transparent",
    accentBorder: "border-blue-500/35 dark:border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.12)]",
    tagColor: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    number: "04",
    title: "OpenConnect — API Integration & Gateway Service",
    description:
      "Event-driven API integration gateway and messaging distribution service engineered for high-throughput multi-service connectivity, webhook routing, and secure real-time data sync.",
    tech: ["JavaScript (55.5%)", "Python (12.7%)", "HTML5/CSS3", "Dockerfile", "Render"],
    github: "https://github.com/Hrishi1176/OpenConnect",
    live: "https://openconnect-95uc.onrender.com",
    isPrivate: true,
    featured: true,
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
    accentBorder: "border-emerald-500/35 dark:border-emerald-400/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]",
    tagColor: "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    number: "05",
    title: "Music Library & Audio Catalog System",
    description:
      "Full-stack music management application designed to organize audio tracks, custom playlists, artists, and album metadata with dynamic search and relational database schema design.",
    tech: ["PHP", "MySQL", "JavaScript", "CSS3", "HTML5"],
    github: "https://github.com/Hrishi1176/music_library",
    live: null,
    isPrivate: false,
    featured: false,
    gradient: "from-violet-500/15 via-purple-500/10 to-transparent",
    accentBorder: "border-violet-500/35 dark:border-violet-400/30 shadow-[0_0_20px_rgba(139,92,246,0.12)]",
    tagColor: "text-violet-600 dark:text-violet-400 border-violet-500/30 bg-violet-500/10",
  },
  {
    number: "06",
    title: "Multi-Tenant E-Commerce SaaS Platform",
    description:
      "Scalable SaaS e-commerce solution using Next.js featuring Role-Based Access Control (RBAC), multi-tenant storefront routing, robust product catalog management, and high-volume order processing.",
    tech: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
    github: null,
    live: null,
    isPrivate: true,
    featured: false,
    gradient: "from-indigo-500/15 via-blue-500/10 to-transparent",
    accentBorder: "border-indigo-500/35 dark:border-indigo-400/30 shadow-[0_0_20px_rgba(99,102,241,0.12)]",
    tagColor: "text-indigo-600 dark:text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  {
    number: "07",
    title: "Enterprise Office & HR Management System",
    description:
      "Comprehensive internal management suite incorporating HR approval workflows, leave management, expense tracking, and advanced task delegation for corporate operations.",
    tech: ["React", "Node.js", "PostgreSQL", "REST APIs", "Python"],
    github: null,
    live: null,
    isPrivate: true,
    featured: false,
    gradient: "from-rose-500/15 via-pink-500/10 to-transparent",
    accentBorder: "border-rose-500/35 dark:border-rose-400/30 shadow-[0_0_20px_rgba(244,63,94,0.12)]",
    tagColor: "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10",
  },
  {
    number: "08",
    title: "Snowflake Cloud Data & Analytics Platform",
    description:
      "Cloud-native data platform supporting automated ETL pipelines, scheduled analytical reporting, and business intelligence dashboards for data-driven organization decisions.",
    tech: ["Python", "Snowflake", "SQL", "ETL Pipelines", "Data Analytics"],
    github: null,
    live: null,
    isPrivate: true,
    featured: false,
    gradient: "from-amber-500/15 via-orange-500/10 to-transparent",
    accentBorder: "border-amber-500/35 dark:border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.12)]",
    tagColor: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
];

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.65 }}
      >
        {/* Label */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="section-num text-base">04.</span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Portfolio
            </span>
          </div>

          <a
            href="https://github.com/Hrishi1176"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 px-3.5 py-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all shadow-sm"
          >
            <FolderGit2 className="h-4 w-4 text-purple-500" />
            View GitHub Profile
          </a>
        </div>

        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Featured <span className="gradient-text">GitHub Projects</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.55 }}
              whileHover={{ y: -6 }}
              className={`card group relative flex flex-col overflow-hidden transition-all duration-300 ${proj.accentBorder}`}
            >
              {/* Gradient tint */}
              <div
                className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${proj.gradient} opacity-70 pointer-events-none`}
              />

              <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                {/* Top row */}
                <div className="mb-5 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white/80 dark:bg-slate-900/60 shadow-sm">
                      <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 select-none leading-none">
                      {proj.number}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Badge Indicator */}
                    {proj.isPrivate ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        <Lock className="h-3 w-3 text-amber-500" /> Private Repo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <Globe className="h-3 w-3" /> Public Repo
                      </span>
                    )}

                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/[0.06] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="View GitHub Repository"
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}

                    {proj.live && (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/[0.06] text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="Open Live Application"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white group-hover:gradient-text transition-colors duration-300 sm:text-2xl leading-snug">
                  {proj.title}
                </h3>

                {/* Description */}
                <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  {proj.description}
                </p>

                {/* Tech tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {proj.tech.map((t) => (
                    <span key={t} className={`tag border text-xs font-semibold px-2.5 py-1 rounded-full ${proj.tagColor}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
