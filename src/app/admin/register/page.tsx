"use client";

import { useState } from "react";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";

export default function AdminRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="app-card w-full max-w-md p-8 text-center">
          <div className="mb-4 text-success-600">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Pendaftaran Berhasil!</h1>
          <p className="mb-6 text-slate-600">
            Akun Anda menunggu persetujuan admin. Anda akan diberitahu setelah akun disetujui.
          </p>
          <Link
            href="/admin/login"
            className="app-button-primary"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="app-card w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
          Daftar Akun Guru
        </h1>

        {error && <div className="app-status-error px-3 py-3">{error}</div>}

        <form onSubmit={handleSubmit} className={`space-y-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
          <div>
            <label className="app-label">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="app-input"
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          <div>
            <label className="app-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="app-input"
              placeholder="guru@sekolah.id"
            />
          </div>

          <div>
            <label className="app-label">
              Kata Sandi
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="app-input"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label className="app-label">
              Konfirmasi Kata Sandi
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="app-input"
              placeholder="Ulangi kata sandi"
            />
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Mendaftar..."
            className="app-button-primary w-full"
          >
            Daftar
          </LoadingButton>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link href="/admin/login" className="app-link font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
