"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Copy, Check, MessageSquare, ExternalLink, Sparkles } from "lucide-react";
import type { DeveloperConfig } from "@/config/portfolioConfig";
import { soundFX } from "@/utils/audioFX";

interface WhatsAppToggleProps {
  developer?: DeveloperConfig;
}

const DEFAULT_DEV: DeveloperConfig = {
  name: "Hrishi Bhattacharya",
  firstName: "Hrishi",
  lastName: "Bhattacharyya",
  initials: "HB",
  role: "Senior Software Developer",
  title: "Senior Full Stack Engineer & System Architect",
  experienceYears: "4.4",
  email: "hrishisgp97@gmail.com",
  phone: "+91 62946 60141",
  whatsapp: "+91 62946 60141",
  location: "Kolkata, India",
  github: "https://github.com/Hrishi1176",
  linkedin: "https://linkedin.com/in/hrishi-bhattacharyya",
  instagram: "",
  facebook: "",
};

const PRESET_TOPICS = [
  {
    label: "🚀 Discuss a New Project",
    text: "Hi Hrishi, I came across your portfolio and I would like to discuss a new software project with you.",
  },
  {
    label: "💼 Contract / Full-Time Role",
    text: "Hi Hrishi, I was impressed by your portfolio and would like to discuss a software engineering opportunity.",
  },
  {
    label: "⚡ 3D & AI Web Application",
    text: "Hi Hrishi, I love the 3D robots and interactive architecture on your site! Can we explore building something similar?",
  },
  {
    label: "📅 Book a Consultation",
    text: "Hi Hrishi, I'd like to schedule a 30-minute technical discovery call with you regarding an upcoming build.",
  },
];

export function WhatsAppToggle({ developer }: WhatsAppToggleProps) {
  const dev = developer || DEFAULT_DEV;
  const cleanNumber = dev.whatsapp.replace(/[^0-9]/g, "");

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      soundFX.wakeChirp(0.06);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleLaunchWhatsApp = (customText?: string) => {
    const textToSend = customText || message.trim() || `Hi ${dev.firstName}, I am reaching out from your portfolio website!`;
    const encoded = encodeURIComponent(textToSend);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;
    soundFX.wakeChirp(0.08);
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(dev.whatsapp);
    setCopied(true);
    soundFX.wakeChirp(0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* ── Floating WhatsApp Action Button ── */}
      <div className="fixed bottom-24 right-6 z-40">
        <div className="relative group">
          {/* Tooltip on hover */}
          <AnimatePresence>
            {isHovered && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900/95 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md pointer-events-none flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Chat on WhatsApp
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            suppressHydrationWarning
            onClick={() => setIsOpen((prev) => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ${
              isOpen
                ? "bg-slate-800 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                : "bg-gradient-to-tr from-[#128C7E] to-[#25D366] shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.65)]"
            }`}
            aria-label="Direct WhatsApp Chat with Hrishi"
          >
            {/* Ripple Pulse Rings */}
            {!isOpen && (
              <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            )}

            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <>
                {/* Official WhatsApp SVG Icon */}
                <svg
                  className="w-7 h-7 fill-white drop-shadow-sm"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.101-.476-.15-.677.15-.2.3-.778.98-.953 1.181-.176.2-.351.226-.652.075-.3-.151-1.268-.468-2.416-1.492-.893-.798-1.496-1.784-1.672-2.085-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.175.201-.3.301-.501.101-.2.05-.376-.025-.526-.075-.151-.677-1.632-.928-2.235-.244-.587-.493-.507-.677-.517-.176-.008-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.513c0 1.482 1.079 2.912 1.23 3.113.15.2 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.636.723.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.431.25-.703.25-1.306.175-1.431-.075-.125-.276-.2-.577-.35zM12.04 2C6.518 2 2.037 6.48 2.037 12c0 1.942.556 3.754 1.523 5.29L2 22l4.862-1.525C8.344 21.365 10.138 22 12.04 22c5.522 0 10.003-4.48 10.003-10S17.562 2 12.04 2zm0 18.28c-1.657 0-3.2-.472-4.524-1.288l-.325-.198-2.88.903.924-2.809-.214-.337A8.257 8.257 0 013.75 12c0-4.57 3.717-8.288 8.29-8.288 4.573 0 8.29 3.718 8.29 8.288 0 4.57-3.717 8.28-8.29 8.28z" />
                </svg>

                {/* Online status indicator pip */}
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ── Interactive WhatsApp Quick-Chat Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-[10.5rem] right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-slate-950/95 backdrop-blur-2xl"
          >
            {/* 1. Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 p-4 border-b border-emerald-600/30 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar with Status Pip */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-white text-base shadow-md border border-white/20">
                      {dev.initials}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-white tracking-tight">
                        {dev.name}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold">
                        Dev
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-100/80 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Typically replies in 15 mins
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-emerald-100 hover:text-white transition-colors"
                  aria-label="Close WhatsApp chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Conversation Simulator Body */}
            <div className="p-4 bg-slate-900/60 max-h-[360px] overflow-y-auto space-y-3.5">
              {/* Automated Greeting Bubble from Hrishi */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-300 shrink-0 mt-1">
                  HB
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-200 shadow-md leading-relaxed">
                  <p className="font-medium">
                    Hey there! 👋 Thanks for stopping by my portfolio.
                  </p>
                  <p className="mt-1.5 text-slate-300">
                    Feel free to start a direct WhatsApp chat with me to discuss project scope, architecture, or full-stack contracts.
                  </p>
                  <div className="text-[9px] text-slate-500 text-right mt-1.5">
                    {currentTime} • Verified
                  </div>
                </div>
              </div>

              {/* Quick Topic Chips */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Quick Conversation Starters
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {PRESET_TOPICS.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMessage(topic.text);
                        handleLaunchWhatsApp(topic.text);
                      }}
                      className="text-left text-xs bg-slate-950/80 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 p-2.5 rounded-xl transition-all flex items-center justify-between group"
                    >
                      <span className="font-medium text-[11px]">{topic.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Phone Number Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px]">
                  WhatsApp: <strong className="text-slate-200">{dev.whatsapp}</strong>
                </span>
                <button
                  onClick={handleCopyPhone}
                  className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3. Custom Message Textarea Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800/80">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleLaunchWhatsApp();
                    }
                  }}
                  rows={2}
                  maxLength={300}
                  placeholder="Type your WhatsApp message..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/70 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-500">
                  {message.length}/300 chars
                </span>

                <button
                  onClick={() => handleLaunchWhatsApp()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Open WhatsApp</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
