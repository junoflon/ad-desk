import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { searchMetaAds, metaAdToDbFormat } from "@/lib/meta";

/**
 * POST /api/collect
 * Meta Ad Library에서 광고를 검색하여 DB에 저장
 *
 * body: { searchTerms?: string, pageId?: string, country?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchTerms, pageId, country } = body;

    if (!searchTerms && !pageId) {
      return error("searchTerms 또는 pageId가 필요합니다.");
    }

    // Meta API에서 광고 검색
    const metaAds = await searchMetaAds({
      searchTerms,
      pageId,
      country: country || "KR",
      limit: 25,
    });

    if (metaAds.length === 0) {
      return success({ message: "수집된 광고가 없습니다.", collected: 0 });
    }

    // DB에 저장 (중복 무시)
    let collected = 0;
    for (const metaAd of metaAds) {
      const adData = metaAdToDbFormat(metaAd);
      try {
        await prisma.ad.create({ data: adData });
        collected++;
      } catch (e) {
        // 중복 등 에러는 무시하고 계속
        if (e instanceof Error && !e.message.includes("Unique constraint")) {
          console.error("Ad save error:", e.message);
        }
      }
    }

    return success({
      message: `${collected}개 광고 수집 완료`,
      collected,
      total: metaAds.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("META_AD_LIBRARY_TOKEN")) {
      return error("Meta API 토큰이 설정되지 않았습니다. .env에 META_AD_LIBRARY_TOKEN을 추가해주세요.", 400);
    }
    return error(`수집 실패: ${msg}`, 500);
  }
}
