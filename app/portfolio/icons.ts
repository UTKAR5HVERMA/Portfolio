/*
  Icon registry for data-driven icons (currently the skill categories).
  The stored content keeps an icon *key* (a plain string); we resolve it to a
  Lucide component here at render time. Add more entries to widen the picker in
  the admin SkillsEditor.
*/

import {
  Bot,
  Brain,
  Cloud,
  Code,
  Cpu,
  Database,
  Layers,
  Network,
  Server,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  cpu: Cpu,
  database: Database,
  server: Server,
  code: Code,
  sparkles: Sparkles,
  bot: Bot,
  cloud: Cloud,
  terminal: Terminal,
  layers: Layers,
  zap: Zap,
  network: Network,
  wrench: Wrench,
};

/* Keys offered in the admin icon picker. */
export const iconKeys = Object.keys(iconMap);

/* Resolve an icon key to a component, falling back to a sensible default. */
export function resolveIcon(key: string | undefined): LucideIcon {
  return (key && iconMap[key]) || Code;
}
