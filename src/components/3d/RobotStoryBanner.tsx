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

export function RobotStoryBanner() {
  const { activeAgentId, isEnabled, robots } = useRobotCompanion();
  const [displayedText, setDisplayedText] = useState("");

  const activeBot = robots.find((r) => r.agentId === activeAgentId) || robots[0];
  const currentStory: StoryDialogue = activeBot
    ? {
        id: (activeBot.agentId as RobotAgentId) || "nova",
        name: activeBot.name,
        codename: activeBot.codename,
        role: activeBot.role,
        sceneTitle: activeBot.sector,
        badgeColor: activeBot.badgeColor,
        borderColor: activeBot.borderColor,
        glowColor: activeBot.glowRgba || "rgba(0,240,255,0.25)",
        transmission: activeBot.transmission,
        status: activeBot.status,
      }
    : {
        id: "nova" as RobotAgentId,
        name: "Nova",
        codename: "ROBOT-01 // GUIDE",
        role: "Portfolio Guide",
        sceneTitle: "SCENE 01 // THE ARRIVAL",
        badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        borderColor: "border-cyan-500/30",
        glowColor: "rgba(0,240,255,0.25)",
        transmission: "Welcome to Hrishi's technology universe.",
        status: "ONLINE",
      };

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
