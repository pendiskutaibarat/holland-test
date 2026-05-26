import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { buildSessionDetailWhere } from "@/lib/session-access";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; resultId: string }> },
) {
  try {
    const { userId, role } = await requireAuth();
    const { sessionId, resultId } = await params;

    if (!isValidUUID(sessionId) || !isValidUUID(resultId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: buildSessionDetailWhere(userId, role, sessionId),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Sesi tidak ditemukan" },
        { status: 404 },
      );
    }

    const result = await prisma.testResult.findFirst({
      where: {
        id: resultId,
        session_id: sessionId,
      },
      include: {
        answers: true,
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Hasil tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
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
