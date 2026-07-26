import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { personalities } from "@/data/personalities";
import { careers } from "@/data/careers";
import { getBadgeByCode, getTop3Code } from "@/data/badges";
import {
  PEMINATAN_COMPATIBILITY,
  PEMINATAN_INFO,
} from "@/data/peminatan";
import { calculatePeminatanPercentages } from "@/utils/peminatan";
import {
  calculatePeminatanScores,
  getPeminatanCompatibility,
  rankRiasecResults,
} from "@/utils/riasec";
import { minatHobiCategories } from "@/data/minatHobi";
import {
  renderKarirPdf,
  renderMinatHobiPdf,
  renderPeminatanPdf,
  toSlug,
} from "@/lib/pdf/resultPdf";

function buildFilename(kind: string, studentName: string) {
  return `hasil-${kind}-${toSlug(studentName)}.pdf`;
}

function getStringParam(url: URL, key: string) {
  return url.searchParams.get(key) || "";
}

function uniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function buildLookupPairs(studentName: string, studentClass: string) {
  const names = uniqueValues([studentName, studentName.trim()]);
  const classes = uniqueValues([studentClass, studentClass.trim()]);
  const pairs: Array<{ student_name: string; student_class: string }> = [];

  names.forEach((name) => {
    classes.forEach((studentClassValue) => {
      pairs.push({ student_name: name, student_class: studentClassValue });
    });
  });

  return pairs;
}

async function findResultByIdentity<T extends {
  session_id: string;
  student_name: string;
  student_class: string;
}>(
  finder: (args: {
    where: {
      session_id: string;
      OR: Array<{ student_name: string; student_class: string }>;
    };
  }) => Promise<T | null>,
  sessionId: string,
  studentName: string,
  studentClass: string,
) {
  return finder({
    where: {
      session_id: sessionId,
      OR: buildLookupPairs(studentName, studentClass),
    },
  });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const kind = getStringParam(url, "kind");
  const sessionId = getStringParam(url, "sessionId");
  const studentName = getStringParam(url, "studentName");
  const studentClass = getStringParam(url, "studentClass");

  if (!kind || !sessionId || !studentName || !studentClass) {
    return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
  }

  if (!["karir", "peminatan", "minat_hobi"].includes(kind)) {
    return NextResponse.json({ error: "Jenis PDF tidak valid" }, { status: 400 });
  }

  if (kind === "minat_hobi") {
    const result = await findResultByIdentity(
      (args) => prisma.assessmentResult.findFirst(args),
      sessionId,
      studentName,
      studentClass,
    );

    if (!result) {
      return NextResponse.json({ error: "Hasil tidak ditemukan" }, { status: 404 });
    }

    const topCategories = (result.top_categories as Array<{
      code?: string;
      category_code?: string;
      name?: string;
      category_name?: string;
      score: number;
      rank: number;
    }>).map((category) => ({
      code: category.code ?? category.category_code ?? "-",
      name: category.name ?? category.category_name ?? "-",
      score: category.score,
      rank: category.rank,
    }));

    const rankedRows = (result.ranked_categories as Array<{
      code?: string;
      category_code?: string;
      name?: string;
      category_name?: string;
      score: number;
      rank: number;
    }>).map((row) => ({
      rank: row.rank,
      name: row.name ?? row.category_name ?? row.code ?? row.category_code ?? "-",
      score: row.score,
    }));

    const pdf = await renderMinatHobiPdf({
      studentName: result.student_name,
      birthDate: result.birth_date?.toISOString() ?? null,
      testDate: result.created_at.toISOString(),
      topCategories: topCategories.map((category) => ({
        code: category.code,
        name: category.name,
        score: category.score,
        rank: category.rank,
      })),
      categoryDetails: Object.fromEntries(
        topCategories.map((category) => {
          const detail = minatHobiCategories.find((item) => item.code === category.code);
          return [
            category.code,
            {
              description: detail?.description ?? "",
              activities: detail?.activities ?? [],
            },
          ];
        }),
      ),
      rankedRows,
    });

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${buildFilename("minat-hobi", result.student_name)}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const result = await findResultByIdentity(
    (args) => prisma.testResult.findFirst(args),
    sessionId,
    studentName,
    studentClass,
  );

  if (!result) {
    return NextResponse.json({ error: "Hasil tidak ditemukan" }, { status: 404 });
  }

  const scores = [
    { key: "realistic", label: "Realistis", score: result.r_score },
    { key: "investigative", label: "Investigatif", score: result.i_score },
    { key: "artistic", label: "Artistik", score: result.a_score },
    { key: "social", label: "Sosial", score: result.s_score },
    { key: "enterprising", label: "Wirausaha", score: result.e_score },
    { key: "conventional", label: "Konvensional", score: result.c_score },
  ];

  const testResults = [
    { type: "realistic", score: result.r_score },
    { type: "investigative", score: result.i_score },
    { type: "artistic", score: result.a_score },
    { type: "social", score: result.s_score },
    { type: "enterprising", score: result.e_score },
    { type: "conventional", score: result.c_score },
  ] as const;
  const ranking = rankRiasecResults([...testResults]);
  const sorted = ranking.ranked.map((ranked) => ({
    key: ranked.type,
    label: personalities[ranked.type].label,
    score: ranked.score,
  }));
  const top3 = ranking.top3;
  const hollandCode = result.holland_code || getTop3Code([...testResults]);
  const badge = getBadgeByCode(hollandCode);

  if (kind === "peminatan") {
    const isV2 = result.scoring_version === "v2";
    const storedV2Scores =
      result.ipa_score !== null &&
      result.ips_score !== null &&
      result.bahasa_score !== null
        ? [
            { type: "ipa" as const, score: result.ipa_score },
            { type: "ips" as const, score: result.ips_score },
            { type: "bahasa" as const, score: result.bahasa_score },
          ]
        : null;
    const v2Scores = (
      storedV2Scores ?? calculatePeminatanScores([...testResults]) ?? []
    )
      .map((item) => ({
        ...item,
        compatibility: getPeminatanCompatibility(item.score),
      }))
      .sort((a, b) => b.score - a.score);
    const legacyPercentages =
      result.ipa_pct !== null &&
      result.ips_pct !== null &&
      result.bahasa_pct !== null
        ? {
            ipa: result.ipa_pct,
            ips: result.ips_pct,
            bahasa: result.bahasa_pct,
          }
        : calculatePeminatanPercentages([...testResults]);
    const peminatanRows = isV2
      ? v2Scores.map((item) => {
          const compatibility = PEMINATAN_COMPATIBILITY[item.compatibility];
          return {
            key: item.type,
            label: PEMINATAN_INFO[item.type].label,
            score: item.score,
            max: 14,
            valueLabel: `${item.score}/14`,
            description: `${compatibility.label} - ${compatibility.priority}. ${compatibility.description}`,
            subjects: PEMINATAN_INFO[item.type].subjects,
          };
        })
      : (Object.entries(legacyPercentages) as [
          keyof typeof PEMINATAN_INFO,
          number,
        ][])
          .sort((a, b) => b[1] - a[1])
          .map(([key, value]) => ({
            key,
            label: PEMINATAN_INFO[key].label,
            score: value,
            max: 100,
            valueLabel: `${value}%`,
            description: PEMINATAN_INFO[key].description,
            subjects: PEMINATAN_INFO[key].subjects,
          }));

    const pdf = await renderPeminatanPdf({
      name: result.student_name,
      birthDate: result.birth_date?.toISOString() ?? null,
      testDate: result.created_at.toISOString(),
      version: isV2 ? "v2" : "v1",
      peminatanRows,
      topRiasec: top3.map((row) => ({
        type: row.type,
        label: personalities[row.type].label,
        score: row.score,
        description: personalities[row.type].summary,
      })),
      scores: sorted.map((row) => ({
        label: row.label,
        score: row.score,
      })),
    });

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${buildFilename("peminatan", result.student_name)}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const pdf = await renderKarirPdf({
    name: result.student_name,
    birthDate: result.birth_date?.toISOString() ?? null,
    testDate: result.created_at.toISOString(),
    hollandCode,
    badgeName: badge?.name ?? null,
    badgeDescription: badge?.description ?? null,
    barRows: scores.map((row) => ({
      label: row.label,
      score: row.score,
      max: 15,
    })),
    dominant: top3.map((row) => {
      const info = personalities[row.type];
      return {
        type: row.type,
        label: info.label,
        score: row.score,
        summary: info.summary,
        traits: info.traits,
        preferences: info.preferences,
        avoidances: info.avoidances,
        careers: careers[row.type],
      };
    }),
    scores: sorted.map((row) => ({
      label: row.label,
      score: row.score,
    })),
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${buildFilename(kind, result.student_name)}"`,
      "Cache-Control": "no-store",
    },
  });
}
