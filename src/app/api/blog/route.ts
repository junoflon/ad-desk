import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { published: true };
    if (category && category !== "전체") {
      where.category = category;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        coverImage: true,
        publishedAt: true,
      },
    });

    return success(posts);
  } catch (e) {
    return error(`Failed to fetch posts: ${e instanceof Error ? e.message : e}`, 500);
  }
}
