import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api/auth";
import { HttpError, jsonError, parseJsonBody, parsePositiveInt } from "@/lib/api/http";

export const runtime = "edge";

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
    requireAuth(request);

    const { id } = await ctx.params;
    const itemId = parsePositiveInt(id, "menu item ID");

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const { name, description, is_active, img_url } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        throw new HttpError("Invalid name provided", 400);
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description ? String(description).trim() : null;
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        throw new HttpError("is_active must be a boolean", 400);
      }
      updateData.is_active = is_active;
    }

    if (img_url !== undefined) {
      updateData.img_url = img_url ? String(img_url).trim() : null;
    }

    if (Object.keys(updateData).length === 0) {
      throw new HttpError("No fields to update", 400);
    }

    const updatedItem = await prisma.menuItems.update({
      where: { id: itemId },
      data: updateData,
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

    return jsonError(error, "Failed to update menu item");
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
    requireAuth(request);

    const { id } = await ctx.params;
    const itemId = parsePositiveInt(id, "menu item ID");

    const body = await parseJsonBody<Record<string, unknown>>(request);
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
    return jsonError(error, "Failed to create variant");
  }
}
