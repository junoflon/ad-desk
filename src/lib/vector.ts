import { prisma } from "@/lib/prisma";

/**
 * 벡터 유사도 검색
 * OpenAI embeddings API로 생성된 1536차원 벡터를 기반으로
 * 코사인 유사도가 높은 광고를 검색합니다.
 *
 * 사용법:
 * 1. OPENAI_API_KEY를 .env에 설정
 * 2. POST /api/ads/embed 로 기존 광고에 embedding 생성
 * 3. 검색 시 쿼리를 embedding으로 변환 → 유사도 검색
 */

const OPENAI_EMBED_MODEL = "text-embedding-3-small";

/**
 * 텍스트를 벡터로 변환 (OpenAI Embeddings API)
 */
export async function getEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_EMBED_MODEL,
        input: text.slice(0, 8000),
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.embedding || null;
  } catch {
    return null;
  }
}

/**
 * 광고의 텍스트 정보를 하나의 문자열로 합침
 */
export function adToText(ad: {
  brand: string;
  copyText?: string | null;
  category?: string | null;
  platform: string;
}): string {
  return [ad.brand, ad.category, ad.platform, ad.copyText]
    .filter(Boolean)
    .join(" ");
}

/**
 * 특정 광고에 embedding을 저장
 */
export async function embedAd(adId: string): Promise<boolean> {
  const ad = await prisma.ad.findUnique({ where: { id: adId } });
  if (!ad) return false;

  const text = adToText(ad);
  const embedding = await getEmbedding(text);
  if (!embedding) return false;

  const vectorStr = `[${embedding.join(",")}]`;
  await prisma.$executeRawUnsafe(
    `UPDATE "Ad" SET embedding = $1::vector WHERE id = $2`,
    vectorStr,
    adId
  );
  return true;
}

/**
 * 벡터 유사도 검색 - 쿼리와 가장 유사한 광고 반환
 */
export async function searchSimilar(queryText: string, limit = 20) {
  const embedding = await getEmbedding(queryText);
  if (!embedding) return null;

  const vectorStr = `[${embedding.join(",")}]`;
  const results = await prisma.$queryRawUnsafe(
    `SELECT id, brand, "copyText", category, platform, format, likes, comments, shares,
            "startDate", "endDate", "isActive", "imageUrl",
            1 - (embedding <=> $1::vector) AS similarity
     FROM "Ad"
     WHERE embedding IS NOT NULL
     ORDER BY embedding <=> $1::vector
     LIMIT $2`,
    vectorStr,
    limit
  );

  return results;
}
