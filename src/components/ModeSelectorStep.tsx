"use client";

import { Mode } from "@/data/types";

interface ModeSelectorStepProps {
  selectedMode: Mode | null;
  onSelectMode: (mode: Mode) => void;
  onRestart: () => void;
  hasSavedState: boolean;
}

const MODES: {
  value: Mode;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "peminatan",
    label: "Peminatan SMA/MA",
    description:
      "Temukan kecenderunganmu antara IPA, IPS, atau Bahasa & Budaya untuk menentukan peminatan di jenjang menengah atas.",
    icon: "🏫",
  },
  {
    value: "karir",
    label: "Karir & Program Studi",
    description:
      "Temukan kombinasi kepribadian RIASEC-mu, lencana profil, dan rekomendasi program studi serta profesi yang cocok untukmu.",
    icon: "🎓",
  },
];

export default function ModeSelectorStep({
  selectedMode,
  onSelectMode,
  onRestart,
  hasSavedState,
}: ModeSelectorStepProps) {
  return (
    <div className="space-y-8 max-w-[800px] mx-auto">
      <div className="text-center">
        <img
          src="/banner.png"
          alt="Tes Bakat Holland RIASEC"
          className="mx-auto rounded-lg"
        />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          TES BAKAT HOLLAND RIASEC
        </h1>
        <p className="text-slate-600">
          Pilih tujuan tes ini untuk memulai perjalananmu:
        </p>
      </div>

      {hasSavedState && (
        <div className="text-center">
          <button
            onClick={onRestart}
            className="px-5 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            Mulai Ulang (Hapus data tersimpan)
          </button>
        </div>
      )}

      <fieldset className="grid md:grid-cols-2 gap-4">
        <legend className="sr-only">Pilih mode tes</legend>
        {MODES.map((mode) => {
          const isSelected = selectedMode === mode.value;
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => onSelectMode(mode.value)}
              aria-pressed={isSelected}
              aria-describedby={`mode-desc-${mode.value}`}
              className={`relative p-6 rounded-xl border-2 text-left transition-all group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                isSelected
                  ? "border-blue-700 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-blue-400 hover:shadow-md"
              }`}
            >
              <div className="text-4xl mb-3" aria-hidden="true">
                {mode.icon}
              </div>
              <h2
                className={`text-lg font-bold mb-2 ${
                  isSelected
                    ? "text-blue-700"
                    : "text-slate-800 group-hover:text-blue-700"
                }`}
              >
                {mode.label}
              </h2>
              <p
                id={`mode-desc-${mode.value}`}
                className="text-sm text-slate-600"
              >
                {mode.description}
              </p>
              {isSelected && (
                <div
                  className="absolute top-4 right-4 w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}