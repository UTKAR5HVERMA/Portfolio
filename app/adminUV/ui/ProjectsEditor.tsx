"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import type { Project } from "@/app/portfolio/content-types";
import { Field, ListEditor, StringList, TextArea } from "./fields";

function PhotoUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");
        uploaded.push(data.url);
      }
      onChange([...photos, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (url: string) => {
    onChange(photos.filter((p) => p !== url));
    // Best-effort delete from storage; ignore failures.
    fetch(`/api/admin/upload?url=${encodeURIComponent(url)}`, {
      method: "DELETE",
    }).catch(() => {});
  };

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
        Photos
      </span>
      <div className="flex flex-wrap gap-3">
        {photos.map((url) => (
          <div
            key={url}
            className="group relative h-24 w-24 overflow-hidden rounded-lg border border-[var(--surface-border)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              aria-label="Remove photo"
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-lg border border-dashed border-[var(--surface-border)] text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-accent">
          {busy ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <ImagePlus size={20} />
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

export default function ProjectsEditor({
  value,
  onChange,
}: {
  value: Project[];
  onChange: (v: Project[]) => void;
}) {
  return (
    <ListEditor<Project>
      items={value}
      onChange={onChange}
      addLabel="Add project"
      itemLabel={(p) => p.name || "Untitled project"}
      newItem={() => ({
        id: `project-${Date.now()}`,
        name: "",
        subtitle: "",
        status: "",
        description: "",
        highlights: [],
        stack: [],
        link: "",
        featured: false,
        photos: [],
      })}
      render={(p, update) => (
        <>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={!!p.featured}
              onChange={(e) => update({ featured: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            <Star size={15} className={p.featured ? "text-accent" : "text-[var(--muted)]"} />
            Featured (shown in the top slider)
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Name" value={p.name} onChange={(v) => update({ name: v })} />
            <Field
              label="Subtitle"
              value={p.subtitle}
              onChange={(v) => update({ subtitle: v })}
            />
            <Field
              label="Status"
              value={p.status}
              onChange={(v) => update({ status: v })}
            />
            <Field
              label="Link (optional)"
              value={p.link ?? ""}
              onChange={(v) => update({ link: v })}
              placeholder="https://…"
            />
          </div>

          <TextArea
            label="Description"
            value={p.description}
            onChange={(v) => update({ description: v })}
          />

          <StringList
            label="Highlights"
            values={p.highlights}
            onChange={(v) => update({ highlights: v })}
            addLabel="Add highlight"
          />
          <StringList
            label="Tech stack"
            values={p.stack}
            onChange={(v) => update({ stack: v })}
            addLabel="Add tech"
          />

          <PhotoUploader photos={p.photos} onChange={(v) => update({ photos: v })} />
        </>
      )}
    />
  );
}
