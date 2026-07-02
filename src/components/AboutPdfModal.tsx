"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const pdfUrl = "/api/documents/naskah-akademik-validitas-instrumen";

export default function AboutPdfModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="app-button-secondary mt-2 w-fit"
      >
        Lihat Naskah Akademik
      </button>

      {isOpen && isMounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[2147483647] bg-slate-950/70 backdrop-blur-md"
              role="presentation"
              onClick={() => setIsOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Naskah akademik dan validitas instrumen"
                className="absolute inset-0 isolate flex items-center justify-center p-4 md:p-8"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup"
                  className="fixed right-4 top-4 z-[2147483647] rounded-full bg-white/80 p-2 text-slate-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-slate-900 md:right-6 md:top-6"
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

                <div className="relative z-0 h-full w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_rgba(15,23,42,0.32)]">
                  <iframe
                    src={pdfUrl}
                    title="Naskah akademik dan validitas instrumen"
                    className="h-full w-full border-0"
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
