"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, LogIn } from "lucide-react";
import { btnPrimary, inputClass } from "./fields";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/adminUV/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--background)] px-6 text-[var(--foreground)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-8 backdrop-blur-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-bold">
            Admin Access<span className="text-accent">.</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Sign in to edit your portfolio
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <p className="mt-3 text-sm text-accent">{error}</p>}

        <button type="submit" disabled={loading} className={`${btnPrimary} mt-6 w-full`}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing in…
            </>
          ) : (
            <>
              <LogIn size={16} /> Sign in
            </>
          )}
        </button>
      </form>
    </div>
  );
}
