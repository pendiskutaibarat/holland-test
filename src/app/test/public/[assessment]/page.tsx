import { notFound } from "next/navigation";
import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAssessmentSlugFromRouteSegment } from "@/lib/test-route";
import TestPageClient from "../../[code]/TestPageClient";

const PUBLIC_USER_EMAIL = "public-assessment@pendis.local";
const PUBLIC_USER_NAME = "Public Assessment";
const PUBLIC_SCHOOL_NAME = "Asesmen Pendis Kutai Barat";
const PUBLIC_PASSWORD_HASH = hashSync("public-assessment-disabled", 10);

async function getPublicSession(assessmentSlug: string) {
  const owner = await prisma.user.upsert({
    where: { email: PUBLIC_USER_EMAIL },
    update: {
      name: PUBLIC_USER_NAME,
      role: "TEACHER",
      status: "ACTIVE",
    },
    create: {
      email: PUBLIC_USER_EMAIL,
      password_hash: PUBLIC_PASSWORD_HASH,
      name: PUBLIC_USER_NAME,
      role: "TEACHER",
      status: "ACTIVE",
    },
  });

  const assessment = await prisma.assessment.findUnique({
    where: { slug: assessmentSlug },
  });

  const version = assessment
    ? await prisma.assessmentVersion.findFirst({
        where: {
          assessment_id: assessment.id,
          is_active: true,
        },
        orderBy: { created_at: "desc" },
      })
    : null;

  if (!assessment || !version) {
    notFound();
  }

  const code = `public-${assessmentSlug.replace(/_/g, "-")}`;

  return prisma.session.upsert({
    where: { code },
    update: {
      user_id: owner.id,
      assessment_id: assessment.id,
      assessment_version_id: version.id,
      name: `Tes Publik ${assessment.name}`,
      school_name: PUBLIC_SCHOOL_NAME,
      description: "Sesi publik otomatis dari landing page",
      mode: "bebas",
      is_active: true,
    },
    create: {
      user_id: owner.id,
      assessment_id: assessment.id,
      assessment_version_id: version.id,
      code,
      name: `Tes Publik ${assessment.name}`,
      school_name: PUBLIC_SCHOOL_NAME,
      description: "Sesi publik otomatis dari landing page",
      mode: "bebas",
      is_active: true,
    },
    include: {
      assessment: true,
    },
  });
}

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

  const session = await getPublicSession(assessmentSlug);

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
