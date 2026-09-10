"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCompletedTests,
  removeCompletedTest,
  type CompletedTest,
} from "@/lib/student-test-history";

export default function CompletedTests() {
  const [tests, setTests] = useState<CompletedTest[]>([]);

  useEffect(() => {
    queueMicrotask(() => setTests(getCompletedTests()));
  }, []);

  if (tests.length === 0) {
    return (
      <div className="app-card mx-auto max-w-2xl p-8 text-center">
        <h2 className="text-xl font-semibold text-slate-900">
          Belum ada riwayat tes
        </h2>
        <p className="mt-2 text-slate-600">
          Setelah menyelesaikan asesmen, hasilmu akan tersimpan di perangkat ini.
        </p>
        <Link href="/test/public" className="app-button-primary mt-6">
          Mulai Asesmen
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
      {tests.map((test) => (
        <article key={test.sessionId} className="app-card p-5 text-left">
          <p className="text-sm font-medium text-brand-700">{test.assessmentName}</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{test.studentName}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Selesai {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(test.completedAt))}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <Link href={test.testHref} className="app-button-primary">
              Lihat Hasil
            </Link>
            <button
              type="button"
              onClick={() => {
                removeCompletedTest(test.sessionId);
                setTests(getCompletedTests());
              }}
              className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
            >
              Hapus dari perangkat
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
