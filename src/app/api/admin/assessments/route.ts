import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    const assessments = await prisma.assessment.findMany({
      where: { is_active: true },
      orderBy: { created_at: "asc" },
      include: {
        versions: {
          where: { is_active: true },
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json(
      assessments
        .filter((assessment) => assessment.versions.length > 0)
        .map((assessment) => ({
          id: assessment.id,
          slug: assessment.slug,
          name: assessment.name,
          description: assessment.description,
          engine_key: assessment.engine_key,
          version: assessment.versions[0],
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
