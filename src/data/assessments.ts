export const ASSESSMENT_SLUGS = {
  holland: "holland_riasec",
  minatHobi: "minat_hobi",
} as const;

export type AssessmentSlug =
  (typeof ASSESSMENT_SLUGS)[keyof typeof ASSESSMENT_SLUGS];

export interface AssessmentCatalogItem {
  slug: AssessmentSlug;
  name: string;
  description: string;
  engineKey: AssessmentSlug;
  defaultVersion: string;
  questionCount: number;
  estimatedDuration: string;
}

export const assessmentCatalog: AssessmentCatalogItem[] = [
  {
    slug: ASSESSMENT_SLUGS.holland,
    name: "Holland RIASEC",
    description:
      "Eksplorasi minat, bakat, peminatan SMA/MA, serta rekomendasi karir dan program studi.",
    engineKey: ASSESSMENT_SLUGS.holland,
    defaultVersion: "v1",
    questionCount: 90,
    estimatedDuration: "7-12 menit",
  },
  {
    slug: ASSESSMENT_SLUGS.minatHobi,
    name: "Minat Hobi",
    description:
      "Pemetaan 10 area minat dan hobi siswa dari aktivitas sehari-hari.",
    engineKey: ASSESSMENT_SLUGS.minatHobi,
    defaultVersion: "v1",
    questionCount: 100,
    estimatedDuration: "12-18 menit",
  },
];

export function getAssessmentCatalogItem(slug: string) {
  return assessmentCatalog.find((item) => item.slug === slug);
}
