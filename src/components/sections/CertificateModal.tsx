"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Award, X, Download, ExternalLink, Calendar, Building2, UserCheck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CertificateModalProps {
  onClose: () => void;
}

export function CertificateModal({ onClose }: CertificateModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
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
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="glass-raised w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto rounded-2xl shadow-2xl border border-white/20 dark:border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-white/80 dark:bg-black/40 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  Experience Certificate
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Edgewrapper Technology Private Limited
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/certificates/experience-certificate.png"
                download="Hrishi_Bhattacharya_Experience_Certificate.png"
                className="btn-outline text-xs sm:text-sm py-1.5 px-3.5 rounded-xl flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-slate-100 dark:bg-white/[0.06] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Certificate Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/30">
            {/* Image Preview Container */}
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-inner">
              <div 
                className={`relative w-full cursor-zoom-in transition-all duration-300 ${isZoomed ? "max-h-none" : "max-h-[55vh]"}`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <Image
                  src="/certificates/experience-certificate.png"
                  alt="Hrishi Bhattacharya Experience Certificate - Edgewrapper Technology"
                  width={1200}
                  height={850}
                  priority
                  className="w-full h-auto object-contain rounded-lg shadow-md"
                />
                
                {/* Click hint overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-end justify-end p-3 pointer-events-none">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {isZoomed ? "Click to fit" : "Click to enlarge"}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-start gap-3">
                <Building2 className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Organization</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Edgewrapper Tech Pvt. Ltd.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-start gap-3">
                <UserCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Designation</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Associate → Manager</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-start gap-3">
                <Calendar className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Tenure</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">01-Mar-2022 – 29-Jun-2026</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Authorized By</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Pritam Nandi (Founder & CEO)</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
