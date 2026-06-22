"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, LogOut, Save } from "lucide-react";
import type { Content } from "@/app/portfolio/content-types";
import { Field, ListEditor, StringList, TextArea, btnGhost, btnPrimary } from "./fields";
import ProjectsEditor from "./ProjectsEditor";
import ExperienceEditor from "./ExperienceEditor";
import SkillsEditor from "./SkillsEditor";
import ResumeEditor from "./ResumeEditor";

const TABS = [
  "Personal",
  "Resume",
  "Socials",
  "About",
  "Skills",
  "Experience",
  "Projects",
  "Certifications",
  "Education",
  "Achievements",
  "Testimonials",
  "Navigation",
] as const;

type Tab = (typeof TABS)[number];
type SaveState = "idle" | "saving" | "saved" | "error";

export default function Dashboard({ initial }: { initial: Content }) {
  const router = useRouter();
  const [content, setContent] = useState<Content>(initial);
  const [tab, setTab] = useState<Tab>("Projects");
  const [save, setSave] = useState<SaveState>("idle");
  const [error, setError] = useState("");

  const patch = (p: Partial<Content>) => setContent((c) => ({ ...c, ...p }));

  const handleSave = async () => {
    setSave("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setSave("saved");
      setTimeout(() => setSave("idle"), 2500);
    } catch (err) {
      setSave("error");
      setError(err instanceof Error ? err.message : "Failed to save.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/adminUV");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[var(--surface-border)] bg-[var(--surface)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-lg font-bold">
              Portfolio Admin<span className="text-accent">.</span>
            </h1>
            <p className="text-xs text-[var(--muted)]">Edit content & save to publish</p>
          </div>
          <div className="flex items-center gap-2">
            {save === "error" && (
              <span className="text-xs text-accent">{error}</span>
            )}
            <button onClick={handleLogout} className={btnGhost}>
              <LogOut size={15} /> Logout
            </button>
            <button onClick={handleSave} disabled={save === "saving"} className={btnPrimary}>
              {save === "saving" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving…
                </>
              ) : save === "saved" ? (
                <>
                  <Check size={15} /> Saved
                </>
              ) : (
                <>
                  <Save size={15} /> Save changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-5xl overflow-x-auto px-6">
          <div className="flex gap-1 pb-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                  tab === t
                    ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {tab === "Personal" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Name" value={content.personal.name} onChange={(v) => patch({ personal: { ...content.personal, name: v } })} />
              <Field label="First name" value={content.personal.firstName} onChange={(v) => patch({ personal: { ...content.personal, firstName: v } })} />
              <Field label="Last name" value={content.personal.lastName} onChange={(v) => patch({ personal: { ...content.personal, lastName: v } })} />
              <Field label="Title" value={content.personal.title} onChange={(v) => patch({ personal: { ...content.personal, title: v } })} />
              <Field label="Tagline" value={content.personal.tagline} onChange={(v) => patch({ personal: { ...content.personal, tagline: v } })} />
              <Field label="Email" value={content.personal.email} onChange={(v) => patch({ personal: { ...content.personal, email: v } })} />
              <Field label="Location" value={content.personal.location} onChange={(v) => patch({ personal: { ...content.personal, location: v } })} />
              <Field label="Greeting" value={content.personal.greeting} onChange={(v) => patch({ personal: { ...content.personal, greeting: v } })} />
            </div>
            <StringList
              label="Rotating specializations (hero)"
              values={content.personal.specializations}
              onChange={(v) => patch({ personal: { ...content.personal, specializations: v } })}
              addLabel="Add specialization"
            />
          </div>
        )}

        {tab === "Resume" && (
          <ResumeEditor value={content.resumeUrl} onChange={(v) => patch({ resumeUrl: v })} />
        )}

        {tab === "Socials" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="LinkedIn URL" value={content.socials.linkedin} onChange={(v) => patch({ socials: { ...content.socials, linkedin: v } })} />
            <Field label="GitHub URL" value={content.socials.github} onChange={(v) => patch({ socials: { ...content.socials, github: v } })} />
            <Field label="Website URL" value={content.socials.website} onChange={(v) => patch({ socials: { ...content.socials, website: v } })} />
          </div>
        )}

        {tab === "About" && (
          <div className="space-y-4">
            <StringList
              label="Paragraphs"
              multiline
              values={content.about.paragraphs}
              onChange={(v) => patch({ about: { ...content.about, paragraphs: v } })}
              addLabel="Add paragraph"
            />
            <StringList
              label="Core strengths"
              values={content.about.strengths}
              onChange={(v) => patch({ about: { ...content.about, strengths: v } })}
              addLabel="Add strength"
            />
          </div>
        )}

        {tab === "Skills" && (
          <SkillsEditor value={content.skillCategories} onChange={(v) => patch({ skillCategories: v })} />
        )}

        {tab === "Experience" && (
          <ExperienceEditor value={content.experiences} onChange={(v) => patch({ experiences: v })} />
        )}

        {tab === "Projects" && (
          <ProjectsEditor value={content.projects} onChange={(v) => patch({ projects: v })} />
        )}

        {tab === "Certifications" && (
          <ListEditor
            items={content.certifications}
            onChange={(v) => patch({ certifications: v })}
            addLabel="Add certification"
            itemLabel={(c) => c.name || "Certification"}
            newItem={() => ({ name: "", issuer: "", inProgress: false })}
            render={(c, update) => (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Name" value={c.name} onChange={(v) => update({ name: v })} />
                  <Field label="Issuer" value={c.issuer} onChange={(v) => update({ issuer: v })} />
                </div>
                <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                  <input type="checkbox" checked={!!c.inProgress} onChange={(e) => update({ inProgress: e.target.checked })} className="accent-[var(--accent)]" />
                  In progress
                </label>
              </>
            )}
          />
        )}

        {tab === "Education" && (
          <ListEditor
            items={content.education}
            onChange={(v) => patch({ education: v })}
            addLabel="Add education"
            itemLabel={(e) => e.degree || "Education"}
            newItem={() => ({ degree: "", institution: "", period: "" })}
            render={(e, update) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Degree" value={e.degree} onChange={(v) => update({ degree: v })} />
                <Field label="Institution" value={e.institution} onChange={(v) => update({ institution: v })} />
                <Field label="Period" value={e.period} onChange={(v) => update({ period: v })} />
              </div>
            )}
          />
        )}

        {tab === "Achievements" && (
          <ListEditor
            items={content.achievements}
            onChange={(v) => patch({ achievements: v })}
            addLabel="Add achievement"
            itemLabel={(a) => a.label || "Achievement"}
            newItem={() => ({ value: "", label: "" })}
            render={(a, update) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Value" value={a.value} onChange={(v) => update({ value: v })} placeholder="98%" />
                <Field label="Label" value={a.label} onChange={(v) => update({ label: v })} />
              </div>
            )}
          />
        )}

        {tab === "Testimonials" && (
          <ListEditor
            items={content.testimonials}
            onChange={(v) => patch({ testimonials: v })}
            addLabel="Add testimonial"
            itemLabel={(t) => t.name || "Testimonial"}
            newItem={() => ({ quote: "", name: "", role: "" })}
            render={(t, update) => (
              <>
                <TextArea label="Quote" value={t.quote} onChange={(v) => update({ quote: v })} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Name" value={t.name} onChange={(v) => update({ name: v })} />
                  <Field label="Role" value={t.role} onChange={(v) => update({ role: v })} />
                </div>
              </>
            )}
          />
        )}

        {tab === "Navigation" && (
          <ListEditor
            items={content.navLinks}
            onChange={(v) => patch({ navLinks: v })}
            addLabel="Add link"
            itemLabel={(l) => l.label || "Link"}
            newItem={() => ({ label: "", href: "#" })}
            render={(l, update) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Label" value={l.label} onChange={(v) => update({ label: v })} />
                <Field label="Anchor (href)" value={l.href} onChange={(v) => update({ href: v })} placeholder="#about" />
              </div>
            )}
          />
        )}
      </main>
    </div>
  );
}
