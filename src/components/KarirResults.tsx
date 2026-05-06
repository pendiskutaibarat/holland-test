"use client";

import "@/lib/chartjs";
import dynamic from "next/dynamic";
import { TestResult, Mode, PersonalityType } from "@/data/types";
import { careers } from "@/data/careers";
import { personalities } from "@/data/personalities";
import { getBadgeByCode, getTop3Code } from "@/data/badges";

import CareerTable from "./CareerTable";

const Bar = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
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
            return (
              <div
                key={result.type}
                className="mb-6 p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
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
          onClick={() => window.print()}
          className="px-6 py-2.5 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Cetak Hasil
        </button>
      </div>
    </div>
  );
}
