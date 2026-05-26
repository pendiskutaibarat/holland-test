import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function normalizeParam(value: unknown): string {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  return String(value ?? "").trim();
}

function extractSessionId(
  request: Pick<NextRequest, "nextUrl"> | Pick<Request, "url">,
  rawSessionId: unknown,
): string {
  const fromParams = normalizeParam(rawSessionId);

  if (fromParams) {
    return fromParams;
  }

  const pathname =
    "nextUrl" in request
      ? request.nextUrl.pathname
      : new URL(request.url).pathname;
  const match = pathname.match(/\/api\/admin\/sessions\/([^/]+)\/collaborators\/?$/);

  return normalizeParam(match?.[1]);
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    await requireAdmin();
    const { sessionId: rawSessionId } = await params;
    const sessionId = extractSessionId(request, rawSessionId);

    if (!sessionId) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    await requireAdmin();
    const { sessionId: rawSessionId } = await params;
    const sessionId = extractSessionId(request, rawSessionId);

    if (!sessionId) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const body = await request.json();
    const userId = normalizeParam(body.userId ?? body.user_id ?? body.teacherId);

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Guru tidak valid" }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, user_id: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 404 });
    }

    if (session.user_id === userId) {
      return NextResponse.json(
        { error: "Guru sudah menjadi pemilik sesi ini" },
        { status: 400 },
      );
    }

    const teacher = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "TEACHER",
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Guru aktif tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.sessionCollaborator.create({
      data: {
        session_id: sessionId,
        user_id: userId,
      },
    });

    const collaborators = await getCollaborators(sessionId);

    return NextResponse.json(
      {
        collaborators: collaborators.map((collaborator) => ({
          id: collaborator.id,
          session_id: collaborator.session_id,
          user_id: collaborator.user_id,
          created_at: collaborator.created_at,
          user: collaborator.user,
        })),
      },
      { status: 201 },
    );
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Guru sudah dibagikan ke sesi ini" },
        { status: 409 },
      );
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
