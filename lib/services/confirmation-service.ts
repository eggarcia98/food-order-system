/**
 * Order Confirmation Service
 * Handles business logic for order confirmation operations
 */

import { prisma } from "@/lib/prisma";
import type { FulfillmentType } from "@/lib/domain";
import { HttpError } from "@/lib/api/http";

interface ConfirmationLinkData {
    token: string;
    expires_at: Date;
    used_at: Date | null;
    order_id: number;
}

interface ConfirmationRequestBody {
    fulfillmentTypeId: number;
    arrivalFrom: string;
    arrivalTo: string;
}

type OrderWithDetails = Awaited<ReturnType<typeof fetchOrderById>>;

async function fetchOrderById(orderId: number) {
    return prisma.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
            customer: true,
            fulfillment_type: true,
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
            status: true,
        },
    });
}

/**
 * Validates if a confirmation link has expired
 */
export function isLinkExpired(expiresAt: Date): boolean {
    return expiresAt.getTime() < Date.now();
}

/**
 * Fetch confirmation link with validation
 * Returns link data or throws error with HTTP status
 */
export async function getConfirmationLink(
    code: string,
): Promise<ConfirmationLinkData> {
    if (!code || Array.isArray(code)) {
        throw new HttpError("Invalid confirmation code", 400);
    }

    const link = await prisma.order_confirmation_link.findUnique({
        where: { token: code },
        select: {
            token: true,
            expires_at: true,
            used_at: true,
            order_id: true,
        },
    });

    if (!link) {
        throw new HttpError("Confirmation link not found", 404);
    }

    if (isLinkExpired(link.expires_at)) {
        throw new HttpError("Confirmation link expired", 410);
    }

    if (link.used_at) {
        throw new HttpError("This confirmation link has already been used", 410);
    }

    return link;
}

/**
 * Fetch order confirmation data (GET endpoint)
 */
export async function fetchConfirmationData(code: string): Promise<{
    order: OrderWithDetails;
    fulfillmentTypes: FulfillmentType[];
    link: {
        token: string;
        expires_at: Date;
        used_at: Date | null;
    };
}> {
    const link = await prisma.order_confirmation_link.findUnique({
        where: { token: code },
        select: {
            token: true,
            expires_at: true,
            used_at: true,
            order_id: true,
        },
    });

    if (!link) {
        throw new HttpError("Confirmation link not found", 404);
    }

    if (isLinkExpired(link.expires_at)) {
        throw new HttpError("Confirmation link expired", 410);
    }

    const fulfillmentTypes = await prisma.fulfillmentType.findMany({
        orderBy: { id: "asc" },
    });
    const order = await fetchOrderById(link.order_id);

    return {
        order,
        fulfillmentTypes,
        link: {
            token: link.token,
            expires_at: link.expires_at,
            used_at: link.used_at,
        },
    };
}

/**
 * Confirm order with fulfillment details (PATCH endpoint)
 */
export async function confirmOrder(
    code: string,
    body: ConfirmationRequestBody,
): Promise<OrderWithDetails> {
    // Validate and retrieve link first
    const link = await getConfirmationLink(code);

    // Parse and validate dates
    const arrivalFrom = new Date(body.arrivalFrom);
    const arrivalTo = new Date(body.arrivalTo);

    if (Number.isNaN(arrivalFrom.getTime())) {
        throw new HttpError("Invalid arrival_from date", 400);
    }

    if (Number.isNaN(arrivalTo.getTime())) {
        throw new HttpError("Invalid arrival_to date", 400);
    }

    // Update order
    await prisma.order.update({
        where: { id: link.order_id },
        data: {
            fulfillment_type_id: body.fulfillmentTypeId,
            arrival_from: arrivalFrom,
            arrival_to: arrivalTo,
            customer_confirmed_at: new Date(),
        },
    });

    // Mark confirmation link as used
    await prisma.order_confirmation_link.update({
        where: { token: code },
        data: { used_at: new Date() },
    });

    return fetchOrderById(link.order_id);
}
