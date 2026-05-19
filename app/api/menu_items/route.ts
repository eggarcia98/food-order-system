export const runtime = "edge";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api/auth";
import { getString, jsonError, parseJsonBody } from "@/lib/api/http";
import { NextResponse } from "next/server";

/**
 * GET /api/menu_items
 * Fetch all menu items (public)
 */
export async function GET() {
    try {
        const items = await prisma.menuItems.findMany({
            include: {
                item_variants: true,
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

/**
 * POST /api/menu_items
 * Create a new menu item
 * Requires authentication
 */
export async function POST(request: Request) {
    try {
        requireAuth(request);
        const body = await parseJsonBody<Record<string, unknown>>(request);
        const { name, description, category_id, img_url, is_active } = body;

        const newItem = await prisma.menuItems.create({
            data: {
                name: getString(name, "Menu item name"),
                description: description ? String(description).trim() : undefined,
                category_id: category_id ? parseInt(String(category_id), 10) : undefined,
                img_url: img_url ? String(img_url).trim() : undefined,
                is_active: typeof is_active === "boolean" ? is_active : true,
            },
            include: {
                item_variants: true,
            },
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return jsonError(error, "Failed to create menu item");
    }
}
