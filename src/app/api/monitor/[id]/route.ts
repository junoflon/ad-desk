import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brand = await prisma.monitorBrand.findUnique({
      where: { id },
      include: {
        monitorAds: {
          include: { ad: true },
          orderBy: { detectedAt: "desc" },
        },
      },
    });

    if (!brand) return error("Brand not found", 404);
    return success(brand);
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.monitorBrand.delete({ where: { id } });
    return success({ deleted: true });
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}
