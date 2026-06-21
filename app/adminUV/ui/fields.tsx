"use client";

/*
  Small themed form primitives shared across the admin editors.
  Styling mirrors the portfolio tokens (surface / border / accent) so the admin
  matches the site theme and respects dark/light mode.
*/

import { Plus, Trash2 } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition-colors focus:border-accent/60";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-strong px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-[var(--foreground)]";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}

/* Editable list of plain strings (one input/line per entry). */
export function StringList({
  label,
  values,
  onChange,
  multiline = false,
  addLabel = "Add",
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  multiline?: boolean;
  addLabel?: string;
}) {
  const set = (i: number, v: string) =>
    onChange(values.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, ""]);

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
        {label}
      </span>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                rows={2}
                value={v}
                onChange={(e) => set(i, e.target.value)}
                className={`${inputClass} resize-y`}
              />
            ) : (
              <input
                value={v}
                onChange={(e) => set(i, e.target.value)}
                className={inputClass}
              />
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="mt-1 shrink-0 rounded-lg border border-[var(--surface-border)] p-2 text-[var(--muted)] transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className={`${btnGhost} mt-2`}>
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}

/* Generic editor for a list of structured items with add/remove. */
export function ListEditor<T>({
  items,
  onChange,
  newItem,
  render,
  addLabel = "Add item",
  itemLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  itemLabel?: (item: T, index: number) => string;
}) {
  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {itemLabel ? itemLabel(item, i) : `#${i + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded p-1 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded p-1 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded p-1 text-[var(--muted)] transition-colors hover:text-accent"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="space-y-3">{render(item, (patch) => update(i, patch), i)}</div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, newItem()])} className={btnGhost}>
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
}
