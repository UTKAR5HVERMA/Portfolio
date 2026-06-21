/*
  Single-admin auth for /adminUV.

  All credentials come from environment variables — nothing is hardcoded.
  Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET (see .env.example).
  If they are missing, auth fails closed: login is rejected and no session is
  issued or accepted, rather than falling back to a guessable default.

  The browser session is a signed (HMAC-SHA256) cookie — no DB needed.
  Uses Web Crypto so it works in both the Edge middleware and Node route handlers.
*/

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getEnv() {
  return {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.ADMIN_SESSION_SECRET,
  };
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(sig));
}

/* Timing-safe-ish string compare. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function verifyCredentials(email: string, password: string): boolean {
  const env = getEnv();
  if (!env.email || !env.password || !env.secret) {
    console.error(
      "[auth] ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET not set — admin login is disabled. Configure them in the environment."
    );
    return false;
  }
  return (
    safeEqual(email.trim().toLowerCase(), env.email.toLowerCase()) &&
    safeEqual(password, env.password)
  );
}

export async function createSessionToken(): Promise<string> {
  const { secret } = getEnv();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }
  const issuedAt = Date.now().toString();
  const sig = await hmac(issuedAt, secret);
  return `${issuedAt}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const [issuedAt, sig] = token.split(".");
  if (!issuedAt || !sig) return false;
  const ts = Number(issuedAt);
  if (!Number.isFinite(ts) || Date.now() - ts > SESSION_TTL_MS) return false;
  const { secret } = getEnv();
  if (!secret) return false;
  const expected = await hmac(issuedAt, secret);
  return safeEqual(sig, expected);
}

export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
