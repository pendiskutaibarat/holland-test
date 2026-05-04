import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { generateSessionCode } from "@/lib/code";

export async function POST(request: NextRequest) {
  try {
    const { adminId } = await requireAuth();
    const { name, mode, description } = await request.json();

    if (!name || !mode) {
      return NextResponse.json(
        { error: "Nama dan mode wajib diisi" },
        { status: 400 },
      );
    }

    if (!["peminatan", "karir", "bebas"].includes(mode)) {
      return NextResponse.json(
        { error: "Mode tidak valid" },
        { status: 400 },
      );
    }

    let code = generateSessionCode();
    let existing = await prisma.session.findUnique({ where: { code } });
    let retries = 0;
    while (existing && retries < 10) {
      code = generateSessionCode();
      existing = await prisma.session.findUnique({ where: { code } });
      retries++;
    }

    if (existing) {
      return NextResponse.json(
        { error: "Gagal membuat kode sesi unik" },
        { status: 500 },
      );
    }

    const session = await prisma.session.create({
      data: {
        admin_id: adminId,
        code,
        name,
        description: description || null,
        mode,
      },
    });

    return NextResponse.json(session, { status: 201 });
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
    const { adminId } = await requireAuth();

    const sessions = await prisma.session.findMany({
      where: { admin_id: adminId },
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: { results: true },
        },
      },
    });

    return NextResponse.json(
      sessions.map((s) => ({
        ...s,
        result_count: s._count.results,
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
