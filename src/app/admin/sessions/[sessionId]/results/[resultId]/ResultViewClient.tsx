"use client";

import Link from "next/link";
import { TestResult, Mode, PersonalityType } from "@/data/types";
import KarirResults from "@/components/KarirResults";
import PeminatanResults from "@/components/PeminatanResults";
import MinatHobiResults from "@/components/MinatHobiResults";
import type { RankedMinatHobiCategory } from "@/utils/minatHobi";

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

interface GenericDbResult {
  student_name: string;
  student_class: string;
  birth_date: Date | null;
  total_score: number;
  category_scores: Record<string, number>;
  ranked_categories: RankedMinatHobiCategory[];
  top_categories: RankedMinatHobiCategory[];
}

function ResultShell({
  children,
  sessionId,
  title,
}: {
  children: React.ReactNode;
  sessionId: string;
  title?: string;
}) {
  return (
    <div className="app-shell max-w-[1000px]">
      <div className="mb-6">
        <Link href={`/admin/sessions/${sessionId}`} className="app-back-link">
          {"<-"} Kembali ke Detail Sesi
        </Link>
      </div>
      {title ? (
        <div className="app-page-header">
          <div className="app-page-header-copy">
            <h1 className="app-page-title">{title}</h1>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}

export default function ResultViewClient({
  result,
  sessionId,
  assessmentVersion,
}: {
  result: DbResult | GenericDbResult;
  sessionId: string;
  assessmentVersion?: string;
}) {
  if ("category_scores" in result) {
    return (
      <ResultShell sessionId={sessionId}>
        <MinatHobiResults
          studentName={result.student_name}
          birthDate={result.student_class}
          assessmentVersion={assessmentVersion}
          result={result}
        />
      </ResultShell>
    );
  }

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
    <ResultShell
      sessionId={sessionId}
      title={`Hasil: ${result.student_name} (${result.student_class})`}
    >
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
    </ResultShell>
  );
}
