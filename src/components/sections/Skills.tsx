"use client";

import { motion } from "framer-motion";
import { Layout, Server, Database, Wrench, Code2, Sparkles } from "lucide-react";
import { FaReact, FaPython, FaNodeJs, FaGitAlt, FaHtml5, FaCss3Alt, FaRobot } from "react-icons/fa";
import { SiNextdotjs, SiJavascript, SiTypescript, SiMongodb, SiMysql, SiPostgresql, SiSnowflake } from "react-icons/si";
import { BiNetworkChart, BiCheckShield, BiChalkboard } from "react-icons/bi";
import { TbApi } from "react-icons/tb";
import { portfolioConfig, SkillCategoryConfig, SkillItemConfig } from "@/config/portfolioConfig";
import { SectionHeader } from "@/components/ui";
import { TiltCard } from "@/components/3d/TiltCard";

// Dynamic Icon Map Lookup
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Layout,
  Server,
  Database,
  Wrench,
  Code2,
  FaReact,
  FaPython,
  FaNodeJs,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaRobot,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiSnowflake,
  BiNetworkChart,
  BiCheckShield,
  BiChalkboard,
  TbApi,
};

function renderSkillIcon(iconName: string, customColor?: string) {
  const IconComponent = ICON_MAP[iconName] || Code2;

  if (customColor && customColor.startsWith("#")) {
    return <IconComponent className="w-5 h-5 shrink-0" style={{ color: customColor }} />;
  }

  const colorClass = customColor || "text-purple-500";
  return <IconComponent className={`w-5 h-5 shrink-0 ${colorClass}`} />;
}

interface SkillsProps {
  categories?: SkillCategoryConfig[];
  marquee?: SkillItemConfig[];
}

export function Skills({ categories, marquee }: SkillsProps = {}) {
  const skillCategories = categories && categories.length > 0 ? categories : portfolioConfig.skills.categories;
  const marqueeSkills =
    marquee && marquee.length > 0
      ? marquee
      : skillCategories.flatMap((cat) => cat.skills);

  return (
    <section id="skills" className="scroll-mt-24 py-16 sm:py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65 }}
      >
        <SectionHeader
          number="03."
          badge="Technical Skills"
          title="Floor by Floor ·"
          gradientText="3D Skills Matrix"
          description="A multi-tier engineering stack constructed for enterprise resilience, reactive UI micro-frontends, and distributed systems."
        />

        {/* ── Live Infinite Marquee Skill Banner Slider ── */}
        <div className="mb-12 overflow-hidden py-3.5 relative">
          <div className="flex gap-6 sm:gap-8 whitespace-nowrap animate-scroll">
            {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/5 bg-transparent text-xs font-bold text-slate-200 shrink-0 hover:scale-105 hover:border-purple-500/40 hover:bg-white/[0.02] transition-all cursor-default"
              >
                {renderSkillIcon(item.icon, item.color)}
                <span className="font-semibold tracking-wide">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Isometric Category Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {skillCategories.map((cat, idx) => {
            const CategoryIcon = ICON_MAP[cat.icon] || Layout;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <TiltCard
                  maxTilt={12}
                  perspective={1200}
                  scale={1.03}
                  glareEffect={true}
                  className="h-full rounded-2xl"
                >
                  <div className="group relative h-full rounded-2xl border border-white/5 bg-transparent p-6 transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.02] hover:shadow-[0_15px_35px_rgba(168,85,247,0.1)] flex flex-col justify-between overflow-hidden">
                    {/* Top ambient highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-cyan-500/40 group-hover:via-purple-400 group-hover:to-cyan-400 transition-all duration-500" />

                    <div>
                      {/* Header in Z-3D depth */}
                      <div
                        style={{ transform: "translateZ(24px)" }}
                        className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-transparent px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <CategoryIcon className={`w-5 h-5 ${cat.iconColor}`} />
                          <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                            {cat.title}
                          </h3>
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </div>

                      {/* Skills list with micro-depth */}
                      <ul className="space-y-3" style={{ transform: "translateZ(14px)" }}>
                        {cat.skills.map((skill) => (
                          <li
                            key={skill.name}
                            className="flex items-center gap-3 text-sm font-medium text-slate-300 cursor-default group/item transition-all hover:translate-x-1"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-transparent shadow-sm group-hover/item:border-purple-500/30 group-hover/item:bg-white/[0.02] transition-all">
                              {renderSkillIcon(skill.icon, skill.color)}
                            </div>
                            <span className="group-hover/item:text-white transition-colors">
                              {skill.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Floor Metric Footer */}
                    <div
                      style={{ transform: "translateZ(10px)" }}
                      className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400"
                    >
                      <span>TIER 0{idx + 1}</span>
                      <span className="text-cyan-400">{cat.skills.length} MODULES</span>
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
