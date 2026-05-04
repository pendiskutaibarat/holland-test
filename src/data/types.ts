export type PersonalityType =
  | "realistic"
  | "investigative"
  | "artistic"
  | "social"
  | "enterprising"
  | "conventional";

export interface Question {
  text: string;
}

export interface QuestionCategory {
  title: string; // e.g. "Saya adalah orang yang:"
  questions: Question[];
}

export interface PersonalityQuestions {
  type: PersonalityType;
  label: string; // e.g. "Kepribadian 1"
  categories: QuestionCategory[];
}

export interface Career {
  name: string;
  desc: string;
}

export interface PersonalityInfo {
  type: PersonalityType;
  label: string; // e.g. "Realistic (Realistis)"
  description: string;
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
