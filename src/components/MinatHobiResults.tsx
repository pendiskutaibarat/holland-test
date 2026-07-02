"use client";

import { minatHobiCategories } from "@/data/minatHobi";
import type { MinatHobiScoreResult } from "@/utils/minatHobi";
import { downloadPdf } from "@/utils/pdfExport";
import outdoorIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/1 - Outdoor.png";
import mechanicalPracticalIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/2 - Mechanical & Practical.png";
import computationalClericalIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/3 - Computational & Clerical.png";
import scientificIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/4 - Scientific.png";
import persuasiveIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/5 - Persuasive.png";
import aestheticIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/6 - Aesthetic.png";
import literaryIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/7 - Literary.png";
import musicalIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/8 - Musical.png";
import socialServiceIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/9 - Social Service.png";
import medicalIcon from "../../Icon Minat dan Hobi - RMIB/Icon Minat dan Hobi - RMIB/10 - Medical.png";

const categoryIcons: Record<string, { src: string; alt: string }> = {
  outdoor: { src: outdoorIcon.src, alt: "Icon Outdoor" },
  mechanical_practical: { src: mechanicalPracticalIcon.src, alt: "Icon Mechanical & Practical" },
  computational_clerical: { src: computationalClericalIcon.src, alt: "Icon Computational & Clerical" },
  scientific: { src: scientificIcon.src, alt: "Icon Scientific" },
  persuasive: { src: persuasiveIcon.src, alt: "Icon Persuasive" },
  aesthetic: { src: aestheticIcon.src, alt: "Icon Aesthetic" },
  literary: { src: literaryIcon.src, alt: "Icon Literary" },
  musical: { src: musicalIcon.src, alt: "Icon Musical" },
  social_service: { src: socialServiceIcon.src, alt: "Icon Social Service" },
  medical: { src: medicalIcon.src, alt: "Icon Medical" },
};

interface MinatHobiResultsProps {
  sessionId: string;
  studentName: string;
  birthDate?: string;
  assessmentVersion?: string;
  result: Pick<
    MinatHobiScoreResult,
    "total_score" | "category_scores" | "ranked_categories" | "top_categories"
  >;
}

export default function MinatHobiResults({
  sessionId,
  studentName,
  birthDate,
  result,
}: MinatHobiResultsProps) {
  const [topCategory, ...secondaryCategories] = result.top_categories;
  const topCategoryDetail = topCategory
    ? minatHobiCategories.find((item) => item.code === topCategory.category_code)
    : null;
  const topCategoryIcon = topCategory ? categoryIcons[topCategory.category_code] : null;
  const pdfFileName = `hasil-minat-hobi-${studentName.trim().replace(/\s+/g, "-").toLowerCase() || "siswa"}.pdf`;

  return (
    <div id="results" className="app-card p-5">
      <div
        id="minat-hobi-result-pdf"
        className="absolute -left-[10000px] top-0 w-[794px] bg-white p-8 text-slate-800"
        aria-hidden="true"
      >
        <img
          src="/banner.png"
          alt="Holland RIASEC"
          className="mx-auto mb-6 w-full max-w-[260px]"
        />

        <h2 className="text-2xl font-bold text-slate-900">
          Hasil Asesmen Minat Hobi (RMIB)
        </h2>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p>
            <span className="font-semibold text-slate-900">Nama:</span> {studentName}
          </p>
          {birthDate && (
            <p className="mt-1">
              <span className="font-semibold text-slate-900">Tanggal Lahir:</span>{" "}
              {birthDate}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4">
          {result.top_categories.map((category) => {
            const detail = minatHobiCategories.find(
              (item) => item.code === category.category_code,
            );
            return (
              <div
                key={category.category_code}
                className="rounded-xl border border-slate-200 bg-white p-4"
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

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Rekomendasi Aktivitas
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {result.top_categories.map((category) => {
              const detail = minatHobiCategories.find(
                (item) => item.code === category.category_code,
              );
              return (
                <div
                  key={category.category_code}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h4 className="font-semibold text-slate-900">
                    {category.category_name}
                  </h4>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                    {(detail?.activities ?? []).map((activity) => (
                      <li key={activity}>- {activity}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Semua Kategori
          </h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-800">
                    Peringkat
                  </th>
                  <th className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-800">
                    Kategori
                  </th>
                  <th className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-800">
                    Skor
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.ranked_categories.map((category) => (
                  <tr key={category.category_code} className="border-b border-slate-200 last:border-b-0">
                    <td className="px-4 py-2 text-slate-600">{category.rank}</td>
                    <td className="px-4 py-2 font-medium text-slate-900">
                      {category.category_name}
                    </td>
                    <td className="px-4 py-2 text-slate-600">{category.score}/6</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="results-content">
        <div className="print-card mb-6 border-b border-slate-100 pb-4">
          <p className="text-sm text-slate-500">Hasil Asesmen Minat Hobi (RMIB)</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{studentName}</h1>
          {birthDate && <p className="mt-1 text-sm text-slate-500">{birthDate}</p>}
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Skor tiap kategori berada pada rentang 0 sampai 6. Jika ada skor teratas yang seri,
            hasil ini sebaiknya dikonfirmasi lagi melalui obrolan singkat dengan guru BK.
          </p>
        </div>

        <section className="print-card mb-8">
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
                <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
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
                  {topCategoryIcon && (
                    <img
                      src={topCategoryIcon.src}
                      alt={topCategoryIcon.alt}
                      className="h-28 w-28 shrink-0 object-contain md:h-36 md:w-36"
                    />
                  )}
                </div>
              </div>
            )}

            {secondaryCategories.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {secondaryCategories.map((category) => {
                  const detail = minatHobiCategories.find(
                    (item) => item.code === category.category_code,
                  );
                  const icon = categoryIcons[category.category_code];
                  return (
                    <div key={category.category_code} className="app-card-muted p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
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
                        {icon && (
                          <img
                            src={icon.src}
                            alt={icon.alt}
                            className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="print-card mb-8">
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

        <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={() =>
              void downloadPdf(
                `/api/results/pdf?kind=minat_hobi&sessionId=${encodeURIComponent(sessionId)}&studentName=${encodeURIComponent(studentName)}&studentClass=${encodeURIComponent(birthDate ?? "")}`,
                pdfFileName,
              )
            }
            className="app-button-ghost"
          >
            Unduh PDF
          </button>
        </div>
      </div>
    </div>
  );
}
