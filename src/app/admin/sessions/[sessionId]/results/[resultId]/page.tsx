import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import { buildSessionDetailWhere } from "@/lib/session-access";
import ResultViewClient from "./ResultViewClient";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export default async function ResultViewPage({
  params,
}: {
  params: Promise<{ sessionId: string; resultId: string }>;
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
  const { sessionId, resultId } = await params;

  if (!isValidUUID(sessionId) || !isValidUUID(resultId)) {
    notFound();
  }

  const session = await prisma.session.findFirst({
    where: buildSessionDetailWhere(userId, payload.role, sessionId),
    include: {
      assessment_version: true,
    },
  });

  if (!session) {
    redirect("/admin/dashboard");
  }

  const result = await prisma.testResult.findFirst({
    where: {
      id: resultId,
      session_id: sessionId,
    },
    include: {
      answers: true,
    },
  });

  if (result) {
    return <ResultViewClient result={result} sessionId={sessionId} />;
  }

  const assessmentResult = await prisma.assessmentResult.findFirst({
    where: {
      id: resultId,
      session_id: sessionId,
    },
    include: {
      assessment_version: true,
      responses: true,
    },
  });

  if (!assessmentResult) {
    redirect(`/admin/sessions/${sessionId}`);
  }

  return (
    <ResultViewClient
      result={{
        ...assessmentResult,
        category_scores: assessmentResult.category_scores as Record<string, number>,
        ranked_categories: assessmentResult.ranked_categories as Array<{
          rank: number;
          category_code: string;
          category_name: string;
          score: number;
        }>,
        top_categories: assessmentResult.top_categories as Array<{
          rank: number;
          category_code: string;
          category_name: string;
          score: number;
        }>,
      }}
      sessionId={sessionId}
      assessmentVersion={assessmentResult.assessment_version.version}
    />
  );
}
