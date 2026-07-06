"use client";

import "@/lib/chartjs";
import dynamic from "next/dynamic";
import { TestResult, Mode, PersonalityType } from "@/data/types";
import { careers } from "@/data/careers";
import { personalities } from "@/data/personalities";
import { getBadgeByCode, getTop3Code } from "@/data/badges";
import { downloadPdf } from "@/utils/pdfExport";
import realisticIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/1 - Realistic (Tipe Praktis dan Fisik  The Doers).png";
import investigativeIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/2 - Investigative (Tipe Analitis dan Sains, The Thinkers).png";
import artisticIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/3 - Artistic (Tipe Kreatif dan Ekspresif  The Creators).png";
import socialIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/4 - Social (Tipe Suportif dan Humanis, The Helpers).png";
import enterprisingIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/5 - Enterprising (Tipe Pemimpin dan Bisnis, The Persuaders).png";
import conventionalIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/6 - Conventional (Tipe Terstruktur dan Presisi, The Organizers).png";

import CareerTable from "./CareerTable";

const personalityIcons: Record<
  PersonalityType,
  { src: string; alt: string }
> = {
  realistic: { src: realisticIcon.src, alt: "Icon Realistic" },
  investigative: { src: investigativeIcon.src, alt: "Icon Investigative" },
  artistic: { src: artisticIcon.src, alt: "Icon Artistic" },
  social: { src: socialIcon.src, alt: "Icon Social" },
  enterprising: { src: enterprisingIcon.src, alt: "Icon Enterprising" },
  conventional: { src: conventionalIcon.src, alt: "Icon Conventional" },
};

const bannerSrc = "/test-banners/riasec-banner.png";

const Bar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  { ssr: false },
);

interface KarirResultsProps {
  sessionId: string;
  name: string;
  birthDate: string;
  results: TestResult[];
  selectedAnswers: { section: string; question: string; answer: string }[];
  mode: Mode;
}

export default function KarirResults({
  sessionId,
  name,
  birthDate,
  results,
}: KarirResultsProps) {
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const topResults = sorted.filter((r) => r.score > 0);
  const top3 = topResults.slice(0, 3);

  const testDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedBirthDate = birthDate
    ? new Date(birthDate).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const hollandCode = getTop3Code(results);
  const badge = getBadgeByCode(hollandCode);

  const typeOrder: PersonalityType[] = [
    "realistic",
    "investigative",
    "artistic",
    "social",
    "enterprising",
    "conventional",
  ];

  const top3Types = new Set(top3.map((r) => r.type));
  const pdfFileName = `hasil-karir-${name.trim().replace(/\s+/g, "-").toLowerCase() || "siswa"}.pdf`;

  const barData = {
    labels: [
      "Realistis",
      "Investigatif",
      "Artistik",
      "Sosial",
      "Wirausaha",
      "Konvensional",
    ],
    datasets: [
      {
        label: "Skor RIASEC",
        data: typeOrder.map((t) => results.find((r) => r.type === t)?.score ?? 0),
        backgroundColor: typeOrder.map((t) =>
          top3Types.has(t)
            ? "rgba(29, 78, 216, 0.9)"
            : "rgba(148, 163, 184, 0.5)"
        ),
        borderColor: typeOrder.map((t) =>
          top3Types.has(t)
            ? "rgba(29, 78, 216, 1)"
            : "rgba(148, 163, 184, 0.8)"
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: { stepSize: 1 },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
      y: {
        grid: { display: false },
        ticks: {
          font: { size: 12, weight: "bold" as const },
          color: "#1e293b",
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div
      id="results"
      className="bg-white p-5 md:p-8 rounded-xl shadow-sm border border-slate-200"
    >
      <div
        id="karir-result-pdf"
        className="absolute -left-[10000px] top-0 w-[794px] bg-white p-8 text-slate-800"
        aria-hidden="true"
      >
        <img
          src={bannerSrc}
          alt="Banner asesmen Holland RIASEC"
          className="mx-auto mb-6 w-full max-w-[260px]"
        />

        <h2 className="text-2xl font-bold text-slate-900">
          Hasil Tes Holland RIASEC
        </h2>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p>
            <span className="font-semibold text-slate-900">Nama:</span> {name}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Tanggal Lahir:</span>{" "}
            {formattedBirthDate}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Tanggal Tes:</span>{" "}
            {testDate}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-slate-900">Kode Holland:</span>{" "}
            {hollandCode}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Profil RIASEC
          </h3>
          <div className="mt-3">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {top3.map((result, index) => {
            const info = personalities[result.type];
            return (
              <div
                key={result.type}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-blue-700">
                      {index + 1}. {info.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Skor: {result.score}
                    </p>
                  </div>
                  <img
                    src={personalityIcons[result.type].src}
                    alt={personalityIcons[result.type].alt}
                    className="h-20 w-20 shrink-0 object-contain"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {info.summary}
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <li>
                    <span className="font-semibold text-slate-900">
                      Sifat Utama:
                    </span>{" "}
                    {info.traits}
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">
                      Preferensi (Suka):
                    </span>{" "}
                    {info.preferences}
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">
                      Hal yang Dihindari:
                    </span>{" "}
                    {info.avoidances}
                  </li>
                </ul>
                <div className="mt-3">
                  <h4 className="font-semibold text-slate-900">
                    Profesi yang Cocok:
                  </h4>
                  <div className="mt-2">
                    <CareerTable careers={careers[result.type]} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Detail Semua Hasil
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {sorted.map((result) => (
              <div
                key={result.type}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <span className="block text-sm text-slate-600">
                  {personalities[result.type].label}
                </span>
                <span className="block text-lg font-bold text-blue-700">
                  {result.score} poin
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="results-content">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Hasil Tes Holland RIASEC
      </h2>

      <div className="print-card bg-slate-50 rounded-lg p-4 mb-8 space-y-1">
        <p className="text-slate-600">
          <span className="font-semibold text-slate-800">Nama:</span> {name}
        </p>
        <p className="text-slate-600">
          <span className="font-semibold text-slate-800">
            Tanggal Lahir:
          </span>{" "}
          {formattedBirthDate}
        </p>
        <p className="text-slate-600">
          <span className="font-semibold text-slate-800">
            Tanggal Tes:
          </span>{" "}
          {testDate}
        </p>
      </div>

      <section className="mt-6 text-center" aria-labelledby="holland-code-heading">
        <h2 id="holland-code-heading" className="sr-only">
          Kode Holland
        </h2>
        <div className="inline-block px-8 py-5 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-slate-600 mb-1">
            Kode Holland-mu
          </p>
          <p
            className="text-4xl font-bold text-blue-700 tracking-widest"
            aria-label={`Kode Holland: ${hollandCode}`}
          >
            {hollandCode}
          </p>
          {badge && (
            <div className="mt-3">
              <span className="inline-block px-4 py-1.5 bg-blue-700 text-white text-sm font-semibold rounded-full">
                {badge.name}
              </span>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                {badge.description}
              </p>
            </div>
          )}
          {!badge && (
            <p className="mt-2 text-sm text-slate-500">
              Profil kombinasi unik dengan kode {hollandCode}
            </p>
          )}
        </div>
      </section>

      <section
        className="mt-8 max-w-md mx-auto"
        aria-labelledby="bar-heading"
      >
        <h3 id="bar-heading" className="text-lg font-bold text-slate-800 mb-3 text-center">
          Profil RIASEC
        </h3>
        <Bar data={barData} options={barOptions} />
      </section>

      <section className="mt-8" aria-labelledby="dominant-heading">
        <h3
          id="dominant-heading"
          className="text-lg font-bold text-slate-800 mb-4"
        >
          Kepribadian Dominan
        </h3>
        {top3.length === 0 ? (
          <p className="text-slate-500" role="status">
            Anda belum memilih pernyataan apapun. Silakan centang beberapa
            pernyataan yang sesuai dengan Anda.
          </p>
        ) : (
          top3.map((result, index) => {
            const info = personalities[result.type];
            const icon = personalityIcons[result.type];
            return (
              <div
                key={result.type}
                className="print-card mb-6 p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <h4 className="text-blue-700 font-bold text-base mb-1">
                      {index + 1}. {info.label}
                    </h4>
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Skor:
                      </span>{" "}
                      {result.score}
                    </p>
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed italic">
                      {info.summary}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      <li>
                        <span className="font-semibold text-slate-800">
                          Sifat Utama:
                        </span>{" "}
                        {info.traits}
                      </li>
                      <li>
                        <span className="font-semibold text-slate-800">
                          Preferensi (Suka):
                        </span>{" "}
                        {info.preferences}
                      </li>
                      <li>
                        <span className="font-semibold text-slate-800">
                          Hal yang Dihindari:
                        </span>{" "}
                        {info.avoidances}
                      </li>
                    </ul>
                  </div>
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="h-28 w-28 shrink-0 object-contain md:h-36 md:w-36"
                  />
                </div>
                <h4 className="mt-4 font-semibold text-slate-800">
                  Profesi yang Cocok:
                </h4>
                <CareerTable careers={careers[result.type]} />
              </div>
            );
          })
        )}
      </section>

      <section className="mt-6" aria-labelledby="detail-career-heading">
        <h3
          id="detail-career-heading"
          className="font-bold text-slate-800 mb-3"
        >
          Detail Semua Hasil
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {sorted.map((result) => (
          <div
              key={result.type}
              className="print-card px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
            >
              <span className="text-sm text-slate-600">
                {personalities[result.type].label}
              </span>
              <span className="block text-lg font-bold text-blue-700">
                {result.score} poin
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={() =>
            void downloadPdf(
              `/api/results/pdf?kind=karir&sessionId=${encodeURIComponent(sessionId)}&studentName=${encodeURIComponent(name)}&studentClass=${encodeURIComponent(birthDate)}`,
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
