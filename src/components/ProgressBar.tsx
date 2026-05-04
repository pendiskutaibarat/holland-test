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
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-600">
          Langkah {currentStep + 1} dari {totalSteps}
        </span>
        <span className="font-semibold text-blue-700">
          {Math.round(progress)}%
        </span>
      </div>
      <div
        className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progres tes: ${Math.round(progress)}%`}
      >
        <div
          className="bg-blue-700 h-2.5 rounded-full transition-[width] duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}