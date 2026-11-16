import React, { forwardRef } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "glass-raised" | "solid" | "bordered";
  hoverEffect?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "glass", hoverEffect = true, className = "", ...props }, ref) => {
    const variantStyles = {
      glass: "glass",
      "glass-raised": "glass-raised",
      solid: "bg-white dark:bg-slate-900 border border-[var(--border)] shadow-md rounded-3xl",
      bordered: "bg-transparent border border-[var(--border)] rounded-3xl",
    };

    const hoverClass = hoverEffect
      ? "transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:-translate-y-0.5"
      : "";

    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-3 space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-xl font-extrabold text-slate-900 dark:text-white tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-6 pt-0 flex items-center justify-between border-t border-[var(--border)] mt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
