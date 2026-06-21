/*
  Protects the admin area (Next.js 16 "proxy" convention, formerly middleware).
  Unauthenticated requests to the dashboard are redirected to the /adminUV login;
  protected admin APIs return 401. The login + logout APIs are left open.
*/

import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  const isProtectedApi =
    pathname.startsWith("/api/admin/") &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/logout");

  if (isProtectedApi && !authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (pathname.startsWith("/adminUV/dashboard") && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/adminUV";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminUV/dashboard/:path*", "/api/admin/:path*"],
};
