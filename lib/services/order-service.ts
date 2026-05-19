import { Prisma } from "@prisma/client/edge";
import { prisma } from "@/lib/prisma";
import { HttpError, getString, isRecord } from "@/lib/api/http";

type CreateOrderPayload = {
    client: {
        firstName: string;
        lastName: string;
        nationality?: { id?: number | null };
        phoneNumber: string;
    };
    mainItems: Array<{
        variant_id: number;
        price: number;
        quantity: number;
    }>;
    extraItems: Array<{
        extra_id: number;
        price: number;
        quantity: number;
    }>;
    comments?: string;
};

function toPositiveNumber(value: unknown, fieldName: string): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new HttpError(`${fieldName} must be greater than zero`, 400);
    }
    return parsed;
}

function toPositiveInt(value: unknown, fieldName: string): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(`${fieldName} must be a positive integer`, 400);
    }
    return parsed;
}

export function validateCreateOrderPayload(body: unknown): CreateOrderPayload {
    if (!isRecord(body) || !isRecord(body.client)) {
        throw new HttpError("Client information is required", 400);
    }

    const mainItems = Array.isArray(body.mainItems) ? body.mainItems : [];
    const extraItems = Array.isArray(body.extraItems) ? body.extraItems : [];

    if (mainItems.length === 0 && extraItems.length === 0) {
        throw new HttpError("At least one order item is required", 400);
    }

    const nationality = isRecord(body.client.nationality)
        ? { id: body.client.nationality.id == null ? null : toPositiveInt(body.client.nationality.id, "nationality id") }
        : undefined;

    return {
        client: {
            firstName: getString(body.client.firstName, "First name"),
            lastName: getString(body.client.lastName, "Last name"),
            phoneNumber: getString(body.client.phoneNumber, "Phone number"),
            nationality,
        },
        mainItems: mainItems.map((item, index) => {
            if (!isRecord(item)) throw new HttpError(`Invalid main item at index ${index}`, 400);
            return {
                variant_id: toPositiveInt(item.variant_id, "variant id"),
                price: toPositiveNumber(item.price, "main item price"),
                quantity: toPositiveInt(item.quantity, "main item quantity"),
            };
        }),
        extraItems: extraItems.map((item, index) => {
            if (!isRecord(item)) throw new HttpError(`Invalid extra item at index ${index}`, 400);
            return {
                extra_id: toPositiveInt(item.extra_id, "extra id"),
                price: toPositiveNumber(item.price, "extra item price"),
                quantity: toPositiveInt(item.quantity, "extra item quantity"),
            };
        }),
        comments: typeof body.comments === "string" ? body.comments.trim() : undefined,
    };
}

export async function createOrderWithConfirmation(payload: CreateOrderPayload) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                customer: {
                    connectOrCreate: {
                        where: { phone_number: payload.client.phoneNumber },
                        create: {
                            first_name: payload.client.firstName,
                            last_name: payload.client.lastName,
                            nationality_id: payload.client.nationality?.id ?? undefined,
                            phone_number: payload.client.phoneNumber,
                        },
                    },
                },
                order_code: `ORD-BRI${Date.now()}`,
                order_items: {
                    create: payload.mainItems.map((item) => ({
                        variant_id: item.variant_id,
                        quantity: item.quantity,
                        unit_price: item.price,
                    })),
                },
                order_item_extras: {
                    create: payload.extraItems.map((item) => ({
                        extra_id: item.extra_id,
                        quantity: item.quantity,
                        unit_price: item.price,
                    })),
                },
                comments: payload.comments,
            },
        });

        const confirmationLink = await tx.order_confirmation_link.create({
            data: {
                order_id: order.id,
                expires_at: expiresAt,
            } as Prisma.order_confirmation_linkUncheckedCreateInput,
            select: {
                id: true,
                order_id: true,
                token: true,
                expires_at: true,
                created_at: true,
            },
        });

        return { order, confirmationLink };
    });
}
