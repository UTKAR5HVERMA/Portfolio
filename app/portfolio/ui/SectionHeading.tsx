"use client";

import type { LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  icon?: LucideIcon;
  title: string;
  /** Show the short leading accent rule (used on the About section). */
  leadingRule?: boolean;
}

/* Repeated `h2 + accent rule` header pattern from the original design. */
export default function SectionHeading({
  icon: Icon,
  title,
  leadingRule = false,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 flex items-center gap-4 md:mb-16">
      {leadingRule && <div className="h-[2px] w-12 shrink-0 bg-accent" />}
      <h2 className="text-3xl font-bold text-[var(--foreground)] md:text-4xl">
        {Icon && <Icon className="mr-3 mb-1 inline text-accent" />}
        {title}
      </h2>
      <div className="h-[2px] flex-grow bg-[var(--surface-border)]" />
    </div>
  );
}
