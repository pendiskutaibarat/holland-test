import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "../../../../prisma/generated/client";
import { prisma } from "@/lib/prisma";
import { ASSESSMENT_SLUGS } from "@/data/assessments";
import { calculateMinatHobiResult } from "@/utils/minatHobi";
import { calculateRiasecResult } from "@/utils/riasec";

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
      answers,
      selected_question_numbers,
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
      },
    });

    const activeMinatHobiVersion =
      session?.assessment.slug === ASSESSMENT_SLUGS.minatHobi
        ? await prisma.assessmentVersion.findFirst({
            where: {
              assessment_id: session.assessment_id,
              is_active: true,
            },
            include: {
              questions: true,
            },
            orderBy: { created_at: "desc" },
          })
        : null;

    if (!session) {
      return NextResponse.json(
        { error: "Sesi tidak ditemukan" },
        { status: 404 },
      );
    }

    if (
      session.assessment.slug === ASSESSMENT_SLUGS.minatHobi &&
      activeMinatHobiVersion &&
      session.assessment_version_id !== activeMinatHobiVersion.id
    ) {
      await prisma.session.update({
        where: { id: session.id },
        data: {
          assessment_version_id: activeMinatHobiVersion.id,
        },
      });
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

      if (!activeMinatHobiVersion) {
        return NextResponse.json(
          { error: "Asesmen tidak tersedia" },
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
        activeMinatHobiVersion.questions.map((question) => [
          question.question_number,
          question.id,
        ]),
      );

      const result = await prisma.assessmentResult.create({
        data: {
          session_id: session.id,
          assessment_version_id: activeMinatHobiVersion.id,
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

    if (!student_name || !student_class || !mode) {
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

    if (
      !Array.isArray(selected_question_numbers) ||
      selected_question_numbers.length === 0
    ) {
      return NextResponse.json(
        { error: "Pilih setidaknya satu pernyataan sebelum melihat hasil" },
        { status: 422 },
      );
    }
    if (
      selected_question_numbers.some(
        (number: unknown) => typeof number !== "number",
      )
    ) {
      return NextResponse.json(
        { error: "Nomor pertanyaan RIASEC tidak valid" },
        { status: 400 },
      );
    }

    let scoreResult;
    try {
      scoreResult = calculateRiasecResult(selected_question_numbers);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Jawaban RIASEC tidak valid",
        },
        { status: 400 },
      );
    }

    const activeHollandVersion = await prisma.assessmentVersion.findFirst({
      where: {
        assessment_id: session.assessment_id,
        is_active: true,
      },
      include: { questions: true },
      orderBy: { created_at: "desc" },
    });

    if (!activeHollandVersion) {
      return NextResponse.json(
        { error: "Asesmen RIASEC tidak tersedia" },
        { status: 400 },
      );
    }

    if (session.assessment_version_id !== activeHollandVersion.id) {
      await prisma.session.update({
        where: { id: session.id },
        data: { assessment_version_id: activeHollandVersion.id },
      });
    }

    const scoreByType = new Map(
      scoreResult.scores.map((result) => [result.type, result.score]),
    );
    const r_score = scoreByType.get("realistic") ?? 0;
    const i_score = scoreByType.get("investigative") ?? 0;
    const a_score = scoreByType.get("artistic") ?? 0;
    const s_score = scoreByType.get("social") ?? 0;
    const e_score = scoreByType.get("enterprising") ?? 0;
    const c_score = scoreByType.get("conventional") ?? 0;
    const peminatanByType = new Map(
      scoreResult.peminatan?.map((result) => [result.type, result.score]) ?? [],
    );
    const categoryScores = Object.fromEntries(
      scoreResult.scores.map((result) => [result.type, result.score]),
    );
    const rankedCategories = scoreResult.ranked.map((category) => ({
      category_code: category.type,
      score: category.score,
      rank: category.rank,
    }));
    const questionIdByNumber = new Map(
      activeHollandVersion.questions.map((question) => [
        question.question_number,
        question.id,
      ]),
    );

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
          holland_code: scoreResult.hollandCode,
          scoring_version: "v2",
          ipa_score:
            mode === "peminatan" ? (peminatanByType.get("ipa") ?? null) : null,
          ips_score:
            mode === "peminatan" ? (peminatanByType.get("ips") ?? null) : null,
          bahasa_score:
            mode === "peminatan"
              ? (peminatanByType.get("bahasa") ?? null)
              : null,
          ipa_pct: null,
          ips_pct: null,
          bahasa_pct: null,
          answers: {
            create: scoreResult.selectedQuestions.map((answer) => ({
              section: answer.section,
              question: answer.text,
              answer: "Selected",
            })),
          },
        },
        include: {
          answers: true,
        },
      });

      await tx.assessmentResult.create({
        data: {
          session_id: session.id,
          assessment_version_id: activeHollandVersion.id,
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
              scoreResult.selectedQuestions.map((answer) => ({
                question_id: questionIdByNumber.get(answer.number) ?? null,
                question_number: answer.number,
                question: answer.text,
                answer_code: "Selected",
                score: 1,
                category_code: answer.type,
              })),
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
