import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import {
  buildTeacherSessionWhere,
  getSessionAccessType,
} from "@/lib/session-access";
import SessionCard from "@/components/admin/SessionCard";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  );
}

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);

  if (payload.role !== "ADMIN" || payload.status !== "ACTIVE") {
    redirect("/admin/dashboard");
  }

  const { userId } = await params;

  if (!isValidUUID(userId)) {
    notFound();
  }

  const teacher = await prisma.user.findFirst({
    where: { id: userId, role: "TEACHER" },
  });

  if (!teacher) {
    notFound();
  }

  const sessions = await prisma.session.findMany({
    where: buildTeacherSessionWhere(userId),
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: { results: true },
      },
    },
  });

  return (
    <div className="app-shell">
      <div className="mb-6">
        <Link href="/admin/dashboard" className="app-back-link">
          {"<-"} Kembali ke Dashboard
        </Link>
      </div>

      <div className="app-page-header">
        <div className="app-page-header-copy">
          <h1 className="app-page-title">{teacher.name}</h1>
          <p className="app-page-subtitle">{teacher.email}</p>
          <p className="mt-2 text-sm text-slate-500">
            Status{" "}
            <span
              className={`ml-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                teacher.status === "ACTIVE"
                  ? "bg-success-100 text-success-700"
                  : teacher.status === "PENDING"
                    ? "bg-warning-100 text-warning-700"
                    : "bg-danger-100 text-danger-700"
              }`}
            >
              {teacher.status === "ACTIVE"
                ? "Aktif"
                : teacher.status === "PENDING"
                  ? "Menunggu"
                  : "Ditolak"}
            </span>
          </p>
        </div>
      </div>

      <h2 className="app-section-title mb-4">Sesi ({sessions.length})</h2>

      {sessions.length === 0 ? (
        <div className="app-empty-state">
          Guru ini belum memiliki sesi yang dapat diakses.
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={{
                id: session.id,
                code: session.code,
                name: session.name,
                school_name: session.school_name,
                description: session.description,
                mode: session.mode,
                created_at: session.created_at,
                result_count: session._count.results,
                owner_name: session.user.name,
                access_type: getSessionAccessType(session.user_id, userId),
              }}
              ownedLabel="Milik Guru"
              actions={
                <>
                  <span
                    className={`app-badge ${
                      session.is_active
                        ? "bg-success-100 text-success-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {session.is_active ? "Aktif" : "Tidak Aktif"}
                  </span>
                  <Link
                    href={`/admin/sessions/${session.id}`}
                    className="app-link text-sm font-medium"
                  >
                    Lihat Detail
                  </Link>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
