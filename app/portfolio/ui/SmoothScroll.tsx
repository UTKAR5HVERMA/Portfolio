"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "./smoothScrollController";

/*
  Lenis smooth-scroll. Free scrolling is preserved; section navigation is
  offered via the pagination dots (which drive this same Lenis instance).
  Skips entirely when the user prefers reduced motion, falling back to native
  scrolling.
*/
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(lenis);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
