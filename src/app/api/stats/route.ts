import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

/**
 * GET /api/stats
 * 대시보드용 통계 데이터
 */
export async function GET() {
  try {
    // 업종별 광고 수
    const byCategory = await prisma.ad.groupBy({
      by: ["category"],
      _count: { id: true },
      where: { category: { not: null } },
      orderBy: { _count: { id: "desc" } },
    });

    // 플랫폼별 광고 수
    const byPlatform = await prisma.ad.groupBy({
      by: ["platform"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // 포맷별 광고 수
    const byFormat = await prisma.ad.groupBy({
      by: ["format"],
      _count: { id: true },
      where: { format: { not: null } },
      orderBy: { _count: { id: "desc" } },
    });

    // 게재 상태
    const activeCount = await prisma.ad.count({ where: { isActive: true } });
    const inactiveCount = await prisma.ad.count({ where: { isActive: false } });

    // 최근 7일간 일별 수집 (createdAt 기준)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAds = await prisma.ad.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // 일별로 그룹핑
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const ad of recentAds) {
      const key = ad.createdAt.toISOString().slice(0, 10);
      if (key in dailyMap) dailyMap[key]++;
    }

    const daily = Object.entries(dailyMap).map(([date, count]) => ({
      date: `${parseInt(date.slice(5, 7))}/${parseInt(date.slice(8, 10))}`,
      count,
    }));

    return success({
      byCategory: byCategory.map((c) => ({
        name: c.category || "기타",
        value: c._count.id,
      })),
      byPlatform: byPlatform.map((p) => ({
        name: p.platform,
        value: p._count.id,
      })),
      byFormat: byFormat.map((f) => ({
        name: f.format || "기타",
        value: f._count.id,
      })),
      status: {
        active: activeCount,
        inactive: inactiveCount,
      },
      daily,
    });
  } catch (e) {
    return error(`통계 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
