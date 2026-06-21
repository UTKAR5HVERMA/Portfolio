"use client";

import { ArrowRight, Briefcase } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

export default function Experience() {
  const { experiences } = useContent();
  return (
    <section id="experience" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={Briefcase} title="Professional Experience" />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-[var(--surface-border)] before:to-transparent md:before:mx-auto md:before:translate-x-0">
          {experiences.map((exp, idx) => (
            <PuzzlePiece
              key={idx}
              index={idx}
              className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
            >
              <div className="z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-solid)] text-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <div className="h-3 w-3 rounded-full bg-accent" />
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
                <TiltCard>
                  <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-xl transition-colors hover:border-accent/50 md:p-8">
                    <div className="mb-4 flex flex-col justify-between md:flex-row md:items-center">
                      <h3 className="text-xl font-bold text-[var(--foreground)]">
                        {exp.role}
                      </h3>
                      <span className="mt-1 font-mono text-sm text-accent md:mt-0">
                        {exp.period}
                      </span>
                    </div>
                    <h4 className="mb-4 text-lg font-medium text-[var(--muted)]">
                      {exp.company}
                    </h4>

                    {exp.tags && exp.tags.length > 0 && (
                      <div className="mb-6 flex flex-wrap gap-2">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 font-mono text-xs text-accent"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4">
                      {exp.projects.map((proj) => (
                        <div key={proj.name}>
                          <h5 className="mb-1 flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                            <ArrowRight size={14} className="text-accent" />
                            {proj.name}
                          </h5>
                          <p className="pl-6 text-sm leading-relaxed text-[var(--muted)]">
                            {proj.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            </PuzzlePiece>
          ))}
        </Puzzle>
      </div>
    </section>
  );
}
