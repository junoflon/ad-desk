import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

export async function GET() {
  try {
    const items = await prisma.faqItem.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    // Group by category
    const grouped = items.reduce<Record<string, { q: string; a: string }[]>>(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push({ q: item.question, a: item.answer });
        return acc;
      },
      {}
    );

    const sections = Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }));

    return success(sections);
  } catch (e) {
    return error(`Failed to fetch FAQ: ${e instanceof Error ? e.message : e}`, 500);
  }
}
