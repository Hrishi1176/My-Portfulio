"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Play,
  Pause,
  ChevronRight,
  X,
  Bot,
} from "lucide-react";
import { useRobotCompanion, RobotAgentId } from "@/context/RobotCompanionContext";

interface GuideStop {
  id: RobotAgentId;
  sceneNumber: number;
  name: string;
  role: string;
  speech: string;
  actionLabel: string;
  nextScene: number;
  color: string;
}

export function RobotTourGuide() {
  const {
    activeAgentId,
    activeScene,
    isEnabled,
    goToScene,
    isTourPlaying,
    toggleTourPlayPause,
    playSound,
    robots,
  } = useRobotCompanion();

  const [isDismissed, setIsDismissed] = useState(false);
  const [displayedSpeech, setDisplayedSpeech] = useState("");

  const activeBot = robots.find((r) => r.agentId === activeAgentId) || robots[0];
  const nextSceneNum = activeBot ? (activeBot.sceneNumber >= 9 ? 1 : activeBot.sceneNumber + 1) : 1;

  const currentStop: GuideStop = activeBot
    ? {
        id: (activeBot.agentId as RobotAgentId) || "nova",
        sceneNumber: activeBot.sceneNumber,
        name: activeBot.name,
        role: activeBot.role,
        speech: activeBot.tourSpeech || activeBot.transmission,
        actionLabel: activeBot.tourActionLabel || "Explore Next Lab",
        nextScene: nextSceneNum,
        color: activeBot.glowColor,
      }
    : {
        id: "nova" as RobotAgentId,
        sceneNumber: 1,
        name: "Nova",
        role: "Portfolio Guide",
        speech: "Welcome to Hrishi's technology universe.",
        actionLabel: "Explore Lab",
        nextScene: 3,
        color: "#00f0ff",
      };
  const autoTourTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect on dialogue change
  useEffect(() => {
    if (!currentStop) return;
    setDisplayedSpeech("");
    let idx = 0;
    const text = currentStop.speech;
    const interval = setInterval(() => {
      idx++;
      setDisplayedSpeech(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [currentStop]);

  // Handle Auto-Tour progression
  useEffect(() => {
    if (isTourPlaying) {
      autoTourTimerRef.current = setTimeout(() => {
        const nextSceneNum = currentStop.nextScene;
        goToScene(nextSceneNum);
      }, 7000);
    } else {
      if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);
    }

    return () => {
      if (autoTourTimerRef.current) clearTimeout(autoTourTimerRef.current);
    };
  }, [isTourPlaying, currentStop, goToScene]);

  if (!isEnabled) return null;

  return (
    <aside
      aria-label="Interactive Tour Guide"
      className="fixed bottom-24 left-6 z-40 max-w-sm sm:max-w-md select-none font-mono"
    >
      <AnimatePresence>
        {!isDismissed ? (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-cyan-500/30 bg-slate-950/94 p-4 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-xs relative overflow-hidden"
            style={{
              boxShadow: `0 8px 32px ${currentStop.color}25`,
              borderColor: `${currentStop.color}45`,
            }}
          >
            {/* Top ambient color light beam */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-75 transition-colors duration-500"
              style={{
                background: `linear-gradient(90deg, transparent, ${currentStop.color}, transparent)`,
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ backgroundColor: currentStop.color }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: currentStop.color }}
                  />
                </span>
                <span className="font-bold text-slate-200 tracking-wider text-[11px]">
                  ROBOTVERSE GUIDE // {currentStop.name.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Auto Tour Toggle */}
                <button
                  type="button"
                  onClick={toggleTourPlayPause}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer border ${
                    isTourPlaying
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/50 animate-pulse"
                      : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200"
                  }`}
                  title="Auto-guided tour of all 9 scenes"
                >
                  {isTourPlaying ? (
                    <>
                      <Pause className="w-2.5 h-2.5" /> STOP
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5" /> AUTO TOUR
                    </>
                  )}
                </button>

                {/* Dismiss */}
                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title="Minimize Tour Guide"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Speech Body */}
            <div className="mt-3">
              <p className="text-[12px] font-sans text-slate-200 leading-relaxed min-h-[38px]">
                {displayedSpeech}
                <span
                  className="inline-block w-1.5 h-3 ml-1 animate-pulse align-middle"
                  style={{ backgroundColor: currentStop.color }}
                />
              </p>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[9px] text-slate-500 font-mono">
                  SCENE 0{currentStop.sceneNumber} // {currentStop.role.toUpperCase()}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    playSound("warp");
                    goToScene(currentStop.nextScene);
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer border shadow-sm group"
                  style={{
                    backgroundColor: `${currentStop.color}18`,
                    color: currentStop.color,
                    borderColor: `${currentStop.color}50`,
                  }}
                >
                  <span>{currentStop.actionLabel}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsDismissed(false)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-cyan-500/35 bg-slate-950/92 text-cyan-300 shadow-xl backdrop-blur-xl text-xs hover:border-cyan-400 transition-all cursor-pointer font-mono"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open Tour Guide</span>
          </motion.button>
        )}
      </AnimatePresence>
    </aside>
  );
}

export default RobotTourGuide;
