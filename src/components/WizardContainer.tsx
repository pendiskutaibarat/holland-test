"use client";

import { useEffect, useState, useCallback } from "react";
import { questions } from "@/data/questions";
import { PersonalityType, Mode } from "@/data/types";
import { calculateRiasecResult } from "@/utils/riasec";
import AssessmentBanner from "./AssessmentBanner";
import ProgressBar from "./ProgressBar";
import StepNavigation from "./StepNavigation";
import ModeSelectorStep from "./ModeSelectorStep";
import TestSectionStep from "./TestSectionStep";
import PeminatanResults from "./PeminatanResults";
import KarirResults from "./KarirResults";
import { saveCompletedTest } from "@/lib/student-test-history";

const TOTAL_STEPS = 8;
const PERSONALITY_TYPES: PersonalityType[] = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
];

interface WizardContainerProps {
  sessionId: string;
  forcedMode: "peminatan" | "karir" | null;
  studentName: string;
  studentClass: string;
  questionBannerSrc?: string;
  questionBannerAlt?: string;
  initialSelections?: Record<string, number[]>;
  initiallyCompleted?: boolean;
}

export default function WizardContainer({
  sessionId,
  forcedMode,
  studentName,
  studentClass,
  questionBannerSrc,
  questionBannerAlt,
  initialSelections,
  initiallyCompleted = false,
}: WizardContainerProps) {
  const [currentStep, setCurrentStep] = useState(initiallyCompleted ? TOTAL_STEPS - 1 : 0);
  const [mode, setMode] = useState<Mode | null>(forcedMode);
  const [name] = useState(studentName);
  const [birthDate] = useState(studentClass);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "duplicate"
  >(initiallyCompleted ? "success" : "idle");

  const [selections, setSelections] = useState<Record<string, Set<number>>>(
    () => {
      const init: Record<string, Set<number>> = {};
      PERSONALITY_TYPES.forEach((type) => {
        init[type] = new Set(initialSelections?.[type] ?? []);
      });
      return init;
    },
  );

  const handleToggle = useCallback(
    (type: PersonalityType, questionIndex: number) => {
      setSelections((prev) => {
        const next = { ...prev };
        const newSet = new Set(next[type]);
        if (newSet.has(questionIndex)) {
          newSet.delete(questionIndex);
        } else {
          newSet.add(questionIndex);
        }
        next[type] = newSet;
        return next;
      });
    },
    [],
  );

  const canProceed = (): boolean => {
    if (currentStep === 0) {
      return mode !== null;
    }
    return true;
  };

  const selectedQuestionNumbers = PERSONALITY_TYPES.flatMap((type) => [
    ...(selections[type] ?? []),
  ]).sort((a, b) => a - b);
  const riasecResult = calculateRiasecResult(selectedQuestionNumbers);

  useEffect(() => {
    if (submissionStatus !== "success" || !mode) return;

    saveCompletedTest({
      sessionId,
      assessmentName: "Tes RIASEC",
      assessmentSlug: "holland_riasec",
      testHref: window.location.pathname,
      studentName,
      snapshot: {
        kind: "riasec",
        mode,
        birthDate,
        selections: Object.fromEntries(
          PERSONALITY_TYPES.map((type) => [type, [...(selections[type] ?? [])]]),
        ),
      },
    });
  }, [birthDate, mode, selections, sessionId, studentName, submissionStatus]);

  async function submitResult() {
    if (!mode || selectedQuestionNumbers.length === 0) return;

    setSubmissionStatus("submitting");
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_code: sessionId,
          student_name: studentName,
          student_class: studentClass,
          mode,
          birth_date: birthDate || null,
          selected_question_numbers: selectedQuestionNumbers,
        }),
      });

      if (res.status === 409) {
        setSubmissionStatus("duplicate");
      } else if (res.ok) {
        setSubmissionStatus("success");
      } else {
        setSubmissionStatus("error");
      }
    } catch {
      setSubmissionStatus("error");
    }
  }

  const handleNext = () => {
    if (currentStep === 0) {
      if (!mode) return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (currentStep === TOTAL_STEPS - 2) {
        void submitResult();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setMode(forcedMode);
    setCurrentStep(0);
    setSubmissionStatus("idle");
    const init: Record<string, Set<number>> = {};
    PERSONALITY_TYPES.forEach((type) => {
      init[type] = new Set();
    });
    setSelections(init);
  };

  if (currentStep === TOTAL_STEPS - 1) {
    return (
      <div className="max-w-[1000px] mx-auto p-4 md:p-6 print:max-w-none print:p-4">
        {selectedQuestionNumbers.length === 0 ? (
          <div className="app-card mx-auto max-w-xl p-8 text-center">
            <h2 className="text-xl font-bold text-slate-800">
              Data belum cukup untuk menghitung hasil
            </h2>
            <p className="mt-3 text-slate-600">
              Kamu belum mencentang satu pun pernyataan. Kembali ke tes dan
              pilih pernyataan yang paling menggambarkan dirimu.
            </p>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="app-button-primary mt-6 px-6"
            >
              Kembali Mengisi Tes
            </button>
          </div>
        ) : (
          <>
        {submissionStatus === "success" && (
          <div
            className="app-status-success text-center font-medium"
            role="status"
            aria-live="polite"
          >
            <svg
              className="w-5 h-5 inline-block mr-1.5 -mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Hasil berhasil disimpan
          </div>
        )}
        {submissionStatus === "duplicate" && (
          <div
            className="app-status-warning text-center font-medium"
            role="status"
            aria-live="polite"
          >
            <svg
              className="w-5 h-5 inline-block mr-1.5 -mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Anda sudah mengirim hasil tes untuk sesi ini
          </div>
        )}
        {submissionStatus === "error" && (
          <div
            className="app-status-error flex flex-col items-center gap-2 text-center"
            role="alert"
          >
            <span>Gagal menyimpan hasil.</span>
            <button
              onClick={() => void submitResult()}
              className="app-button-danger"
            >
              Coba Lagi
            </button>
          </div>
        )}
        {submissionStatus === "submitting" && (
          <div
            className="app-status-info flex items-center justify-center gap-2 text-center"
            role="status"
            aria-live="polite"
          >
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
              aria-hidden="true"
            />
            Mengirim hasil...
          </div>
        )}

        {mode === "peminatan" ? (
          <PeminatanResults
            sessionId={sessionId}
            name={name}
            birthDate={birthDate}
            studentClass={studentClass}
            results={riasecResult.scores}
            hasTies={riasecResult.hasTies}
          />
        ) : (
          <KarirResults
            sessionId={sessionId}
            name={name}
            birthDate={birthDate}
            studentClass={studentClass}
            results={riasecResult.scores}
          />
        )}
          </>
        )}
      </div>
    );
  }

  if (currentStep === 0) {
    return (
      <div className="max-w-[1000px] mx-auto p-4 md:p-6">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        {forcedMode ? (
          <div className="space-y-8">
            <div className="text-center">
              <AssessmentBanner
                src="/test-banners/riasec-banner.png"
                alt="Banner Tes RIASEC"
              />
            </div>
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-brand-700">
                TES RIASEC
              </h1>
              <p className="text-slate-600">
                Mode tes telah ditentukan oleh admin:
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <div
                className={`p-6 rounded-xl border-2 text-left ${
                  forcedMode === "peminatan"
                    ? "border-brand-700 bg-brand-50"
                    : "border-accent-700 bg-accent-50"
                }`}
              >
                <div className="text-4xl mb-3" aria-hidden="true">
                  {forcedMode === "peminatan" ? "🏫" : "🎓"}
                </div>
                <h2
                  className={`text-lg font-bold mb-2 ${
                    forcedMode === "peminatan"
                      ? "text-brand-700"
                      : "text-accent-700"
                  }`}
                >
                  {forcedMode === "peminatan"
                    ? "Peminatan SMA/MA"
                    : "Karir & Program Studi"}
                </h2>
                <p className="text-sm text-slate-600">
                  {forcedMode === "peminatan"
                    ? "Temukan kecenderunganmu antara IPA, IPS, atau Bahasa & Budaya untuk menentukan peminatan di jenjang menengah atas."
                    : "Temukan kombinasi kepribadian RIASEC-mu, lencana profil, dan rekomendasi program studi serta profesi yang cocok untukmu."}
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={handleNext}
                className="app-button-primary px-8 py-3"
              >
                Mulai Tes
              </button>
            </div>
          </div>
        ) : (
          <>
            <ModeSelectorStep
              selectedMode={mode}
              onSelectMode={(m) => setMode(m)}
              onRestart={handleRestart}
              hasSavedState={false}
            />
            <div className="text-center mt-8">
              <button
                onClick={handleNext}
                disabled={!mode}
                className="app-button-primary px-8 py-3"
              >
                Mulai Tes
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const sectionIndex = currentStep - 1;
  const section = questions[sectionIndex];
  const personalityType = PERSONALITY_TYPES[sectionIndex];

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-6 print:hidden">
      {questionBannerSrc && (
        <div className="mb-6">
          <AssessmentBanner
            src={questionBannerSrc}
            alt={questionBannerAlt ?? "Banner asesmen"}
          />
        </div>
      )}
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      <TestSectionStep
        section={section}
        selectedIndices={selections[personalityType] ?? new Set()}
        onToggle={(idx) => handleToggle(personalityType, idx)}
      />
      <StepNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        canProceed={canProceed()}
      />
    </div>
  );
}
