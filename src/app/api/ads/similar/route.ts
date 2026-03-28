import { NextRequest } from "next/server";
import { success, error } from "@/lib/api";
import { searchSimilar } from "@/lib/vector";

/**
 * GET /api/ads/similar?q=검색어&limit=20
 * 벡터 유사도 기반 광고 검색
 */
export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

    if (!q) return error("검색어(q)가 필요합니다.");

    if (!process.env.OPENAI_API_KEY) {
      return error("OPENAI_API_KEY가 설정되지 않았습니다. 벡터 검색을 사용하려면 키를 설정해주세요.", 400);
    }

    const results = await searchSimilar(q, limit);
    if (!results) {
      return error("벡터 검색 실패 — 임베딩이 생성된 광고가 없을 수 있습니다.");
    }

    return success({ ads: results, query: q });
  } catch (e) {
    return error(`유사도 검색 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
