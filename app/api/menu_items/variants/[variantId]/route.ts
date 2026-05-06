import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";

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
 * PATCH /api/menu_items/variants/[variantId]
 * Update a variant (name, price, is_active)
 * Requires authentication
 */
export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/menu_items/variants/[variantId]">,
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

    const { variantId } = await ctx.params;
    const id = parseInt(variantId as string, 10);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid variant ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { variant_name, price, is_active } = body;

    // Build update data dynamically
    const updateData: any = {};

    if (variant_name !== undefined) {
      if (typeof variant_name !== "string" || variant_name.trim().length === 0) {
        return NextResponse.json(
          { error: "Invalid variant name" },
          { status: 400 },
        );
      }
      updateData.variant_name = variant_name.trim();
    }

    if (price !== undefined) {
      const priceNum = parseFloat(String(price));
      if (Number.isNaN(priceNum) || priceNum <= 0) {
        return NextResponse.json(
          { error: "Invalid price provided" },
          { status: 400 },
        );
      }
      updateData.price = priceNum;
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        return NextResponse.json(
          { error: "is_active must be a boolean" },
          { status: 400 },
        );
      }
      updateData.is_active = is_active;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
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

    console.error("Error updating variant:", error);
    return NextResponse.json(
      { error: "Failed to update variant" },
      { status: 500 },
    );
  }
}
