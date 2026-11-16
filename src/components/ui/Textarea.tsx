import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          suppressHydrationWarning
          className={`w-full rounded-2xl border bg-white/70 dark:bg-white/[0.04] p-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 backdrop-blur-md outline-none focus:ring-2 focus:ring-purple-500/30 ${
            error
              ? "border-rose-500 focus:border-rose-500 dark:border-rose-500/50"
              : "border-[var(--border)] focus:border-purple-500 dark:focus:border-purple-400"
          } ${className}`}
          {...props}
        />

        {error ? (
          <p className="text-xs text-rose-500 font-semibold">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
