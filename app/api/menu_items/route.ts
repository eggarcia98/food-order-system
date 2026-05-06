export const runtime = "edge";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Verify user is authenticated
 */
async function verifyAuth(request: Request): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const authTokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
    return authTokenMatch ? authTokenMatch[1] : null;
  } catch {
    return null;
  }
}

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
        return NextResponse.json({ error }, { status: 500 });
    }
}

/**
 * POST /api/menu_items
 * Create a new menu item
 * Requires authentication
 */
export async function POST(request: Request) {
    try {
        // Verify authentication
        const authToken = await verifyAuth(request);
        if (!authToken) {
            return NextResponse.json(
                { error: "Unauthorized - Authentication required" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { name, description, category_id, img_url, is_active } = body;

        // Validate input
        if (typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Menu item name is required" },
                { status: 400 },
            );
        }

        const newItem = await prisma.menuItems.create({
            data: {
                name: name.trim(),
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
        console.error("Error creating menu item:", error);
        return NextResponse.json(
            { error: "Failed to create menu item" },
            { status: 500 },
        );
    }
}
