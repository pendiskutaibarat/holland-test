"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-medium text-slate-600">
          Langkah {currentStep + 1} dari {totalSteps}
        </span>
        <span className="font-semibold text-brand-700">
          {Math.round(progress)}%
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progres tes: ${Math.round(progress)}%`}
      >
        <div
          className="h-2.5 rounded-full bg-brand-600 transition-[width] duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
