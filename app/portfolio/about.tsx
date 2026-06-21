"use client";

import { CheckCircle, User } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

export default function About() {
  const { about, personal } = useContent();
  return (
    <section id="about" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={User} title="About Me" leadingRule />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle>
          <PuzzlePiece>
            <TiltCard className="bg-gradient-to-br from-accent/30 via-accent/5 to-transparent p-[1px]">
            <div className="h-full rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 shadow-2xl backdrop-blur-xl md:p-12">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-lg leading-relaxed text-[var(--muted)] md:text-xl ${
                    i > 0 ? "mt-4" : ""
                  }`}
                >
                  {p}
                </p>
              ))}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {about.strengths.map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-3 text-sm text-[var(--foreground)]"
                  >
                    <CheckCircle size={18} className="shrink-0 text-accent" />
                    {s}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-2 text-[var(--muted)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                Based in {personal.location}.
              </div>
            </div>
          </TiltCard>
          </PuzzlePiece>
        </Puzzle>
      </div>
    </section>
  );
}
