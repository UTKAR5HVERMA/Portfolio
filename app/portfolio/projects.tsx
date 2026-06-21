"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FolderGit2,
  Server,
} from "lucide-react";
import type { Project } from "./content-types";
import { useContent } from "./ui/ContentProvider";
import MagneticButton from "./ui/MagneticButton";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";

const highlightIcons = [Cpu, Brain, Server];

/* Photo gallery for a featured project: large active image + thumbnail strip.
   Falls back to the original stylized mockup when there are no photos. */
function FeaturedMedia({ project }: { project: Project }) {
  const [active, setActive] = useState(0);
  const photos = project.photos ?? [];

  if (photos.length === 0) {
    return (
      <div className="perspective-1000 flex w-full flex-1 justify-center">
        <div className="relative aspect-square w-full max-w-sm transform-gpu transition-transform duration-700 ease-out">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent-strong to-accent opacity-20 blur-xl" />
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-solid)] shadow-2xl">
            <div className="flex h-8 items-center gap-2 border-b border-[var(--surface-border)] bg-black/20 px-4">
              <div className="h-2.5 w-2.5 rounded-full bg-accent" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex h-24 animate-pulse items-center justify-center rounded-lg border border-[var(--surface-border)] bg-black/10">
                <Brain className="text-[var(--muted)]" size={32} />
              </div>
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-black/10" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-black/10" />
              <div className="mt-auto h-10 rounded-lg border border-accent/30 bg-accent/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeIdx = active % photos.length;

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-3">
      <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-solid)] shadow-2xl">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-accent-strong to-accent opacity-20 blur-xl" />
        <AnimatePresence mode="wait">
          <motion.div
            key={photos[activeIdx]}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={photos[activeIdx]}
              alt={`${project.name} screenshot ${activeIdx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {photos.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {photos.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative h-12 w-16 overflow-hidden rounded-md border transition-all ${
                i === activeIdx
                  ? "border-accent ring-1 ring-accent/40"
                  : "border-[var(--surface-border)] opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* The large featured-project card (content + media). */
function FeaturedCard({ project }: { project: Project }) {
  return (
    <TiltCard glowColor="rgba(var(--accent-rgb), 0.4)">
      <div className="group relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8 p-8 md:flex-row md:p-12">
          <div className="flex-1">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              {project.status}
            </div>
            <h3 className="mb-4 text-3xl font-extrabold text-[var(--foreground)]">
              {project.name}
            </h3>
            <h4 className="mb-6 text-xl font-light text-[var(--muted)]">
              {project.subtitle}
            </h4>
            <p className="mb-6 leading-relaxed text-[var(--muted)]">
              {project.description}
            </p>

            <ul className="mb-8 space-y-3">
              {project.highlights.map((h, i) => {
                const Icon = highlightIcons[i % highlightIcons.length];
                return (
                  <li
                    key={h}
                    className="flex items-start gap-3 text-sm text-[var(--foreground)]"
                  >
                    <Icon className="mt-0.5 shrink-0 text-accent" size={18} />
                    <span>{h}</span>
                  </li>
                );
              })}
            </ul>

            {project.link && (
              <MagneticButton
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--foreground)] px-6 py-3 font-semibold text-[var(--background)] transition-opacity hover:opacity-90"
              >
                Visit {project.name} <ArrowRight size={18} />
              </MagneticButton>
            )}
          </div>

          <FeaturedMedia project={project} />
        </div>
      </div>
    </TiltCard>
  );
}

/* Slider that cycles through all featured projects. */
function FeaturedSlider({ projects }: { projects: Project[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const count = projects.length;
  const [paused, setPaused] = useState(false);

  const go = (delta: number) =>
    setState(([i]) => [(i + delta + count) % count, delta]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(() => setState(([i]) => [(i + 1) % count, 1]), 6500);
    return () => clearInterval(id);
  }, [count, paused, index]);

  if (count === 0) return null;
  const current = projects[index % count];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id ?? index}
            custom={dir}
            initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <FeaturedCard project={current} />
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous featured project"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--muted)] backdrop-blur-md transition-colors hover:border-accent/50 hover:text-[var(--foreground)]"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id ?? i}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Go to ${p.name}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-2 bg-[var(--surface-border)]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next featured project"
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--muted)] backdrop-blur-md transition-colors hover:border-accent/50 hover:text-[var(--foreground)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const { projects } = useContent();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={FolderGit2} title="Featured Work" />
          </PuzzlePiece>
        </Puzzle>

        {featured.length > 0 && (
          <Puzzle>
            <PuzzlePiece>
              <FeaturedSlider projects={featured} />
            </PuzzlePiece>
          </Puzzle>
        )}

        <Puzzle className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {rest.map((proj, i) => (
            <PuzzlePiece key={proj.id ?? proj.name} index={i} className="h-full">
              <TiltCard className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 backdrop-blur-md transition-colors hover:border-accent/40">
                  {proj.photos?.length > 0 && (
                    <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg border border-[var(--surface-border)]">
                      <Image
                        src={proj.photos[0]}
                        alt={proj.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="mb-3 w-fit rounded-full bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
                    {proj.status}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">
                    {proj.name}
                  </h3>
                  <p className="mb-3 text-sm text-[var(--muted)]">{proj.subtitle}</p>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proj.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[var(--surface-border)] px-2 py-1 text-xs text-[var(--muted)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </PuzzlePiece>
          ))}
        </Puzzle>
      </div>
    </section>
  );
}
