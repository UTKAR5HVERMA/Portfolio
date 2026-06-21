"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

/**
 * Scroll-driven "puzzle" assembly.
 *
 * Each <PuzzlePiece> starts scattered to a random offset/rotation/scale (the
 * "puzzled" state) and springs into place when IT scrolls into view, so pieces
 * assemble one-by-one as you reach them. When a piece fully leaves the viewport
 * (scrolling back up) it scatters again — reversible.
 *
 * <Puzzle> is just a layout wrapper/grouping element (e.g. the grid container);
 * it carries no animation, so every piece is triggered independently.
 */

/** Per-index assemble delay so pieces visible together (grids, hero) cascade. */
const STAGGER = 0.08;

/** Deterministic pseudo-random in [0,1) seeded by index — stable across SSR/CSR. */
function seeded(index: number, salt: number) {
  const x = Math.sin((index + 1) * 99.13 + salt * 47.71) * 43758.5453;
  return x - Math.floor(x);
}

function scatterFor(index: number): Record<string, number> {
  const angle = seeded(index, 1) * Math.PI * 2;
  const distance = 160 + seeded(index, 2) * 240;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: (seeded(index, 3) - 0.5) * 80,
    scale: 0.4 + seeded(index, 4) * 0.35,
  };
}

/**
 * Scattered/assembled variants for a single piece, seeded by `index`.
 * Exported so components that manage their own ref (e.g. the count-up cards in
 * achievements) can reuse the exact scatter.
 */
export function pieceVariants(index: number): Variants {
  const scattered = scatterFor(index);
  return {
    scattered: {
      ...scattered,
      opacity: 0,
      transition: { type: "spring", stiffness: 90, damping: 20 },
    },
    assembled: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 110, damping: 16, delay: index * STAGGER },
    },
  };
}

/** Element's top relative to the document, from layout only (ignores transforms). */
function layoutTop(el: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/*
  A single shared scroll/resize listener fans out to every piece on a throttled
  rAF, instead of each piece attaching its own — so 30+ pieces cost one listener
  and one rAF per frame, not thirty.
*/
const tickers = new Set<() => void>();
let frame = 0;
let bound = false;

function runTickers() {
  frame = 0;
  tickers.forEach((fn) => fn());
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(runTickers);
}
function addTicker(fn: () => void) {
  tickers.add(fn);
  if (!bound) {
    bound = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  return () => {
    tickers.delete(fn);
  };
}

/**
 * Whether a piece should be assembled, with hysteresis to kill jitter.
 *
 * Visibility is computed from the element's LAYOUT position (offsetTop/Height),
 * not its rendered box — so the scatter transform can never move a piece across
 * its own trigger and cause an in/out feedback loop. It assembles once the
 * element reaches the middle band of the viewport and only scatters again after
 * it has fully left; the gap between those thresholds prevents edge jitter.
 *
 * Layout position is measured once (and on resize) and cached, so the per-scroll
 * work is just a few comparisons — keeping scrolling smooth with many pieces.
 */
export function usePuzzleAssembled(
  ref: RefObject<HTMLElement | null>,
  once = false,
) {
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let top = 0;
    let height = 0;
    let current = false;
    const measure = () => {
      top = layoutTop(el);
      height = el.offsetHeight;
    };
    const evaluate = () => {
      const scroll = window.scrollY;
      const vh = window.innerHeight;
      // Assemble once the element overlaps the middle 60% of the viewport.
      const inBand = top + height > scroll + vh * 0.2 && top < scroll + vh * 0.8;
      const fullyOut = top + height < scroll || top > scroll + vh;
      let next = current;
      if (inBand) next = true;
      else if (!once && fullyOut) next = false;
      if (next !== current) {
        current = next;
        setAssembled(next);
      }
    };

    const tick = () => evaluate();
    const onResize = () => {
      measure();
      evaluate();
    };

    measure();
    evaluate();
    // Re-measure after layout settles (fonts/images) on the next frame.
    const settle = requestAnimationFrame(onResize);
    const unsubscribe = addTicker(tick);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(settle);
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [ref, once]);

  return assembled;
}

interface PuzzleProps {
  children: React.ReactNode;
  className?: string;
}

export function Puzzle({ children, className = "" }: PuzzleProps) {
  return <div className={className}>{children}</div>;
}

interface PuzzlePieceProps {
  children: React.ReactNode;
  /** Unique index used to seed this piece's scatter position and cascade delay. */
  index?: number;
  className?: string;
  /** Set true to assemble only once and never scatter again. */
  once?: boolean;
}

export function PuzzlePiece({
  children,
  index = 0,
  className = "",
  once = false,
}: PuzzlePieceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const variants = useMemo(() => pieceVariants(index), [index]);
  const assembled = usePuzzleAssembled(ref, once);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="scattered"
      animate={assembled ? "assembled" : "scattered"}
    >
      {children}
    </motion.div>
  );
}
