"use client";

import type { SkillCategory } from "@/app/portfolio/content-types";
import { iconKeys, resolveIcon } from "@/app/portfolio/icons";
import { Field, ListEditor, StringList, inputClass } from "./fields";

export default function SkillsEditor({
  value,
  onChange,
}: {
  value: SkillCategory[];
  onChange: (v: SkillCategory[]) => void;
}) {
  return (
    <ListEditor<SkillCategory>
      items={value}
      onChange={onChange}
      addLabel="Add category"
      itemLabel={(c) => c.title || "Category"}
      newItem={() => ({ title: "", icon: "code", skills: [] })}
      render={(cat, update) => {
        const Icon = resolveIcon(cat.icon);
        return (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field
                label="Title"
                value={cat.title}
                onChange={(v) => update({ title: v })}
              />
              <label className="block">
                <span className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
                  Icon <Icon size={16} className="text-accent" />
                </span>
                <select
                  value={cat.icon}
                  onChange={(e) => update({ icon: e.target.value })}
                  className={inputClass}
                >
                  {iconKeys.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <StringList
              label="Skills"
              values={cat.skills}
              onChange={(v) => update({ skills: v })}
              addLabel="Add skill"
            />
          </>
        );
      }}
    />
  );
}
