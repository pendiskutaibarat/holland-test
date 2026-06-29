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
    name: "Minat Hobi (RMIB)",
    description:
      "Asesmen minat dan hobi berbasis adaptasi RMIB dengan 10 area minat dari aktivitas sehari-hari.",
    engineKey: ASSESSMENT_SLUGS.minatHobi,
    defaultVersion: "v2",
    questionCount: 60,
    estimatedDuration: "8-12 menit",
  },
];

export function getAssessmentCatalogItem(slug: string) {
  return assessmentCatalog.find((item) => item.slug === slug);
}
