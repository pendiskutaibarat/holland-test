import { TestResult, Mode } from "@/data/types";
import { personalities } from "@/data/personalities";
import { PEMINATAN_INFO } from "@/data/peminatan";
import {
  calculatePeminatanPercentages,
  getTopPeminatan,
} from "@/utils/peminatan";


interface PeminatanResultsProps {
  name: string;
  birthDate: string;
  results: TestResult[];
  selectedAnswers: { section: string; question: string; answer: string }[];
  mode: Mode;
}

export default function PeminatanResults({
  name,
  birthDate,
  results,
}: PeminatanResultsProps) {
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const top2 = sorted.filter((r) => r.score > 0).slice(0, 2);

  const percentages = calculatePeminatanPercentages(results);
  const topPeminatan = getTopPeminatan(percentages);

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

  const barConfig: Record<
    string,
    { bgColor: string; textColor: string; label: string }
  > = {
    ipa: {
      bgColor: "bg-blue-600",
      textColor: "text-blue-800",
      label: "IPA",
    },
    ips: {
      bgColor: "bg-emerald-600",
      textColor: "text-emerald-800",
      label: "IPS",
    },
    bahasa: {
      bgColor: "bg-amber-600",
      textColor: "text-amber-800",
      label: "Bahasa & Budaya",
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
        Hasil Pemetaan Peminatan SMA/MA
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

      <section aria-labelledby="peminatan-heading">
        <h3
          id="peminatan-heading"
          className="text-lg font-bold text-slate-800 mb-4"
        >
          Kecenderungan Peminatan
        </h3>
        <div className="space-y-5">
          {topPeminatan.map((ptype) => {
            const pct = percentages[ptype];
            const config = barConfig[ptype];
            const maxPct = Math.max(...topPeminatan.map((p) => percentages[p]));
            const width = maxPct > 0 ? Math.max((pct / maxPct) * 100, 5) : 5;
            return (
              <div key={ptype}>
                <div className="flex justify-between text-sm font-semibold mb-1.5">
                  <span className="text-slate-800">
                    {config.label}
                  </span>
                  <span className={config.textColor}>{pct}%</span>
                </div>
                <div
                  className="w-full bg-slate-200 rounded-full h-4 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${config.label}: ${pct}%`}
                >
                  <div
                    className={`${config.bgColor} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 space-y-4" aria-labelledby="explanation-heading">
        <h3
          id="explanation-heading"
          className="text-lg font-bold text-slate-800"
        >
          Penjelasan Hasil
        </h3>
        {topPeminatan.map((ptype) => {
          const pct = percentages[ptype];
          const info = PEMINATAN_INFO[ptype];
          const config = barConfig[ptype];
          if (pct >= 10) {
            return (
              <div
                key={ptype}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${config.bgColor}`}
                    aria-hidden="true"
                  />
                  {info.label}
                </h4>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {info.description}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">
                    Mata Pelajaran relevan:
                  </span>{" "}
                  {info.subjects.join(", ")}
                </p>
              </div>
            );
          }
          return (
            <div
              key={ptype}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50"
            >
              <h4 className="font-semibold text-slate-500 text-sm">
                {info.label}
              </h4>
              <p className="mt-1 text-slate-500 text-sm">
                Kecenderungan {info.label} tergolong rendah ({pct}%).
              </p>
            </div>
          );
        })}
      </section>

      {top2.length > 0 && (
        <section className="mt-8" aria-labelledby="dominant-heading">
          <h3
            id="dominant-heading"
            className="text-lg font-bold text-slate-800 mb-4"
          >
            Kepribadian RIASEC Dominan
          </h3>
          {top2.map((result, index) => {
            const info = personalities[result.type];
            return (
              <div
                key={result.type}
                className="mb-5 p-5 rounded-xl border border-slate-200 bg-white shadow-sm"
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
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {info.description}
                </p>
              </div>
            );
          })}
        </section>
      )}

      <section className="mt-6" aria-labelledby="all-scores-heading">
        <h3
          id="all-scores-heading"
          className="font-bold text-slate-800 mb-3"
        >
          Detail Semua Hasil RIASEC
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