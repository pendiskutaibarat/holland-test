"use client";

import { useState } from "react";
import Link from "next/link";
import LoadingButton from "@/components/LoadingButton";
import { calculatePeminatanPercentages } from "@/utils/peminatan";
import type { PeminatanType, TestResult } from "@/data/types";

type PeminatanPercentages = Record<PeminatanType, number>;
type ExcelCell = string | number;

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

interface TeacherOption {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: Date;
}

interface Collaborator {
  id: string;
  session_id: string;
  user_id: string;
  created_at: Date;
  user: TeacherOption;
}

interface Session {
  id: string;
  code: string;
  name: string;
  school_name: string;
  mode: string;
  is_active: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  collaborators: Collaborator[];
  results: Result[];
}

function resultToTestResults(result: Result): TestResult[] {
  return [
    { type: "realistic", score: result.r_score },
    { type: "investigative", score: result.i_score },
    { type: "artistic", score: result.a_score },
    { type: "social", score: result.s_score },
    { type: "enterprising", score: result.e_score },
    { type: "conventional", score: result.c_score },
  ];
}

function getPeminatanPercentages(
  result: Result,
): PeminatanPercentages | null {
  if (result.mode !== "peminatan") return null;

  if (
    result.ipa_pct !== null &&
    result.ips_pct !== null &&
    result.bahasa_pct !== null
  ) {
    return {
      ipa: result.ipa_pct,
      ips: result.ips_pct,
      bahasa: result.bahasa_pct,
    };
  }

  return calculatePeminatanPercentages(resultToTestResults(result));
}

function averagePeminatan(
  results: Result[],
  key: PeminatanType,
): number {
  const percentages = results
    .map((result) => getPeminatanPercentages(result))
    .filter((value): value is PeminatanPercentages => value !== null);

  if (!percentages.length) return 0;

  return (
    percentages.reduce((sum, percentage) => sum + percentage[key], 0) /
    percentages.length
  );
}

function escapeXml(value: ExcelCell): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function columnName(index: number): string {
  let name = "";
  let current = index + 1;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }

  return name;
}

function buildWorksheetXml(rows: ExcelCell[][]): string {
  const sheetRows = rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 1;
      const cells = row
        .map((cell, columnIndex) => {
          const ref = `${columnName(columnIndex)}${rowNumber}`;
          const style = rowIndex === 0 || rowIndex === 8 ? ' s="1"' : "";

          if (typeof cell === "number" && Number.isFinite(cell)) {
            return `<c r="${ref}"${style}><v>${cell}</v></c>`;
          }

          return `<c r="${ref}" t="inlineStr"${style}><is><t>${escapeXml(
            cell,
          )}</t></is></c>`;
        })
        .join("");

      return `<row r="${rowNumber}">${cells}</row>`;
    })
    .join("");

  const maxColumns = Math.max(...rows.map((row) => row.length));
  const dimension = `A1:${columnName(maxColumns - 1)}${rows.length}`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="${dimension}"/>
  <cols>
    <col min="1" max="1" width="26" customWidth="1"/>
    <col min="2" max="2" width="18" customWidth="1"/>
    <col min="3" max="14" width="16" customWidth="1"/>
  </cols>
  <sheetData>${sheetRows}</sheetData>
</worksheet>`;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

function zipDateTime(date: Date) {
  return {
    time:
      (date.getHours() << 11) |
      (date.getMinutes() << 5) |
      Math.floor(date.getSeconds() / 2),
    date:
      ((date.getFullYear() - 1980) << 9) |
      ((date.getMonth() + 1) << 5) |
      date.getDate(),
  };
}

function toArrayBuffer(chunk: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(chunk.byteLength);
  new Uint8Array(buffer).set(chunk);
  return buffer;
}

function createZip(files: { name: string; content: string }[]): Blob {
  const encoder = new TextEncoder();
  const now = zipDateTime(new Date());
  const chunks: Uint8Array[] = [];
  const centralDirectory: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const content = encoder.encode(file.content);
    const crc = crc32(content);

    const localHeader = new Uint8Array(30 + name.length);
    const localView = new DataView(localHeader.buffer);
    writeUint32(localView, 0, 0x04034b50);
    writeUint16(localView, 4, 20);
    writeUint16(localView, 6, 0x0800);
    writeUint16(localView, 8, 0);
    writeUint16(localView, 10, now.time);
    writeUint16(localView, 12, now.date);
    writeUint32(localView, 14, crc);
    writeUint32(localView, 18, content.length);
    writeUint32(localView, 22, content.length);
    writeUint16(localView, 26, name.length);
    writeUint16(localView, 28, 0);
    localHeader.set(name, 30);

    chunks.push(localHeader, content);

    const centralHeader = new Uint8Array(46 + name.length);
    const centralView = new DataView(centralHeader.buffer);
    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0x0800);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, now.time);
    writeUint16(centralView, 14, now.date);
    writeUint32(centralView, 16, crc);
    writeUint32(centralView, 20, content.length);
    writeUint32(centralView, 24, content.length);
    writeUint16(centralView, 28, name.length);
    writeUint16(centralView, 30, 0);
    writeUint16(centralView, 32, 0);
    writeUint16(centralView, 34, 0);
    writeUint16(centralView, 36, 0);
    writeUint32(centralView, 38, 0);
    writeUint32(centralView, 42, offset);
    centralHeader.set(name, 46);
    centralDirectory.push(centralHeader);

    offset += localHeader.length + content.length;
  }

  const centralOffset = offset;
  const centralSize = centralDirectory.reduce(
    (sum, chunk) => sum + chunk.length,
    0,
  );
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 8, files.length);
  writeUint16(endView, 10, files.length);
  writeUint32(endView, 12, centralSize);
  writeUint32(endView, 16, centralOffset);

  return new Blob(
    [...chunks, ...centralDirectory, endRecord].map(toArrayBuffer),
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
}

function buildWorkbook(rows: ExcelCell[][]): Blob {
  return createZip([
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Hasil Tes" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    },
    {
      name: "xl/styles.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/><color rgb="FFFFFFFF"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1D4ED8"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
  </cellXfs>
</styleSheet>`,
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: buildWorksheetXml(rows),
    },
  ]);
}

function safeFileName(value: string): string {
  return value.replace(/[\\/:*?"<>|]+/g, "-").trim() || "hasil";
}

export default function SessionDetailClient({
  session,
  canManageSharing,
  teachers,
}: {
  session: Session;
  canManageSharing: boolean;
  teachers: TeacherOption[];
}) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(
    session.collaborators,
  );
  const results = session.results;
  const peminatanResults = results.filter((r) => r.mode === "peminatan");

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

  const avgIpa = averagePeminatan(peminatanResults, "ipa");
  const avgIps = averagePeminatan(peminatanResults, "ips");
  const avgBahasa = averagePeminatan(peminatanResults, "bahasa");

  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [sharingLoading, setSharingLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTargetId, setShareTargetId] = useState(
    teachers.find(
      (teacher) =>
        teacher.id !== session.user.id &&
        !session.collaborators.some((collaborator) => collaborator.user_id === teacher.id),
    )?.id || "",
  );
  const [shareError, setShareError] = useState<string | null>(null);
  const [removeLoadingId, setRemoveLoadingId] = useState<string | null>(null);

  const visibleTeacherOptions = teachers.filter(
    (teacher) =>
      teacher.id !== session.user.id &&
      !collaborators.some((collaborator) => collaborator.user_id === teacher.id),
  );
  const currentShareTargetId =
    shareTargetId || visibleTeacherOptions[0]?.id || "";

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/test/${session.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function refreshCollaborators(nextCollaborators: Collaborator[]) {
    setCollaborators(nextCollaborators);
    const nextTarget = teachers.find(
      (teacher) =>
        teacher.id !== session.user.id &&
        !nextCollaborators.some((collaborator) => collaborator.user_id === teacher.id),
      )?.id;
    setShareTargetId(nextTarget || "");
    if (nextCollaborators.length >= teachers.filter(
      (teacher) => teacher.id !== session.user.id,
    ).length) {
      setShowShareModal(false);
    }
  }

  async function handleAddCollaborator() {
    if (!currentShareTargetId) return;
    setSharingLoading(true);
    setShareError(null);

    try {
      const res = await fetch(`/api/admin/sessions/${session.id}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentShareTargetId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setShareError(data.error || "Gagal membagikan sesi");
        return;
      }

      refreshCollaborators(data.collaborators);
      setShareError(null);
    } catch {
      setShareError("Gagal membagikan sesi");
    } finally {
      setSharingLoading(false);
    }
  }

  async function handleRemoveCollaborator(userId: string) {
    setRemoveLoadingId(userId);
    setShareError(null);

    try {
      const res = await fetch(
        `/api/admin/sessions/${session.id}/collaborators/${userId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setShareError(data.error || "Gagal menghapus akses");
        return;
      }

      refreshCollaborators(data.collaborators);
    } catch {
      setShareError("Gagal menghapus akses");
    } finally {
      setRemoveLoadingId(null);
    }
  }

  async function exportExcel() {
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

    const detailRows = results.map((result) => {
      const percentages = getPeminatanPercentages(result);

      return [
        result.student_name,
        result.student_class,
        result.mode,
        result.r_score,
        result.i_score,
        result.a_score,
        result.s_score,
        result.e_score,
        result.c_score,
        result.holland_code || "",
        percentages?.ipa ?? "",
        percentages?.ips ?? "",
        percentages?.bahasa ?? "",
        new Date(result.created_at).toLocaleString("id-ID"),
      ];
    });

    const rows: ExcelCell[][] = [
      ["Hasil Tes Holland RIASEC"],
      ["Sesi", session.name],
      ["Sekolah / Madrasah", session.school_name],
      ["Kode", session.code],
      ["Mode", session.mode],
      ["Total Siswa", results.length],
      ["Jumlah Peminatan", peminatanCount],
      ["Jumlah Karir", karirCount],
      [],
      headers,
      ...detailRows,
    ];

    const blob = buildWorkbook(rows);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFileName(`hasil-${session.name}`)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{session.name}</h1>
          <p className="text-gray-600 mt-1">{session.school_name}</p>
          <p className="text-gray-500 mt-1">
            Kode: <code className="bg-gray-100 px-1 rounded">{session.code}</code> ·{" "}
            {results.length} hasil · Mode: {session.mode}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Pemilik: {session.user.name} ({session.user.email})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/test/${session.code}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm"
          >
            Buka Halaman Tes
          </Link>
          <LoadingButton
            onClick={exportExcel}
            loading={exporting}
            loadingText="Mengunduh..."
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Unduh Excel
          </LoadingButton>
        </div>
      </div>

      {canManageSharing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-gray-800">
                Akses Guru
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Kelola guru aktif yang dapat melihat dan mengelola sesi ini.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {collaborators.length === 0 ? (
                  <span className="text-sm text-gray-400">
                    Belum ada guru yang dibagikan.
                  </span>
                ) : (
                  collaborators.map((collaborator) => (
                    <span
                      key={collaborator.id}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800"
                    >
                      <span>{collaborator.user.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCollaborator(collaborator.user_id)}
                        disabled={removeLoadingId === collaborator.user_id}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        aria-label={`Hapus akses ${collaborator.user.name}`}
                        title="Hapus akses"
                      >
                        {removeLoadingId === collaborator.user_id ? "..." : "×"}
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {visibleTeacherOptions.length} guru tersedia
              </span>
              <LoadingButton
                type="button"
                onClick={() => {
                  setShareError(null);
                  setShowShareModal(true);
                }}
                disabled={visibleTeacherOptions.length === 0}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-300"
              >
                Bagikan Sesi
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      {canManageSharing && showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Tutup dialog bagikan sesi"
            disabled={sharingLoading}
            onClick={() => setShowShareModal(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-session-title"
            className="relative w-full max-w-lg rounded-lg bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2
                  id="share-session-title"
                  className="text-lg font-semibold text-gray-800"
                >
                  Bagikan Sesi
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Pilih guru aktif untuk menambahkan akses kolaborasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                disabled={sharingLoading}
                title="Tutup"
                aria-label="Tutup"
                className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-sm font-medium text-gray-700">{session.name}</p>
                <p className="mt-1 text-sm text-gray-500">{session.school_name}</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Guru aktif
                </label>
                <select
                  value={currentShareTargetId}
                  onChange={(e) => setShareTargetId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {visibleTeacherOptions.length > 0
                      ? "Pilih guru"
                      : "Tidak ada guru aktif"}
                  </option>
                  {visibleTeacherOptions.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} · {teacher.email}
                    </option>
                  ))}
                </select>
              </div>

              {shareError && (
                <p className="text-sm text-red-600">{shareError}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  disabled={sharingLoading}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <LoadingButton
                  type="button"
                  onClick={handleAddCollaborator}
                  loading={sharingLoading}
                  loadingText="Membagikan..."
                  disabled={!currentShareTargetId || visibleTeacherOptions.length === 0}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Bagikan
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}

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
