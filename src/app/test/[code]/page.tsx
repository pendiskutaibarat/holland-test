import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TestPageClient from "./TestPageClient";

function isValidSessionCode(code: string): boolean {
  return /^[a-zA-Z0-9]{8}$/.test(code);
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!isValidSessionCode(code)) {
    notFound();
  }

  const session = await prisma.session.findUnique({
    where: { code },
  });

  if (!session) {
    notFound();
  }

  return (
    <TestPageClient
      sessionId={session.id}
      sessionCode={session.code}
      sessionName={session.name}
      sessionMode={session.mode}
      isActive={session.is_active}
    />
  );
}