"use client";

import { useState } from "react";
import { SubmissionPayload } from "@/data/types";

interface SaveButtonProps {
  payload: SubmissionPayload;
}

export default function SaveButton({ payload }: SaveButtonProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbysEj5gPw7OpumxnuQ7beuIeu_x0hZKu8yVyuf0mLxRabHdQ4RaOyccut8cCkfaaZMk-g/exec";

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setMessage({ text: "Data berhasil disimpan!", type: "success" });
    } catch {
      setMessage({
        text: "Gagal menyimpan data. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="text-center mt-4 print:hidden">
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed inline-flex items-center gap-2"
      >
        {saving && (
          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {saving ? "Menyimpan..." : "Simpan Hasil ke Google Spreadsheet"}
      </button>
      {message && (
        <p
          className={`mt-2 p-2 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
