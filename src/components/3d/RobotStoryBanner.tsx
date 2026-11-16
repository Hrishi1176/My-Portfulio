"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Code2,
  Server,
  Database,
  Cloud,
  Brain,
  Trophy,
  Users,
  ChevronRight,
} from "lucide-react";
import { useRobotCompanion, RobotAgentId } from "@/context/RobotCompanionContext";

interface StoryDialogue {
  id: RobotAgentId;
  name: string;
  codename: string;
  role: string;
  sceneTitle: string;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
  transmission: string;
  status: string;
}

const ROBOTVERSE_STORY: Record<string, StoryDialogue> = {
  nova: {
    id: "nova",
    name: "Nova",
    codename: "ROBOT-01 // GUIDE",
    role: "Portfolio Guide",
    sceneTitle: "SCENE 01 & 02 // THE ARRIVAL & ABOUT",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(0,240,255,0.25)",
    transmission:
      "Hello, I am Nova! Welcome to Hrishi's digital universe. Let my team show you the scalable architectures we build.",
    status: "NAVIGATING GATEWAY",
  },
  codex: {
    id: "codex",
    name: "Codex",
    codename: "ROBOT-02 // FRONTEND",
    role: "Frontend Engineer",
    sceneTitle: "SCENE 03 // FRONTEND DEVELOPMENT LAB",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    borderColor: "border-sky-500/30",
    glowColor: "rgba(56,189,248,0.25)",
    transmission:
      "Assembling floating UI components, Next.js 16 micro-frontends, and responsive design systems with TypeScript.",
    status: "COMPILING UI MESH",
  },
  matrix: {
    id: "matrix",
    name: "Matrix",
    codename: "ROBOT-03 // BACKEND",
    role: "Backend Engineer",
    sceneTitle: "SCENE 04 // BACKEND COMMAND CENTER",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(16,185,129,0.25)",
    transmission:
      "Synchronizing Node.js microservices, Python distributed tasks, and high-frequency REST API endpoints.",
    status: "ROUTING API PULSES",
  },
  orbit: {
    id: "orbit",
    name: "Orbit",
    codename: "ROBOT-04 // DATABASE",
    role: "Database Engineer",
    sceneTitle: "SCENE 05 // DATABASE CORE",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    borderColor: "border-purple-500/30",
    glowColor: "rgba(168,85,247,0.25)",
    transmission:
      "Optimizing MongoDB clusters, PostgreSQL relational schemas, and real-time ACID transactions.",
    status: "INDEXING DATA FLOW",
  },
  cloudx: {
    id: "cloudx",
    name: "Cloud-X",
    codename: "ROBOT-05 // DEVOPS",
    role: "DevOps & Cloud Engineer",
    sceneTitle: "SCENE 06 // CLOUD & DEVOPS STATION",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    borderColor: "border-orange-500/30",
    glowColor: "rgba(249,115,22,0.25)",
    transmission:
      "Deploying containerized Docker pods, automated GitHub Actions CI/CD pipelines, and AWS cloud infrastructure.",
    status: "DEPLOYING PODS",
  },
  neura: {
    id: "neura",
    name: "Neura",
    codename: "ROBOT-06 // AI LAB",
    role: "AI & Automation Engineer",
    sceneTitle: "SCENE 07 // ARTIFICIAL INTELLIGENCE UNIVERSE",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(6,182,212,0.25)",
    transmission:
      "Activating neural network synaptic weights, intelligent workflow automation, and multi-agent LLM systems.",
    status: "PROCESSING SYNAPSE",
  },
  titan: {
    id: "titan",
    name: "Titan",
    codename: "ROBOT-07 // ARENA",
    role: "System Architect",
    sceneTitle: "SCENE 08 // PROJECT ARENA",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245,158,11,0.25)",
    transmission:
      "Presenting Hrishi's verified production applications, real-time GitHub telemetry, and full-stack solutions.",
    status: "PRESENTING SHOWCASE",
  },
  all: {
    id: "all",
    name: "The Squad",
    codename: "ROBOT-07 // ASSEMBLY",
    role: "Full Engineering Division",
    sceneTitle: "SCENE 09 // CONTACT & FINAL MISSION",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    borderColor: "border-yellow-500/30",
    glowColor: "rgba(234,179,8,0.25)",
    transmission:
      "The next mission starts with you. All seven specialists are assembled. Let's build something extraordinary together!",
    status: "7 AGENTS ASSEMBLED",
  },
};

export function RobotStoryBanner() {
  const { activeAgentId, isEnabled } = useRobotCompanion();
  const [displayedText, setDisplayedText] = useState("");
  const currentStory = ROBOTVERSE_STORY[activeAgentId] || ROBOTVERSE_STORY.nova;

  // Typewriter effect on transmission change
  useEffect(() => {
    if (!currentStory) return;
    setDisplayedText("");
    let idx = 0;
    const fullText = currentStory.transmission;
    const interval = setInterval(() => {
      idx++;
      setDisplayedText(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [currentStory]);

  if (!isEnabled) return null;

  const getIcon = () => {
    switch (currentStory.id) {
      case "nova":
        return <Compass className="w-3.5 h-3.5 text-cyan-400" />;
      case "codex":
        return <Code2 className="w-3.5 h-3.5 text-sky-400" />;
      case "matrix":
        return <Server className="w-3.5 h-3.5 text-emerald-400" />;
      case "orbit":
        return <Database className="w-3.5 h-3.5 text-purple-400" />;
      case "cloudx":
        return <Cloud className="w-3.5 h-3.5 text-orange-400" />;
      case "neura":
        return <Brain className="w-3.5 h-3.5 text-cyan-400" />;
      case "titan":
        return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case "all":
      default:
        return <Users className="w-3.5 h-3.5 text-yellow-400" />;
    }
  };

  return (
    <div className="fixed top-20 sm:top-24 right-4 sm:right-8 z-30 pointer-events-none max-w-sm sm:max-w-md select-none hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0, x: 20, y: -5 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -20, y: -5 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl border ${currentStory.borderColor} bg-slate-950/85 p-3.5 shadow-2xl backdrop-blur-xl font-mono`}
          style={{ boxShadow: `0 8px 30px ${currentStory.glowColor}` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800/80 text-[10px]">
            <div className="flex items-center gap-2">
              {getIcon()}
              <span className="font-bold text-slate-200 tracking-wider">
                {currentStory.sceneTitle}
              </span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${currentStory.badgeColor}`}
            >
              {currentStory.status}
            </span>
          </div>

          {/* Unit Callout & Live Transmission */}
          <div className="mt-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-100 mb-1">
              <span className="text-cyan-400">{currentStory.name}</span>
              <span className="text-slate-500 font-normal">[{currentStory.codename}]</span>
              <ChevronRight className="w-3 h-3 text-slate-500 inline" />
              <span className="text-[10px] font-normal text-slate-400">{currentStory.role}</span>
            </div>
            <p className="text-[11px] font-sans leading-relaxed text-slate-300">
              {displayedText}
              <span className="inline-block w-1.5 h-3 ml-1 bg-cyan-400 animate-pulse align-middle" />
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default RobotStoryBanner;
