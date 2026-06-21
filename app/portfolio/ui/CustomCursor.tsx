"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

/*
  Custom cursor: a small red dot that tracks the pointer, plus the soft
  global red glow that follows it. Desktop / fine-pointer only — it never
  renders on touch devices or for reduced-motion users.
*/
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Slightly lagged springs drive the soft background glow.
  const glowX = useSpring(x, { stiffness: 220, damping: 24 });
  const glowY = useSpring(y, { stiffness: 220, damping: 24 });

  // All hooks must run unconditionally — keep this above the early return.
  const glow = useMotionTemplate`radial-gradient(600px circle at ${glowX}px ${glowY}px, rgba(var(--accent-rgb), 0.06), transparent 40%)`;

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Soft global glow that follows the pointer (desktop only) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 hidden md:block"
        style={{ background: glow }}
      />
    </>
  );
}
