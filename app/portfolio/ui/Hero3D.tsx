"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* R3F scene is loaded client-side only and code-split out of the main bundle. */
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero3D() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Skip the 3D scene for reduced-motion users.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShow(!reduced);
  }, []);

  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-80">
      <HeroScene />
    </div>
  );
}
