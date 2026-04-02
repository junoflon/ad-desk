import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * GET /api/instagram/folders
 * 폴더(카테고리)별 인스타그램 브랜드 + 게시물 통계
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    const categories = await prisma.monitorCategory.findMany({
      where: { userId: user.id },
      include: {
        brands: {
          where: { platform: "instagram" },
          include: {
            _count: { select: { instagramPosts: true } },
            instagramPosts: {
              orderBy: { likes: "desc" },
              take: 3,
            },
            followers: {
              orderBy: { recordedAt: "desc" },
              take: 2, // 최근 2개로 변화량 계산
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // 카테고리 미지정 브랜드도 포함
    const uncategorized = await prisma.monitorBrand.findMany({
      where: {
        userId: user.id,
        platform: "instagram",
        categoryId: null,
      },
      include: {
        _count: { select: { instagramPosts: true } },
        instagramPosts: {
          orderBy: { likes: "desc" },
          take: 3,
        },
        followers: {
          orderBy: { recordedAt: "desc" },
          take: 2,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 폴더 데이터 가공
    const folders = categories
      .filter((c) => c.brands.length > 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
        brands: c.brands.map(formatBrand),
        totalPosts: c.brands.reduce((s, b) => s + b._count.instagramPosts, 0),
      }));

    // 미분류 폴더 추가
    if (uncategorized.length > 0) {
      folders.push({
        id: "uncategorized",
        name: "미분류",
        color: "#6B7280",
        brands: uncategorized.map(formatBrand),
        totalPosts: uncategorized.reduce((s, b) => s + b._count.instagramPosts, 0),
      });
    }

    // 전체 통계
    const totalBrands = folders.reduce((s, f) => s + f.brands.length, 0);
    const totalPosts = folders.reduce((s, f) => s + f.totalPosts, 0);

    return success({ folders, stats: { totalBrands, totalPosts, totalFolders: folders.length } });
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

function formatBrand(b: {
  id: string;
  brandName: string;
  instagramHandle: string | null;
  isActive: boolean;
  lastCrawledAt: Date | null;
  _count: { instagramPosts: number };
  instagramPosts: { shortcode: string; imageUrl: string | null; likes: number; caption: string | null }[];
  followers: { followers: number; following: number; posts: number; recordedAt: Date }[];
}) {
  const latestFollowers = b.followers[0];
  const prevFollowers = b.followers[1];
  const followerChange = latestFollowers && prevFollowers
    ? latestFollowers.followers - prevFollowers.followers
    : 0;

  return {
    id: b.id,
    brandName: b.brandName,
    instagramHandle: b.instagramHandle,
    isActive: b.isActive,
    lastCrawledAt: b.lastCrawledAt,
    postCount: b._count.instagramPosts,
    topPosts: b.instagramPosts,
    followers: latestFollowers?.followers || 0,
    followerChange,
    postsCount: latestFollowers?.posts || 0,
  };
}
