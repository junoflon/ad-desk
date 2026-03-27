import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    const brands = await prisma.monitorBrand.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { monitorAds: true } },
        monitorAds: {
          include: { ad: true },
          orderBy: { detectedAt: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return success(brands);
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    const body = await request.json();
    const { brandName, platform, brandUrl } = body;

    if (!brandName) return error("브랜드명을 입력해주세요.");

    const brand = await prisma.monitorBrand.create({
      data: {
        brandName,
        platform: platform || "meta",
        brandUrl: brandUrl || null,
        userId: user.id,
      },
    });

    return success(brand, 201);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return error("이미 모니터링 중인 브랜드입니다.");
    }
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}
