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
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h2 className="text-blue-500 border-b-2 border-blue-500 pb-2 mt-0">
        {section.label}
      </h2>

      {section.categories.map((category, catIdx) => (
        <div key={catIdx} className="mt-4">
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th
                  colSpan={3}
                  className="text-left p-2.5 bg-gray-100 font-semibold"
                >
                  {category.title}
                </th>
              </tr>
            </thead>
            <tbody>
              {chunkArray(category.questions, 3).map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  {row.map((q, colIdx) => (
                    <td
                      key={colIdx}
                      className="p-2.5 border-b border-gray-200 align-top"
                    >
                      {q && (
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedIndices.has(
                              catIdx * 5 + rowIdx * 3 + colIdx,
                            )}
                            onChange={() =>
                              onToggle(catIdx * 5 + rowIdx * 3 + colIdx)
                            }
                            className="mt-1 shrink-0"
                          />
                          <span className="text-sm">{q.text}</span>
                        </label>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="font-bold text-right mt-3">
        Total Poin: <span>{totalPoints}</span>
      </div>
    </div>
  );
}

function chunkArray<T>(arr: T[], size: number): (T | null)[][] {
  const chunks: (T | null)[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    const chunk: (T | null)[] = arr.slice(i, i + size);
    // Pad with nulls if not a full row
    while (chunk.length < size) chunk.push(null);
    chunks.push(chunk);
  }
  return chunks;
}
