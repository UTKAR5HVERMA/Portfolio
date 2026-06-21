import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, saveContent } from "@/lib/content-store";
import type { Content } from "@/app/portfolio/content-types";

// Always run fresh; never cache admin reads.
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  let body: Content;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Minimal shape check — the admin UI sends the full document.
  if (!body || !Array.isArray(body.projects) || !body.personal) {
    return NextResponse.json(
      { error: "Malformed content document." },
      { status: 400 }
    );
  }

  try {
    await saveContent(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save content." },
      { status: 500 }
    );
  }

  // Refresh the public site so edits show immediately.
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
