import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "emerald" | "amber" | "neutral" | "outline";
  size?: "sm" | "md";
  ping?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  ping = false,
  icon,
  className = "",
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3.5 py-1 text-xs",
  };

  const variantStyles = {
    primary:
      "bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/25",
    emerald:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300/50 dark:border-emerald-500/25",
    amber:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30",
    neutral:
      "bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300 border border-[var(--border)]",
    outline:
      "bg-transparent text-purple-600 dark:text-purple-300 border border-purple-500/30",
  };

  const pingColors = {
    primary: "bg-purple-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    neutral: "bg-slate-400",
    outline: "bg-purple-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {ping && (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pingColors[variant]} opacity-75`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${pingColors[variant]}`}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
