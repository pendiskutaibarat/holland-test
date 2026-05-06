import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return secret;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: {
  userId: string;
  email: string;
  role: string;
  status: string;
}): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "24h" });
}

export function verifyToken(token: string): {
  userId: string;
  email: string;
  role: string;
  status: string;
} {
  return jwt.verify(token, getSecret()) as {
    userId: string;
    email: string;
    role: string;
    status: string;
  };
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token")?.value;
}

export async function requireAuth(): Promise<{
  userId: string;
  email: string;
  role: string;
  status: string;
}> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  try {
    const payload = verifyToken(token);
    if (payload.status === "PENDING") {
      throw new Error("Akun Anda masih menunggu persetujuan admin");
    }
    if (payload.status === "REJECTED") {
      throw new Error("Akun ditolak");
    }
    return payload;
  } catch {
    throw new Error("Unauthorized");
  }
}

export async function requireAdmin(): Promise<{
  userId: string;
  email: string;
  role: string;
  status: string;
}> {
  const auth = await requireAuth();
  if (auth.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return auth;
}
