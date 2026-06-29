"use client";

import { useRef, useState } from "react";
import {
  MINAT_HOBI_ASSESSMENT_NAME,
  MINAT_HOBI_QUESTIONS_PER_PAGE,
  minatHobiQuestions,
  minatHobiScale,
} from "@/data/minatHobi";
import { calculateMinatHobiResult } from "@/utils/minatHobi";
import MinatHobiResults from "./MinatHobiResults";

interface MinatHobiAssessmentProps {
  sessionId: string;
  studentName: string;
  birthDate: string;
}

export default function MinatHobiAssessment({
  sessionId,
  studentName,
  birthDate,
}: MinatHobiAssessmentProps) {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<
    "answering" | "submitting" | "success" | "error" | "duplicate"
  >("answering");
  const [error, setError] = useState<string | null>(null);
  const hasSubmitted = useRef(false);

  const totalPages = Math.ceil(
    minatHobiQuestions.length / MINAT_HOBI_QUESTIONS_PER_PAGE,
  );
  const visibleQuestions = minatHobiQuestions.slice(
    page * MINAT_HOBI_QUESTIONS_PER_PAGE,
    page * MINAT_HOBI_QUESTIONS_PER_PAGE + MINAT_HOBI_QUESTIONS_PER_PAGE,
  );
  const answeredCount = Object.keys(answers).length;
  const canGoNext = visibleQuestions.every((question) => answers[question.number]);
  const isComplete = answeredCount === minatHobiQuestions.length;

  const result = isComplete
    ? calculateMinatHobiResult(
        minatHobiQuestions.map((question) => ({
          question_number: question.number,
          answer_code: answers[question.number],
        })),
      )
    : null;

  async function submit() {
    if (!isComplete || hasSubmitted.current) return;

    hasSubmitted.current = true;
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_code: sessionId,
          student_name: studentName,
          student_class: birthDate,
          birth_date: birthDate || null,
          assessment_type: "minat_hobi",
          answers: minatHobiQuestions.map((question) => ({
            question_number: question.number,
            answer_code: answers[question.number],
          })),
        }),
      });

      if (res.status === 409) {
        setStatus("duplicate");
      } else if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan hasil.");
        setStatus("error");
      }
    } catch {
      setError("Gagal menyimpan hasil.");
      setStatus("error");
    }
  }

  if (status !== "answering" && status !== "submitting") {
    return (
      <div className="mx-auto max-w-[1000px] p-4 md:p-6">
        {status === "success" && (
          <div className="app-status-success text-center font-medium">
            Hasil berhasil disimpan
          </div>
        )}
        {status === "duplicate" && (
          <div className="app-status-warning text-center font-medium">
            Anda sudah mengirim hasil asesmen untuk sesi ini
          </div>
        )}
        {status === "error" && (
          <div className="app-status-error text-center">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                hasSubmitted.current = false;
                setStatus("answering");
              }}
              className="app-button-danger mt-3"
            >
              Coba Lagi
            </button>
          </div>
        )}
        {result && (
          <MinatHobiResults
            studentName={studentName}
            birthDate={birthDate}
            result={result}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] p-4 md:p-6">
      <div className="app-card mb-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {MINAT_HOBI_ASSESSMENT_NAME}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {answeredCount} dari {minatHobiQuestions.length} jawaban
            </p>
          </div>
          <span className="app-badge-brand text-sm">
            Halaman {page + 1}/{totalPages}
          </span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-brand-600 transition-all"
            style={{
              width: `${(answeredCount / minatHobiQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {visibleQuestions.map((question) => {
          return (
            <div
              key={question.number}
              className="app-section-card"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                  {question.number}
                </span>
                <div>
                  <p className="font-medium text-slate-800">
                    {question.statement}
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {minatHobiScale.map((scale) => (
                  <label
                    key={scale.code}
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                      answers[question.number] === scale.code
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.number}`}
                      value={scale.code}
                      checked={answers[question.number] === scale.code}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.number]: scale.code,
                        }))
                      }
                      className="sr-only"
                    />
                    {scale.label}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => {
            setPage((current) => Math.max(0, current - 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={page === 0 || status === "submitting"}
          className="app-button-ghost"
        >
          Kembali
        </button>

        {page < totalPages - 1 ? (
          <button
            type="button"
            onClick={() => {
              if (!canGoNext) return;
              setPage((current) => current + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={!canGoNext || status === "submitting"}
            className="app-button-primary"
          >
            Lanjut
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!isComplete || status === "submitting"}
            className="app-button-success"
          >
            {status === "submitting" ? "Mengirim..." : "Lihat Hasil"}
          </button>
        )}
      </div>
    </div>
  );
}
