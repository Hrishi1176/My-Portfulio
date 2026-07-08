"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted]   = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)]
        bg-white/60 dark:bg-white/[0.06] shadow-sm transition-all duration-200
        hover:border-purple-400/50 hover:bg-purple-50/60 dark:hover:bg-purple-900/20"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
          animate={{ rotate:   0, opacity: 1, scale: 1   }}
          exit={   { rotate:  30, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.22 }}
          className="absolute"
        >
          {isDark
            ? <Sun  className="h-4 w-4 text-amber-400" />
            : <Moon className="h-4 w-4 text-slate-600" />
          }
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
