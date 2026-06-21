"use client";

import { GraduationCap } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

export default function EducationSection() {
  const { education } = useContent();
  return (
    <section id="education" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={GraduationCap} title="Education" />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle>
          <PuzzlePiece>
            <TiltCard>
            <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 backdrop-blur-xl">
              <div className="relative space-y-8 border-l border-[var(--surface-border)] pl-6">
                {education.map((edu) => (
                  <div key={edu.degree} className="relative">
                    <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-4 border-[var(--surface-solid)] bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.8)]" />
                    <h4 className="text-lg font-semibold text-[var(--foreground)]">
                      {edu.degree}
                    </h4>
                    <p className="text-[var(--muted)]">{edu.institution}</p>
                    <p className="mt-1 font-mono text-sm text-accent">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
          </PuzzlePiece>
        </Puzzle>
      </div>
    </section>
  );
}
