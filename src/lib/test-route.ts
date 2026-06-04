import { ASSESSMENT_SLUGS } from "@/data/assessments";

export function getAssessmentRouteSegment(assessmentSlug: string): string {
  switch (assessmentSlug) {
    case ASSESSMENT_SLUGS.minatHobi:
      return "minat-hobi";
    case ASSESSMENT_SLUGS.holland:
    default:
      return "holland-riasec";
  }
}

export function getAssessmentTestHref(
  assessmentSlug: string,
  code: string,
): string {
  return `/test/${getAssessmentRouteSegment(assessmentSlug)}/${code}`;
}
