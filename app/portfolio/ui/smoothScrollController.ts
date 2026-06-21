import type Lenis from "lenis";

/**
 * Shares the single Lenis instance created in <SmoothScroll> so other client
 * components (e.g. the pagination dots) can drive smooth scrolling. Falls back
 * to native scrolling when Lenis is absent (reduced-motion users).
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollToSection(id: string, duration = 1) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
