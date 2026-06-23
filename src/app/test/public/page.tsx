import Link from "next/link";
import { assessmentCatalog } from "@/data/assessments";
import { getAssessmentRouteSegment } from "@/lib/test-route";

export default function PublicTestPage() {
  return (
    <main className="app-shell py-10">
      <section className="mx-auto max-w-4xl text-center">
        <p className="section-kicker">Tes Publik</p>
        <h1 className="app-page-title mt-2 text-4xl">Pilih asesmen yang ingin kamu mulai</h1>
      </section>

      <section className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
        {assessmentCatalog.map((assessment) => (
          <Link
            key={assessment.slug}
            href={`/test/public/${getAssessmentRouteSegment(assessment.slug)}`}
            className="app-card-link p-6"
          >
            <span className="app-badge-brand">{assessment.estimatedDuration}</span>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              {assessment.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {assessment.description}
            </p>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
              <span>{assessment.questionCount} soal</span>
              <span className="app-button-primary">Mulai Tes</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
