"use client";

import { minatHobiCategories } from "@/data/minatHobi";
import type { MinatHobiScoreResult } from "@/utils/minatHobi";

interface MinatHobiResultsProps {
  studentName: string;
  birthDate?: string;
  assessmentVersion?: string;
  result: Pick<
    MinatHobiScoreResult,
    "total_score" | "category_scores" | "ranked_categories" | "top_categories"
  >;
}

export default function MinatHobiResults({
  studentName,
  birthDate,
  result,
}: MinatHobiResultsProps) {
  const [topCategory, ...secondaryCategories] = result.top_categories;
  const topCategoryDetail = topCategory
    ? minatHobiCategories.find((item) => item.code === topCategory.category_code)
    : null;

  return (
    <div className="app-card p-5">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <p className="text-sm text-slate-500">Hasil Asesmen Minat Hobi (RMIB)</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{studentName}</h1>
        {birthDate && <p className="mt-1 text-sm text-slate-500">{birthDate}</p>}
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Skor tiap kategori berada pada rentang 0 sampai 6. Jika ada skor teratas yang seri,
          hasil ini sebaiknya dikonfirmasi lagi melalui obrolan singkat dengan guru BK.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Tiga Minat Teratas
        </h2>
        <div className="space-y-3">
          {topCategory && (
            <div
              key={topCategory.category_code}
              className="app-card-muted p-5 md:p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                Peringkat {topCategory.rank}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                {topCategory.category_name}
              </h3>
              <p className="mt-2 text-base font-medium text-slate-700">
                Skor {topCategory.score}/6
              </p>
              {topCategoryDetail && (
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                  {topCategoryDetail.description}
                </p>
              )}
            </div>
          )}

          {secondaryCategories.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {secondaryCategories.map((category) => {
                const detail = minatHobiCategories.find(
                  (item) => item.code === category.category_code,
                );
                return (
                  <div
                    key={category.category_code}
                    className="app-card-muted p-4"
                  >
                    <p className="text-sm font-medium text-brand-700">
                      Peringkat {category.rank}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {category.category_name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Skor {category.score}/6
                    </p>
                    {detail && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {detail.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Rekomendasi Aktivitas
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {result.top_categories.map((category) => {
            const detail = minatHobiCategories.find(
              (item) => item.code === category.category_code,
            );
            return (
              <div
                key={category.category_code}
                className="app-section-card p-4"
              >
                <h3 className="font-semibold text-slate-900">
                  {category.category_name}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {(detail?.activities ?? []).map((activity) => (
                    <li key={activity}>- {activity}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Semua Kategori
        </h2>
        <div className="app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>
                  Peringkat
                </th>
                <th>
                  Kategori
                </th>
                <th>
                  Skor
                </th>
              </tr>
            </thead>
            <tbody>
              {result.ranked_categories.map((category) => (
                <tr key={category.category_code}>
                  <td>{category.rank}</td>
                  <td className="font-medium text-slate-900">
                    {category.category_name}
                  </td>
                  <td>{category.score}/6</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
