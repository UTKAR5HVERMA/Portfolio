/*
  Shared content types for the whole portfolio.

  All resume copy now lives in an editable `Content` document (stored in Vercel
  Blob, edited from /adminUV). These types describe its shape. Icons are stored
  as string keys (see ./icons) because React components can't be serialized to
  JSON or passed from a Server Component to the client.
*/

export interface Personal {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  greeting: string;
  /* Rotating phrases shown after the title in the hero. */
  specializations: string[];
}

export interface Socials {
  linkedin: string;
  github: string;
  website: string;
}

export interface About {
  paragraphs: string[];
  strengths: string[];
}

export interface SkillCategory {
  title: string;
  /* Icon key resolved via ./icons (e.g. "brain", "cpu"). */
  icon: string;
  skills: string[];
}

export interface ExperienceProject {
  name: string;
  desc: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  projects: ExperienceProject[];
  /* Free-form tags (tech, domain, etc.) shown as chips. */
  tags?: string[];
}

export interface Project {
  /* Stable id so photo uploads and list edits stay attached to the right item. */
  id: string;
  name: string;
  subtitle: string;
  status: string;
  description: string;
  highlights: string[];
  stack: string[];
  link?: string;
  featured?: boolean;
  /* Public URLs of uploaded photos (Vercel Blob). */
  photos: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  inProgress?: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
}

export interface Achievement {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Content {
  /* Public URL (or static path) of the downloadable resume PDF. */
  resumeUrl: string;
  personal: Personal;
  socials: Socials;
  about: About;
  skillCategories: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  navLinks: NavLink[];
}
