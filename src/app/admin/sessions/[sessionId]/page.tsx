import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import SessionDetailClient from "./SessionDetailClient";

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);

  if (payload.status === "PENDING" || payload.status === "REJECTED") {
    redirect("/admin/login");
  }

  const userId = payload.userId;
  const { sessionId } = await params;

  if (!isValidUUID(sessionId)) {
    notFound();
  }

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      user_id: userId,
    },
    include: {
      results: {
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>
      <SessionDetailClient session={session} />
    </div>
  );
}