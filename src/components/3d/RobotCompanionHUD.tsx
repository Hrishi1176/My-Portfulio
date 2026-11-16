"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronUp, Sparkles, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRobotCompanion, RobotModelType } from "@/context/RobotCompanionContext";

export function RobotCompanionHUD() {
  const {
    state,
    modelType,
    isEnabled,
    setModelType,
    setIsEnabled,
    triggerSuccess,
    triggerError,
  } = useRobotCompanion();

  const [isOpen, setIsOpen] = useState(false);

  const modelOptions: Array<{ id: RobotModelType; label: string; desc: string }> = [
    { id: "squad", label: "Squad", desc: "Dual Mecha Formation" },
    { id: "sentinel", label: "Titan", desc: "Tactical Alpha Mech" },
    { id: "eve", label: "Acrobat", desc: "Ceramic Beta Mech" },
    { id: "scout", label: "Scout", desc: "Aero Drone Escort" },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-72 rounded-2xl border border-cyan-500/20 bg-slate-950/90 p-4 shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl font-mono text-xs"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                      isEnabled ? "bg-cyan-400" : "bg-slate-500"
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      isEnabled ? "bg-cyan-500" : "bg-slate-600"
                    }`}
                  />
                </span>
                <span className="font-bold text-slate-200 tracking-wider">3D CYBER COMPANION</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEnabled(!isEnabled)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  isEnabled
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
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

            {/* Formation Selector */}
            {isEnabled && (
              <div className="mt-3 space-y-2">
                <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                  Formation Mode
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {modelOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setModelType(opt.id)}
                      className={`flex flex-col text-left p-2 rounded-lg border transition-all cursor-pointer ${
                        modelType === opt.id
                          ? "border-cyan-500 bg-cyan-500/15 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      <span className="font-bold text-[11px]">{opt.label}</span>
                      <span className="text-[9px] text-slate-400 font-sans">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Telemetry Status & Interactive Triggers */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span>STATE:</span>
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        state === "error"
                          ? "text-red-400"
                          : state === "success"
                          ? "text-emerald-400"
                          : state === "verifying" || state === "typing"
                          ? "text-amber-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {state}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={triggerSuccess}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 text-[10px] cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      Cheer
                    </button>
                    <button
                      type="button"
                      onClick={triggerError}
                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 text-[10px] cursor-pointer transition-all"
                    >
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      Shake
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main HUD Pill Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-slate-950/80 hover:bg-slate-900/90 text-cyan-300 hover:text-white backdrop-blur-xl shadow-[0_4px_20px_rgba(0,240,255,0.15)] transition-all cursor-pointer font-mono text-xs"
        title="Toggle 3D Robot Telemetry HUD"
      >
        <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition-transform">
          <Bot className="w-3.5 h-3.5" />
        </div>
        <span className="font-bold tracking-wider text-[11px]">
          {isEnabled ? `MECHA: ${modelType.toUpperCase()}` : "MECHA: OFF"}
        </span>
        <ChevronUp
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default RobotCompanionHUD;
