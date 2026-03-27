import { prisma } from "@/lib/prisma";

const DEFAULT_EMAIL = "admin@addesk.local";

/**
 * 인하우스 도구용 - 로그인 없이 기본 유저 자동 생성/반환
 */
export async function getCurrentUser() {
  return prisma.user.upsert({
    where: { email: DEFAULT_EMAIL },
    update: {},
    create: {
      email: DEFAULT_EMAIL,
      name: "Admin",
    },
  });
}
