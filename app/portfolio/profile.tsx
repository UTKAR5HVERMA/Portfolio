/*
  Back-compat shim.

  Content is now an editable document (see content-types.ts / content-defaults.ts)
  loaded at runtime and delivered to components through `useContent()`
  (ui/ContentProvider). Components should import from there, NOT from here.

  This file re-exports the default seed values and types so any lingering import
  keeps resolving. Prefer `useContent()` for anything that should reflect admin edits.
*/

export * from "./content-types";
export { defaultContent } from "./content-defaults";

import { defaultContent } from "./content-defaults";

export const personal = defaultContent.personal;
export const socials = defaultContent.socials;
export const about = defaultContent.about;
export const skillCategories = defaultContent.skillCategories;
export const experiences = defaultContent.experiences;
export const projects = defaultContent.projects;
export const certifications = defaultContent.certifications;
export const education = defaultContent.education;
export const achievements = defaultContent.achievements;
export const testimonials = defaultContent.testimonials;
export const navLinks = defaultContent.navLinks;
