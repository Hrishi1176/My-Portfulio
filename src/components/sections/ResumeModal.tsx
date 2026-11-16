"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Download, ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface ResumeModalProps {
  onClose: () => void;
  resumeUrl?: string;
  developerName?: string;
}

export function ResumeModal({
  onClose,
  resumeUrl = "/resume/Hrishi_Bhattacharyya_Resume.pdf",
  developerName = "Hrishi Bhattacharyya",
}: ResumeModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="glass-raised w-full max-w-5xl h-[92vh] sm:h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 border-b border-[var(--border)] bg-white/70 dark:bg-black/50">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-2">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-extrabold text-xs sm:text-base text-slate-900 dark:text-white truncate">
                <span className="sm:hidden">Resume</span>
                <span className="hidden sm:inline">Resume — {developerName}</span>
              </h3>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs sm:text-sm py-1.5 px-2.5 sm:px-4 rounded-xl flex items-center gap-1.5"
                title="Open in new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open Tab</span>
              </a>
              <a
                href={resumeUrl}
                download={`${developerName.replace(/\s+/g, "_")}_Resume.pdf`}
                className="btn-primary text-xs sm:text-sm py-1.5 px-2.5 sm:px-4 rounded-xl flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
              <button
                suppressHydrationWarning
                onClick={onClose}
                aria-label="Close Modal"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white/60 dark:bg-white/[0.04] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors ml-0.5 sm:ml-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Fallback Warning Strip (Visible only on mobile devices) */}
          <div className="sm:hidden bg-purple-950/80 border-b border-purple-500/30 px-3 py-2 flex items-center justify-between text-[11px] text-purple-200">
            <span>Viewing on phone? For best viewing:</span>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold underline flex items-center gap-1 ml-2"
            >
              Open Full PDF <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 bg-slate-100 dark:bg-black/30 relative">
            <iframe
              src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0"
              title={`${developerName} Resume`}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
