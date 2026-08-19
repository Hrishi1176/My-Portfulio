"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, School, Calendar, CheckCircle2 } from "lucide-react";
import { portfolioConfig } from "@/config/portfolioConfig";

const ICONS = [GraduationCap, Award, School];

export function Education() {
  const educationItems = portfolioConfig.education.map((item, index) => ({
    ...item,
    icon: ICONS[index % ICONS.length],
  }));

  return (
    <section id="education" className="scroll-mt-24 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        {/* Label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="section-num text-base">06.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Academic Background
          </span>
        </div>

        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          My <span className="gradient-text">Education</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {educationItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{ y: -6 }}
                className={`card group relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 transition-all duration-300 ${item.border}`}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${item.gradient} opacity-70 pointer-events-none`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Header with Icon and Period */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`inline-flex rounded-xl p-3 ${item.iconBg} transition-transform group-hover:scale-110 shadow-sm`}>
                        <Icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      {item.period && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-white/[0.05] border border-[var(--border)] px-2.5 py-1 rounded-full">
                          <Calendar className="h-3 w-3" />
                          {item.period}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-1 text-lg font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className={`mb-2.5 font-bold text-sm ${item.iconColor}`}>
                      {item.field}
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                      {item.school}
                    </p>
                  </div>

                  {item.grade && (
                    <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {item.grade}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
