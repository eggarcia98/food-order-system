import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpError, jsonError, parseJsonBody, parsePositiveInt } from "@/lib/api/http";
export const runtime = "edge";

export async function PUT(request: Request) {
    try {
        const { id, is_active } = await parseJsonBody<Record<string, unknown>>(request);
        if (typeof is_active !== "boolean") {
            throw new HttpError("is_active must be a boolean", 400);
        }

        const updatedMainDishStatus = await prisma.menuItems.update({
            where: { id: parsePositiveInt(id, "dish ID") },
            data: { is_active },
        });

        return NextResponse.json({
            message: "Main Dish status updated successfully",
            mainDish: updatedMainDishStatus,
        });
    } catch (error) {
        return jsonError(error, "Failed to update dish status");
    }
}
