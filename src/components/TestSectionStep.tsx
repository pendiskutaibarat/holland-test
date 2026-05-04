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
    <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-blue-700">
          {section.label}
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
          <span className="text-sm font-semibold text-blue-700">
            Total Poin:
          </span>
          <span
            className="text-lg font-bold text-blue-700"
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
          <fieldset
            key={catIdx}
            className="mb-6 last:mb-0"
          >
            <legend className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-700">
                {catIdx + 1}
              </span>
              {category.title}
              <span className="ml-auto text-sm font-normal text-slate-500">
                {categorySelected}/{category.questions.length} dipilih
              </span>
            </legend>
            <div
              className="space-y-2"
              role="group"
              aria-label={category.title}
            >
              {category.questions.map((question, qIdx) => {
                const globalIdx = categoryBase + qIdx;
                const isChecked = selectedIndices.has(globalIdx);
                const checkboxId = `q-${section.type}-${globalIdx}`;

                return (
                  <label
                    key={qIdx}
                    htmlFor={checkboxId}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isChecked
                        ? "bg-blue-50 border-blue-700"
                        : "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(globalIdx)}
                      aria-label={question.text}
                      className="mt-0.5 shrink-0 w-5 h-5 rounded border-slate-300 text-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 cursor-pointer"
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        isChecked
                          ? "text-slate-800 font-medium"
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