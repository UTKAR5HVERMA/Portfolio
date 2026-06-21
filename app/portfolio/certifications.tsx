"use client";

import { Award } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

export default function Certifications() {
  const { certifications } = useContent();
  return (
    <section id="certifications" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={Award} title="Certifications" />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {certifications.map((cert, i) => (
            <PuzzlePiece key={cert.name} index={i} className="h-full">
              <TiltCard className="h-full" glowColor="rgba(var(--accent-rgb), 0.4)">
                <div className="flex h-full flex-col rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md transition-colors hover:border-accent/40">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Award size={24} />
                  </div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
                    {cert.name}
                    {cert.inProgress && (
                      <span className="rounded bg-[var(--surface-border)] px-2 py-0.5 font-mono text-[10px] uppercase text-[var(--muted)]">
                        In Progress
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{cert.issuer}</p>
                </div>
              </TiltCard>
            </PuzzlePiece>
          ))}
        </Puzzle>
      </div>
    </section>
  );
}
