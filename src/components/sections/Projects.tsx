"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

const projects = [
  {
    number: "01",
    title: "Multi-tenant E-Commerce Platform",
    description:
      "Designed and developed a scalable e-commerce solution using Next.js featuring Role-Based Access Control (RBAC), robust product management, and comprehensive order processing modules.",
    tech: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
    github: "#",
    live: "#",
    gradient: "from-purple-500/10 via-violet-500/5 to-transparent",
    accentBorder: "border-purple-500/25 dark:border-purple-500/20",
  },
  {
    number: "02",
    title: "Enterprise Office Management System",
    description:
      "Built a comprehensive internal management platform incorporating HR workflows, leave management, expense tracking, and advanced task management capabilities for a large organisation.",
    tech: ["React", "Node.js", "PostgreSQL", "REST APIs", "Python"],
    github: "#",
    live: "#",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    accentBorder: "border-blue-500/25 dark:border-blue-500/20",
  },
  {
    number: "03",
    title: "Snowflake Data Platform",
    description:
      "Developed a cloud-native data platform supporting ETL pipelines, real-time reporting, and analytics dashboards, enabling data-driven decisions across business units.",
    tech: ["Python", "Snowflake", "SQL", "Data Engineering"],
    github: "#",
    live: "#",
    gradient: "from-teal-500/10 via-cyan-500/5 to-transparent",
    accentBorder: "border-teal-500/25 dark:border-teal-500/20",
  },
  {
    number: "04",
    title: "Workflow Automation Suite",
    description:
      "Designed configurable business-process automation applications that streamline approval workflows, notifications, and document management across departments.",
    tech: ["React", "Node.js", "MongoDB", "REST APIs"],
    github: "#",
    live: "#",
    gradient: "from-rose-500/10 via-pink-500/5 to-transparent",
    accentBorder: "border-rose-500/25 dark:border-rose-500/20",
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
        <div className="mb-3 flex items-center gap-2">
          <span className="section-num text-base">04.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Portfolio
          </span>
        </div>

        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Featured <span className="gradient-text">Projects</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.55 }}
              className={`card group relative flex flex-col overflow-hidden ${proj.accentBorder}`}
            >
              {/* Gradient tint */}
              <div
                className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${proj.gradient} opacity-60 pointer-events-none`}
              />

              <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                {/* Top row */}
                <div className="mb-5 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white/70 dark:bg-black/30 shadow-sm">
                      <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-4xl font-black text-slate-200/80 dark:text-white/10 select-none leading-none">
                      {proj.number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={proj.github}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white/60 dark:bg-black/20 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={proj.live}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white/60 dark:bg-black/20 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      title="Live"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
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
                    <span key={t} className="tag">
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
