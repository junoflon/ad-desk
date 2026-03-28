import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인 필요", 401);

    const categories = await prisma.monitorCategory.findMany({
      where: { userId: user.id },
      include: {
        brands: {
          include: {
            _count: { select: { monitorAds: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return success(categories);
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인 필요", 401);

    const { name, color } = await request.json();
    if (!name) return error("카테고리명을 입력해주세요.");

    const category = await prisma.monitorCategory.create({
      data: {
        name,
        color: color || "#3B82F6",
        userId: user.id,
      },
    });

    return success(category, 201);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return error("이미 존재하는 카테고리입니다.");
    }
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}
