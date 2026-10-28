import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  align?: "split" | "center";
  children?: React.ReactNode;
  className?: string;
}

/** Consistent section intro: eyebrow, title, and either a description or controls on the right. */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "split",
  children,
  className,
}: SectionHeaderProps) {
  const dark = tone === "dark";

  if (align === "center") {
    return (
      <div className={cn("mx-auto max-w-2xl text-center", className)}>
        <p className={dark ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>
        <h2 className={cn("mt-3", dark ? "heading-section-light" : "heading-section")}>{title}</h2>
        {description && (
          <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-slate-300" : "text-slate-500")}>
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <p className={dark ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>
        <h2 className={cn("mt-3", dark ? "heading-section-light" : "heading-section")}>{title}</h2>
      </div>
      {children ??
        (description && (
          <p className={cn("max-w-md text-base leading-relaxed md:text-right", dark ? "text-slate-300" : "text-slate-500")}>
            {description}
          </p>
        ))}
    </div>
  );
}
