"use client";

import { Briefcase, ChevronDown, FileDown } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Github, Linkedin } from "./ui/BrandIcons";
import Hero3D from "./ui/Hero3D";
import MagneticButton from "./ui/MagneticButton";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import RotatingText from "./ui/RotatingText";

export default function Home() {
  const { personal, socials } = useContent();
  const specializations = personal.specializations;
  const socialLinks = [
    { icon: Linkedin, url: socials.linkedin, label: "LinkedIn" },
    { icon: Github, url: socials.github, label: "GitHub" },
  ];

  return (
    <section
      id="home"
      className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20"
    >
      <Hero3D />

      <Puzzle className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <PuzzlePiece index={0}>
          <h2 className="mb-4 bg-gradient-to-r from-accent to-accent-strong bg-clip-text font-mono text-xl tracking-wider text-transparent md:text-2xl">
            {personal.greeting}
          </h2>
        </PuzzlePiece>

        <PuzzlePiece index={1}>
          <h1 className="mb-6 text-6xl font-extrabold uppercase tracking-tighter text-[var(--foreground)] drop-shadow-2xl md:text-8xl">
            {personal.name}
          </h1>
        </PuzzlePiece>

        <PuzzlePiece index={2}>
          <p className="mx-auto mb-8 max-w-4xl text-xl font-light leading-relaxed text-[var(--muted)] sm:whitespace-nowrap sm:text-2xl md:text-3xl">
            {personal.title} specializing in{" "}
            <RotatingText phrases={specializations} className="block sm:inline" />
          </p>
        </PuzzlePiece>

        <PuzzlePiece index={3} className="mb-12 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            href={`mailto:${personal.email}?subject=${encodeURIComponent(
              `Hiring inquiry for ${personal.name}`
            )}&body=${encodeURIComponent(
              `Hi ${personal.firstName},\n\nI'd like to talk to you about a role/opportunity.\n\n`
            )}`}
            className="group relative overflow-hidden rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-8 py-4 font-medium text-[var(--foreground)] backdrop-blur-md transition-all hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Briefcase size={18} /> Hire Me
            </span>
          </MagneticButton>

          <MagneticButton
            href="/api/resume"
            download
            className="group relative overflow-hidden rounded-full border border-[var(--surface-border)] bg-[var(--surface)] px-8 py-4 font-medium text-[var(--foreground)] backdrop-blur-md transition-all hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <FileDown size={18} /> Resume
            </span>
          </MagneticButton>

          <div className="flex gap-4">
            {socialLinks.map((item) => (
              <MagneticButton
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="grid h-14 w-14 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--muted)] backdrop-blur-md transition-all hover:text-[var(--foreground)] hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.4)]"
              >
                <item.icon size={22} />
              </MagneticButton>
            ))}
          </div>
        </PuzzlePiece>
      </Puzzle>

      <a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-[var(--muted)]"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
