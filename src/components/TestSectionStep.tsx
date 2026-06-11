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

      {section.categories.map((category, catIdx) => {
        const categoryBase = catIdx * 5;
        const categorySelected = category.questions.filter((_, qIdx) =>
          selectedIndices.has(categoryBase + qIdx),
        ).length;

        return (
          <fieldset key={catIdx} className="mb-6 last:mb-0">
            <legend className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700">
                {catIdx + 1}
              </span>
              {category.title}
              <span className="ml-auto text-sm font-normal text-slate-500">
                {categorySelected}/{category.questions.length} dipilih
              </span>
            </legend>
            <div className="space-y-2" role="group" aria-label={category.title}>
              {category.questions.map((question, qIdx) => {
                const globalIdx = categoryBase + qIdx;
                const isChecked = selectedIndices.has(globalIdx);
                const checkboxId = `q-${section.type}-${globalIdx}`;

                return (
                  <label
                    key={qIdx}
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
                      onChange={() => onToggle(globalIdx)}
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
        );
      })}
    </div>
  );
}
