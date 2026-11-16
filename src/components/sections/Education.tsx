"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, School, Calendar, CheckCircle2 } from "lucide-react";
import { portfolioConfig, EducationConfig } from "@/config/portfolioConfig";
import { SectionHeader } from "@/components/ui";
import { TiltCard } from "@/components/3d/TiltCard";

const ICONS = [GraduationCap, Award, School];

interface EducationProps {
  education?: EducationConfig[];
}

export function Education({ education }: EducationProps = {}) {
  const sourceItems = education && education.length > 0 ? education : portfolioConfig.education;
  const educationItems = sourceItems.map((item, index) => ({
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
        <SectionHeader
          number="08."
          badge="Academic Background"
          title="Credentials ·"
          gradientText="Academic Vault"
        />

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
                className="h-full"
              >
                <TiltCard maxTilt={8} scale={1.02} glareEffect={true} className="h-full rounded-2xl">
                  <div
                    className="group relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 h-full rounded-2xl border border-white/5 bg-transparent transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.01]"
                  >
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
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
