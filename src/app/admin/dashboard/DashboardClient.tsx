"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";
import { ASSESSMENT_SLUGS } from "@/data/assessments";
import SessionCard, {
  type SessionCardAccessType,
  type SessionCardData,
} from "@/components/admin/SessionCard";
import AssessmentCards, {
  type AssessmentCardData,
} from "@/components/admin/AssessmentCards";

interface Session extends SessionCardData {
  is_active: boolean;
  access_type: SessionCardAccessType;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: Date;
  session_count: number;
}

export default function DashboardClient({
  sessions: initialSessions,
  assessments = [],
  role,
  assessmentContext,
}: {
  sessions: Session[];
  assessments?: AssessmentCardData[];
  role: string;
  assessmentContext?: {
    slug: string;
    name: string;
    backHref: string;
  };
}) {
  const isAdmin = role === "ADMIN";
  const isAssessmentScoped = !!assessmentContext;
  const [activeTab, setActiveTab] = useState<"sesi" | "guru">("sesi");

  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  // Teacher management state
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [approveLoadingId, setApproveLoadingId] = useState<string | null>(null);
  const [rejectLoadingId, setRejectLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && activeTab === "guru") {
      fetchTeachers();
    }
  }, [isAdmin, activeTab]);

  async function fetchTeachers() {
    setTeachersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      }
    } catch {
      // ignore
    } finally {
      setTeachersLoading(false);
    }
  }

  async function handleApprove(userId: string) {
    setApproveLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchTeachers();
      }
    } catch {
      // ignore
    } finally {
      setApproveLoadingId(null);
    }
  }

  async function handleReject(userId: string) {
    setRejectLoadingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reject`, {
        method: "PATCH",
      });
      if (res.ok) {
        await fetchTeachers();
      }
    } catch {
      // ignore
    } finally {
      setRejectLoadingId(null);
    }
  }

  async function handleCreateSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessment_slug: assessmentContext?.slug ?? ASSESSMENT_SLUGS.holland,
        name: formData.get("name"),
        school_name: formData.get("school_name"),
        mode:
          (assessmentContext?.slug ?? ASSESSMENT_SLUGS.holland) ===
          ASSESSMENT_SLUGS.holland
            ? formData.get("mode")
            : assessmentContext?.slug,
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

  function getStatusBadge(status: string) {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="app-badge-success">
            Aktif
          </span>
        );
      case "PENDING":
        return (
          <span className="app-badge-warning">
            Menunggu
          </span>
        );
      case "REJECTED":
        return (
          <span className="app-badge-danger">
            Ditolak
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      <div className="app-page-header">
        <div className="app-page-header-copy">
          <h1 className="app-page-title">
            {assessmentContext ? assessmentContext.name : "Dashboard Admin"}
          </h1>
          {assessmentContext && (
            <p className="app-page-subtitle">
              Kelola sesi untuk asesmen yang dipilih.
            </p>
          )}
        </div>
      </div>

      {isAdmin && !isAssessmentScoped && (
        <div className="app-tab-list mb-6 w-fit">
          <button
            onClick={() => setActiveTab("sesi")}
            className={`app-tab ${activeTab === "sesi" ? "app-tab-active" : ""}`}
          >
            Asesmen
          </button>
          <button
            onClick={() => setActiveTab("guru")}
            className={`app-tab ${activeTab === "guru" ? "app-tab-active" : ""}`}
          >
            Guru
          </button>
        </div>
      )}

      {activeTab === "sesi" && (
        <>
          {!isAssessmentScoped && (
            <section className="mb-8">
              <div className="mb-4">
                <h2 className="app-section-title">
                  Pilih Asesmen
                </h2>
                <p className="app-page-subtitle">
                  Pilih asesmen untuk melihat dan mengelola sesi.
                </p>
              </div>
              <AssessmentCards assessments={assessments} />
            </section>
          )}

          {isAssessmentScoped && (
            <>
              <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="app-button-secondary"
                  >
                    + Buat Sesi Baru
                  </button>
                <Link
                  href={assessmentContext.backHref}
                  className="app-button-ghost"
                >
                  Kembali
                </Link>
                </div>
              </div>

              {showForm && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                  role="presentation"
                >
                  <button
                    type="button"
                    className="absolute inset-0 cursor-default"
                    aria-label="Tutup dialog"
                    disabled={loading}
                    onClick={() => setShowForm(false)}
                  />
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-session-title"
                    className="app-card relative w-full max-w-lg"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                      <h2
                        id="create-session-title"
                        className="text-lg font-semibold text-slate-900"
                      >
                        {`Buat Sesi ${assessmentContext.name}`}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        disabled={loading}
                        title="Tutup"
                        aria-label="Tutup"
                        className="app-icon-button text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <form
                      onSubmit={handleCreateSession}
                      className={`space-y-4 p-6 ${loading ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <div>
                        <label className="app-label">
                          Nama Sesi
                        </label>
                        <input
                          name="name"
                          required
                          autoFocus
                          className="app-input"
                          placeholder="Contoh: Kelas 10A"
                        />
                      </div>

                      <div>
                        <label className="app-label">
                          Nama Sekolah / Madrasah
                        </label>
                        <input
                          name="school_name"
                          required
                          className="app-input"
                          placeholder="Contoh: MA Negeri 1 Bandung"
                        />
                      </div>

                      {assessmentContext.slug === ASSESSMENT_SLUGS.holland && (
                        <div>
                          <label className="app-label">
                            Mode
                          </label>
                          <select
                            name="mode"
                            required
                            className="app-select"
                          >
                            <option value="bebas">Bebas (siswa memilih)</option>
                            <option value="peminatan">Peminatan SMA/MA</option>
                            <option value="karir">Karir & Program Studi</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="app-label">
                          Deskripsi (opsional)
                        </label>
                        <textarea
                          name="description"
                          rows={3}
                          className="app-textarea"
                          placeholder="Deskripsi sesi..."
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          disabled={loading}
                          className="app-button-ghost disabled:opacity-50"
                        >
                          Batal
                        </button>
                        <LoadingButton
                          type="submit"
                          loading={loading}
                          loadingText="Membuat..."
                          className="app-button-success"
                        >
                          Buat Sesi
                        </LoadingButton>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {sessions.length === 0 ? (
                <div className="app-empty-state">
                  Belum ada sesi untuk asesmen ini. Klik &quot;Buat Sesi
                  Baru&quot; untuk memulai.
                </div>
              ) : (
                <div className="grid gap-4">
                  {sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      actions={
                        <>
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
                            className="app-icon-button text-brand-700 hover:bg-brand-50"
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
                            className="app-icon-button text-danger-600 hover:bg-danger-50"
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
                        </>
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === "guru" && isAdmin && (
        <div>
          {teachersLoading ? (
            <div className="app-status-info text-center">Memuat daftar guru...</div>
          ) : teachers.length === 0 ? (
            <div className="app-empty-state">
              Belum ada guru yang terdaftar.
            </div>
          ) : (
            <div className="space-y-6">
              {["PENDING", "ACTIVE", "REJECTED"].map((status) => {
                const filtered = teachers.filter((t) => t.status === status);
                if (filtered.length === 0) return null;
                return (
                  <div key={status}>
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                      {status === "PENDING"
                        ? "Menunggu Persetujuan"
                        : status === "ACTIVE"
                          ? "Aktif"
                          : "Ditolak"}
                    </h2>
                    <div className="grid gap-3">
                      {filtered.map((teacher) => (
                        <div
                          key={teacher.id}
                          className="app-section-card flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <Link
                              href={`/admin/dashboard/guru/${teacher.id}`}
                              className="text-base font-medium text-slate-900 transition-colors hover:text-brand-700"
                            >
                              {teacher.name}
                            </Link>
                            <p className="text-sm text-slate-500">{teacher.email}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {teacher.session_count} sesi ·{" "}
                              {new Date(teacher.created_at).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            {getStatusBadge(teacher.status)}
                            {teacher.status === "PENDING" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleApprove(teacher.id)}
                                  disabled={approveLoadingId === teacher.id}
                                  className="app-button-success px-3 py-1.5"
                                >
                                  {approveLoadingId === teacher.id ? "..." : "Setujui"}
                                </button>
                                <button
                                  onClick={() => handleReject(teacher.id)}
                                  disabled={rejectLoadingId === teacher.id}
                                  className="app-button-danger px-3 py-1.5"
                                >
                                  {rejectLoadingId === teacher.id ? "..." : "Tolak"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
