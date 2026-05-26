import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { buildSessionDetailWhere } from "@/lib/session-access";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { userId, role } = await requireAuth();
    const { sessionId } = await params;

    if (!isValidUUID(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const session = await prisma.session.findFirst({
      where: buildSessionDetailWhere(userId, role, sessionId),
      include: {
        results: {
          orderBy: { created_at: "desc" },
          include: {
            answers: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        collaborators: {
          orderBy: { created_at: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true,
                created_at: true,
              },
            },
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

    return NextResponse.json(session);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { userId, role } = await requireAuth();
    const { sessionId } = await params;
    const body = await request.json();

    if (!isValidUUID(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
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

    const updated = await prisma.session.update({
      where: { id: sessionId },
      data: {
        ...(body.is_active !== undefined && { is_active: body.is_active }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    return NextResponse.json(updated);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { userId, role } = await requireAuth();
    const { sessionId } = await params;

    if (!isValidUUID(sessionId)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
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

    await prisma.session.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true });
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
