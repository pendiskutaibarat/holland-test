import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah" },
        { status: 401 },
      );
    }

    if (user.status === "PENDING") {
      return NextResponse.json(
        { error: "Akun Anda masih menunggu persetujuan admin" },
        { status: 403 },
      );
    }

    if (user.status === "REJECTED") {
      return NextResponse.json(
        { error: "Akun ditolak" },
        { status: 403 },
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah" },
        { status: 401 },
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
