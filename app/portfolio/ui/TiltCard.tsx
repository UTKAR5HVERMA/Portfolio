"use client";

import { useRef, useState } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

/*
  3D tilt-on-hover card with a cursor-following radial glow.
  Extracted from the original portfolio.tsx design.
*/
export default function TiltCard({
  children,
  className = "",
  glowColor = "rgba(var(--accent-rgb), 0.5)",
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlowStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${x}px ${y}px, ${glowColor}, transparent 40%)`,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle(
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    );
    setGlowStyle({ opacity: 0, transition: "opacity 0.5s ease" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl transition-transform duration-200 ease-out preserve-3d ${className}`}
      style={{ transform: transformStyle, transformStyle: "preserve-3d" }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl mix-blend-screen transition-opacity duration-300"
        style={glowStyle}
      />
      <div
        className="relative z-10 h-full transform-gpu"
        style={{ transform: "translateZ(30px)" }}
      >
        {children}
      </div>
    </div>
  );
}
