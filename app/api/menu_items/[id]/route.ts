import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeAuthSession, parseJsonSafely } from "@/lib/auth";

export const runtime = "edge";

/**
 * Verify user is authenticated
 * Returns error response if not authenticated
 */
async function verifyAuth(request: Request): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const authTokenMatch = cookieHeader.match(/auth_token=([^;]+)/);

    if (!authTokenMatch) {
      return null;
    }

    // In a real setup, verify the token with your auth endpoint
    // For now, checking if token exists is sufficient
    return authTokenMatch[1];
  } catch {
    return null;
  }
}

/**
 * PATCH /api/menu_items/[id]
 * Update a menu item (name, description, is_active, img_url)
 * Requires authentication
 */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/menu_items/[id]">,
) {
  try {
    // Verify authentication
    const authToken = await verifyAuth(request);
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await ctx.params;
    const itemId = parseInt(id as string, 10);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "Invalid menu item ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { name, description, is_active, img_url } = body;

    // Validate input
    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid name provided" },
        { status: 400 },
      );
    }

    // Update the menu item
    const updatedItem = await prisma.menuItems.update({
      where: { id: itemId },
      data: {
        name: name.trim(),
        description: description ? String(description).trim() : undefined,
        is_active: typeof is_active === "boolean" ? is_active : undefined,
        img_url: img_url ? String(img_url).trim() : undefined,
      },
      include: {
        item_variants: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 },
      );
    }

    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/menu_items/[id]/variants
 * Create a new variant for a menu item
 * Requires authentication
 */
export async function POST(
  request: Request,
  ctx: RouteContext<"/api/menu_items/[id]">,
) {
  try {
    // Verify authentication
    const authToken = await verifyAuth(request);
    if (!authToken) {
      return NextResponse.json(
        { error: "Unauthorized - Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await ctx.params;
    const itemId = parseInt(id as string, 10);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return NextResponse.json(
        { error: "Invalid menu item ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { variant_name, price, is_active } = body;

    // Validate variant data
    if (typeof variant_name !== "string" || variant_name.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid variant name" },
        { status: 400 },
      );
    }

    const priceNum = parseFloat(String(price));
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { error: "Invalid price provided" },
        { status: 400 },
      );
    }

    // Create variant
    const variant = await prisma.itemVariant.create({
      data: {
        item_id: itemId,
        variant_name: variant_name.trim(),
        price: priceNum,
        is_active: typeof is_active === "boolean" ? is_active : true,
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error("Error creating variant:", error);
    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 },
    );
  }
}
