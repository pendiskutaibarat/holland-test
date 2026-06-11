import Link from "next/link";

export interface AssessmentCardData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  question_count: number;
}

export default function AssessmentCards({
  assessments,
}: {
  assessments: AssessmentCardData[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {assessments.map((assessment) => (
        <Link
          key={assessment.id}
          href={`/admin/dashboard/assessments/${assessment.slug}`}
          className="app-card-link p-5 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {assessment.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {assessment.description}
              </p>
            </div>
            <span className="app-badge-brand shrink-0">
              {assessment.question_count} soal
            </span>
          </div>
          <span className="app-button-primary mt-5">Lihat Sesi</span>
        </Link>
      ))}
    </div>
  );
}
