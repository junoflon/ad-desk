import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { searchMetaAds, metaAdToDbFormat } from "@/lib/meta";
import { notifyCollectionComplete } from "@/lib/notify";

/**
 * POST /api/collect/monitor
 * 등록된 모니터링 브랜드 전체에 대해 광고를 수집하고
 * MonitorAd에 연결합니다.
 *
 * 크론잡이나 수동으로 호출하여 사용합니다.
 */
export async function POST() {
  try {
    const token = process.env.META_AD_LIBRARY_TOKEN;
    if (!token) {
      return error("Meta API 토큰이 설정되지 않았습니다.", 400);
    }

    // 활성 모니터링 브랜드 조회
    const brands = await prisma.monitorBrand.findMany({
      where: { isActive: true },
    });

    if (brands.length === 0) {
      return success({ message: "모니터링 중인 브랜드가 없습니다.", results: [] });
    }

    const results = [];

    for (const brand of brands) {
      try {
        // Meta API에서 브랜드명으로 광고 검색
        const metaAds = await searchMetaAds({
          searchTerms: brand.brandName,
          limit: 10,
        });

        let newAds = 0;

        for (const metaAd of metaAds) {
          const adData = metaAdToDbFormat(metaAd);

          // 광고 저장 (upsert 대신 create + catch로 중복 처리)
          let ad;
          try {
            ad = await prisma.ad.create({ data: adData });
          } catch {
            // 이미 존재하는 광고면 brand + copyText로 찾기
            const existing = await prisma.ad.findFirst({
              where: {
                brand: adData.brand,
                copyText: adData.copyText,
              },
            });
            if (existing) {
              ad = existing;
            } else {
              continue;
            }
          }

          // MonitorAd 연결 (중복 무시)
          try {
            await prisma.monitorAd.create({
              data: {
                monitorBrandId: brand.id,
                adId: ad.id,
              },
            });
            newAds++;
          } catch {
            // 이미 연결된 광고는 무시
          }
        }

        results.push({
          brand: brand.brandName,
          searched: metaAds.length,
          newAds,
        });
      } catch (e) {
        results.push({
          brand: brand.brandName,
          searched: 0,
          newAds: 0,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    const totalNew = results.reduce((sum, r) => sum + r.newAds, 0);

    // 신규 광고 알림
    await notifyCollectionComplete(results);

    return success({
      message: `${brands.length}개 브랜드 스캔 완료, ${totalNew}개 신규 광고`,
      results,
    });
  } catch (e) {
    return error(`모니터링 수집 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
