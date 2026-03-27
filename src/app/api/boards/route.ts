import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

// TODO: Replace with actual auth when login is implemented
const DEMO_USER_EMAIL = "demo@snipit.im";

async function getDemoUser() {
  return prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
}

export async function GET() {
  try {
    const user = await getDemoUser();
    if (!user) return error("User not found", 401);

    const boards = await prisma.board.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { boardAds: true } },
        folder: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return success(boards);
  } catch (e) {
    return error(`Failed to fetch boards: ${e instanceof Error ? e.message : e}`, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getDemoUser();
    if (!user) return error("User not found", 401);

    const body = await request.json();
    const { name, description, isPublic, folderId } = body;

    if (!name) return error("보드 이름을 입력해주세요.");

    const board = await prisma.board.create({
      data: {
        name,
        description: description || null,
        isPublic: isPublic || false,
        folderId: folderId || null,
        userId: user.id,
      },
    });

    return success(board, 201);
  } catch (e) {
    return error(`Failed to create board: ${e instanceof Error ? e.message : e}`, 500);
  }
}
