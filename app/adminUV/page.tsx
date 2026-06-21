import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import LoginForm from "./ui/LoginForm";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) {
    redirect("/adminUV/dashboard");
  }
  return <LoginForm />;
}
