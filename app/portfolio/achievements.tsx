"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { Achievement } from "./content-types";
import { useContent } from "./ui/ContentProvider";
import { Puzzle, PuzzlePiece, pieceVariants, usePuzzleAssembled } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";

/* Splits "1,200+" into numeric (1200) + prefix/suffix so we can count up. */
function parseValue(value: string) {
  const match = value.match(/[\d,.]+/);
  if (!match) return { num: null as number | null, prefix: value, suffix: "" };
  const numeric = parseFloat(match[0].replace(/,/g, ""));
  const start = match.index ?? 0;
  return {
    num: numeric,
    prefix: value.slice(0, start),
    suffix: value.slice(start + match[0].length),
    hasComma: match[0].includes(","),
  };
}

function Counter({ item, index }: { item: Achievement; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const assembled = usePuzzleAssembled(ref);
  const parsed = parseValue(item.value);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const v = Math.round(latest);
    return parsed.hasComma ? v.toLocaleString("en-US") : String(v);
  });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (parsed.num === null) {
      setDisplay(item.value);
      return;
    }
    const unsub = rounded.on("change", (v) => setDisplay(v));
    if (inView) {
      const controls = animate(count, parsed.num, {
        duration: 1.6,
        ease: "easeOut",
      });
      return () => {
        controls.stop();
        unsub();
      };
    }
    return unsub;
  }, [inView, count, rounded, parsed.num, item.value]);

  return (
    <motion.div
      ref={ref}
      variants={pieceVariants(index)}
      initial="scattered"
      animate={assembled ? "assembled" : "scattered"}
      className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 text-center backdrop-blur-md"
    >
      <div className="bg-gradient-to-r from-accent to-accent-strong bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
        {parsed.num === null ? (
          item.value
        ) : (
          <>
            {parsed.prefix}
            {display}
            {parsed.suffix}
          </>
        )}
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{item.label}</p>
    </motion.div>
  );
}

export default function Achievements() {
  const { achievements } = useContent();
  return (
    <section id="achievements" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={TrendingUp} title="Impact & Achievements" />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {achievements.map((item, i) => (
            <Counter key={item.label} item={item} index={i} />
          ))}
        </Puzzle>
      </div>
    </section>
  );
}
