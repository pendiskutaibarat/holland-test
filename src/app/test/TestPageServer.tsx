import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TestPageClient from "./[code]/TestPageClient";

function isValidSessionSlug(code: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(code) && code.length <= 100;
}

export default async function TestPageServer({
  code,
  expectedAssessmentSlug,
}: {
  code: string;
  expectedAssessmentSlug: string;
}) {
  if (!isValidSessionSlug(code)) {
    notFound();
  }

  const session = await prisma.session.findUnique({
    where: { code },
    include: {
      assessment: true,
    },
  });

  if (!session || session.assessment.slug !== expectedAssessmentSlug) {
    notFound();
  }

  return (
    <TestPageClient
      sessionId={session.id}
      sessionName={session.name}
      schoolName={session.school_name}
      sessionMode={session.mode}
      assessmentSlug={session.assessment.slug}
      assessmentName={session.assessment.name}
      isActive={session.is_active}
    />
  );
}
