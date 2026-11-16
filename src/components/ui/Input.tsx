import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-slate-400 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            suppressHydrationWarning
            className={`w-full rounded-2xl border bg-white/70 dark:bg-white/[0.04] py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-200 backdrop-blur-md outline-none focus:ring-2 focus:ring-purple-500/30 ${
              leftIcon ? "pl-11" : "pl-4"
            } ${rightIcon ? "pr-11" : "pr-4"} ${
              error
                ? "border-rose-500 focus:border-rose-500 dark:border-rose-500/50"
                : "border-[var(--border)] focus:border-purple-500 dark:focus:border-purple-400"
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3.5 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-500 font-semibold">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
