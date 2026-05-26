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
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{teacher.name}</h1>
        <p className="text-gray-500">{teacher.email}</p>
        <p className="text-sm text-gray-400 mt-1">
          Status:{" "}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              teacher.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : teacher.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
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

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Sesi ({sessions.length})
      </h2>

      {sessions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
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
                    className={`text-xs px-2 py-0.5 rounded ${
                      session.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {session.is_active ? "Aktif" : "Tidak Aktif"}
                  </span>
                  <Link
                    href={`/admin/sessions/${session.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
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
