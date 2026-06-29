"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="app-card w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
          Login Admin / Guru
        </h1>

        {error && <div className="app-status-error px-3 py-3">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className={`space-y-4 ${loading ? "pointer-events-none opacity-50" : ""}`}
        >
          <div>
            <label className="app-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="app-input"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="app-label">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="app-input"
              placeholder="Masukkan kata sandi"
            />
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Masuk..."
            className="app-button-primary w-full"
          >
            Masuk
          </LoadingButton>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link href="/admin/register" className="app-link font-medium">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
