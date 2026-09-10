"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Update this object for the next release. Changing `version` shows the modal again.
const CHANGELOG = {
  version: "2026-09-10-test-history",
  title: "Pembaruan terbaru",
  closeLabel: "Tutup pembaruan terbaru",
  dismissLabel: "Mengerti",
  items: [
    "Perpindahan antarhalaman kini tampil lebih mulus.",
    "Tombol Daftar di header dihapus; pendaftaran tetap tersedia dari halaman Login.",
    "Fitur Riwayat Tes baru memudahkan Anda melihat kembali tes yang telah diselesaikan.",
  ],
} as const;

const CHANGELOG_STORAGE_KEY = "madani-changelog-version";
const CHANGELOG_EVENT = "madani-changelog-dismissed";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGELOG_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(CHANGELOG_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(CHANGELOG_STORAGE_KEY) !== CHANGELOG.version;
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  return false;
}

export default function ChangelogModal() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function dismiss() {
    try {
      localStorage.setItem(CHANGELOG_STORAGE_KEY, CHANGELOG.version);
      window.dispatchEvent(new Event(CHANGELOG_EVENT));
    } catch {
      // Leave the modal closed only when local storage is available.
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
        aria-label={CHANGELOG.closeLabel}
        onClick={dismiss}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-title"
        aria-describedby="changelog-description"
        className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-[0_24px_70px_rgba(11,27,26,0.28)]"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="changelog-title" className="mt-2 font-display text-3xl text-slate-900">
                {CHANGELOG.title}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={dismiss}
              aria-label="Tutup"
              className="grid size-9 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="size-5">
                <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <ul className="mt-5 space-y-3" aria-label="Daftar perubahan">
            {CHANGELOG.items.map((item, index) => (
              <li
                key={item}
                className={`flex gap-3 rounded-xl p-3.5 text-sm leading-5 text-slate-700 ${
                  index % 2 === 0 ? "bg-brand-50" : "bg-slate-50"
                }`}
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-slate-700 text-white" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button type="button" onClick={dismiss} className="app-button-primary mt-6 w-full justify-center">
            {CHANGELOG.dismissLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
