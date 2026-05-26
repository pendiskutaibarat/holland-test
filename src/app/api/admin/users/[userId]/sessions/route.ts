import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  buildTeacherSessionWhere,
  getSessionAccessType,
} from "@/lib/session-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await requireAdmin();
    const { userId } = await params;

    const sessions = await prisma.session.findMany({
      where: buildTeacherSessionWhere(userId),
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
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}
