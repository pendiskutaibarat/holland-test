import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);

  if (payload.status === "PENDING" || payload.status === "REJECTED") {
    redirect("/admin/login");
  }

  const role = payload.role;

  const assessments = await prisma.assessment.findMany({
    where: { is_active: true },
    orderBy: { created_at: "asc" },
    include: {
      versions: {
        where: { is_active: true },
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
  });

  return (
    <DashboardClient
      sessions={[]}
      assessments={assessments
        .filter((assessment) => assessment.versions.length > 0)
        .map((assessment) => ({
          id: assessment.id,
          slug: assessment.slug,
          name: assessment.name,
          description: assessment.description,
          question_count: assessment.versions[0].question_count,
        }))}
      role={role}
    />
  );
}
