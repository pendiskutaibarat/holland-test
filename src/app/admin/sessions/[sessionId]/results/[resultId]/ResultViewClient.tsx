"use client";

import Link from "next/link";
import { TestResult, Mode, PersonalityType } from "@/data/types";
import KarirResults from "@/components/KarirResults";
import PeminatanResults from "@/components/PeminatanResults";

interface DbAnswer {
  section: string;
  question: string;
  answer: string;
}

interface DbResult {
  student_name: string;
  student_class: string;
  mode: string;
  birth_date: Date | null;
  r_score: number;
  i_score: number;
  a_score: number;
  s_score: number;
  e_score: number;
  c_score: number;
  holland_code: string | null;
  ipa_pct: number | null;
  ips_pct: number | null;
  bahasa_pct: number | null;
  answers: DbAnswer[];
}

export default function ResultViewClient({
  result,
  sessionId,
}: {
  result: DbResult;
  sessionId: string;
}) {
  const results: TestResult[] = [
    { type: "realistic" as PersonalityType, score: result.r_score },
    { type: "investigative" as PersonalityType, score: result.i_score },
    { type: "artistic" as PersonalityType, score: result.a_score },
    { type: "social" as PersonalityType, score: result.s_score },
    { type: "enterprising" as PersonalityType, score: result.e_score },
    { type: "conventional" as PersonalityType, score: result.c_score },
  ];

  const selectedAnswers = result.answers.map((a) => ({
    section: a.section,
    question: a.question,
    answer: a.answer,
  }));

  const birthDateStr = result.birth_date
    ? result.birth_date.toISOString().split("T")[0]
    : "";

  const mode = result.mode as Mode;

  return (
    <div className="max-w-[1000px] mx-auto p-5">
      <div className="mb-4">
        <Link
          href={`/admin/sessions/${sessionId}`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Kembali ke Detail Sesi
        </Link>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Hasil: {result.student_name} ({result.student_class})
        </h1>
      </div>

      {mode === "peminatan" ? (
        <PeminatanResults
          name={result.student_name}
          birthDate={birthDateStr}
          results={results}
          selectedAnswers={selectedAnswers}
          mode={mode}
        />
      ) : (
        <KarirResults
          name={result.student_name}
          birthDate={birthDateStr}
          results={results}
          selectedAnswers={selectedAnswers}
          mode={mode}
        />
      )}
    </div>
  );
}
