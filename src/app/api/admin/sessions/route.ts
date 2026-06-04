import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateSessionSlug } from "@/lib/code";
import {
  buildTeacherSessionWhere,
  getSessionAccessType,
} from "@/lib/session-access";
import { ASSESSMENT_SLUGS } from "@/data/assessments";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const {
      name,
      school_name,
      mode,
      description,
      assessment_slug = ASSESSMENT_SLUGS.holland,
    } = await request.json();

    if (!name || !school_name || !assessment_slug) {
      return NextResponse.json(
        { error: "Nama, sekolah/madrasah, dan asesmen wajib diisi" },
        { status: 400 },
      );
    }

    const sessionName = String(name).trim();
    const schoolName = String(school_name).trim();

    if (!sessionName || !schoolName) {
      return NextResponse.json(
        { error: "Nama dan sekolah/madrasah wajib diisi" },
        { status: 400 },
      );
    }

    const assessment = await prisma.assessment.findUnique({
      where: { slug: String(assessment_slug) },
      include: {
        versions: {
          where: { is_active: true },
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    });

    if (!assessment || !assessment.is_active || assessment.versions.length === 0) {
      return NextResponse.json(
        { error: "Asesmen tidak tersedia" },
        { status: 400 },
      );
    }

    const sessionMode =
      assessment.slug === ASSESSMENT_SLUGS.holland ? String(mode || "bebas") : assessment.slug;

    if (
      assessment.slug === ASSESSMENT_SLUGS.holland &&
      !["peminatan", "karir", "bebas"].includes(sessionMode)
    ) {
      return NextResponse.json(
        { error: "Mode tidak valid" },
        { status: 400 },
      );
    }

    const baseSlug = generateSessionSlug(sessionName);
    let code = baseSlug;
    let existing = await prisma.session.findUnique({ where: { code } });
    let suffix = 2;
    while (existing && suffix <= 99) {
      code = `${baseSlug}-${suffix}`;
      existing = await prisma.session.findUnique({ where: { code } });
      suffix++;
    }

    if (existing) {
      return NextResponse.json(
        { error: "Gagal membuat link sesi unik" },
        { status: 500 },
      );
    }

    const session = await prisma.session.create({
      data: {
        user_id: userId,
        assessment_id: assessment.id,
        assessment_version_id: assessment.versions[0].id,
        code,
        name: sessionName,
        school_name: schoolName,
        description: description || null,
        mode: sessionMode,
      },
      include: {
        assessment: true,
        assessment_version: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ...session,
        result_count: 0,
        owner_name: session.user.name,
        access_type: "OWNED",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId, role } = await requireAuth();

    const where =
      role === "ADMIN" ? { user_id: userId } : buildTeacherSessionWhere(userId);

    const sessions = await prisma.session.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        assessment: true,
        assessment_version: true,
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { results: true, assessment_results: true },
        },
      },
    });

    return NextResponse.json(
      sessions.map((s) => ({
        ...s,
        result_count:
          s.assessment.slug === ASSESSMENT_SLUGS.minatHobi
            ? s._count.assessment_results
            : s._count.results,
        owner_name: s.user.name,
        access_type: getSessionAccessType(s.user_id, userId),
      })),
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}
