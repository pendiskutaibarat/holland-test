"use client";

import { PersonalityQuestions } from "@/data/types";

interface TestSectionStepProps {
  section: PersonalityQuestions;
  selectedIndices: Set<number>;
  onToggle: (questionIndex: number) => void;
}

export default function TestSectionStep({
  section,
  selectedIndices,
  onToggle,
}: TestSectionStepProps) {
  const totalPoints = selectedIndices.size;

  return (
    <div className="app-card p-5 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-700">{section.label}</h2>
        <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-1.5">
          <span className="text-sm font-semibold text-brand-700">
            Total Poin:
          </span>
          <span
            className="text-lg font-bold text-brand-700"
            aria-live="polite"
            aria-atomic="true"
          >
            {totalPoints}
          </span>
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 flex w-full items-center justify-between gap-3 text-sm text-slate-500">
          <span>Centang semua pernyataan yang sesuai dengan dirimu.</span>
          <span className="shrink-0">
            {totalPoints}/{section.questions.length} dipilih
          </span>
        </legend>
        <div className="space-y-2">
          {section.questions.map((question) => {
            const isChecked = selectedIndices.has(question.number);
            const checkboxId = `q-${question.number}`;

            return (
              <label
                key={question.number}
                htmlFor={checkboxId}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                  isChecked
                    ? "border-brand-600 bg-brand-50"
                    : "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40"
                }`}
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(question.number)}
                  aria-label={question.text}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
                />
                <span
                  className={`text-sm leading-relaxed ${
                    isChecked
                      ? "font-medium text-slate-800"
                      : "text-slate-600"
                  }`}
                >
                  {question.text}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
