"use client";

import { useMemo, useRef, useState } from "react";
import {
  minatHobiQuestions,
  minatHobiScale,
} from "@/data/minatHobi";
import { calculateMinatHobiResult } from "@/utils/minatHobi";
import MinatHobiResults from "./MinatHobiResults";

const QUESTIONS_PER_PAGE = 10;

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

  const totalPages = Math.ceil(minatHobiQuestions.length / QUESTIONS_PER_PAGE);
  const visibleQuestions = minatHobiQuestions.slice(
    page * QUESTIONS_PER_PAGE,
    page * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE,
  );
  const answeredCount = Object.keys(answers).length;
  const canGoNext = visibleQuestions.every((question) => answers[question.number]);
  const isComplete = answeredCount === minatHobiQuestions.length;

  const result = useMemo(() => {
    if (!isComplete) return null;
    return calculateMinatHobiResult(
      minatHobiQuestions.map((question) => ({
        question_number: question.number,
        answer_code: answers[question.number],
      })),
    );
  }, [answers, isComplete]);

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
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800">
            Hasil berhasil disimpan
          </div>
        )}
        {status === "duplicate" && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm font-medium text-amber-800">
            Anda sudah mengirim hasil asesmen untuk sesi ini
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-800">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                hasSubmitted.current = false;
                setStatus("answering");
              }}
              className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Asesmen Minat Hobi
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {answeredCount} dari {minatHobiQuestions.length} jawaban
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Halaman {page + 1}/{totalPages}
          </span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
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
              className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                  {question.number}
                </span>
                <div>
                  <p className="font-medium text-gray-800">
                    {question.statement}
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-4">
                {minatHobiScale.map((scale) => (
                  <label
                    key={scale.code}
                    className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      answers[question.number] === scale.code
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
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
          className="rounded-md border border-gray-300 px-5 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Lanjut
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!isComplete || status === "submitting"}
            className="rounded-md bg-green-600 px-5 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {status === "submitting" ? "Mengirim..." : "Lihat Hasil"}
          </button>
        )}
      </div>
    </div>
  );
}
