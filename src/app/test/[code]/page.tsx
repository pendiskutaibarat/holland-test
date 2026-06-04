import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAssessmentTestHref } from "@/lib/test-route";

function isValidSessionSlug(code: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(code) && code.length <= 100;
}

export default async function LegacyTestPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!isValidSessionSlug(code)) {
    notFound();
  }

  const session = await prisma.session.findUnique({
    where: { code },
    include: {
      assessment: true,
    },
  });

  if (!session) {
    notFound();
  }

  redirect(getAssessmentTestHref(session.assessment.slug, session.code));
}
