"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { questions } from "@/data/questions";
import { PersonalityType, TestResult, Mode } from "@/data/types";
import ProgressBar from "./ProgressBar";
import StepNavigation from "./StepNavigation";
import ModeSelectorStep from "./ModeSelectorStep";
import TestSectionStep from "./TestSectionStep";
import PeminatanResults from "./PeminatanResults";
import KarirResults from "./KarirResults";

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
}

export default function WizardContainer({
  sessionId,
  forcedMode,
  studentName,
  studentClass,
}: WizardContainerProps) {
  const [currentStep, setCurrentStep] = useState(forcedMode ? 0 : 0);
  const [mode, setMode] = useState<Mode | null>(forcedMode);
  const [name] = useState(studentName);
  const [birthDate] = useState(studentClass);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "duplicate"
  >("idle");

  const [selections, setSelections] = useState<Record<string, Set<number>>>(
    () => {
      const init: Record<string, Set<number>> = {};
      PERSONALITY_TYPES.forEach((type) => {
        init[type] = new Set();
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

  const handleNext = () => {
    if (currentStep === 0) {
      if (!mode) return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const getSelectedAnswers = () => {
    const answers: { section: string; question: string; answer: string }[] = [];
    PERSONALITY_TYPES.forEach((type) => {
      const sectionData = questions.find((q) => q.type === type);
      if (!sectionData) return;
      const indices = selections[type] ?? new Set();
      indices.forEach((idx) => {
        let flatIdx = 0;
        for (const cat of sectionData.categories) {
          for (const q of cat.questions) {
            if (flatIdx === idx) {
              answers.push({
                section: sectionData.label,
                question: q.text,
                answer: "Selected",
              });
            }
            flatIdx++;
          }
        }
      });
    });
    return answers;
  };

  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (currentStep !== TOTAL_STEPS - 1) return;
    if (hasSubmitted.current) return;

    async function submit() {
      hasSubmitted.current = true;
      setSubmissionStatus("submitting");
      const results = PERSONALITY_TYPES.map((type) => ({
        type,
        score: selections[type]?.size ?? 0,
      }));

      const answers = getSelectedAnswers();

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
            r_score: results.find((r) => r.type === "realistic")?.score ?? 0,
            i_score:
              results.find((r) => r.type === "investigative")?.score ?? 0,
            a_score: results.find((r) => r.type === "artistic")?.score ?? 0,
            s_score: results.find((r) => r.type === "social")?.score ?? 0,
            e_score:
              results.find((r) => r.type === "enterprising")?.score ?? 0,
            c_score:
              results.find((r) => r.type === "conventional")?.score ?? 0,
            holland_code: null,
            ipa_pct: null,
            ips_pct: null,
            bahasa_pct: null,
            answers,
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

    submit();
  }, [currentStep]);

  if (currentStep === TOTAL_STEPS - 1) {
    const results = PERSONALITY_TYPES.map((type) => ({
      type,
      score: selections[type]?.size ?? 0,
    }));

    return (
      <div className="max-w-[1000px] mx-auto p-4 md:p-6 print:max-w-none print:p-4">
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
              onClick={() => {
                hasSubmitted.current = false;
                setSubmissionStatus("idle");
              }}
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
            name={name}
            birthDate={birthDate}
            results={results}
            selectedAnswers={getSelectedAnswers()}
            mode={mode}
          />
        ) : (
          <KarirResults
            name={name}
            birthDate={birthDate}
            results={results}
            selectedAnswers={getSelectedAnswers()}
            mode={mode!}
          />
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
              <img
                src="/banner.png"
                alt="Tes Bakat Holland RIASEC"
                className="mx-auto rounded-lg"
              />
            </div>
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-brand-700">
                TES BAKAT HOLLAND RIASEC
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
