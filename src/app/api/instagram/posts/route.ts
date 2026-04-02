import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * GET /api/instagram/posts?brandId=xxx&sort=latest|top&limit=20
 * 브랜드별 인스타그램 게시물 목록
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const sort = searchParams.get("sort") || "latest";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    if (!brandId) return error("brandId가 필요합니다.");

    // 해당 브랜드가 현재 유저의 것인지 확인
    const brand = await prisma.monitorBrand.findFirst({
      where: { id: brandId, userId: user.id },
    });
    if (!brand) return error("브랜드를 찾을 수 없습니다.", 404);

    const orderBy = sort === "top"
      ? { likes: "desc" as const }
      : { collectedAt: "desc" as const };

    const posts = await prisma.instagramPost.findMany({
      where: { monitorBrandId: brandId },
      orderBy,
      take: limit,
    });

    return success({ brand, posts });
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}
