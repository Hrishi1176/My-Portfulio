"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, School } from "lucide-react";

const educationItems = [
  {
    title: "Bachelor of Engineering",
    field: "Information Technology",
    school: "University Institute of Technology, The University of Burdwan",
    icon: GraduationCap,
    gradient: "from-purple-500/15 to-violet-500/10",
    iconBg: "bg-purple-100 dark:bg-purple-500/15",
    iconColor: "text-purple-600 dark:text-purple-400",
    border: "border-purple-400/25 dark:border-purple-500/20",
  },
  {
    title: "Diploma in Engineering",
    field: "Computer Science & Technology",
    school: "Siliguri Government Polytechnic",
    icon: Award,
    gradient: "from-blue-500/15 to-indigo-500/10",
    iconBg: "bg-blue-100 dark:bg-blue-500/15",
    iconColor: "text-blue-600 dark:text-blue-400",
    border: "border-blue-400/25 dark:border-blue-500/20",
  },
  {
    title: "Secondary Education",
    field: "Madhyamik",
    school: "CoochBehar Rambhola High School",
    icon: School,
    gradient: "from-emerald-500/15 to-teal-500/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-400/25 dark:border-emerald-500/20",
  },
];

export function Education() {
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
          <span className="section-num text-base">05.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Academic Background
          </span>
        </div>

        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          My <span className="gradient-text">Education</span>
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {educationItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className={`card group relative overflow-hidden ${item.border}`}
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${item.gradient} opacity-70 pointer-events-none`}
                />

                <div className="relative p-6 sm:p-7">
                  {/* Icon */}
                  <div className={`mb-5 inline-flex rounded-xl p-3 ${item.iconBg} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>

                  <h3 className="mb-1.5 text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className={`mb-2 font-semibold text-sm ${item.iconColor}`}>
                    {item.field}
                  </p>
                  <p className="text-sm leading-snug text-slate-500 dark:text-slate-500">
                    {item.school}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
