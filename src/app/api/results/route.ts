import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePeminatanPercentages } from "@/utils/peminatan";
import type { TestResult } from "@/data/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      session_code,
      student_name,
      student_class,
      mode,
      birth_date,
      r_score,
      i_score,
      a_score,
      s_score,
      e_score,
      c_score,
      holland_code,
      ipa_pct,
      ips_pct,
      bahasa_pct,
      answers,
    } = body;

    if (
      !session_code ||
      !student_name ||
      !student_class ||
      !mode ||
      r_score === undefined ||
      i_score === undefined ||
      a_score === undefined ||
      s_score === undefined ||
      e_score === undefined ||
      c_score === undefined
    ) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: session_code },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Sesi tidak ditemukan" },
        { status: 404 },
      );
    }

    if (!session.is_active) {
      return NextResponse.json(
        { error: "Sesi sudah ditutup" },
        { status: 403 },
      );
    }

    if (session.mode !== "bebas" && mode !== session.mode) {
      return NextResponse.json(
        { error: "Mode tidak valid untuk sesi ini" },
        { status: 403 },
      );
    }

    const peminatanPercentages =
      mode === "peminatan"
        ? calculatePeminatanPercentages([
            { type: "realistic", score: r_score },
            { type: "investigative", score: i_score },
            { type: "artistic", score: a_score },
            { type: "social", score: s_score },
            { type: "enterprising", score: e_score },
            { type: "conventional", score: c_score },
          ] satisfies TestResult[])
        : null;

    const result = await prisma.testResult.create({
      data: {
        session_id: session.id,
        student_name,
        student_class,
        mode,
        birth_date: birth_date ? new Date(birth_date) : null,
        r_score,
        i_score,
        a_score,
        s_score,
        e_score,
        c_score,
        holland_code: holland_code || null,
        ipa_pct: peminatanPercentages?.ipa ?? ipa_pct ?? null,
        ips_pct: peminatanPercentages?.ips ?? ips_pct ?? null,
        bahasa_pct: peminatanPercentages?.bahasa ?? bahasa_pct ?? null,
        answers: {
          create:
            answers?.map(
              (a: { section: string; question: string; answer?: string }) => ({
                section: a.section,
                question: a.question,
                answer: a.answer || "Selected",
              }),
            ) || [],
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Anda sudah mengirim hasil tes untuk sesi ini" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}
