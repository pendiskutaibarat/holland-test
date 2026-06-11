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
    icon: "Sekolah",
  },
  {
    value: "karir",
    label: "Karir & Program Studi",
    description:
      "Temukan kombinasi kepribadian RIASEC-mu, lencana profil, dan rekomendasi program studi serta profesi yang cocok untukmu.",
    icon: "Karir",
  },
];

export default function ModeSelectorStep({
  selectedMode,
  onSelectMode,
  onRestart,
  hasSavedState,
}: ModeSelectorStepProps) {
  return (
    <div className="mx-auto max-w-[800px] space-y-8">
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
          Pilih tujuan tes ini untuk memulai perjalananmu:
        </p>
      </div>

      {hasSavedState && (
        <div className="text-center">
          <button onClick={onRestart} className="app-button-danger px-5 py-2">
            Mulai Ulang (Hapus data tersimpan)
          </button>
        </div>
      )}

      <fieldset className="grid gap-4 md:grid-cols-2">
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
              className={`group relative rounded-[var(--radius-card)] border-2 p-6 text-left transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                isSelected
                  ? "border-brand-600 bg-brand-50 shadow-soft"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-soft"
              }`}
            >
              <div className="mb-3 inline-flex rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
                {mode.icon}
              </div>
              <h2
                className={`mb-2 text-lg font-bold ${
                  isSelected
                    ? "text-brand-700"
                    : "text-slate-800 group-hover:text-brand-700"
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
                  className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
                  aria-hidden="true"
                >
                  OK
                </div>
              )}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
