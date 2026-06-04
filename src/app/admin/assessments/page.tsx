import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import AssessmentsClient from "./AssessmentsClient";

export default async function AssessmentsPage() {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);

  if (payload.status === "PENDING" || payload.status === "REJECTED") {
    redirect("/admin/login");
  }

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
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pilih Asesmen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pilih asesmen untuk melihat dan mengelola sesi yang sudah ada.
          </p>
        </div>
      </div>
      <AssessmentsClient
        assessments={assessments
          .filter((assessment) => assessment.versions.length > 0)
          .map((assessment) => ({
            id: assessment.id,
            slug: assessment.slug,
            name: assessment.name,
            description: assessment.description,
            engine_key: assessment.engine_key,
            question_count: assessment.versions[0].question_count,
          }))}
      />
    </div>
  );
}
