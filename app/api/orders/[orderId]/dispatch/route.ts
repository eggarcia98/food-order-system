import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpError, jsonError, parseJsonBody, parsePositiveInt } from "@/lib/api/http";
export const runtime = "edge";

export async function PUT(
    request: Request,
    ctx: RouteContext<"/api/orders/[orderId]/dispatch">,
) {
    try {
        const { orderId } = await ctx.params;
        const id = parsePositiveInt(orderId, "order ID");
        const body = await parseJsonBody<Record<string, unknown>>(request);
        const data: { status_id?: number; is_info_sent?: boolean } = {};

        if (body.status_id !== undefined) {
            data.status_id = parsePositiveInt(body.status_id, "status ID");
        }
        if (body.is_info_sent !== undefined) {
            if (typeof body.is_info_sent !== "boolean") {
                throw new HttpError("is_info_sent must be a boolean", 400);
            }
            data.is_info_sent = body.is_info_sent;
        }
        if (Object.keys(data).length === 0) {
            throw new HttpError("No fields to update", 400);
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data,
        });

        return NextResponse.json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        return jsonError(error, "Failed to update order status");
    }
}
