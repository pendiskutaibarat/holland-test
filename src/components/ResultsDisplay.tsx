import { TestResult, PersonalityType, SubmissionPayload } from "@/data/types";
import { careers } from "@/data/careers";
import { personalities } from "@/data/personalities";
import CareerTable from "./CareerTable";
import SaveButton from "./SaveButton";

interface ResultsDisplayProps {
  name: string;
  birthDate: string;
  results: TestResult[];
  selectedAnswers: { section: string; question: string; answer: string }[];
}

export default function ResultsDisplay({
  name,
  birthDate,
  results,
  selectedAnswers,
}: ResultsDisplayProps) {
  const sorted = [...results].sort((a, b) => b.score - a.score);
  const topResults = sorted.filter((r) => r.score > 0);
  const top2 = topResults.slice(0, 2);

  const testDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedBirthDate = new Date(birthDate).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const payload: SubmissionPayload = {
    name,
    birthDate,
    realistic: results.find((r) => r.type === "realistic")?.score ?? 0,
    investigative: results.find((r) => r.type === "investigative")?.score ?? 0,
    artistic: results.find((r) => r.type === "artistic")?.score ?? 0,
    social: results.find((r) => r.type === "social")?.score ?? 0,
    enterprising: results.find((r) => r.type === "enterprising")?.score ?? 0,
    conventional: results.find((r) => r.type === "conventional")?.score ?? 0,
    topResults: topResults
      .slice(0, 3)
      .map((r) => personalities[r.type].label)
      .join(", "),
    timestamp: new Date().toISOString(),
    answers: selectedAnswers,
  };

  return (
    <div id="results" className="bg-white p-5 rounded-lg shadow-sm">
      <div className="print:block hidden">
        <img src="banner.png" alt="Holland RIASEC" className="mx-auto mb-4" />
      </div>

      <h2 className="text-xl font-bold text-gray-800">
        Hasil Tes Holland RIASEC
      </h2>
      <p className="mt-2">
        <strong>Nama:</strong> {name}
      </p>
      <p>
        <strong>Tanggal Lahir:</strong> {formattedBirthDate}
      </p>
      <p>
        <strong>Tanggal Tes:</strong> {testDate}
      </p>

      <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-800">
        Kepribadian kamu yang paling dominan adalah:
      </h3>

      {top2.length === 0 ? (
        <p className="text-gray-500">
          Anda belum memilih pernyataan apapun. Silakan centang beberapa
          pernyataan yang sesuai dengan Anda.
        </p>
      ) : (
        top2.map((result, index) => {
          const info = personalities[result.type];
          return (
            <div
              key={result.type}
              className="mb-6 pb-6 border-b border-gray-200 last:border-b-0"
            >
              <h3 className="text-blue-500 font-semibold mb-1">
                {index + 1}. {info.label}
              </h3>
              <p>
                <strong>Skor:</strong> {result.score}
              </p>
              <p className="mt-2 text-gray-700">{info.description}</p>

              <h4 className="mt-3 font-semibold">25 Profesi yang Cocok:</h4>
              <CareerTable careers={careers[result.type]} />
            </div>
          );
        })
      )}

      {/* All scores summary */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Detail Semua Hasil:</h3>
        {sorted.map((result) => (
          <p key={result.type}>
            <strong>{personalities[result.type].label}:</strong> {result.score}{" "}
            poin
          </p>
        ))}
      </div>

      {/* Save & Print buttons */}
      <div className="mt-6 flex justify-center gap-2 print:hidden">
        <SaveButton payload={payload} />
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Cetak Hasil
        </button>
      </div>
    </div>
  );
}
