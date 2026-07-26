import { PEMINATAN_AFFINITY } from "../data/peminatan.ts";
import { questions } from "../data/questions.ts";
import type {
  PeminatanCompatibility,
  PeminatanScore,
  PeminatanType,
  PersonalityType,
  TestResult,
} from "../data/types.ts";

export const RIASEC_ORDER: PersonalityType[] = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
];

const RANK_WEIGHTS = [3, 2, 1] as const;
const PEMINATAN_ORDER: PeminatanType[] = ["ipa", "ips", "bahasa"];
const questionByNumber = new Map(
  questions.flatMap((section) =>
    section.questions.map((question) => [
      question.number,
      { ...question, type: section.type, section: section.label },
    ]),
  ),
);

export interface RankedRiasecResult extends TestResult {
  rank: number;
}

export interface RiasecResult {
  scores: TestResult[];
  ranked: RankedRiasecResult[];
  top3: RankedRiasecResult[];
  hollandCode: string | null;
  hasTies: boolean;
  selectedQuestions: Array<{
    number: number;
    text: string;
    type: PersonalityType;
    section: string;
  }>;
  peminatan: PeminatanScore[] | null;
}

export function rankRiasecResults(results: TestResult[]) {
  const scoreByType = new Map(results.map((result) => [result.type, result.score]));
  const ranked = RIASEC_ORDER.map((type) => ({
    type,
    score: scoreByType.get(type) ?? 0,
  }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        RIASEC_ORDER.indexOf(a.type) - RIASEC_ORDER.indexOf(b.type),
    )
    .map((result, index) => ({ ...result, rank: index + 1 }));
  const top3 = ranked.slice(0, 3);

  return {
    ranked,
    top3,
    hollandCode: top3.map((result) => result.type[0].toUpperCase()).join(""),
    hasTies:
      top3.some(
        (result, index) =>
          index > 0 && result.score === top3[index - 1]?.score,
      ) || top3[2]?.score === ranked[3]?.score,
  };
}

export function getPeminatanCompatibility(
  score: number,
): PeminatanCompatibility {
  if (score >= 10) return "sangat_cocok";
  if (score >= 5) return "cukup_cocok";
  return "kurang_cocok";
}

export function calculatePeminatanScores(
  results: TestResult[],
): PeminatanScore[] | null {
  if (results.every((result) => result.score === 0)) return null;

  const { top3 } = rankRiasecResults(results);
  return PEMINATAN_ORDER.map((type) => {
    const score = top3.reduce(
      (total, result, index) =>
        total + PEMINATAN_AFFINITY[result.type][type] * RANK_WEIGHTS[index],
      0,
    );

    return {
      type,
      score,
      compatibility: getPeminatanCompatibility(score),
    };
  }).sort(
    (a, b) =>
      b.score - a.score ||
      PEMINATAN_ORDER.indexOf(a.type) - PEMINATAN_ORDER.indexOf(b.type),
  );
}

export function calculateRiasecResult(
  selectedQuestionNumbers: number[],
): RiasecResult {
  if (!Array.isArray(selectedQuestionNumbers)) {
    throw new Error("Jawaban RIASEC harus berupa daftar nomor pertanyaan");
  }

  const uniqueNumbers = new Set(selectedQuestionNumbers);
  if (uniqueNumbers.size !== selectedQuestionNumbers.length) {
    throw new Error("Jawaban RIASEC memuat pertanyaan duplikat");
  }

  const selectedQuestions = selectedQuestionNumbers.map((number) => {
    if (!Number.isInteger(number)) {
      throw new Error("Nomor pertanyaan RIASEC tidak valid");
    }
    const question = questionByNumber.get(number);
    if (!question) {
      throw new Error("Nomor pertanyaan RIASEC di luar rentang 1-90");
    }
    return question;
  });

  const counts = new Map<PersonalityType, number>(
    RIASEC_ORDER.map((type) => [type, 0]),
  );
  for (const question of selectedQuestions) {
    counts.set(question.type, (counts.get(question.type) ?? 0) + 1);
  }

  const scores = RIASEC_ORDER.map((type) => ({
    type,
    score: counts.get(type) ?? 0,
  }));
  const ranking = rankRiasecResults(scores);
  const insufficient = selectedQuestions.length === 0;

  return {
    scores,
    ranked: ranking.ranked,
    top3: insufficient ? [] : ranking.top3,
    hollandCode: insufficient ? null : ranking.hollandCode,
    hasTies: !insufficient && ranking.hasTies,
    selectedQuestions,
    peminatan: calculatePeminatanScores(scores),
  };
}
