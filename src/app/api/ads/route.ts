import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const platform = searchParams.get("platform");
    const format = searchParams.get("format");
    const sort = searchParams.get("sort") || "latest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const query = searchParams.get("q");

    const where: Record<string, unknown> = {};

    if (category && category !== "전체") {
      where.category = category;
    }
    if (platform && platform !== "전체") {
      where.platform = platform;
    }
    if (format && format !== "전체") {
      where.format = format;
    }
    if (query) {
      where.OR = [
        { brand: { contains: query, mode: "insensitive" } },
        { copyText: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ];
    }

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case "likes":
        orderBy.likes = "desc";
        break;
      case "comments":
        orderBy.comments = "desc";
        break;
      default:
        orderBy.startDate = "desc";
    }

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ad.count({ where }),
    ]);

    return success({
      ads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    return error(`Failed to fetch ads: ${e instanceof Error ? e.message : e}`, 500);
  }
}
