import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * API 라우트에서 현재 로그인된 유저를 가져옴
 * 미인증 시 null 반환
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
}
