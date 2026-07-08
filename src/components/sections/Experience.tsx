"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    role: "Manager – Software Development Team",
    company: "eDge Wrapper Technology Pvt. Ltd.",
    period: "2023 – June 2026",
    type: "current",
    bullets: [
      "Led the design and development of a multi-tenant e-commerce platform using Next.js with RBAC.",
      "Built an enterprise Office Management System with HR, leave management, expense tracking, and task management.",
      "Managed and mentored software engineers across multiple concurrent projects.",
      "Optimised MySQL and PostgreSQL database performance for high-volume transactional systems.",
    ],
  },
  {
    role: "Associate Software Developer",
    company: "eDge Wrapper Technology Pvt. Ltd.",
    period: "2022 – 2023",
    type: "past",
    bullets: [
      "Developed a Snowflake and Python-based data platform supporting ETL pipelines, reporting, and analytics.",
      "Designed workflow automation applications supporting configurable business processes.",
      "Delivered custom WordPress solutions with SEO optimisation and responsive design.",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        {/* Label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="section-num text-base">03.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Work History
          </span>
        </div>

        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Professional <span className="gradient-text">Experience</span>
        </h2>

        <div className="glass p-6 sm:p-8 lg:p-10">
          {/* Timeline */}
          <div className="relative space-y-10">
            {/* Vertical track */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-purple-500 via-blue-400 to-slate-200 dark:to-slate-700 hidden sm:block" />

            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.55 }}
                className="relative sm:pl-10"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[1px] top-1 hidden sm:flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    exp.type === "current"
                      ? "border-purple-500 bg-purple-100 dark:bg-purple-900/40"
                      : "border-slate-400 bg-slate-100 dark:bg-slate-800 dark:border-slate-600"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      exp.type === "current" ? "bg-purple-500" : "bg-slate-400 dark:bg-slate-500"
                    }`}
                  />
                </div>

                <div className={`card p-5 sm:p-6 ${exp.type === "current" ? "border-purple-400/25 dark:border-purple-500/20" : ""}`}>
                  {/* Role & meta */}
                  <div className="mb-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3
                        className={`text-lg font-bold sm:text-xl ${
                          exp.type === "current"
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {exp.role}
                      </h3>
                      {exp.type === "current" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/50 bg-emerald-50 dark:border-emerald-500/25 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                        <span className={exp.type === "current" ? "font-semibold text-purple-600 dark:text-purple-400" : ""}>
                          {exp.company}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        Remote
                      </span>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-2.5">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                        <span
                          className={`mt-[3px] shrink-0 text-base leading-none ${
                            exp.type === "current" ? "text-purple-500 dark:text-purple-400" : "text-slate-400 dark:text-slate-600"
                          }`}
                        >
                          ▹
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
