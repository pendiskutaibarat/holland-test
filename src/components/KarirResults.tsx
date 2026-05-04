"use client";

import "@/lib/chartjs";
import dynamic from "next/dynamic";
import { TestResult, Mode } from "@/data/types";
import { careers } from "@/data/careers";
import { personalities } from "@/data/personalities";
import { getBadgeByCode, getTop3Code } from "@/data/badges";
import { getProgramStudiByCode } from "@/data/programStudi";
import { downloadPdf } from "@/utils/pdfExport";
import CareerTable from "./CareerTable";

const Radar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Radar),
  { ssr: false },
);

interface KarirResultsProps {
  name: string;
  birthDate: string;
  results: TestResult[];
  selectedAnswers: { section: string; question: string; answer: string }[];
  mode: Mode;
}

export default function KarirResults({
  name,
  birthDate,
  results,
}: KarirResultsProps) {
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const topResults = sorted.filter((r) => r.score > 0);
  const top2 = topResults.slice(0, 2);

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
  const programStudi = getProgramStudiByCode(hollandCode);

  const radarData = {
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
        data: [
          results.find((r) => r.type === "realistic")?.score ?? 0,
          results.find((r) => r.type === "investigative")?.score ?? 0,
          results.find((r) => r.type === "artistic")?.score ?? 0,
          results.find((r) => r.type === "social")?.score ?? 0,
          results.find((r) => r.type === "enterprising")?.score ?? 0,
          results.find((r) => r.type === "conventional")?.score ?? 0,
        ],
        backgroundColor: "rgba(29, 78, 216, 0.15)",
        borderColor: "rgba(29, 78, 216, 0.8)",
        pointBackgroundColor: "rgba(29, 78, 216, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(29, 78, 216, 1)",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: { stepSize: 1 },
        grid: { color: "rgba(0,0,0,0.06)" },
        pointLabels: {
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
      <div className="print:block hidden">
        <img
          src="/banner.png"
          alt="Holland RIASEC"
          className="mx-auto mb-4"
        />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Hasil Tes Holland RIASEC
      </h2>

      <div className="bg-slate-50 rounded-lg p-4 mb-8 space-y-1">
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
        aria-labelledby="radar-heading"
      >
        <h3 id="radar-heading" className="text-lg font-bold text-slate-800 mb-3 text-center">
          Profil RIASEC
        </h3>
        <Radar data={radarData} options={radarOptions} />
      </section>

      {programStudi && (
        <section className="mt-8" aria-labelledby="prodi-heading">
          <h3
            id="prodi-heading"
            className="text-lg font-bold text-slate-800 mb-4"
          >
            Rekomendasi Program Studi
          </h3>
          <div className="space-y-4">
            {programStudi.clusters.map((cluster, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <h4 className="font-bold text-blue-700 mb-2">
                  {cluster.name}
                </h4>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Program Studi:
                  </span>{" "}
                  {cluster.programs.join(", ")}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-semibold text-slate-800">
                    Profesi:
                  </span>{" "}
                  {cluster.professions.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!programStudi && (
        <section className="mt-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3">
            Kepribadian kamu yang paling dominan adalah:
          </h3>
          {top2.length === 0 ? (
            <p className="text-slate-500" role="status">
              Anda belum memilih pernyataan apapun. Silakan centang beberapa
              pernyataan yang sesuai dengan Anda.
            </p>
          ) : (
            top2.map((result, index) => {
              const info = personalities[result.type];
              return (
                <div
                  key={result.type}
                  className="mb-6 p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <h3 className="text-blue-700 font-bold mb-1">
                    {index + 1}. {info.label}
                  </h3>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">
                      Skor:
                    </span>{" "}
                    {result.score}
                  </p>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    {info.description}
                  </p>
                  <h4 className="mt-3 font-semibold text-slate-800">
                    25 Profesi yang Cocok:
                  </h4>
                  <CareerTable careers={careers[result.type]} />
                </div>
              );
            })
          )}
        </section>
      )}

      {programStudi && top2.length > 0 && (
        <section className="mt-8" aria-labelledby="dominant-career-heading">
          <h3
            id="dominant-career-heading"
            className="text-lg font-bold text-slate-800 mb-4"
          >
            Kepribadian Dominan
          </h3>
          {top2.map((result, index) => {
            const info = personalities[result.type];
            return (
              <div
                key={result.type}
                className="mb-5 p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <h4 className="text-blue-700 font-bold mb-1">
                  {index + 1}. {info.label}
                </h4>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Skor:
                  </span>{" "}
                  {result.score}
                </p>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {info.description}
                </p>
              </div>
            );
          })}
        </section>
      )}

      {top2.length > 0 && (
        <section className="mt-6" aria-labelledby="profesi-heading">
          <h3
            id="profesi-heading"
            className="text-lg font-bold text-slate-800 mb-4"
          >
            Profesi yang Cocok
          </h3>
          {top2.map((result) => (
            <div key={result.type} className="mb-6">
              <h4 className="font-semibold text-blue-700 mb-2">
                {personalities[result.type].label}
              </h4>
              <CareerTable careers={careers[result.type]} />
            </div>
          ))}
        </section>
      )}

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
              className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
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
          onClick={() =>
            downloadPdf(
              "results",
              `Hasil-Tes-Holland-${name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`,
            )
          }
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Unduh PDF
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Cetak Hasil
        </button>
      </div>
    </div>
  );
}