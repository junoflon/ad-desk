import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body;

    if (!query) {
      return error("검색어를 입력해주세요.");
    }

    // AI-enhanced search: use Claude to interpret the query and extract search intent
    // For now, do smart text matching. When ANTHROPIC_API_KEY is set, this will use Claude.
    const apiKey = process.env.ANTHROPIC_API_KEY;
    let searchTerms: string[] = [query];
    let suggestedKeywords: string[] = [];

    if (apiKey && apiKey !== "sk-ant-xxxxx") {
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
            max_tokens: 300,
            messages: [
              {
                role: "user",
                content: `사용자가 광고 레퍼런스를 검색하려고 합니다. 검색어: "${query}"

이 검색 의도를 분석하여 다음 JSON 형태로만 응답해주세요:
{
  "keywords": ["검색에 사용할 키워드 목록 (브랜드명, 카테고리, 무드, 색상 등)"],
  "categories": ["관련 업종 카테고리"],
  "suggested": ["추천 검색어 3개"]
}`,
              },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.content?.[0]?.text || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            searchTerms = parsed.keywords || [query];
            suggestedKeywords = parsed.suggested || [];
          }
        }
      } catch {
        // Fallback to basic search if AI fails
      }
    }

    // Build search query from extracted terms
    const orConditions = searchTerms.flatMap((term: string) => [
      { brand: { contains: term, mode: "insensitive" as const } },
      { copyText: { contains: term, mode: "insensitive" as const } },
      { category: { contains: term, mode: "insensitive" as const } },
    ]);

    const where: Record<string, unknown> = {
      OR: orConditions,
    };

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
      searchTerms,
      suggestedKeywords,
      total: ads.length,
    });
  } catch (e) {
    return error(
      `Search failed: ${e instanceof Error ? e.message : e}`,
      500
    );
  }
}
