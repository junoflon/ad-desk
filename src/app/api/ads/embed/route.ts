import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { embedAd } from "@/lib/vector";

/**
 * POST /api/ads/embed
 * 모든 광고(또는 특정 광고)에 embedding을 생성합니다.
 * body: { adId?: string } — adId 없으면 embedding 없는 전체 광고 처리
 */
export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return error("OPENAI_API_KEY가 설정되지 않았습니다.", 400);
    }

    const body = await request.json().catch(() => ({}));

    if (body.adId) {
      const ok = await embedAd(body.adId);
      return ok
        ? success({ embedded: 1 })
        : error("임베딩 생성 실패");
    }

    // embedding이 없는 광고 전체 처리
    const ads = await prisma.$queryRawUnsafe(
      `SELECT id FROM "Ad" WHERE embedding IS NULL LIMIT 100`
    ) as { id: string }[];

    let embedded = 0;
    for (const ad of ads) {
      const ok = await embedAd(ad.id);
      if (ok) embedded++;
    }

    return success({ embedded, total: ads.length });
  } catch (e) {
    return error(`임베딩 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
