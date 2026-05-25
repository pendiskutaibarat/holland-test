import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TestPageClient from "./TestPageClient";

function isValidSessionSlug(code: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(code) && code.length <= 100;
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (!isValidSessionSlug(code)) {
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
      sessionName={session.name}
      schoolName={session.school_name}
      sessionMode={session.mode}
      isActive={session.is_active}
    />
  );
}
