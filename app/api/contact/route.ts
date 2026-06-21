import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Nodemailer needs the Node.js runtime (not Edge).
export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    console.error("[contact] GMAIL_USER / GMAIL_APP_PASSWORD not configured.");
    return NextResponse.json(
      { error: "Email is not configured on the server." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: "portfolio msg",
      text: `Name : ${name}\nemail : ${email}\nmsg : ${message}`,
      html:
        `<p><strong>Name :</strong> ${escapeHtml(name)}</p>` +
        `<p><strong>email :</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>msg :</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });
  } catch (err) {
    console.error("[contact] failed to send email:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
