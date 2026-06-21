/*
  Server-only content store with two backends:

  - When BLOB_READ_WRITE_TOKEN is set (auto-provided on Vercel), data lives in a
    single public JSON blob at CONTENT_PATH.
  - Otherwise (local dev with no token) it falls back to a JSON file on disk at
    LOCAL_CONTENT_FILE so the admin still works fully offline.

  Reads always return the latest; on any failure or missing data we fall back to
  the default seed so the public site never breaks.
*/

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { list, put } from "@vercel/blob";
import { defaultContent } from "@/app/portfolio/content-defaults";
import type { Content } from "@/app/portfolio/content-types";

const CONTENT_PATH = "content.json";
const LOCAL_CONTENT_FILE = path.join(process.cwd(), ".data", "content.json");

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readLocalContent(): Promise<Content> {
  try {
    const raw = await fs.readFile(LOCAL_CONTENT_FILE, "utf8");
    return normalize(JSON.parse(raw) as Partial<Content>);
  } catch {
    // Missing file or bad JSON — serve defaults.
    return defaultContent;
  }
}

async function writeLocalContent(content: Content): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_CONTENT_FILE), { recursive: true });
  await fs.writeFile(
    LOCAL_CONTENT_FILE,
    JSON.stringify(content, null, 2),
    "utf8"
  );
}

/* Fill in any keys missing from a (possibly older) stored document. */
function normalize(stored: Partial<Content> | null | undefined): Content {
  if (!stored || typeof stored !== "object") return defaultContent;
  return {
    ...defaultContent,
    ...stored,
    personal: { ...defaultContent.personal, ...(stored.personal ?? {}) },
    socials: { ...defaultContent.socials, ...(stored.socials ?? {}) },
    about: { ...defaultContent.about, ...(stored.about ?? {}) },
  };
}

export async function getContent(): Promise<Content> {
  if (!hasBlobToken()) return readLocalContent();
  try {
    const { blobs } = await list({ prefix: CONTENT_PATH });
    const blob = blobs.find((b) => b.pathname === CONTENT_PATH);
    if (!blob) return defaultContent;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return defaultContent;
    const data = (await res.json()) as Partial<Content>;
    return normalize(data);
  } catch (err) {
    console.error("[content-store] getContent failed, using defaults:", err);
    return defaultContent;
  }
}

export async function saveContent(content: Content): Promise<void> {
  if (!hasBlobToken()) {
    await writeLocalContent(content);
    return;
  }
  await put(CONTENT_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}
