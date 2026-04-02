import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * GET /api/instagram/insights?brandId=xxx
 * AI 기반 브랜드 인스타그램 콘텐츠 인사이트
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    if (!brandId) return error("brandId가 필요합니다.");

    const brand = await prisma.monitorBrand.findFirst({
      where: { id: brandId, userId: user.id },
      include: {
        instagramPosts: {
          orderBy: { likes: "desc" },
          take: 20,
        },
        followers: {
          orderBy: { recordedAt: "desc" },
          take: 7,
        },
      },
    });

    if (!brand) return error("브랜드를 찾을 수 없습니다.", 404);

    if (brand.instagramPosts.length < 5) {
      return success({
        brandName: brand.brandName,
        insight: "게시물이 5개 미만이어서 분석할 데이터가 충분하지 않습니다. 더 많은 게시물이 수집되면 인사이트를 제공해드릴게요.",
        topPatterns: [],
        recommendation: "",
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-xxxxx") {
      return success({
        brandName: brand.brandName,
        insight: "AI 분석을 위해 ANTHROPIC_API_KEY 환경변수가 필요합니다.",
        topPatterns: [],
        recommendation: "",
      });
    }

    // 분석 데이터 구성
    const postSummary = brand.instagramPosts
      .map(
        (p, i) =>
          `${i + 1}. [${p.contentType}] 좋아요 ${p.likes} / 댓글 ${p.comments}\n   캡션: ${(p.caption || "").slice(0, 200)}`
      )
      .join("\n");

    const followerTrend = brand.followers
      .map((f) => `${f.recordedAt.toISOString().slice(0, 10)}: ${f.followers}명`)
      .join(", ");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `인스타그램 브랜드 @${brand.instagramHandle}의 콘텐츠를 분석해줘.

게시물 (좋아요 높은 순):
${postSummary}

팔로워 추이: ${followerTrend || "데이터 없음"}

다음 형식으로 한국어 분석 결과를 JSON으로 반환해:
{
  "insight": "3줄 이내 전체 요약",
  "topPatterns": ["반응 좋은 콘텐츠 패턴 1", "패턴 2", "패턴 3"],
  "recommendation": "콘텐츠 전략 추천 1-2줄"
}

JSON만 반환해.`,
          },
        ],
      }),
    });

    const result = await response.json();
    const text = result.content?.[0]?.text || "";

    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { insight: text, topPatterns: [], recommendation: "" };
    } catch {
      analysis = { insight: text, topPatterns: [], recommendation: "" };
    }

    return success({
      brandName: brand.brandName,
      ...analysis,
    });
  } catch (e) {
    return error(`분석 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
