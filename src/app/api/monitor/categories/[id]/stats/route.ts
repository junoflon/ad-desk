import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

/**
 * GET /api/monitor/categories/[id]/stats?from=2026-03-01&to=2026-03-28
 * 카테고리별 대시보드 통계
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = request.nextUrl;

    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const from = fromStr ? new Date(fromStr) : new Date(Date.now() - 30 * 86400000);
    const to = toStr ? new Date(toStr + "T23:59:59") : new Date();

    // 카테고리 + 브랜드 조회
    const category = await prisma.monitorCategory.findUnique({
      where: { id },
      include: {
        brands: {
          include: {
            monitorAds: {
              where: {
                detectedAt: { gte: from, lte: to },
              },
              include: { ad: true },
            },
            followers: {
              where: {
                recordedAt: { gte: from, lte: to },
              },
              orderBy: { recordedAt: "asc" },
            },
          },
        },
      },
    });

    if (!category) return error("카테고리를 찾을 수 없습니다.", 404);

    // 전체 광고 모으기
    const allAds = category.brands.flatMap((b) =>
      b.monitorAds.map((ma) => ({ ...ma.ad, brandName: b.brandName }))
    );

    // 게시물/릴스 비율
    const contentTypeCounts: Record<string, number> = {};
    for (const ad of allAds) {
      const type = ad.contentType || "post";
      contentTypeCounts[type] = (contentTypeCounts[type] || 0) + 1;
    }
    const contentTypeRatio = Object.entries(contentTypeCounts).map(
      ([name, value]) => ({ name, value })
    );

    // 일별 업로드 수
    const dailyMap: Record<string, number> = {};
    const dayCount = Math.ceil((to.getTime() - from.getTime()) / 86400000);
    for (let i = 0; i < Math.min(dayCount, 60); i++) {
      const d = new Date(from.getTime() + i * 86400000);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const ad of allAds) {
      const date = ad.startDate || ad.createdAt;
      const key = new Date(date).toISOString().slice(0, 10);
      if (key in dailyMap) dailyMap[key]++;
    }
    const dailyUploads = Object.entries(dailyMap).map(([date, count]) => ({
      date: `${parseInt(date.slice(5, 7))}/${parseInt(date.slice(8, 10))}`,
      count,
    }));

    // 브랜드별 팔로워 증감
    const followerTrends = category.brands.map((brand) => {
      const snapshots = brand.followers;
      const first = snapshots[0];
      const last = snapshots[snapshots.length - 1];
      const change = first && last ? last.followers - first.followers : 0;

      return {
        brandName: brand.brandName,
        current: last?.followers || 0,
        change,
        history: snapshots.map((s) => ({
          date: `${s.recordedAt.getMonth() + 1}/${s.recordedAt.getDate()}`,
          followers: s.followers,
        })),
      };
    });

    // 브랜드별 광고 수
    const brandStats = category.brands.map((b) => ({
      brandName: b.brandName,
      platform: b.platform,
      adsCount: b.monitorAds.length,
    }));

    return success({
      category: { id: category.id, name: category.name, color: category.color },
      period: { from: from.toISOString(), to: to.toISOString() },
      totalAds: allAds.length,
      contentTypeRatio,
      dailyUploads,
      followerTrends,
      brandStats,
    });
  } catch (e) {
    return error(`통계 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
