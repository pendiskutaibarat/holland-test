import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAssessmentSlugFromRouteSegment } from "@/lib/test-route";
import TestPageClient from "../../[code]/TestPageClient";

export default async function PublicAssessmentPage({
  params,
}: {
  params: Promise<{ assessment: string }>;
}) {
  const { assessment: routeSegment } = await params;
  const assessmentSlug = getAssessmentSlugFromRouteSegment(routeSegment);

  if (!assessmentSlug) {
    notFound();
  }

  const code = `public-${assessmentSlug.replace(/_/g, "-")}`;

  const session = await prisma.session.findUnique({
    where: { code },
    include: {
      assessment: true,
      assessment_version: true,
    },
  });

  if (!session || session.assessment.slug !== assessmentSlug) {
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
      assessmentVersion={session.assessment_version.version}
      isActive={session.is_active}
    />
  );
}
