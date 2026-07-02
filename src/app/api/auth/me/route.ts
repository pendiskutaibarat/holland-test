import { NextResponse } from "next/server";
import { getAuthToken, verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        {
          isAdminOrGuruLoggedIn: false,
          activeUserEmail: null,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = verifyToken(token);
    const isAdminOrGuruLoggedIn =
      payload.status === "ACTIVE" &&
      (payload.role === "ADMIN" || payload.role === "TEACHER");

    return NextResponse.json(
      {
        isAdminOrGuruLoggedIn,
        activeUserEmail: isAdminOrGuruLoggedIn ? payload.email : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { isAdminOrGuruLoggedIn: false, activeUserEmail: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
