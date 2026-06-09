"use client";

import { minatHobiCategories } from "@/data/minatHobi";
import type { MinatHobiScoreResult } from "@/utils/minatHobi";

interface MinatHobiResultsProps {
  studentName: string;
  birthDate?: string;
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
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <p className="text-sm text-gray-500">Hasil Asesmen Minat Hobi</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-800">{studentName}</h1>
        {birthDate && <p className="mt-1 text-sm text-gray-500">{birthDate}</p>}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Tiga Minat Teratas
        </h2>
        <div className="space-y-3">
          {topCategory && (
            <div
              key={topCategory.category_code}
              className="rounded-lg border border-blue-100 bg-blue-50 p-5 md:p-6"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Peringkat {topCategory.rank}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-800 md:text-3xl">
                {topCategory.category_name}
              </h3>
              <p className="mt-2 text-base font-medium text-gray-700">
                Skor {topCategory.score}
              </p>
              {topCategoryDetail && (
                <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
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
                    className="rounded-lg border border-blue-100 bg-blue-50 p-4"
                  >
                    <p className="text-sm font-medium text-blue-700">
                      Peringkat {category.rank}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-gray-800">
                      {category.category_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Skor {category.score}
                    </p>
                    {detail && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
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
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
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
                className="rounded-lg border border-gray-100 p-4"
              >
                <h3 className="font-semibold text-gray-800">
                  {category.category_name}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
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
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Semua Kategori
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Peringkat
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  Skor
                </th>
              </tr>
            </thead>
            <tbody>
              {result.ranked_categories.map((category) => (
                <tr
                  key={category.category_code}
                  className="border-t border-gray-50"
                >
                  <td className="px-4 py-3 text-gray-600">{category.rank}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {category.category_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{category.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
