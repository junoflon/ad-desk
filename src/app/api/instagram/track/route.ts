import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * POST /api/instagram/track
 * 브랜드 인스타그램 트래킹 등록
 * body: { instagramHandle, brandName?, categoryId? }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    const body = await request.json();
    const { instagramHandle, brandName, categoryId } = body;

    if (!instagramHandle) return error("인스타그램 핸들을 입력해주세요.");

    const cleanHandle = instagramHandle.replace(/^@/, "").trim();
    if (!/^[\w.]{1,30}$/.test(cleanHandle)) {
      return error("올바른 인스타그램 핸들을 입력해주세요. (영문, 숫자, 밑줄, 마침표만 가능)");
    }

    // 이미 등록된 핸들인지 확인
    const existing = await prisma.monitorBrand.findFirst({
      where: {
        userId: user.id,
        platform: "instagram",
        instagramHandle: cleanHandle,
      },
    });
    if (existing) return error("이미 트래킹 중인 계정입니다.");

    const brand = await prisma.monitorBrand.create({
      data: {
        brandName: brandName || `@${cleanHandle}`,
        platform: "instagram",
        instagramHandle: cleanHandle,
        brandUrl: `https://www.instagram.com/${cleanHandle}/`,
        categoryId: categoryId || null,
        userId: user.id,
      },
    });

    return success(brand, 201);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return error("이미 모니터링 중인 브랜드입니다.");
    }
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

/**
 * DELETE /api/instagram/track
 * 트래킹 해제
 * body: { brandId }
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return error("로그인이 필요합니다.", 401);

    const { brandId } = await request.json();
    if (!brandId) return error("brandId가 필요합니다.");

    await prisma.monitorBrand.deleteMany({
      where: { id: brandId, userId: user.id, platform: "instagram" },
    });

    return success({ deleted: true });
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}
