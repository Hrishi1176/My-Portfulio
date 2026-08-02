"use client";

import { motion } from "framer-motion";
import { Layout, Server, Database, Wrench } from "lucide-react";
import { FaReact, FaPython, FaNodeJs, FaGitAlt, FaHtml5, FaCss3Alt, FaRobot } from "react-icons/fa";
import { SiNextdotjs, SiJavascript, SiTypescript, SiMongodb, SiMysql, SiPostgresql, SiSnowflake } from "react-icons/si";
import { BiNetworkChart, BiCheckShield, BiChalkboard } from "react-icons/bi";
import { TbApi } from "react-icons/tb";

const skillCategories = [
  {
    title: "Frontend",
    icon: Layout,
    iconColor: "text-blue-500",
    accent: "from-blue-500/15 to-cyan-500/10",
    border: "border-blue-500/30 dark:border-blue-500/25",
    skills: [
      { name: "React.js", icon: <FaReact className="w-5 h-5 text-[#61DAFB]" /> },
      { name: "Next.js 16", icon: <SiNextdotjs className="w-5 h-5 text-black dark:text-white" /> },
      { name: "TypeScript", icon: <SiTypescript className="w-5 h-5 text-[#3178C6]" /> },
      { name: "JavaScript", icon: <SiJavascript className="w-5 h-5 text-[#F7DF1E]" /> },
      { name: "HTML5", icon: <FaHtml5 className="w-5 h-5 text-[#E34F26]" /> },
      { name: "CSS3 / Tailwind", icon: <FaCss3Alt className="w-5 h-5 text-[#1572B6]" /> },
    ],
  },
  {
    title: "Backend & APIs",
    icon: Server,
    iconColor: "text-emerald-500",
    accent: "from-emerald-500/15 to-green-500/10",
    border: "border-emerald-500/30 dark:border-emerald-500/25",
    skills: [
      { name: "Python", icon: <FaPython className="w-5 h-5 text-[#3776AB]" /> },
      { name: "Node.js", icon: <FaNodeJs className="w-5 h-5 text-[#339933]" /> },
      { name: "REST / WebSockets", icon: <TbApi className="w-5 h-5 text-purple-400" /> },
    ],
  },
  {
    title: "Databases & Cloud",
    icon: Database,
    iconColor: "text-amber-500",
    accent: "from-amber-500/15 to-yellow-500/10",
    border: "border-amber-500/30 dark:border-amber-500/25",
    skills: [
      { name: "MongoDB", icon: <SiMongodb className="w-5 h-5 text-[#47A248]" /> },
      { name: "MySQL", icon: <SiMysql className="w-5 h-5 text-[#4479A1]" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5 text-[#4169E1]" /> },
      { name: "Snowflake", icon: <SiSnowflake className="w-5 h-5 text-[#29B5E8]" /> },
    ],
  },
  {
    title: "Tools & AI",
    icon: Wrench,
    iconColor: "text-purple-500",
    accent: "from-purple-500/15 to-violet-500/10",
    border: "border-purple-500/30 dark:border-purple-500/25",
    skills: [
      { name: "AI Agents & LLMs", icon: <FaRobot className="w-5 h-5 text-purple-500" /> },
      { name: "Git & GitHub", icon: <FaGitAlt className="w-5 h-5 text-[#F05032]" /> },
      { name: "System Design", icon: <BiNetworkChart className="w-5 h-5 text-teal-500" /> },
      { name: "CI / CD Pipelines", icon: <BiChalkboard className="w-5 h-5 text-blue-500" /> },
      { name: "Agile & DevOps", icon: <BiCheckShield className="w-5 h-5 text-orange-500" /> },
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        {/* Label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="section-num text-base">02.</span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Technical Skills
          </span>
        </div>

        <h2 className="mb-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          My <span className="gradient-text">Core Skills & Stack</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className={`card group relative overflow-hidden p-6 transition-all duration-300 ${cat.border}`}
              >
                {/* Accent gradient overlay */}
                <div
                  className={`absolute inset-0 rounded-[1.25rem] bg-gradient-to-br ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />

                {/* Header */}
                <div className={`relative mb-5 flex items-center gap-3 rounded-xl border ${cat.border} bg-white/70 dark:bg-white/[0.05] px-3.5 py-2.5 backdrop-blur-md`}>
                  <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{cat.title}</h3>
                </div>

                {/* Skills list */}
                <ul className="relative space-y-3">
                  {cat.skills.map((skill) => (
                    <motion.li
                      key={skill.name}
                      whileHover={{ x: 4, scale: 1.02 }}
                      className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-default"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-white dark:bg-slate-900 shadow-sm group-hover:shadow-md transition-shadow">
                        {skill.icon}
                      </div>
                      <span>{skill.name}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
