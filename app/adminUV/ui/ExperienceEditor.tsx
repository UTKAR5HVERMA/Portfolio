"use client";

import type { Experience } from "@/app/portfolio/content-types";
import { Field, ListEditor, StringList, TextArea } from "./fields";

export default function ExperienceEditor({
  value,
  onChange,
}: {
  value: Experience[];
  onChange: (v: Experience[]) => void;
}) {
  return (
    <ListEditor<Experience>
      items={value}
      onChange={onChange}
      addLabel="Add experience"
      itemLabel={(e) => e.role || "New role"}
      newItem={() => ({ role: "", company: "", period: "", projects: [], tags: [] })}
      render={(exp, update) => (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Role" value={exp.role} onChange={(v) => update({ role: v })} />
            <Field
              label="Company"
              value={exp.company}
              onChange={(v) => update({ company: v })}
            />
            <Field
              label="Period"
              value={exp.period}
              onChange={(v) => update({ period: v })}
              placeholder="Jul 2025 – Present"
            />
          </div>

          <StringList
            label="Tags"
            values={exp.tags ?? []}
            onChange={(v) => update({ tags: v })}
            addLabel="Add tag"
          />

          <div>
            <span className="mb-1 block text-xs font-medium text-[var(--muted)]">
              Projects
            </span>
            <ListEditor
              items={exp.projects}
              onChange={(projects) => update({ projects })}
              addLabel="Add project"
              itemLabel={(pr) => pr.name || "Project"}
              newItem={() => ({ name: "", desc: "" })}
              render={(pr, updatePr) => (
                <>
                  <Field
                    label="Name"
                    value={pr.name}
                    onChange={(v) => updatePr({ name: v })}
                  />
                  <TextArea
                    label="Description"
                    value={pr.desc}
                    onChange={(v) => updatePr({ desc: v })}
                  />
                </>
              )}
            />
          </div>
        </>
      )}
    />
  );
}
