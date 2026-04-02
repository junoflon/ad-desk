import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-helpers";
import { crawlInstagramProfile } from "@/lib/instagram-crawler";
import { NextRequest } from "next/server";

/**
 * POST /api/instagram/collect
 * 인스타그램 게시물 수집 (수동 트리거 또는 크론에서 호출)
 * body: { brandId? } — brandId 없으면 전체 active 브랜드 수집
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    let body: { brandId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // body 없이 호출 시 전체 수집
    }

    const where = body.brandId
      ? { id: body.brandId, userId: user.id, platform: "instagram" as const, isActive: true }
      : { userId: user.id, platform: "instagram" as const, isActive: true };

    const brands = await prisma.monitorBrand.findMany({ where });

    if (brands.length === 0) {
      return success({ message: "수집할 브랜드가 없습니다.", results: [] });
    }

    const results: { brand: string; handle: string; newPosts: number; error?: string }[] = [];

    for (const brand of brands) {
      if (!brand.instagramHandle) continue;

      try {
        const crawl = await crawlInstagramProfile(brand.instagramHandle);

        if (!crawl.success) {
          // 연속 실패 감지 — 3회 연속 실패 시 비활성화
          results.push({
            brand: brand.brandName,
            handle: brand.instagramHandle,
            newPosts: 0,
            error: crawl.error,
          });
          continue;
        }

        // 프로필 스냅샷 저장
        await prisma.followerSnapshot.create({
          data: {
            monitorBrandId: brand.id,
            followers: crawl.profile.followers,
            following: crawl.profile.following,
            posts: crawl.profile.posts,
          },
        });

        // 게시물 upsert
        let newCount = 0;
        for (const post of crawl.posts) {
          const result = await prisma.instagramPost.upsert({
            where: {
              monitorBrandId_shortcode: {
                monitorBrandId: brand.id,
                shortcode: post.shortcode,
              },
            },
            create: {
              monitorBrandId: brand.id,
              shortcode: post.shortcode,
              caption: post.caption || null,
              imageUrl: post.imageUrl || null,
              videoUrl: post.videoUrl || null,
              contentType: post.contentType,
              likes: post.likes,
              comments: post.comments,
              postedAt: post.postedAt ? new Date(post.postedAt) : null,
            },
            update: {
              likes: post.likes || undefined,
              comments: post.comments || undefined,
              caption: post.caption || undefined,
            },
          });

          // 새로 생성된 경우 카운트
          if (result.collectedAt.getTime() > Date.now() - 60000) {
            newCount++;
          }
        }

        // lastCrawledAt 업데이트
        await prisma.monitorBrand.update({
          where: { id: brand.id },
          data: { lastCrawledAt: new Date() },
        });

        results.push({
          brand: brand.brandName,
          handle: brand.instagramHandle,
          newPosts: newCount,
        });
      } catch (e) {
        results.push({
          brand: brand.brandName,
          handle: brand.instagramHandle || "",
          newPosts: 0,
          error: e instanceof Error ? e.message : String(e),
        });
      }

      // rate limit 방지: 브랜드 간 3초 대기
      await new Promise((r) => setTimeout(r, 3000));
    }

    const totalNew = results.reduce((s, r) => s + r.newPosts, 0);

    return success({
      message: `${brands.length}개 브랜드에서 ${totalNew}건 새 게시물 수집 완료`,
      results,
    });
  } catch (e) {
    return error(`수집 실패: ${e instanceof Error ? e.message : e}`, 500);
  }
}
