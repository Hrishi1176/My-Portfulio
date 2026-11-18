"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, AlertCircle, Loader2, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRobotCompanion } from "@/context/RobotCompanionContext";
import dynamic from "next/dynamic";

const ChatbotRobotCompanion = dynamic(
  () => import("@/components/3d/ChatbotRobotCompanion").then((mod) => mod.ChatbotRobotCompanion),
  { ssr: false }
);

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  provider?: string;
  latencyMs?: number;
}

const AVAILABLE_AI_MODELS = [
  { id: "auto", name: "Auto", badge: "⚡ Smart Router", color: "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" },
  { id: "llama-3.3-70b", name: "Llama 3.3", badge: "Groq 70B", color: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0", badge: "Google AI", color: "border-sky-500/40 text-sky-300 bg-sky-500/10" },
  { id: "deepseek-r1", name: "DeepSeek R1", badge: "Reasoning", color: "border-purple-500/40 text-purple-300 bg-purple-500/10" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5", badge: "Anthropic", color: "border-amber-500/40 text-amber-300 bg-amber-500/10" },
  { id: "gpt-4o-mini", name: "GPT-4o", badge: "OpenAI", color: "border-blue-500/40 text-blue-300 bg-blue-500/10" },
];

import type { DeveloperConfig } from "@/config/portfolioConfig";

interface AIChatbotProps {
  aiConfig?: {
    maxDailyChats: number;
    maxDailyRefinements: number;
    suggestedPrompts: string[];
  };
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

function getTodayCookieKey() {
  const d = new Date();
  return `chat_req_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getFormattedTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function generateMessageId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `msg_${Math.random().toString(36).substring(2, 9)}`;
}

export function AIChatbot({ aiConfig, developer }: AIChatbotProps = {}) {
  const dev = developer || DEFAULT_DEV;
  const MAX_DAILY_REQUESTS = aiConfig?.maxDailyChats || 10;
  const SUGGESTED_PROMPTS =
    aiConfig?.suggestedPrompts && aiConfig.suggestedPrompts.length > 0
      ? aiConfig.suggestedPrompts
      : [
          "Tell me about Hrishi's experience",
          "What projects has he built?",
          "What is his tech stack?",
          "How can I contact Hrishi?",
        ];

  const INITIAL_MESSAGES: ChatMessage[] = [
    {
      id: "welcome",
      sender: "bot",
      text: `Hi! I am ${dev.firstName}'s AI Portfolio Assistant 🤖. Ask me anything about his ${dev.experienceYears} years of experience, Next.js & Python projects, or technical skills!`,
      timestamp: "Online",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestsToday, setRequestsToday] = useState(0);
  const [selectedModel, setSelectedModel] = useState<string>("auto");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { setActiveField, setState: setRobotState, triggerTyping: triggerRobotTyping } = useRobotCompanion();

  // Sync open state with 3D robot companion telemetry
  useEffect(() => {
    if (isOpen) {
      setActiveField("chat");
    } else {
      setActiveField("none");
    }
  }, [isOpen, setActiveField]);

  // Load request count from secure browser cookie
  useEffect(() => {
    const key = getTodayCookieKey();
    const count = Cookies.get(key);
    if (count) {
      const parsed = parseInt(count, 10);
      queueMicrotask(() => {
        setRequestsToday(parsed);
      });
    }
  }, []);

  // Auto-scroll chat history
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    // Check Cookie Rate Limit (Max 10 per day)
    const key = getTodayCookieKey();
    const currentCount = parseInt(Cookies.get(key) || "0", 10);

    if (currentCount >= MAX_DAILY_REQUESTS) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          sender: "user",
          text: query,
          timestamp: getFormattedTime(),
        },
        {
          id: generateMessageId(),
          sender: "bot",
          text: `⚠️ Daily free AI chat limit reached (${MAX_DAILY_REQUESTS}/${MAX_DAILY_REQUESTS} requests for today). Please contact ${dev.firstName} directly using the Contact Form below or via WhatsApp (${dev.whatsapp})!`,
          timestamp: getFormattedTime(),
        },
      ]);
      setInput("");
      return;
    }

    // Increment request count in cookie (expires in 1 day, SameSite=Lax)
    const newCount = currentCount + 1;
    Cookies.set(key, String(newCount), { expires: 1, sameSite: "lax" });
    setRequestsToday(newCount);

    // Add user message
    const userMsg: ChatMessage = {
      id: generateMessageId(),
      sender: "user",
      text: query,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setRobotState("verifying");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, model: selectedModel }),
      });

      const data = await res.json();
      const botReply = data.reply || "I am currently unable to process your request. Please try contacting Hrishi directly.";

      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          sender: "bot",
          text: botReply,
          timestamp: getFormattedTime(),
          provider: data.provider,
          latencyMs: data.latencyMs,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          sender: "bot",
          text: "Network error processing AI query. Please contact Hrishi at hrishisgp97@gmail.com.",
          timestamp: getFormattedTime(),
        },
      ]);
    } finally {
      setLoading(false);
      setRobotState("idle");
    }
  };

  const remaining = Math.max(0, MAX_DAILY_REQUESTS - requestsToday);
  const chatbotCompanionState = loading
    ? "responding"
    : input.trim().length > 0
    ? "listening"
    : "idle";

  return (
    <>
      {/* Dedicated 3D AI Robot Companion (AXIOM) */}
      <ChatbotRobotCompanion isOpen={isOpen} state={chatbotCompanionState} />

      {/* Floating Trigger Button in Bottom Right */}
      <div className="fixed bottom-4 sm:bottom-6 right-3.5 sm:right-6 z-50">
        <motion.button
          suppressHydrationWarning
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 text-white shadow-[0_8px_30px_rgba(124,58,237,0.5)] transition-all hover:shadow-[0_12px_40px_rgba(124,58,237,0.7)]"
          aria-label="AI Portfolio Assistant Chat"
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <>
              <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
                  {remaining}
                </span>
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Expandable Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-4 sm:bottom-24 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[380px] h-[520px] max-h-[85vh] flex flex-col rounded-2xl sm:rounded-3xl glass-raised overflow-hidden shadow-2xl border border-purple-500/30 bg-slate-950/90 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border)] bg-white/5 dark:bg-black/30">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    Hrishi&apos;s AI Assistant
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online • {remaining} / {MAX_DAILY_REQUESTS} daily chats free
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Model Selector Pill Bar */}
            <div className="px-3 py-1.5 border-b border-white/5 bg-slate-950/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-mono">
              <span className="text-slate-500 shrink-0 flex items-center gap-1 pl-1">
                <Cpu className="w-3 h-3 text-purple-400" /> Model:
              </span>
              {AVAILABLE_AI_MODELS.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m.id)}
                    className={`shrink-0 px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? `${m.color} font-bold shadow-sm ring-1 ring-white/10`
                        : "border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 bg-slate-900/40"
                    }`}
                  >
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none shadow-md"
                        : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm whitespace-pre-line"
                    }`}
                  >
                    {msg.text}
                    {msg.sender === "bot" && msg.provider ? (
                      <div className="flex items-center justify-between text-[9px] mt-2 pt-1 border-t border-slate-800/60 text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                          <Sparkles className="w-2.5 h-2.5" /> {msg.provider}
                          {msg.latencyMs && <span className="text-slate-500 font-normal">· {msg.latencyMs}ms</span>}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    ) : (
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          msg.sender === "user" ? "text-purple-200" : "text-slate-500"
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/90 border border-slate-800 text-slate-400 rounded-2xl rounded-bl-none p-3 flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                    <span>AI thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Suggestions */}
            {messages.length <= 2 && remaining > 0 && (
              <div className="px-3 py-2 border-t border-[var(--border)] bg-slate-950/40 flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    suppressHydrationWarning
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-2.5 py-1 rounded-full transition-colors truncate max-w-full"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 border-t border-[var(--border)] bg-slate-950">
              {remaining <= 0 ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Daily limit reached (10/10). Contact Hrishi via the form or WhatsApp!</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    id="ai-chat-input"
                    suppressHydrationWarning
                    type="text"
                    placeholder="Ask AI about Hrishi..."
                    value={input}
                    onFocus={() => setActiveField("chat")}
                    onBlur={() => setActiveField("none")}
                    onChange={(e) => {
                      setInput(e.target.value);
                      triggerRobotTyping("chat");
                    }}
                    disabled={loading}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50 transition-colors shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
