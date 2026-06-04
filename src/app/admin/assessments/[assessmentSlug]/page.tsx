import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import { buildTeacherSessionWhere, getSessionAccessType } from "@/lib/session-access";
import DashboardClient from "../../dashboard/DashboardClient";

export default async function AssessmentSessionsPage({
  params,
}: {
  params: Promise<{ assessmentSlug: string }>;
}) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);

  if (payload.status === "PENDING" || payload.status === "REJECTED") {
    redirect("/admin/login");
  }

  const { assessmentSlug } = await params;
  const assessment = await prisma.assessment.findUnique({
    where: { slug: assessmentSlug },
  });

  if (!assessment || !assessment.is_active) {
    notFound();
  }

  const userId = payload.userId;
  const role = payload.role;
  const accessWhere =
    role === "ADMIN" ? { user_id: userId } : buildTeacherSessionWhere(userId);

  const sessions = await prisma.session.findMany({
    where: {
      ...accessWhere,
      assessment: {
        slug: assessmentSlug,
      },
    },
    orderBy: { created_at: "desc" },
    include: {
      assessment: true,
      assessment_version: true,
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: { results: true, assessment_results: true },
      },
    },
  });

  return (
    <DashboardClient
      sessions={sessions.map((session) => ({
        ...session,
        result_count:
          session.assessment.slug === "minat_hobi"
            ? session._count.assessment_results
            : session._count.results,
        owner_name: session.user.name,
        access_type: getSessionAccessType(session.user_id, userId),
      }))}
      role={role}
      assessmentContext={{
        slug: assessment.slug,
        name: assessment.name,
        backHref: "/admin/assessments",
      }}
    />
  );
}
