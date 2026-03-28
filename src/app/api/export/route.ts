import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/export?type=ads|board&boardId=xxx
 * 광고 데이터를 CSV로 내보내기
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "ads";
  const boardId = searchParams.get("boardId");
  const query = searchParams.get("q");

  try {
    let ads;

    if (type === "board" && boardId) {
      const boardAds = await prisma.boardAd.findMany({
        where: { boardId },
        include: { ad: true },
      });
      ads = boardAds.map((ba) => ba.ad);
    } else {
      const where: Record<string, unknown> = {};
      if (query) {
        where.OR = [
          { brand: { contains: query, mode: "insensitive" } },
          { copyText: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ];
      }
      ads = await prisma.ad.findMany({
        where,
        orderBy: { likes: "desc" },
        take: 500,
      });
    }

    // CSV 생성
    const headers = [
      "브랜드",
      "플랫폼",
      "업종",
      "포맷",
      "카피",
      "좋아요",
      "댓글",
      "공유",
      "상태",
      "게재시작",
      "게재종료",
    ];

    const rows = ads.map((ad) =>
      [
        ad.brand,
        ad.platform,
        ad.category || "",
        ad.format || "",
        `"${(ad.copyText || "").replace(/"/g, '""')}"`,
        ad.likes,
        ad.comments,
        ad.shares,
        ad.isActive ? "게재중" : "종료",
        ad.startDate ? new Date(ad.startDate).toLocaleDateString("ko-KR") : "",
        ad.endDate ? new Date(ad.endDate).toLocaleDateString("ko-KR") : "",
      ].join(",")
    );

    const bom = "\uFEFF"; // UTF-8 BOM for Excel
    const csv = bom + headers.join(",") + "\n" + rows.join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="ad-desk-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: `내보내기 실패: ${e instanceof Error ? e.message : e}` },
      { status: 500 }
    );
  }
}
