import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function normalizeParam(value: unknown): string {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  return String(value ?? "").trim();
}

function extractIds(
  request: Request,
  rawSessionId: unknown,
  rawUserId: unknown,
): { sessionId: string; userId: string } {
  const fromParams = {
    sessionId: normalizeParam(rawSessionId),
    userId: normalizeParam(rawUserId),
  };

  if (fromParams.sessionId && fromParams.userId) {
    return fromParams;
  }

  const pathname = new URL(request.url).pathname;
  const match = pathname.match(
    /\/api\/admin\/sessions\/([^/]+)\/collaborators\/([^/]+)\/?$/,
  );

  return {
    sessionId: normalizeParam(match?.[1]),
    userId: normalizeParam(match?.[2]),
  };
}

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

async function getCollaborators(sessionId: string) {
  return prisma.sessionCollaborator.findMany({
    where: { session_id: sessionId },
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
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ sessionId: string; userId: string }> },
) {
  try {
    await requireAdmin();
    const { sessionId: rawSessionId, userId: rawUserId } = await params;
    const { sessionId, userId } = extractIds(
      request,
      rawSessionId,
      rawUserId,
    );

    if (!sessionId || !isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const share = await prisma.sessionCollaborator.findUnique({
      where: {
        session_id_user_id: {
          session_id: sessionId,
          user_id: userId,
        },
      },
    });

    if (!share) {
      return NextResponse.json(
        { error: "Guru tidak dibagikan ke sesi ini" },
        { status: 404 },
      );
    }

    await prisma.sessionCollaborator.delete({
      where: {
        session_id_user_id: {
          session_id: sessionId,
          user_id: userId,
        },
      },
    });

    const collaborators = await getCollaborators(sessionId);

    return NextResponse.json({
      collaborators: collaborators.map((collaborator) => ({
        id: collaborator.id,
        session_id: collaborator.session_id,
        user_id: collaborator.user_id,
        created_at: collaborator.created_at,
        user: collaborator.user,
      })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
