"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

export interface ToastProps {
  show: boolean;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
  duration?: number; // Duration in ms (default: 6000ms)
  onClose: () => void;
}

export function ToastNotification({
  show,
  type,
  title,
  message,
  duration = 6000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (show && message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, message, duration, onClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {show && message && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed top-24 right-4 sm:right-8 z-[100] max-w-md w-[calc(100vw-2rem)]"
        >
          <div
            className={`glass-raised p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-start gap-3.5 relative overflow-hidden ${
              isSuccess
                ? "border-emerald-500/40 bg-emerald-950/85 text-emerald-100"
                : "border-rose-500/40 bg-rose-950/85 text-rose-100"
            }`}
          >
            {/* Icon Badge */}
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isSuccess ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {isSuccess ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            </div>

            {/* Message Content */}
            <div className="flex-1 pr-4">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                {title || (isSuccess ? "Action Successful!" : "Notification Alert")}
                {isSuccess && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
              </h4>
              <p className="text-xs leading-relaxed opacity-90 mt-0.5">{message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Animated Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 ${
                isSuccess ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
