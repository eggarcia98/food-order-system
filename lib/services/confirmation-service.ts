/**
 * Order Confirmation Service
 * Handles business logic for order confirmation operations
 */

import { prisma } from "@/lib/prisma";
import type { Order, FulfillmentType } from "@/lib/domain";

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

interface OrderWithDetails extends Order {
    customer: any;
    fulfillment_type: FulfillmentType | null;
    order_items: any[];
    order_item_extras: any[];
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
        const error = new Error("Invalid confirmation code");
        (error as any).status = 400;
        throw error;
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
        const error = new Error("Confirmation link not found");
        (error as any).status = 404;
        throw error;
    }

    if (isLinkExpired(link.expires_at)) {
        const error = new Error("Confirmation link expired");
        (error as any).status = 410;
        throw error;
    }

    if (link.used_at) {
        const error = new Error("This confirmation link has already been used");
        (error as any).status = 410;
        throw error;
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
        include: {
            order: {
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
                    status: true
                },
            },
        },
    });

    if (!link) {
        const error = new Error("Confirmation link not found");
        (error as any).status = 404;
        throw error;
    }

    if (isLinkExpired(link.expires_at)) {
        const error = new Error("Confirmation link expired");
        (error as any).status = 410;
        throw error;
    }

    const fulfillmentTypes = await prisma.fulfillmentType.findMany({
        orderBy: { id: "asc" },
    });

    return {
        order: link.order,
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
        const error = new Error("Invalid arrival_from date");
        (error as any).status = 400;
        throw error;
    }

    if (Number.isNaN(arrivalTo.getTime())) {
        const error = new Error("Invalid arrival_to date");
        (error as any).status = 400;
        throw error;
    }

    // Update order
    const updatedOrder = await prisma.order.update({
        where: { id: link.order_id },
        data: {
            fulfillment_type_id: body.fulfillmentTypeId,
            arrival_from: arrivalFrom,
            arrival_to: arrivalTo,
            customer_confirmed_at: new Date(),
        },
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
            status: true
        },
    });

    // Mark confirmation link as used
    await prisma.order_confirmation_link.update({
        where: { token: code },
        data: { used_at: new Date() },
    });

    return updatedOrder;
}
