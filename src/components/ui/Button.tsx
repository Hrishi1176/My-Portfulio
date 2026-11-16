import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "glass" | "secondary";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "min-h-[38px] px-3.5 py-1.5 text-xs rounded-xl gap-1.5",
      md: "min-h-[44px] px-5 py-2.5 text-sm rounded-xl gap-2",
      lg: "min-h-[50px] px-7 py-3.5 text-base rounded-2xl gap-2.5",
    };

    const variantStyles = {
      primary:
        "text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 shadow-md hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] border border-purple-500/30",
      outline:
        "border border-purple-500/35 bg-purple-500/5 text-purple-600 dark:text-purple-300 hover:bg-purple-500/15 hover:border-purple-500/60 active:scale-[0.98]",
      ghost:
        "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-500/10 active:scale-[0.98]",
      glass:
        "border border-[var(--border)] bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl text-slate-800 dark:text-slate-100 hover:border-purple-400/50 hover:bg-white/90 dark:hover:bg-white/[0.12] shadow-sm",
      secondary:
        "border border-[var(--border)] bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800",
    };

    return (
      <button
        ref={ref}
        suppressHydrationWarning
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-bold tracking-tight select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
