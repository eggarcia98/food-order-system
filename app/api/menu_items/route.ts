import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api/http";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /api/menu_items
 * Fetch active menu items and variants for the public client app.
 */
export async function GET() {
    try {
        const items = await prisma.menuItems.findMany({
            where: {
                is_active: true,
            },
            include: {
                item_variants: {
                    where: {
                        is_active: true,
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
        });

        return NextResponse.json(items);
    } catch (error) {
        return jsonError(error, "Failed to fetch menu items");
    }
}
