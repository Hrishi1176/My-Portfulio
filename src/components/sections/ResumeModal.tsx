"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Download } from "lucide-react";
import { useEffect } from "react";

export function ResumeModal({ onClose }: { onClose: () => void }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={   { opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="glass-raised w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-white/60 dark:bg-black/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Resume — Hrishi Bhattacharya
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/resume/Hrishi_Bhattacharya_Resume.pdf"
                download
                className="btn-outline text-sm py-1.5 px-4 rounded-xl"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white/60 dark:bg-white/[0.04] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* PDF viewer */}
          <div className="flex-1 bg-slate-100 dark:bg-black/20">
            <iframe
              src="/resume/Hrishi_Bhattacharya_Resume.pdf"
              className="w-full h-full border-0"
              title="Hrishi Bhattacharya Resume"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
