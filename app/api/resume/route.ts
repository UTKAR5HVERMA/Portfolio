/*
  Public resume download. Streams the current resume (from the editable content
  document) with a forced filename, so:
    - visitors always get the latest uploaded file, and
    - the saved file is always named Utkarsh_Verma_Resume.pdf, regardless of the
      uploaded/blob name (the `download` attribute hint is ignored cross-origin,
      so we own the Content-Disposition here on a same-origin route).
*/

import { promises as fs } from "node:fs";
import path from "node:path";
import { getContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const DOWNLOAD_NAME = "Utkarsh_Verma_Resume.pdf";
const FALLBACK_FILE = "Utkarsh_Verma_Resume.pdf"; // under /public

function headers(): HeadersInit {
  return {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${DOWNLOAD_NAME}"`,
    "Cache-Control": "no-store",
  };
}

async function readPublicFile(relPath: string): Promise<ArrayBuffer> {
  // relPath is like "/Utkarsh_Verma_Resume.pdf" or "/uploads/123-foo.pdf".
  const safe = relPath.replace(/^\/+/, "");
  const buf = await fs.readFile(path.join(process.cwd(), "public", safe));
  // Copy into a standalone ArrayBuffer so it's a valid BodyInit (and not a view
  // over a possibly-shared/pooled Node Buffer).
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function GET() {
  let resumeUrl = "/Utkarsh_Verma_Resume.pdf";
  try {
    resumeUrl = (await getContent()).resumeUrl || resumeUrl;
  } catch {
    // Fall through to the static file below.
  }

  try {
    if (resumeUrl.startsWith("/")) {
      const bytes = await readPublicFile(resumeUrl);
      return new Response(bytes, { headers: headers() });
    }
    const res = await fetch(resumeUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    return new Response(await res.arrayBuffer(), { headers: headers() });
  } catch (err) {
    console.error("[resume] serving stored resume failed, using fallback:", err);
    try {
      const bytes = await readPublicFile(`/${FALLBACK_FILE}`);
      return new Response(bytes, { headers: headers() });
    } catch {
      return new Response("Resume unavailable.", { status: 404 });
    }
  }
}
