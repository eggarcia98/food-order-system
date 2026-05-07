// app/api/orders/[orderId]/dispatch/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // or your db connection
export const runtime = "edge";

export async function PUT(_req: Request, { params }) {
    const { id, is_active } = await _req.json()
    console.log("Received request to toggle dish status:", { id, is_active });

    try {
        const updatedMainDishStatus = await prisma.menuItems.update({
            where: { id: Number(id) },
            data: {
                is_active: is_active,
            },
        });

        return NextResponse.json({
            message: "Main Dish status updated successfully",
            mainDish: updatedMainDishStatus,
        });
    } catch (error) {
        console.error("Error updating main dish status:", error);
        return NextResponse.json(
            { error: "Failed to update dish status" },
            { status: 500 }
        );
    }
}
