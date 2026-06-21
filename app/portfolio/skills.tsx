"use client";

import { Code } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { resolveIcon } from "./icons";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

export default function Skills() {
  const { skillCategories } = useContent();
  return (
    <section id="skills" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={Code} title="Technical Arsenal" />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, i) => {
            const Icon = resolveIcon(category.icon);
            return (
              <PuzzlePiece key={category.title} index={i} className="h-full">
                <TiltCard className="h-full" glowColor="rgba(var(--accent-rgb), 0.4)">
                  <div className="h-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md transition-colors hover:border-accent/40">
                    <Icon className="mb-4 text-accent" size={32} />
                    <h3 className="mb-4 text-xl font-bold text-[var(--foreground)]">
                      {category.title}
                    </h3>
                    <ul className="space-y-2">
                      {category.skills.map((skill) => (
                        <li
                          key={skill}
                          className="flex items-start gap-2 text-sm text-[var(--muted)]"
                        >
                          <span className="mt-1 text-accent">▹</span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </PuzzlePiece>
            );
          })}
        </Puzzle>
      </div>
    </section>
  );
}
