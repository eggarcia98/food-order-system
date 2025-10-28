// app/api/orders/[orderId]/dispatch/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // or your db connection


export async function PUT(_req: Request, { params }) {
    const { orderId } = params;

    // Get status_id from body if needed
    const { status_id } = await _req.json()

    try {
        // Update your order status to "dispatched"
        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { status_id }, // adjust to your field name
        });

        return NextResponse.json({
            message: "Order dispatched successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        );
    }
}
