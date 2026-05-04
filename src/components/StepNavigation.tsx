"use client";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canProceed,
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps - 2;
  const isFirstStep = currentStep === 0;

  return (
    <nav
      className="flex justify-between items-center mt-8 print:hidden"
      aria-label="Navigasi langkah tes"
    >
      <div>
        {!isFirstStep && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-white text-slate-600 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <span aria-hidden="true" className="mr-1">
              ←
            </span>{" "}
            Kembali
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="px-8 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        {isLastStep ? (
          <>
            Lihat Hasil{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </>
        ) : (
          <>
            Lanjut{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </>
        )}
      </button>
    </nav>
  );
}