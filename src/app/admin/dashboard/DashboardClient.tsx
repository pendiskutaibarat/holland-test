"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  async function handleLogout() {
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
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          Keluar
        </button>
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
          className="bg-white p-6 rounded-lg shadow-sm mb-8 space-y-4"
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

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300"
          >
            {loading ? "Membuat..." : "Buat Sesi"}
          </button>
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
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      /test/{session.code}
                    </code>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/test/${session.code}`,
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Salin Link
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={session.is_active}
                      onChange={() =>
                        handleToggleActive(session.id, session.is_active)
                      }
                      className="w-4 h-4"
                    />
                    Aktif
                  </label>
                  <Link
                    href={`/admin/sessions/${session.id}`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
