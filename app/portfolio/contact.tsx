"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Mail, MapPin, Send } from "lucide-react";
import { useContent } from "./ui/ContentProvider";
import { Github, Linkedin } from "./ui/BrandIcons";
import { Puzzle, PuzzlePiece } from "./ui/Puzzle";
import SectionHeading from "./ui/SectionHeading";

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { personal, socials } = useContent();
  const socialLinks = [
    { icon: Linkedin, url: socials.linkedin, label: "LinkedIn" },
    { icon: Github, url: socials.github, label: "GitHub" },
  ];
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      // Fall back to a mailto draft if the API is unavailable.
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Could not send. Try email instead."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none backdrop-blur-md transition-colors focus:border-accent/60";

  return (
    <section id="contact" className="relative z-10 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Puzzle>
          <PuzzlePiece>
            <SectionHeading icon={Mail} title="Get In Touch" />
          </PuzzlePiece>
        </Puzzle>

        <Puzzle className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PuzzlePiece index={0}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 backdrop-blur-xl">
              <div>
                <h3 className="text-2xl font-bold text-[var(--foreground)]">
                  Let&apos;s build something intelligent.
                </h3>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">
                  Open to AI/ML engineering roles, GenAI consulting, and
                  collaborations. I usually reply within a day.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-3 text-[var(--muted)] transition-colors hover:text-accent"
                >
                  <Mail size={18} className="text-accent" />
                  {personal.email}
                </a>
                <div className="flex items-center gap-3 text-[var(--muted)]">
                  <MapPin size={18} className="text-accent" />
                  {personal.location}
                </div>
                <div className="flex gap-3 pt-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="grid h-11 w-11 place-items-center rounded-full border border-[var(--surface-border)] text-[var(--muted)] transition-all hover:text-[var(--foreground)] hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.4)]"
                    >
                      <item.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </PuzzlePiece>

          <PuzzlePiece index={1}>
            {status === "success" ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-accent/30 bg-[var(--surface)] p-8 text-center backdrop-blur-xl">
                <CheckCircle size={48} className="text-accent" />
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  Message sent!
                </h3>
                <p className="text-[var(--muted)]">
                  Thanks for reaching out — I&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-accent hover:underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 backdrop-blur-xl"
              >
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={update("name")}
                  className={inputClass}
                />
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={form.email}
                  onChange={update("email")}
                  className={inputClass}
                />
                <textarea
                  required
                  rows={5}
                  placeholder="Your message"
                  value={form.message}
                  onChange={update("message")}
                  className={`${inputClass} resize-none`}
                />

                {status === "error" && (
                  <p className="text-sm text-accent">
                    {error}{" "}
                    <a
                      href={`mailto:${personal.email}`}
                      className="underline"
                    >
                      Email me directly
                    </a>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-strong px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </PuzzlePiece>
        </Puzzle>
      </div>
    </section>
  );
}
