import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthToken, verifyToken } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const token = await getAuthToken();

  if (!token) {
    redirect("/admin/login");
  }

  let adminId: string;
  try {
    const payload = verifyToken(token);
    adminId = payload.adminId;
  } catch {
    redirect("/admin/login");
  }

  const sessions = await prisma.session.findMany({
    where: { admin_id: adminId },
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
    />
  );
}
