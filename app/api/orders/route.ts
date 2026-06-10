import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseJsonBody } from "@/lib/api/http";
import {
    createOrderWithConfirmation,
    validateCreateOrderPayload,
} from "@/lib/services/order-service";

export const runtime = "edge";

export async function POST(request: Request) {
    try {
        const body = await parseJsonBody(request);
        const payload = validateCreateOrderPayload(body);
        return NextResponse.json(await createOrderWithConfirmation(payload));
    } catch (error) {
        return jsonError(error, "Error creating order");
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
                order_items: {
                    include: {
                        ItemVariant: {
                            include: {
                                MenuItem: true,
                            },
                        },
                    },
                },
                order_item_extras: {
                    include: {
                        MenuExtras: true,
                    },
                },
                fulfillment_type: true,
                status: true,
                order_confirmation_link: {
                    select: {
                        token: true,
                    },
                },
            },
        });

        const blockedDomain =
            process.env.BLOCKED_DOMAIN?.replace(/\/+$/, "") ?? "";
        const origin = blockedDomain ? `https://${blockedDomain}` : "";

        const ordersWithConfirmationLink = orders.map((order) => ({
            ...order,
            confirmationLinkUrl:
                origin && order.order_confirmation_link[0]?.token
                    ? `${origin}/order-confirm/${order.order_confirmation_link[0].token}`
                    : null,
        }));

        return NextResponse.json(ordersWithConfirmationLink);
    } catch (error) {
        return jsonError(error, "Failed to fetch orders");
    }
}
