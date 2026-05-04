"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";

interface Session {
  id: string;
  code: string;
  name: string;
  description: string | null;
  mode: string;
  is_active: boolean;
  created_at: Date;
  result_count: number;
}

export default function DashboardClient({
  sessions: initialSessions,
}: {
  sessions: Session[];
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopyLink(sessionId: string, code: string) {
    navigator.clipboard.writeText(`${window.location.origin}/test/${code}`);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleLogout() {
    setLogoutLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleCreateSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        mode: formData.get("mode"),
        description: formData.get("description"),
      }),
    });

    if (res.ok) {
      const newSession = await res.json();
      setSessions([newSession, ...sessions]);
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
    }

    setLoading(false);
  }

  async function handleToggleActive(sessionId: string, current: boolean) {
    setToggleLoadingId(sessionId);
    const res = await fetch(`/api/admin/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current }),
    });

    if (res.ok) {
      setSessions(
        sessions.map((s) =>
          s.id === sessionId ? { ...s, is_active: !current } : s,
        ),
      );
    }
    setToggleLoadingId(null);
  }

  async function handleDeleteSession(sessionId: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
      return;
    }

    setDeleteLoadingId(sessionId);
    const res = await fetch(`/api/admin/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setSessions(sessions.filter((s) => s.id !== sessionId));
    }
    setDeleteLoadingId(null);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <LoadingButton
          onClick={handleLogout}
          loading={logoutLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          Keluar
        </LoadingButton>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Batal" : "+ Buat Sesi Baru"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateSession}
          className={`bg-white p-6 rounded-lg shadow-sm mb-8 space-y-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Sesi
            </label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Kelas 10A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode
            </label>
            <select
              name="mode"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bebas">Bebas (siswa memilih)</option>
              <option value="peminatan">Peminatan SMA/MA</option>
              <option value="karir">Karir & Program Studi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi (opsional)
            </label>
            <textarea
              name="description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi sesi..."
            />
          </div>

          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Membuat..."
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300"
          >
            Buat Sesi
          </LoadingButton>
        </form>
      )}

      {sessions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          Belum ada sesi. Klik &ldquo;Buat Sesi Baru&rdquo; untuk memulai.
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {session.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Mode: <span className="capitalize">{session.mode}</span> ·{" "}
                    {session.result_count} hasil ·{" "}
                    {new Date(session.created_at).toLocaleDateString("id-ID")}
                  </p>
                  {session.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {session.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => handleCopyLink(session.id, session.code)}
                      className="relative"
                    >
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm hover:bg-gray-200 cursor-pointer transition-colors">
                        /test/{session.code}
                      </code>
                      {copiedId === session.id && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          Tersalin!
                        </span>
                      )}
                    </button>
                    <a
                      href={`/test/${session.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka Halaman Tes"
                      aria-label="Buka Halaman Tes"
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 text-sm mr-1 ${toggleLoadingId === session.id ? "" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      checked={session.is_active}
                      disabled={toggleLoadingId === session.id}
                      onChange={() =>
                        handleToggleActive(session.id, session.is_active)
                      }
                      className="w-4 h-4"
                    />
                    Aktif
                    {toggleLoadingId === session.id && (
                      <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    )}
                  </label>
                  <Link
                    href={`/admin/sessions/${session.id}`}
                    title="Lihat Detail"
                    aria-label="Lihat Detail"
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Link>
                  <LoadingButton
                    onClick={() => handleDeleteSession(session.id)}
                    loading={deleteLoadingId === session.id}
                    title="Hapus Sesi"
                    aria-label="Hapus Sesi"
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </LoadingButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
