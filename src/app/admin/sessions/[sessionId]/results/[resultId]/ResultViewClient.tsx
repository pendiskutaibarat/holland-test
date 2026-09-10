"use client";

import Link from "next/link";
import type {
  Mode,
  PeminatanOutcome,
  PersonalityType,
  TestResult,
} from "@/data/types";
import KarirResults from "@/components/KarirResults";
import PeminatanResults from "@/components/PeminatanResults";
import MinatHobiResults from "@/components/MinatHobiResults";
import type { RankedMinatHobiCategory } from "@/utils/minatHobi";
import { calculatePeminatanPercentages } from "@/utils/peminatan";
import {
  calculatePeminatanScores,
  getPeminatanCompatibility,
} from "@/utils/riasec";

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
  scoring_version: string;
  ipa_score: number | null;
  ips_score: number | null;
  bahasa_score: number | null;
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
          sessionId={sessionId}
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

  const birthDateStr = result.birth_date
    ? result.birth_date.toISOString().split("T")[0]
    : "";

  const mode = result.mode as Mode;
  const storedV2Scores =
    result.ipa_score !== null &&
    result.ips_score !== null &&
    result.bahasa_score !== null
      ? [
          { type: "ipa" as const, score: result.ipa_score },
          { type: "ips" as const, score: result.ips_score },
          { type: "bahasa" as const, score: result.bahasa_score },
        ]
      : null;
  const outcome: PeminatanOutcome =
    result.scoring_version === "v2"
      ? {
          version: "v2",
          scores: (storedV2Scores ?? calculatePeminatanScores(results) ?? [])
            .map((item) => ({
              ...item,
              compatibility: getPeminatanCompatibility(item.score),
            }))
            .sort((a, b) => b.score - a.score),
        }
      : {
          version: "v1",
          percentages:
            result.ipa_pct !== null &&
            result.ips_pct !== null &&
            result.bahasa_pct !== null
              ? {
                  ipa: result.ipa_pct,
                  ips: result.ips_pct,
                  bahasa: result.bahasa_pct,
                }
              : calculatePeminatanPercentages(results),
        };

  return (
    <ResultShell
      sessionId={sessionId}
      title={`Hasil: ${result.student_name} (${result.student_class})`}
    >
      {mode === "peminatan" ? (
        <PeminatanResults
          sessionId={sessionId}
          name={result.student_name}
          birthDate={birthDateStr}
          studentClass={result.student_class}
          results={results}
          outcome={outcome}
        />
      ) : (
        <KarirResults
          sessionId={sessionId}
          name={result.student_name}
          birthDate={birthDateStr}
          studentClass={result.student_class}
          results={results}
        />
      )}
    </ResultShell>
  );
}
