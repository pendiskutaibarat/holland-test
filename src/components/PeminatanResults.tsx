"use client";

import Image from "next/image";
import type {
  PeminatanOutcome,
  PeminatanType,
  PersonalityType,
  TestResult,
} from "@/data/types";
import { personalities } from "@/data/personalities";
import {
  PEMINATAN_COMPATIBILITY,
  PEMINATAN_INFO,
} from "@/data/peminatan";
import {
  calculatePeminatanScores,
  rankRiasecResults,
} from "@/utils/riasec";

import realisticIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/1 - Realistic (Tipe Praktis dan Fisik  The Doers).png";
import investigativeIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/2 - Investigative (Tipe Analitis dan Sains, The Thinkers).png";
import artisticIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/3 - Artistic (Tipe Kreatif dan Ekspresif  The Creators).png";
import socialIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/4 - Social (Tipe Suportif dan Humanis, The Helpers).png";
import enterprisingIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/5 - Enterprising (Tipe Pemimpin dan Bisnis, The Persuaders).png";
import conventionalIcon from "../../Icon Minat dan Karier - RIASEC/Icon Minat dan Karier - RIASEC/6 - Conventional (Tipe Terstruktur dan Presisi, The Organizers).png";

const personalityIcons: Record<PersonalityType, { src: string; alt: string }> = {
  realistic: { src: realisticIcon.src, alt: "Ilustrasi tipe Realistic" },
  investigative: {
    src: investigativeIcon.src,
    alt: "Ilustrasi tipe Investigative",
  },
  artistic: { src: artisticIcon.src, alt: "Ilustrasi tipe Artistic" },
  social: { src: socialIcon.src, alt: "Ilustrasi tipe Social" },
  enterprising: {
    src: enterprisingIcon.src,
    alt: "Ilustrasi tipe Enterprising",
  },
  conventional: {
    src: conventionalIcon.src,
    alt: "Ilustrasi tipe Conventional",
  },
};

const peminatanIcons: Record<PeminatanType, { src: string; alt: string }> = {
  ipa: {
    src: "/test-banners/riasec-minat-ipa.png",
    alt: "Ilustrasi peminatan IPA",
  },
  ips: {
    src: "/test-banners/riasec-minat-ips.png",
    alt: "Ilustrasi peminatan IPS",
  },
  bahasa: {
    src: "/test-banners/riasec-minat-bahasa.png",
    alt: "Ilustrasi peminatan Bahasa dan Budaya",
  },
};

interface PeminatanResultsProps {
  sessionId: string;
  name: string;
  birthDate: string;
  results: TestResult[];
  outcome?: PeminatanOutcome;
  hasTies?: boolean;
}

export default function PeminatanResults({
  sessionId,
  name,
  birthDate,
  results,
  outcome,
  hasTies,
}: PeminatanResultsProps) {
  const ranking = rankRiasecResults(results);
  const resolvedOutcome: PeminatanOutcome =
    outcome ??
    ({
      version: "v2",
      scores: calculatePeminatanScores(results) ?? [],
    } satisfies PeminatanOutcome);
  const displayItems =
    resolvedOutcome.version === "v2"
      ? resolvedOutcome.scores.map((item) => ({
          type: item.type,
          value: item.score,
          valueLabel: `${item.score}/14`,
          compatibility: PEMINATAN_COMPATIBILITY[item.compatibility],
        }))
      : (Object.entries(resolvedOutcome.percentages) as [
          PeminatanType,
          number,
        ][])
          .sort((a, b) => b[1] - a[1])
          .map(([type, value]) => ({
            type,
            value,
            valueLabel: `${value}%`,
            compatibility: null,
          }));
  const formattedBirthDate = birthDate
    ? new Date(birthDate).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";
  const pdfFileName = `hasil-peminatan-${
    name.trim().replace(/\s+/g, "-").toLowerCase() || "siswa"
  }.pdf`;

  return (
    <div id="results" className="mx-auto max-w-4xl space-y-6">
      <header className="app-card overflow-hidden">
        <Image
          src="/test-banners/riasec-banner.png"
          alt="Banner asesmen Holland RIASEC"
          width={1200}
          height={360}
          priority
          className="h-auto w-full"
        />
        <div className="p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            Hasil Tes Holland RIASEC
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Peminatan SMA/MA
          </h1>
          <dl className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Nama</dt>
              <dd>{name}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Tanggal lahir</dt>
              <dd>{formattedBirthDate}</dd>
            </div>
          </dl>
        </div>
      </header>

      {(hasTies ?? ranking.hasTies) ? (
        <div className="app-status-info" role="status">
          Ada skor RIASEC yang sama. Urutan seri ditetapkan secara konsisten
          menggunakan urutan R-I-A-S-E-C.
        </div>
      ) : null}

      <section className="app-card p-5 md:p-6" aria-labelledby="peminatan-title">
        <div className="mb-5">
          <h2 id="peminatan-title" className="text-xl font-bold text-slate-900">
            Rekomendasi Peminatan
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {resolvedOutcome.version === "v2"
              ? "Skor dihitung dari tiga tipe RIASEC dominan dengan rentang 0–14."
              : "Hasil historis ini menggunakan algoritma persentase RIASEC v1."}
          </p>
        </div>
        <div className="space-y-4">
          {displayItems.map((item, index) => {
            const info = PEMINATAN_INFO[item.type];
            const icon = peminatanIcons[item.type];

            return (
              <article
                key={item.type}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                        Peringkat {index + 1}
                      </span>
                      {item.compatibility ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {item.compatibility.label} ·{" "}
                          {item.compatibility.priority}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <h3 className="font-bold text-slate-900">{info.label}</h3>
                      <span className="text-lg font-bold text-brand-700">
                        {item.valueLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.compatibility?.description ?? info.description}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">
                        Mata pelajaran relevan:
                      </span>{" "}
                      {info.subjects.join(", ")}
                    </p>
                  </div>
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={180}
                    height={180}
                    className="mx-auto h-32 w-auto shrink-0 object-contain sm:mx-0"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="app-card p-5 md:p-6" aria-labelledby="riasec-title">
        <h2 id="riasec-title" className="text-xl font-bold text-slate-900">
          Tiga Tipe RIASEC Dominan
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Kode Holland:{" "}
          <strong className="text-slate-900">{ranking.hollandCode}</strong>
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {ranking.top3.map((result) => {
            const info = personalities[result.type];
            const icon = personalityIcons[result.type];
            return (
              <article
                key={result.type}
                className="rounded-2xl border border-slate-200 p-4 text-center"
              >
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={160}
                  height={160}
                  className="mx-auto h-28 w-auto object-contain"
                />
                <h3 className="mt-3 font-bold text-slate-900">{info.label}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-700">
                  {result.score}/15 poin
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="flex justify-center print:hidden">
        <button
          type="button"
          className="app-button-primary px-6"
          onClick={() => {
            window.location.href = `/api/results/pdf?kind=peminatan&sessionId=${encodeURIComponent(
              sessionId,
            )}&studentName=${encodeURIComponent(name)}&studentClass=${encodeURIComponent(
              birthDate,
            )}&filename=${encodeURIComponent(pdfFileName)}`;
          }}
        >
          Unduh PDF
        </button>
      </div>
    </div>
  );
}
