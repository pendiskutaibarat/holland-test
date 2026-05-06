import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifyToken(token);

  if (payload.status === "PENDING" || payload.status === "REJECTED") {
    redirect("/admin/login");
  }

  const userId = payload.userId;
  const role = payload.role;

  const sessions = await prisma.session.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    include: {
      _count: {
        select: { results: true },
      },
    },
  });

  return (
    <DashboardClient
      sessions={sessions.map((s) => ({
        ...s,
        result_count: s._count.results,
      }))}
      role={role}
    />
  );
}