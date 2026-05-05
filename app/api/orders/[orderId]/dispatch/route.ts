// app/api/orders/[orderId]/dispatch/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // or your db connection
export const runtime = "edge";

export async function PUT(_req: Request, { params }) {
    const { orderId } = params;

    const {status_id, is_info_sent} = await _req.json()
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { status_id, is_info_sent }, 
        });

        return NextResponse.json({
            message: "Order status updated successfully",
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
