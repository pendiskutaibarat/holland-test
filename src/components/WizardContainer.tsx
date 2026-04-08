"use client";

import { useState, useCallback } from "react";
import { questions } from "@/data/questions";
import { PersonalityType, TestResult } from "@/data/types";
import ProgressBar from "./ProgressBar";
import StepNavigation from "./StepNavigation";
import UserInfoStep from "./UserInfoStep";
import TestSectionStep from "./TestSectionStep";
import ResultsDisplay from "./ResultsDisplay";

const TOTAL_STEPS = 8; // 0 (info) + 1-6 (sections) + 7 (results)
const PERSONALITY_TYPES: PersonalityType[] = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
];

export default function WizardContainer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>(
    {},
  );

  // Track selections per personality type: type -> Set<questionIndex>
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
      return name.trim() !== "" && birthDate !== "";
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      const newErrors: { name?: string; birthDate?: string } = {};
      if (!name.trim()) newErrors.name = "Silakan isi nama lengkap.";
      if (!birthDate) newErrors.birthDate = "Silakan isi tanggal lahir.";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // Calculate results
  const getResults = (): TestResult[] => {
    return PERSONALITY_TYPES.map((type) => ({
      type,
      score: selections[type]?.size ?? 0,
    }));
  };

  // Build selected answers for submission
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

  // Results step
  if (currentStep === TOTAL_STEPS - 1) {
    return (
      <div className="max-w-[1000px] mx-auto p-5 print:max-w-none print:p-4">
        <ResultsDisplay
          name={name}
          birthDate={birthDate}
          results={getResults()}
          selectedAnswers={getSelectedAnswers()}
        />
      </div>
    );
  }

  // Step 0: User info
  if (currentStep === 0) {
    return (
      <div className="max-w-[1000px] mx-auto p-5">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <UserInfoStep
          name={name}
          birthDate={birthDate}
          onNameChange={(n) => {
            setName(n);
            if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
          }}
          onBirthDateChange={(d) => {
            setBirthDate(d);
            if (errors.birthDate)
              setErrors((e) => ({ ...e, birthDate: undefined }));
          }}
          errors={errors}
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

  // Steps 1-6: Test sections
  const sectionIndex = currentStep - 1;
  const section = questions[sectionIndex];
  const personalityType = PERSONALITY_TYPES[sectionIndex];

  return (
    <div className="max-w-[1000px] mx-auto p-5 print:hidden">
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
