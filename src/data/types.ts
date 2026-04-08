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

export interface SubmissionPayload {
  name: string;
  birthDate: string;
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
  topResults: string;
  timestamp: string;
  answers: { section: string; question: string; answer: string }[];
}
