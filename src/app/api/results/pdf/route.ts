import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { personalities } from "@/data/personalities";
import { careers } from "@/data/careers";
import { getBadgeByCode, getTop3Code } from "@/data/badges";
import { PEMINATAN_INFO } from "@/data/peminatan";
import { calculatePeminatanPercentages } from "@/utils/peminatan";
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

  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const top3 = sorted.filter((row) => row.score > 0).slice(0, 3);
  const hollandCode = result.holland_code || getTop3Code([
    { type: "realistic", score: result.r_score },
    { type: "investigative", score: result.i_score },
    { type: "artistic", score: result.a_score },
    { type: "social", score: result.s_score },
    { type: "enterprising", score: result.e_score },
    { type: "conventional", score: result.c_score },
  ]);
  const badge = getBadgeByCode(hollandCode);

  if (kind === "peminatan") {
    const percentages = calculatePeminatanPercentages([
      { type: "realistic", score: result.r_score },
      { type: "investigative", score: result.i_score },
      { type: "artistic", score: result.a_score },
      { type: "social", score: result.s_score },
      { type: "enterprising", score: result.e_score },
      { type: "conventional", score: result.c_score },
    ]);

    const topPeminatan = Object.entries(percentages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) => key);

    const pdf = await renderPeminatanPdf({
      name: result.student_name,
      birthDate: result.birth_date?.toISOString() ?? null,
      testDate: result.created_at.toISOString(),
      percentages,
      topPeminatan,
      peminatanInfo: PEMINATAN_INFO,
      topRiasec: top3.map((row) => ({
        label: personalities[row.key as keyof typeof personalities].label,
        score: row.score,
        description: personalities[row.key as keyof typeof personalities].summary,
      })),
      scores: sorted.map((row) => ({
        label: personalities[row.key as keyof typeof personalities].label,
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
      max: 5,
    })),
    dominant: top3.map((row) => {
      const info = personalities[row.key as keyof typeof personalities];
      return {
        type: row.key as keyof typeof personalities,
        label: info.label,
        score: row.score,
        summary: info.summary,
        traits: info.traits,
        preferences: info.preferences,
        avoidances: info.avoidances,
        careers: careers[row.key as keyof typeof careers],
      };
    }),
    scores: sorted.map((row) => ({
      label: personalities[row.key as keyof typeof personalities].label,
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
