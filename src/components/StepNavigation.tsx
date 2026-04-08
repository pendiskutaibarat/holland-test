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
  const isLastStep = currentStep === totalSteps - 2; // second-to-last step = last test section
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex justify-between mt-6 print:hidden">
      <div>
        {!isFirstStep && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Kembali
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={!canProceed}
        className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLastStep ? "Lihat Hasil" : "Lanjut"}
      </button>
    </div>
  );
}
