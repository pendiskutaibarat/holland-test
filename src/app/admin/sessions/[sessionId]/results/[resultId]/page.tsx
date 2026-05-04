import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
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

  let adminId: string;
  try {
    const payload = verifyToken(token);
    adminId = payload.adminId;
  } catch {
    redirect("/admin/login");
  }

  const { sessionId, resultId } = await params;

  if (!isValidUUID(sessionId) || !isValidUUID(resultId)) {
    notFound();
  }

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      admin_id: adminId,
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

  if (!result) {
    redirect(`/admin/sessions/${sessionId}`);
  }

  return <ResultViewClient result={result} sessionId={sessionId} />;
}