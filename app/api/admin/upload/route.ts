import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { del, put } from "@vercel/blob";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

// Local-dev fallback: images written here are served statically at /uploads/*.
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
}

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8 MB)." }, { status: 400 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const filename = `${Date.now()}-${slugify(file.name || "image")}`;

  // Local-dev fallback: write into public/uploads and return a relative URL.
  if (!hasBlobToken()) {
    try {
      await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
      const bytes = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(LOCAL_UPLOAD_DIR, filename), bytes);
      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Failed to save image." },
        { status: 500 }
      );
    }
  }

  const blob = await put(`uploads/${filename}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type || "application/octet-stream",
  });

  return NextResponse.json({ url: blob.url });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  // Local-dev fallback: relative /uploads/* path → delete the file on disk.
  if (url.startsWith("/uploads/")) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", url));
    } catch {
      // Already gone — treat as success.
    }
    return NextResponse.json({ ok: true });
  }

  try {
    await del(url);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
