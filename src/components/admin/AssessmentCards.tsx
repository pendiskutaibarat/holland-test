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
          className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {assessment.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {assessment.description}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {assessment.question_count} soal
            </span>
          </div>
          <span className="mt-5 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Lihat Sesi
          </span>
        </Link>
      ))}
    </div>
  );
}
