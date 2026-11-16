"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  ChevronUp,
  Sparkles,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Compass,
  Code2,
  Server,
  Database,
  Cloud,
  Brain,
  Trophy,
  Users,
  Film,
  CompassIcon,
  Play,
  Pause,
} from "lucide-react";
import {
  useRobotCompanion,
  ROBOTVERSE_AGENTS,
  RobotAgentId,
} from "@/context/RobotCompanionContext";

export function RobotCompanionHUD() {
  const {
    state,
    isEnabled,
    soundEnabled,
    activeScene,
    activeAgentId,
    navigationMode,
    isTourPlaying,
    setIsEnabled,
    toggleSound,
    setNavigationMode,
    toggleTourPlayPause,
    triggerSuccess,
    triggerError,
    goToScene,
    playSound,
  } = useRobotCompanion();

  const [isOpen, setIsOpen] = useState(false);

  const getAgentIcon = (id: RobotAgentId) => {
    switch (id) {
      case "nova":
        return Compass;
      case "codex":
        return Code2;
      case "matrix":
        return Server;
      case "orbit":
        return Database;
      case "cloudx":
        return Cloud;
      case "neura":
        return Brain;
      case "titan":
        return Trophy;
      case "all":
      default:
        return Users;
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-2.5 sm:left-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[calc(100vw-5rem)] sm:w-84 max-w-sm rounded-2xl border border-cyan-500/25 bg-slate-950/94 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl font-mono text-xs max-h-[82vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                      isEnabled ? "bg-cyan-400" : "bg-slate-500"
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      isEnabled ? "bg-cyan-500" : "bg-slate-600"
                    }`}
                  />
                </span>
                <div>
                  <span className="font-bold text-slate-100 tracking-wider text-[11px] block">
                    ROBOTVERSE // HUD
                  </span>
                  <span className="text-[9px] text-cyan-400/85 tracking-widest uppercase">
                    7-Agent Full-Stack Division
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Audio Sound FX Toggle */}
                <button
                  type="button"
                  onClick={toggleSound}
                  title={soundEnabled ? "Sound FX Enabled" : "Sound FX Muted"}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    soundEnabled
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30"
                      : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-400"
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Master Squad On/Off */}
                <button
                  type="button"
                  onClick={() => setIsEnabled(!isEnabled)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    isEnabled
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {isEnabled ? (
                    <>
                      <Eye className="w-3 h-3" /> ON
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> OFF
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mode Switcher: Cinematic Tour vs Free Exploration */}
            {isEnabled && (
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                  <span>Navigation Mode</span>
                  <span className="text-cyan-400">Scene 0{activeScene} / 09</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setNavigationMode("explore");
                      playSound("beep");
                    }}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                      navigationMode === "explore"
                        ? "border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <CompassIcon className="w-3.5 h-3.5" />
                    <span>Free Explore</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleTourPlayPause();
                    }}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                      isTourPlaying
                        ? "border-purple-400 bg-purple-950/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)] animate-pulse"
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isTourPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isTourPlaying ? "Pause Tour" : "Cinematic Tour"}</span>
                  </button>
                </div>

                {/* 7-Agent Tactical Roster & Scene Jumper */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] uppercase text-slate-400 font-semibold tracking-wider mb-1.5">
                    <span>Jump to Specialist</span>
                    <span className="text-[9px] text-emerald-400">Live Stage</span>
                  </div>

                  <div className="space-y-1">
                    {ROBOTVERSE_AGENTS.map((agent) => {
                      const Icon = getAgentIcon(agent.id);
                      const isCurrentActive =
                        activeAgentId === agent.id || (agent.id === "all" && activeScene === 9);

                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => goToScene(agent.sceneNumber)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left group cursor-pointer ${
                            isCurrentActive
                              ? "border-cyan-400/60 bg-gradient-to-r from-cyan-950/50 to-slate-900/60 text-slate-100 shadow-[0_0_14px_rgba(0,240,255,0.15)]"
                              : "border-slate-800/80 bg-slate-900/30 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="p-1.5 rounded-lg border flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: `${agent.accentColor}15`,
                                borderColor: `${agent.accentColor}40`,
                                color: agent.accentColor,
                              }}
                            >
                              <Icon className="w-3 h-3" />
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[11px] text-slate-200">
                                  {agent.name}
                                </span>
                                <span className="text-[9px] font-mono text-slate-500">
                                  [Scene 0{agent.sceneNumber}]
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-400 font-sans block truncate">
                                {agent.role}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                                isCurrentActive
                                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse"
                                  : "bg-slate-800/80 text-slate-500"
                              }`}
                            >
                              {isCurrentActive ? "ACTIVE" : "STANDBY"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>STATUS:</span>
                    <span className="font-bold text-cyan-300">{state.toUpperCase()}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        triggerSuccess();
                        playSound("chime");
                      }}
                      className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[9px] font-semibold cursor-pointer"
                    >
                      Salute
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerError();
                      }}
                      className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 text-[9px] font-semibold cursor-pointer"
                    >
                      Alert
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Pill Launcher */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full border shadow-xl backdrop-blur-xl transition-all cursor-pointer ${
          isOpen
            ? "border-cyan-400 bg-cyan-950/70 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            : "border-slate-800/90 bg-slate-950/85 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200"
        }`}
      >
        <div className="relative">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span
            className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${
              isEnabled ? "bg-emerald-400 shadow-[0_0_6px_#10b981]" : "bg-slate-500"
            }`}
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium">
          <span className="tracking-wider">ROBOTVERSE</span>
          <span className="text-[10px] text-slate-500">[7 AGENTS]</span>
        </div>
        <ChevronUp
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-cyan-400" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default RobotCompanionHUD;
