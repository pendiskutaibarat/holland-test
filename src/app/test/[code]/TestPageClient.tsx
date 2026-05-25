"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import WizardContainer from "@/components/WizardContainer";

interface TestPageClientProps {
  sessionId: string;
  sessionName: string;
  schoolName: string;
  sessionMode: string;
  isActive: boolean;
}

const TEST_PAGE_BACKGROUND_STYLE = {
  backgroundImage: "url('/test-background.jpeg'), url('/banner.png')",
  backgroundPosition: "center",
  backgroundSize: "cover",
} as const;

function TestPageBackgroundShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 blur-sm"
        style={TEST_PAGE_BACKGROUND_STYLE}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/45" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-5">
        {children}
      </div>
    </div>
  );
}

export default function TestPageClient({
  sessionId,
  sessionName,
  schoolName,
  sessionMode,
  isActive,
}: TestPageClientProps) {
  const [studentName, setStudentName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState<{ name?: string; birthDate?: string }>(
    {},
  );
  const [started, setStarted] = useState(false);

  function handleStart(e: FormEvent) {
    e.preventDefault();
    const newErrors: { name?: string; birthDate?: string } = {};

    if (!studentName.trim()) {
      newErrors.name = "Silakan isi nama lengkap.";
    }
    if (!birthDate.trim()) {
      newErrors.birthDate = "Silakan isi tanggal lahir.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStarted(true);
  }

  if (!isActive) {
    return (
      <TestPageBackgroundShell>
        <div
          className="w-full max-w-md rounded-xl border border-white/35 bg-white/88 p-8 text-center shadow-xl backdrop-blur-md"
          role="alert"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-7 h-7 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-3">
            Sesi Ditutup
          </h1>
          <p className="text-slate-600">
            Sesi ini sudah ditutup. Hubungi admin untuk informasi lebih lanjut.
          </p>
        </div>
      </TestPageBackgroundShell>
    );
  }

  if (!started) {
    return (
      <TestPageBackgroundShell>
        <div className="w-full max-w-md rounded-xl border border-white/35 bg-white/88 p-8 shadow-xl backdrop-blur-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">
              Tes Holland RIASEC
            </h1>
            <p className="font-medium text-slate-700">{schoolName}</p>
            <p className="text-sm text-slate-500 mt-0.5">{sessionName}</p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              Perlu diketahui
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Asesmen ini menggunakan model Holland Occupational Themes (RIASEC).
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Semua jawaban valid — pilih sesuai minatmu, tanpa jawaban benar atau salah.
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pilihan jawaban bisa dipilih lebih dari satu.
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Waktu pengerjaan kira-kira 7–12 menit.
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hasil tes bersifat eksploratif — disarankan untuk dibahas bersama guru BK atau konselor.
              </li>
            </ul>
          </div>

          <form onSubmit={handleStart} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="studentName"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Nama Lengkap <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errors.name)
                    setErrors((err) => ({ ...err, name: undefined }));
                }}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Contoh: Budi Santoso"
              />
              {errors.name && (
                <p
                  id="name-error"
                  role="alert"
                  className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-semibold text-slate-800 mb-1.5"
              >
                Tanggal Lahir <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  if (errors.birthDate)
                    setErrors((err) => ({ ...err, birthDate: undefined }));
                }}
                aria-required="true"
                aria-invalid={!!errors.birthDate}
                aria-describedby={errors.birthDate ? "birthdate-error" : undefined}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {errors.birthDate && (
                <p
                  id="birthdate-error"
                  role="alert"
                  className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.birthDate}
                </p>
              )}
            </div>

<button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Mulai Tes
            </button>
          </form>
        </div>
      </TestPageBackgroundShell>
    );
  }

  return (
    <WizardContainer
      sessionId={sessionId}
      forcedMode={sessionMode === "bebas" ? null : (sessionMode as "peminatan" | "karir")}
      studentName={studentName}
      studentClass={birthDate}
    />
  );
}
