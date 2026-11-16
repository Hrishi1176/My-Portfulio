"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[] | string[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
}

export function Tabs({
  items,
  activeId,
  onChange,
  className = "",
  layoutId = "active-tab-pill",
}: TabsProps) {
  const normalizedItems: TabItem[] = items.map((item) =>
    typeof item === "string" ? { id: item, label: item } : item
  );

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/70 dark:bg-white/[0.04] p-1.5 backdrop-blur-xl shadow-sm ${className}`}
    >
      {normalizedItems.map((tab) => {
        const isActive = activeId === tab.id;

        return (
          <button
            suppressHydrationWarning
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 select-none cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? "text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
