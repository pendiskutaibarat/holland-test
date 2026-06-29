import { NextResponse } from "next/server";
import { getAuthToken, verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { isActiveUser: false, activeUserEmail: null },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const payload = verifyToken(token);
    const isActiveUser = payload.status === "ACTIVE";

    return NextResponse.json(
      {
        isActiveUser,
        activeUserEmail: isActiveUser ? payload.email : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { isActiveUser: false, activeUserEmail: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
