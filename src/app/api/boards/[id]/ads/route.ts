import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: boardId } = await params;
    const body = await request.json();
    const { adId, note } = body;

    if (!adId) return error("adId is required");

    const boardAd = await prisma.boardAd.create({
      data: {
        boardId,
        adId,
        note: note || null,
      },
      include: { ad: true },
    });

    return success(boardAd, 201);
  } catch (e) {
    if (
      e instanceof Error &&
      e.message.includes("Unique constraint")
    ) {
      return error("이미 보드에 저장된 광고입니다.");
    }
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: boardId } = await params;
    const { searchParams } = request.nextUrl;
    const adId = searchParams.get("adId");

    if (!adId) return error("adId is required");

    await prisma.boardAd.delete({
      where: { boardId_adId: { boardId, adId } },
    });

    return success({ deleted: true });
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}
