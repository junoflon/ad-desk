import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

const SYSTEM_PROMPT = `당신은 광고 소재 검색 시스템의 쿼리 분석 엔진입니다.
사용자가 입력한 자연어 검색어를 분석하여 DB 검색에 사용할 구조화된 데이터를 추출합니다.

DB에 저장된 광고 데이터 필드:
- brand: 브랜드명 (올리브영, 무신사, 나이키, 토스, 쿠팡, 배달의민족, 삼성전자 등)
- category: 업종 (뷰티, 패션, 푸드/배달, 금융, 이커머스, 스포츠, 여행, 테크, F&B, 라이프스타일, 자동차, 식품)
- platform: 플랫폼 (instagram, facebook)
- format: 포맷 (이미지, 비디오, 캐러셀)
- copyText: 광고 카피 텍스트
- isActive: 게재 여부

분석 규칙:
1. 검색어에서 브랜드명, 업종, 플랫폼, 포맷, 무드/톤, 시즌 등을 추출
2. 직접 매칭되지 않는 추상적 표현도 해석 (예: "깔끔한" → 미니멀, 화이트톤 관련 키워드)
3. 경쟁사 분석 의도를 파악 (예: "올리브영 경쟁사" → 뷰티 카테고리 다른 브랜드들)
4. 시즌/이벤트 키워드 해석 (예: "봄 캠페인" → 봄, 시즌, 신상)

반드시 아래 JSON 형태로만 응답하세요. 다른 텍스트 없이 JSON만:
{
  "keywords": ["DB 검색에 사용할 키워드 목록"],
  "categories": ["매칭되는 업종 카테고리"],
  "platforms": ["매칭되는 플랫폼"],
  "formats": ["매칭되는 포맷"],
  "intent": "검색 의도 한줄 설명",
  "suggested": ["연관 추천 검색어 3개"]
}`;

interface AiResponse {
  keywords: string[];
  categories: string[];
  platforms: string[];
  formats: string[];
  intent: string;
  suggested: string[];
}

async function analyzeWithAI(query: string): Promise<AiResponse | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "sk-ant-xxxxx") return null;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: `검색어: "${query}"` },
        ],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as AiResponse;
  } catch {
    return null;
  }
}

function fallbackAnalyze(query: string) {
  const keywords = query
    .split(/[\s,]+/)
    .filter((k) => k.length > 0);

  return {
    keywords,
    categories: [] as string[],
    platforms: [] as string[],
    formats: [] as string[],
    intent: `"${query}" 키워드 검색`,
    suggested: [] as string[],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body;

    if (!query) {
      return error("검색어를 입력해주세요.");
    }

    // AI 분석 시도, 실패 시 폴백
    const analysis = (await analyzeWithAI(query)) || fallbackAnalyze(query);
    const isAiPowered = !!process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "sk-ant-xxxxx";

    // 키워드 기반 OR 검색 조건
    const orConditions = analysis.keywords.flatMap((term: string) => [
      { brand: { contains: term, mode: "insensitive" as const } },
      { copyText: { contains: term, mode: "insensitive" as const } },
      { category: { contains: term, mode: "insensitive" as const } },
    ]);

    const where: Record<string, unknown> = {};

    if (orConditions.length > 0) {
      where.OR = orConditions;
    }

    // AI가 추출한 카테고리/플랫폼/포맷 적용
    if (analysis.categories.length === 1) {
      where.category = analysis.categories[0];
    } else if (analysis.categories.length > 1) {
      where.category = { in: analysis.categories };
    }

    if (analysis.platforms.length === 1) {
      where.platform = analysis.platforms[0];
    } else if (analysis.platforms.length > 1) {
      where.platform = { in: analysis.platforms };
    }

    if (analysis.formats.length === 1) {
      where.format = analysis.formats[0];
    } else if (analysis.formats.length > 1) {
      where.format = { in: analysis.formats };
    }

    // 사용자 수동 필터 (AI 분석보다 우선)
    if (filters?.category && filters.category !== "전체") {
      where.category = filters.category;
    }
    if (filters?.platform && filters.platform !== "전체") {
      where.platform = filters.platform;
    }
    if (filters?.format && filters.format !== "전체") {
      where.format = filters.format;
    }

    const ads = await prisma.ad.findMany({
      where,
      orderBy: { likes: "desc" },
      take: 40,
    });

    return success({
      ads,
      query,
      analysis: {
        keywords: analysis.keywords,
        intent: analysis.intent,
        suggested: analysis.suggested,
        isAiPowered,
      },
      total: ads.length,
    });
  } catch (e) {
    return error(
      `Search failed: ${e instanceof Error ? e.message : e}`,
      500
    );
  }
}
