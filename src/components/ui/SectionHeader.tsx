import React from "react";

export interface SectionHeaderProps {
  number?: string;
  badge?: string;
  title: string;
  gradientText?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  number,
  badge,
  title,
  gradientText,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-8 sm:mb-10 ${
        isCenter ? "text-center mx-auto max-w-2xl flex flex-col items-center" : "text-left"
      } ${className}`}
    >
      {/* Number and Badge Header */}
      {(number || badge) && (
        <div
          className={`mb-3 flex items-center gap-2 ${
            isCenter ? "justify-center" : "justify-start"
          }`}
        >
          {number && <span className="section-num text-sm sm:text-base font-extrabold">{number}</span>}
          {badge && (
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Main Title */}
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
        {title}{" "}
        {gradientText && <span className="gradient-text">{gradientText}</span>}
      </h2>

      {/* Optional Description */}
      {description && (
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
