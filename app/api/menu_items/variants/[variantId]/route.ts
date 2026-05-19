import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api/auth";
import { HttpError, jsonError, parseJsonBody, parsePositiveInt } from "@/lib/api/http";

export const runtime = "edge";

/**
 * PATCH /api/menu_items/variants/[variantId]
 * Update a variant (name, price, is_active)
 * Requires authentication
 */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/menu_items/variants/[variantId]">,
) {
  try {
    requireAuth(request);

    const { variantId } = await ctx.params;
    const id = parsePositiveInt(variantId, "variant ID");

    const body = await parseJsonBody<Record<string, unknown>>(request);
    const { variant_name, price, is_active } = body;

    // Build update data dynamically
    const updateData: Record<string, unknown> = {};

    if (variant_name !== undefined) {
      if (typeof variant_name !== "string" || variant_name.trim().length === 0) {
        throw new HttpError("Invalid variant name", 400);
      }
      updateData.variant_name = variant_name.trim();
    }

    if (price !== undefined) {
      const priceNum = parseFloat(String(price));
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        throw new HttpError("Invalid price provided", 400);
      }
      updateData.price = priceNum;
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        throw new HttpError("is_active must be a boolean", 400);
      }
      updateData.is_active = is_active;
    }

    if (Object.keys(updateData).length === 0) {
      throw new HttpError("No fields to update", 400);
    }

    // Update the variant
    const updatedVariant = await prisma.itemVariant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedVariant);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 },
      );
    }

    return jsonError(error, "Failed to update variant");
  }
}
