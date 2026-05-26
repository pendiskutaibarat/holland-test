"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

export type SessionCardAccessType = "OWNED" | "SHARED";

export interface SessionCardData {
  id: string;
  code: string;
  name: string;
  school_name: string;
  description: string | null;
  mode: string;
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

  function handleCopyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/test/${session.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-gray-800">
            <Link href={detailHref} className="hover:text-blue-600 transition-colors">
              {session.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {session.school_name} · Mode:{" "}
            <span className="capitalize">{session.mode}</span> · {session.result_count} hasil ·{" "}
            {new Date(session.created_at).toLocaleDateString("id-ID")}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${
                session.access_type === "OWNED"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {session.access_type === "OWNED" ? ownedLabel : "Dibagikan"}
            </span>
            {session.access_type === "SHARED" && <span>Dari {session.owner_name}</span>}
          </div>
          {session.description && (
            <p className="text-sm text-gray-500 mt-1">{session.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={handleCopyLink} className="relative">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm hover:bg-gray-200 cursor-pointer transition-colors">
                /test/{session.code}
              </code>
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  Tersalin!
                </span>
              )}
            </button>
            <a
              href={`/test/${session.code}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka Halaman Tes"
              aria-label="Buka Halaman Tes"
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
            >
              <svg
                className="w-4 h-4"
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
