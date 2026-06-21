"use client";

import { Mail } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Github, Linkedin } from "./ui/BrandIcons";

export default function Footer() {
  const { navLinks, personal, socials } = useContent();
  return (
    <footer
      id="footer"
      className="relative z-10 border-t border-[var(--surface-border)] bg-[var(--surface)] px-6 py-12 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter text-[var(--foreground)]">
            {personal.name}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {personal.title} · {personal.tagline}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-4">
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-[var(--muted)] transition-colors hover:text-accent"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <Github size={20} />
          </a>
          <a
            href={`mailto:${personal.email}`}
            aria-label="Email"
            className="text-[var(--muted)] transition-colors hover:text-accent"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-[var(--surface-border)] pt-6 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} {personal.name}. All rights reserved.
      </div>
    </footer>
  );
}
