import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "../../../../prisma/generated/client";
import { prisma } from "@/lib/prisma";
import { ASSESSMENT_SLUGS } from "@/data/assessments";
import type { TestResult } from "@/data/types";
import { calculatePeminatanPercentages } from "@/utils/peminatan";
import { calculateMinatHobiResult } from "@/utils/minatHobi";

interface HollandAnswer {
  section: string;
  question: string;
  answer?: string;
}

interface MinatHobiAnswer {
  question_number: number;
  answer_code: string;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2002"
  );
}

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

    if (!session_code) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: session_code },
      include: {
        assessment: true,
        assessment_version: {
          include: {
            questions: true,
          },
        },
      },
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

    if (session.assessment.slug === ASSESSMENT_SLUGS.minatHobi) {
      if (!student_name || !student_class || !Array.isArray(answers)) {
        return NextResponse.json(
          { error: "Data tidak lengkap" },
          { status: 400 },
        );
      }

      const scoreResult = calculateMinatHobiResult(
        answers.map((answer: MinatHobiAnswer) => ({
          question_number: Number(answer.question_number),
          answer_code: String(answer.answer_code),
        })),
      );

      const questionIdByNumber = new Map(
        session.assessment_version.questions.map((question) => [
          question.question_number,
          question.id,
        ]),
      );

      const result = await prisma.assessmentResult.create({
        data: {
          session_id: session.id,
          assessment_version_id: session.assessment_version_id,
          student_name,
          student_class,
          birth_date: birth_date ? new Date(birth_date) : null,
          total_score: scoreResult.total_score,
          category_scores: scoreResult.category_scores,
          ranked_categories:
            scoreResult.ranked_categories as unknown as Prisma.InputJsonValue,
          top_categories:
            scoreResult.top_categories as unknown as Prisma.InputJsonValue,
          responses: {
            create: scoreResult.responses.map((response) => ({
              question_id:
                questionIdByNumber.get(response.question_number) ?? null,
              question_number: response.question_number,
              question: response.question,
              answer_code: response.answer_code,
              score: response.score,
              category_code: response.category_code,
            })),
          },
        },
        include: {
          responses: true,
        },
      });

      return NextResponse.json(result, { status: 201 });
    }

    if (
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

    const categoryScores = {
      realistic: r_score,
      investigative: i_score,
      artistic: a_score,
      social: s_score,
      enterprising: e_score,
      conventional: c_score,
    };
    const rankedCategories = Object.entries(categoryScores)
      .map(([category_code, score]) => ({ category_code, score }))
      .sort((a, b) => b.score - a.score)
      .map((category, index) => ({ ...category, rank: index + 1 }));

    const result = await prisma.$transaction(async (tx) => {
      const legacyResult = await tx.testResult.create({
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
              answers?.map((answer: HollandAnswer) => ({
                section: answer.section,
                question: answer.question,
                answer: answer.answer || "Selected",
              })) || [],
          },
        },
        include: {
          answers: true,
        },
      });

      await tx.assessmentResult.create({
        data: {
          session_id: session.id,
          assessment_version_id: session.assessment_version_id,
          legacy_result_id: legacyResult.id,
          student_name,
          student_class,
          birth_date: birth_date ? new Date(birth_date) : null,
          total_score: r_score + i_score + a_score + s_score + e_score + c_score,
          category_scores: categoryScores,
          ranked_categories:
            rankedCategories as unknown as Prisma.InputJsonValue,
          top_categories:
            rankedCategories.slice(0, 3) as unknown as Prisma.InputJsonValue,
          responses: {
            create:
              answers?.map((answer: HollandAnswer, index: number) => ({
                question_number: index + 1,
                question: answer.question,
                answer_code: answer.answer || "Selected",
                score: 1,
                category_code: answer.section,
              })) || [],
          },
        },
      });

      return legacyResult;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "Anda sudah mengirim hasil tes untuk sesi ini" },
        { status: 409 },
      );
    }

    if (error instanceof Error && error.message.startsWith("MINAT_HOBI_")) {
      return NextResponse.json(
        { error: "Jawaban Minat Hobi tidak valid atau belum lengkap" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}
