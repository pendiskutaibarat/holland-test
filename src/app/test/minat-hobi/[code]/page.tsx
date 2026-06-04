import { ASSESSMENT_SLUGS } from "@/data/assessments";
import TestPageServer from "../../TestPageServer";

export default async function MinatHobiTestPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <TestPageServer
      code={code}
      expectedAssessmentSlug={ASSESSMENT_SLUGS.minatHobi}
    />
  );
}
