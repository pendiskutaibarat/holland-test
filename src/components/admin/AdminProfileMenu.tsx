"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProfileMenu({
  email,
}: {
  email: string;
}) {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  async function handleLogout() {
    setLogoutLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <details className="relative">
      <summary
        className="flex h-11 w-11 list-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-soft transition hover:border-brand-300 hover:text-brand-700"
        aria-label="Buka menu profil"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.5 19.25a7.5 7.5 0 0115 0"
          />
        </svg>
      </summary>

      <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft-lg">
        <p className="border-b border-slate-100 px-3 pb-2 text-xs text-slate-500">
          {email}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="mt-2 flex w-full items-center justify-center rounded-xl bg-danger-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-danger-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {logoutLoading ? "Keluar..." : "Logout"}
        </button>
      </div>
    </details>
  );
}
