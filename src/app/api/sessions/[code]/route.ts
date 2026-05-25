import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    const session = await prisma.session.findUnique({
      where: { code },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Sesi tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: session.id,
      name: session.name,
      school_name: session.school_name,
      mode: session.mode,
      is_active: session.is_active,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 },
    );
  }
}
