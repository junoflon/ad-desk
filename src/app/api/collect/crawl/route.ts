import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { crawlMetaAdLibrary } from "@/lib/crawler";

/**
 * POST /api/collect/crawl
 * Playwright로 Meta Ad Library 크롤링 (API 토큰 없이 사용)
 * body: { searchTerms: string, country?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchTerms, country } = body;

    if (!searchTerms) {
      return error("searchTerms가 필요합니다.");
    }

    const crawled = await crawlMetaAdLibrary(searchTerms, country || "KR");

    if (crawled.length === 0) {
      return success({ message: "수집된 광고가 없습니다.", collected: 0 });
    }

    let collected = 0;
    for (const item of crawled) {
      try {
        await prisma.ad.create({
          data: {
            platform: item.platform,
            brand: item.pageTitle,
            imageUrl: item.snapshotUrl || "/images/placeholder-ad.svg",
            copyText: item.adText || null,
            isActive: item.isActive,
            startDate: item.startDate ? new Date(item.startDate) : null,
            country: "KR",
          },
        });
        collected++;
      } catch {
        // 중복 등 무시
      }
    }

    return success({
      message: `${collected}개 광고 크롤링 완료`,
      collected,
      total: crawled.length,
    });
  } catch (e) {
    return error(`크롤링 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
