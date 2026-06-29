import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import { buildSessionDetailWhere } from "@/lib/session-access";
import SessionDetailClient from "./SessionDetailClient";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id,
  );
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);

  if (payload.status === "PENDING" || payload.status === "REJECTED") {
    redirect("/admin/login");
  }

  const userId = payload.userId;
  const { sessionId } = await params;

  if (!isValidUUID(sessionId)) {
    notFound();
  }

  const session = await prisma.session.findFirst({
    where: buildSessionDetailWhere(userId, payload.role, sessionId),
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assessment: true,
      assessment_version: true,
      collaborators: {
        orderBy: { created_at: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
              created_at: true,
            },
          },
        },
      },
      results: {
        orderBy: { created_at: "desc" },
      },
      assessment_results: {
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!session) {
    redirect("/admin/dashboard");
  }

  const teachers =
    payload.role === "ADMIN"
      ? await prisma.user.findMany({
          where: {
            role: "TEACHER",
            status: "ACTIVE",
          },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            created_at: true,
          },
        })
      : [];

  return (
    <div className="app-shell">
      <div className="mb-6">
        <Link
          href={`/admin/dashboard/assessments/${session.assessment.slug}`}
          className="app-back-link"
        >
          {"<-"} Kembali ke Daftar Sesi
        </Link>
      </div>
      <SessionDetailClient
        session={{
          ...session,
          assessment_results: session.assessment_results.map((result) => ({
            ...result,
            category_scores: result.category_scores as Record<string, number>,
            ranked_categories: result.ranked_categories as Array<{
              rank: number;
              category_code: string;
              category_name?: string;
              score: number;
            }>,
            top_categories: result.top_categories as Array<{
              rank: number;
              category_code: string;
              category_name?: string;
              score: number;
            }>,
          })),
        }}
        canManageSharing={payload.role === "ADMIN"}
        teachers={teachers}
      />
    </div>
  );
}
