import type { Prisma } from "@/../prisma/generated/client";

export function buildTeacherSessionWhere(userId: string): Prisma.SessionWhereInput {
  return {
    OR: [
      { user_id: userId },
      {
        collaborators: {
          some: {
            user_id: userId,
          },
        },
      },
    ],
  };
}

export function buildSessionDetailWhere(
  userId: string,
  role: string,
  sessionId: string,
): Prisma.SessionWhereInput {
  if (role === "ADMIN") {
    return { id: sessionId };
  }

  return {
    id: sessionId,
    ...buildTeacherSessionWhere(userId),
  };
}

export function getSessionAccessType(
  sessionOwnerId: string,
  viewerUserId: string,
): "OWNED" | "SHARED" {
  return sessionOwnerId === viewerUserId ? "OWNED" : "SHARED";
}
