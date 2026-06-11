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
      className="mt-8 flex items-center justify-between print:hidden"
      aria-label="Navigasi langkah tes"
    >
      <div>
        {!isFirstStep && (
          <button onClick={onBack} className="app-button-ghost px-6">
            <span aria-hidden="true" className="mr-1">
              Back
            </span>
            Kembali
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="app-button-primary px-8"
      >
        {isLastStep ? "Lihat Hasil" : "Lanjut"}
      </button>
    </nav>
  );
}
