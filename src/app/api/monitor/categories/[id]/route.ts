import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const category = await prisma.monitorCategory.update({
      where: { id },
      data: body,
    });
    return success(category);
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
    await prisma.monitorCategory.delete({ where: { id } });
    return success({ deleted: true });
  } catch (e) {
    return error(`Failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}
