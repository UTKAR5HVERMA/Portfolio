"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";

export default function Testimonials() {
  const { testimonials } = useContent();
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const count = testimonials.length;

  const paginate = (delta: number) =>
    setState(([i]) => [(i + delta + count) % count, delta]);

  if (count === 0) return null;
  const t = testimonials[index % count];

  return (
    <section id="testimonials" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={Quote} title="Testimonials" />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle>
          <PuzzlePiece>
            <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 backdrop-blur-xl md:p-12">
            <Quote className="mb-6 text-accent/40" size={48} />

            <div className="relative min-h-[160px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={index}
                  custom={dir}
                  initial={{ opacity: 0, x: dir >= 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir >= 0 ? -40 : 40 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xl font-light leading-relaxed text-[var(--foreground)] md:text-2xl">
                    “{t.quote}”
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold text-[var(--foreground)]">{t.name}</p>
                    <p className="text-sm text-[var(--muted)]">{t.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => setState([i, i > index ? 1 : -1])}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-6 bg-accent" : "w-2 bg-[var(--surface-border)]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[var(--surface-border)] text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-[var(--foreground)]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => paginate(1)}
                  aria-label="Next testimonial"
                  className="grid h-10 w-10 place-items-center rounded-full border border-[var(--surface-border)] text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-[var(--foreground)]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          </PuzzlePiece>
        </Puzzle>
      </div>
    </section>
  );
}
