import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import { buildTeacherSessionWhere, getSessionAccessType } from "@/lib/session-access";
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

  const where =
    role === "ADMIN" ? { user_id: userId } : buildTeacherSessionWhere(userId);

  const sessions = await prisma.session.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          name: true,
        },
      },
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
        owner_name: s.user.name,
        access_type: getSessionAccessType(s.user_id, userId),
      }))}
      role={role}
    />
  );
}
