import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateSessionSlug } from "@/lib/code";
import {
  buildTeacherSessionWhere,
  getSessionAccessType,
} from "@/lib/session-access";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAuth();
    const { name, school_name, mode, description } = await request.json();

    if (!name || !school_name || !mode) {
      return NextResponse.json(
        { error: "Nama, sekolah/madrasah, dan mode wajib diisi" },
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

    if (!["peminatan", "karir", "bebas"].includes(mode)) {
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
        code,
        name: sessionName,
        school_name: schoolName,
        description: description || null,
        mode,
      },
      include: {
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
        user: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { results: true },
        },
      },
    });

    return NextResponse.json(
      sessions.map((s) => ({
        ...s,
        result_count: s._count.results,
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
