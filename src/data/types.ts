export type PersonalityType =
  | "realistic"
  | "investigative"
  | "artistic"
  | "social"
  | "enterprising"
  | "conventional";

export interface Question {
  number: number;
  text: string;
}

export interface PersonalityQuestions {
  type: PersonalityType;
  label: string;
  questions: Question[];
}

export interface Career {
  name: string;
  desc: string;
  majorRecommendation: string;
}

export interface PersonalityInfo {
  type: PersonalityType;
  label: string; // e.g. "Realistic (Realistis)"
  description: string; // kept for backward compatibility (peminatan mode)
  summary: string;
  traits: string;
  preferences: string;
  avoidances: string;
}

export interface TestResult {
  type: PersonalityType;
  score: number;
}

export interface UserSelections {
  [key: string]: Set<number>; // personality type -> set of checked question indices
}

export type Mode = "peminatan" | "karir";

export type PeminatanType = "ipa" | "ips" | "bahasa";

export type PeminatanCompatibility =
  | "sangat_cocok"
  | "cukup_cocok"
  | "kurang_cocok";

export interface PeminatanScore {
  type: PeminatanType;
  score: number;
  compatibility: PeminatanCompatibility;
}

export type PeminatanOutcome =
  | {
      version: "v1";
      percentages: Record<PeminatanType, number>;
    }
  | {
      version: "v2";
      scores: PeminatanScore[];
    };

export interface PeminatanWeights {
  ipa: number;
  ips: number;
  bahasa: number;
}

export interface PeminatanInfo {
  type: PeminatanType;
  label: string;
  description: string;
  subjects: string[];
}

export interface Badge {
  code: string; // e.g. "SIA"
  name: string; // e.g. "Inovator Analitis"
  description: string;
}

export interface ProgramStudiCluster {
  code: string; // top-3 code, e.g. "SIA"
  clusters: {
    name: string;
    programs: string[];
    professions: string[];
  }[];
}

export interface SubmissionPayload {
  name: string;
  birthDate: string;
  mode: Mode;
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
  topResults: string;
  ipa?: number;
  ips?: number;
  bahasa?: number;
  timestamp: string;
  answers: { section: string; question: string; answer: string }[];
}
