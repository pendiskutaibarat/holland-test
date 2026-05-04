"use client";

import { useState } from "react";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";

interface Result {
  id: string;
  student_name: string;
  student_class: string;
  mode: string;
  r_score: number;
  i_score: number;
  a_score: number;
  s_score: number;
  e_score: number;
  c_score: number;
  holland_code: string | null;
  ipa_pct: number | null;
  ips_pct: number | null;
  bahasa_pct: number | null;
  created_at: Date;
}

interface Session {
  id: string;
  code: string;
  name: string;
  mode: string;
  is_active: boolean;
  results: Result[];
}

export default function SessionDetailClient({
  session,
}: {
  session: Session;
}) {
  const results = session.results;

  const avgR = results.length
    ? results.reduce((s, r) => s + r.r_score, 0) / results.length
    : 0;
  const avgI = results.length
    ? results.reduce((s, r) => s + r.i_score, 0) / results.length
    : 0;
  const avgA = results.length
    ? results.reduce((s, r) => s + r.a_score, 0) / results.length
    : 0;
  const avgS = results.length
    ? results.reduce((s, r) => s + r.s_score, 0) / results.length
    : 0;
  const avgE = results.length
    ? results.reduce((s, r) => s + r.e_score, 0) / results.length
    : 0;
  const avgC = results.length
    ? results.reduce((s, r) => s + r.c_score, 0) / results.length
    : 0;

  const peminatanCount = results.filter((r) => r.mode === "peminatan").length;
  const karirCount = results.filter((r) => r.mode === "karir").length;

  const avgIpa = results.length
    ? results.reduce((s, r) => s + (r.ipa_pct || 0), 0) / results.length
    : 0;
  const avgIps = results.length
    ? results.reduce((s, r) => s + (r.ips_pct || 0), 0) / results.length
    : 0;
  const avgBahasa = results.length
    ? results.reduce((s, r) => s + (r.bahasa_pct || 0), 0) / results.length
    : 0;

  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/test/${session.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function exportCSV() {
    setExporting(true);
    const headers = [
      "Nama",
      "Kelas",
      "Mode",
      "Realistic",
      "Investigative",
      "Artistic",
      "Social",
      "Enterprising",
      "Conventional",
      "Holland Code",
      "IPA %",
      "IPS %",
      "Bahasa %",
      "Timestamp",
    ];

    const rows = results.map((r) => [
      r.student_name,
      r.student_class,
      r.mode,
      r.r_score,
      r.i_score,
      r.a_score,
      r.s_score,
      r.e_score,
      r.c_score,
      r.holland_code || "",
      r.ipa_pct ?? "",
      r.ips_pct ?? "",
      r.bahasa_pct ?? "",
      new Date(r.created_at).toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hasil-${session.name}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{session.name}</h1>
          <p className="text-gray-500 mt-1">
            Kode: <code className="bg-gray-100 px-1 rounded">{session.code}</code> ·{" "}
            {results.length} hasil · Mode: {session.mode}
          </p>
        </div>
        <LoadingButton
          onClick={exportCSV}
          loading={exporting}
          loadingText="Mengunduh..."
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          Unduh CSV
        </LoadingButton>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Siswa</p>
            <p className="text-2xl font-bold text-gray-800">{results.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Mode</p>
            <p className="text-lg font-bold text-gray-800">
              {peminatanCount} Peminatan · {karirCount} Karir
            </p>
          </div>
          {session.mode === "peminatan" && (
            <>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Rata-rata IPA</p>
                <p className="text-2xl font-bold text-blue-600">
                  {avgIpa.toFixed(1)}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Rata-rata IPS</p>
                <p className="text-2xl font-bold text-green-600">
                  {avgIps.toFixed(1)}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Rata-rata Bahasa</p>
                <p className="text-2xl font-bold text-amber-600">
                  {avgBahasa.toFixed(1)}%
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Rata-rata Skor RIASEC
            </h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4">
            {[
              { label: "Realistic", value: avgR },
              { label: "Investigative", value: avgI },
              { label: "Artistic", value: avgA },
              { label: "Social", value: avgS },
              { label: "Enterprising", value: avgE },
              { label: "Conventional", value: avgC },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-800">
                  {item.value.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500">
          Belum ada hasil. Bagikan link sesi kepada siswa.
          <div className="mt-3 flex items-center justify-center">
            <button
              onClick={handleCopyLink}
              className="relative"
            >
              <code className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors">
                {`${window.location.origin}/test/${session.code}`}
              </code>
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Tersalin!
                </span>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Nama
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Kelas
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Mode
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Kode Holland
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Skor Tertinggi
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Tanggal
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const scores = [
                  result.r_score,
                  result.i_score,
                  result.a_score,
                  result.s_score,
                  result.e_score,
                  result.c_score,
                ];
                const maxScore = Math.max(...scores);
                return (
                  <tr
                    key={result.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {result.student_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {result.student_class}
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-gray-600">
                        {result.mode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-bold">
                        {result.holland_code || "-"}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{maxScore} poin</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(result.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/sessions/${session.id}/results/${result.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
