"use client";

import { useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { btnGhost } from "./fields";

/* The static fallback shipped in /public — never deleted from storage. */
const DEFAULT_RESUME = "/Utkarsh_Verma_Resume.pdf";

export default function ResumeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isCustom = Boolean(value) && value !== DEFAULT_RESUME;

  /* Best-effort delete of a previously uploaded blob; the default is kept. */
  const deletePrevious = (url: string) => {
    if (!url || url === DEFAULT_RESUME) return;
    fetch(`/api/admin/upload?url=${encodeURIComponent(url)}`, {
      method: "DELETE",
    }).catch(() => {});
  };

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      const previous = value;
      onChange(data.url);
      deletePrevious(previous);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = () => {
    const previous = value;
    onChange(DEFAULT_RESUME);
    deletePrevious(previous);
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
          Resume (PDF)
        </span>
        <p className="text-xs text-[var(--muted)]">
          Visitors always download the latest file, saved as
          <span className="text-[var(--foreground)]"> Utkarsh_Verma_Resume.pdf</span>.
          Don&apos;t forget to <span className="text-[var(--foreground)]">Save changes</span> after uploading.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] p-4">
        <FileText size={20} className="text-accent" />
        <div className="min-w-0 flex-1">
          <a
            href="/api/resume"
            target="_blank"
            rel="noreferrer"
            className="block truncate text-sm font-medium text-[var(--foreground)] hover:text-accent"
          >
            {isCustom ? "Current resume (uploaded)" : "Current resume (default)"}
          </a>
          <span className="text-xs text-[var(--muted)]">Click to preview the current file</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className={`${btnGhost} cursor-pointer`}>
          {busy ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload size={15} /> {isCustom ? "Replace resume" : "Upload resume"}
            </>
          )}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        {isCustom && (
          <button type="button" onClick={handleRemove} disabled={busy} className={btnGhost}>
            <Trash2 size={15} /> Remove
          </button>
        )}
      </div>

      {error && <p className="text-xs text-accent">{error}</p>}
    </div>
  );
}
