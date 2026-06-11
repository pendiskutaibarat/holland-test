"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAssessmentTestHref } from "@/lib/test-route";

export type SessionCardAccessType = "OWNED" | "SHARED";

export interface SessionCardData {
  id: string;
  code: string;
  name: string;
  school_name: string;
  description: string | null;
  mode: string;
  assessment?: {
    slug: string;
    name: string;
  } | null;
  created_at: Date | string;
  result_count: number;
  owner_name: string;
  access_type: SessionCardAccessType;
}

interface SessionCardProps {
  session: SessionCardData;
  ownedLabel?: string;
  detailHref?: string;
  actions?: ReactNode;
}

export default function SessionCard({
  session,
  ownedLabel = "Milik Saya",
  detailHref = `/admin/sessions/${session.id}`,
  actions,
}: SessionCardProps) {
  const [copied, setCopied] = useState(false);
  const assessmentName = session.assessment?.name ?? "Holland RIASEC";
  const showMode = session.assessment?.slug !== "minat_hobi";
  const testHref = getAssessmentTestHref(
    session.assessment?.slug ?? "holland_riasec",
    session.code,
  );

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}${testHref}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="app-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            <Link href={detailHref} className="transition-colors hover:text-brand-600">
              {session.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {session.school_name} · {assessmentName}
            {showMode && (
              <>
                {" "}
                · Mode: <span className="capitalize">{session.mode}</span>
              </>
            )}{" "}
            · {session.result_count} hasil ·{" "}
            {new Date(session.created_at).toLocaleDateString("id-ID")}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ${
                session.access_type === "OWNED"
                  ? "bg-success-100 text-success-700"
                  : "bg-brand-50 text-brand-800"
              }`}
            >
              {session.access_type === "OWNED" ? ownedLabel : "Dibagikan"}
            </span>
            {session.access_type === "SHARED" && <span>Dari {session.owner_name}</span>}
          </div>
          {session.description && (
            <p className="mt-1 text-sm text-slate-500">{session.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={handleCopyLink} className="relative">
              <code className="app-code-chip cursor-pointer">{testHref}</code>
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white">
                  Tersalin!
                </span>
              )}
            </button>
            <a
              href={testHref}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka Halaman Tes"
              aria-label="Buka Halaman Tes"
              className="app-icon-button text-success-600 hover:bg-success-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
