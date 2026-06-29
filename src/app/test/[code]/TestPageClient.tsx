"use client";

import Image from "next/image";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import WizardContainer from "@/components/WizardContainer";
import MinatHobiAssessment from "@/components/MinatHobiAssessment";
import { ASSESSMENT_SLUGS } from "@/data/assessments";
import {
  MINAT_HOBI_ANSWER_INSTRUCTION,
  MINAT_HOBI_ESTIMATED_DURATION,
  MINAT_HOBI_SUMMARY_TEXT,
} from "@/data/minatHobi";

interface TestPageClientProps {
  sessionId: string;
  sessionName: string;
  schoolName: string;
  sessionMode: string;
  assessmentSlug: string;
  assessmentName: string;
  assessmentVersion?: string;
  isActive: boolean;
}

function TestPageBackgroundShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Image
          src="/test-background.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center blur-sm"
        />
      </div>
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
  assessmentSlug,
  assessmentName,
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
          className="app-card w-full max-w-md border-white/35 bg-white/88 p-8 text-center shadow-soft-lg backdrop-blur-md"
          role="alert"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-50">
            <svg
              className="h-7 w-7 text-danger-600"
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
          <h1 className="mb-3 text-xl font-bold text-slate-800">
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
        <div className="app-card w-full max-w-md border-white/35 bg-white/88 p-8 shadow-soft-lg backdrop-blur-md">
          <div className="mb-6 text-center">
            <h1 className="mb-1 text-2xl font-bold text-slate-800">
              {assessmentName}
            </h1>
            <p className="font-medium text-slate-700">{schoolName}</p>
            <p className="mt-0.5 text-sm text-slate-500">{sessionName}</p>
          </div>

          <div className="app-card-muted mb-6 p-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              Perlu diketahui
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {[
                assessmentSlug === ASSESSMENT_SLUGS.minatHobi
                  ? MINAT_HOBI_SUMMARY_TEXT
                  : "Asesmen ini menggunakan model Holland Occupational Themes (RIASEC).",
                "Semua jawaban valid - pilih sesuai minatmu, tanpa jawaban benar atau salah.",
                assessmentSlug === ASSESSMENT_SLUGS.minatHobi
                  ? MINAT_HOBI_ANSWER_INSTRUCTION
                  : "Pilihan jawaban bisa dipilih lebih dari satu.",
                assessmentSlug === ASSESSMENT_SLUGS.minatHobi
                  ? `Waktu pengerjaan kira-kira ${MINAT_HOBI_ESTIMATED_DURATION}.`
                  : "Waktu pengerjaan kira-kira 7-12 menit.",
                "Hasil tes bersifat eksploratif - disarankan untuk dibahas bersama guru BK atau konselor.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleStart} className="space-y-5" noValidate>
            <div>
              <label htmlFor="studentName" className="app-label">
                Nama Lengkap{" "}
                <span className="text-danger-600" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errors.name) {
                    setErrors((current) => ({ ...current, name: undefined }));
                  }
                }}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="app-input"
                placeholder="Contoh: Budi Santoso"
              />
              {errors.name && (
                <p id="name-error" role="alert" className="app-field-error">
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="birthDate" className="app-label">
                Tanggal Lahir{" "}
                <span className="text-danger-600" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  if (errors.birthDate) {
                    setErrors((current) => ({
                      ...current,
                      birthDate: undefined,
                    }));
                  }
                }}
                aria-required="true"
                aria-invalid={!!errors.birthDate}
                aria-describedby={
                  errors.birthDate ? "birthdate-error" : undefined
                }
                className="app-input"
              />
              {errors.birthDate && (
                <p
                  id="birthdate-error"
                  role="alert"
                  className="app-field-error"
                >
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.birthDate}
                </p>
              )}
            </div>

            <button type="submit" className="app-button-primary w-full">
              Mulai Asesmen
            </button>
          </form>
        </div>
      </TestPageBackgroundShell>
    );
  }

  if (assessmentSlug === ASSESSMENT_SLUGS.minatHobi) {
    return (
      <MinatHobiAssessment
        sessionId={sessionId}
        studentName={studentName}
        birthDate={birthDate}
      />
    );
  }

  return (
    <WizardContainer
      sessionId={sessionId}
      forcedMode={
        sessionMode === "bebas"
          ? null
          : (sessionMode as "peminatan" | "karir")
      }
      studentName={studentName}
      studentClass={birthDate}
    />
  );
}
