"use client";

import { useEffect, useState } from "react";
import { sections } from "./sections";
import { scrollToSection } from "./smoothScrollController";

/**
 * Vertical pagination dots, one per section. Highlights the section currently
 * in view and smooth-scrolls to a section on click.
 */
export default function Pagination() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // Mark active once a section crosses the upper-middle of the viewport,
      // matching the navbar's active-link behavior.
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            aria-label={`Go to ${s.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-5 w-1.5 bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]"
                  : "h-1.5 w-1.5 bg-[var(--surface-border)] group-hover:bg-[var(--muted)]"
              }`}
            />
            <span className="pointer-events-none absolute right-5 whitespace-nowrap rounded-md border border-[var(--surface-border)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--foreground)] opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">
              {s.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
