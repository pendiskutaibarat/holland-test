import type { Mode } from "@/data/types";

const STORAGE_KEY = "madani-student-test-history";
const STORAGE_VERSION = 1;

export type CompletedTestSnapshot =
  | {
      kind: "riasec";
      mode: Mode;
      birthDate: string;
      selections: Record<string, number[]>;
    }
  | {
      kind: "minat_hobi";
      birthDate: string;
      answers: Record<number, string>;
    };

export interface CompletedTest {
  version: number;
  sessionId: string;
  assessmentName: string;
  assessmentSlug: string;
  testHref: string;
  studentName: string;
  completedAt: string;
  snapshot: CompletedTestSnapshot;
}

function readHistory(): CompletedTest[] {
  if (typeof window === "undefined") return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];

    return value.filter(
      (item): item is CompletedTest =>
        !!item &&
        typeof item === "object" &&
        "version" in item &&
        "sessionId" in item &&
        "snapshot" in item &&
        typeof item.version === "number" &&
        typeof item.sessionId === "string" &&
        typeof item.snapshot === "object",
    );
  } catch {
    return [];
  }
}

export function getCompletedTests(): CompletedTest[] {
  return readHistory().sort(
    (first, second) =>
      new Date(second.completedAt).getTime() - new Date(first.completedAt).getTime(),
  );
}

export function getCompletedTest(sessionId: string): CompletedTest | null {
  return readHistory().find((item) => item.sessionId === sessionId) ?? null;
}

export function saveCompletedTest(test: Omit<CompletedTest, "version" | "completedAt">) {
  if (typeof window === "undefined") return;

  const completedTest: CompletedTest = {
    ...test,
    version: STORAGE_VERSION,
    completedAt: new Date().toISOString(),
  };
  const previous = readHistory().filter((item) => item.sessionId !== test.sessionId);

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([completedTest, ...previous]),
    );
  } catch {
    // Browser storage can be unavailable or full. The completed result remains in the database.
  }
}

export function removeCompletedTest(sessionId: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(readHistory().filter((item) => item.sessionId !== sessionId)),
    );
  } catch {
    // Keep the existing browser state when storage cannot be written.
  }
}
