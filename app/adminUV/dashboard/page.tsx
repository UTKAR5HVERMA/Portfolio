import type { Metadata } from "next";
import { getContent } from "@/lib/content-store";
import Dashboard from "../ui/Dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

// Access is enforced by middleware.ts; always load the freshest content.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const content = await getContent();
  return <Dashboard initial={content} />;
}
