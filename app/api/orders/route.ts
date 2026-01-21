import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "edge";

interface OrderItem {
    mainItems: MenuItem[];
    extraItems: Extra[];
}

interface MenuItem {
    item_id: number;
    item_name: string;
    variant_id: number;
    variant_name: string;
    price: number;
    // img?: string;
    quantity: number;
}

interface Extra {
    extra_id: number;
    name: string;
    price: number;
    quantity: number;
}

export async function POST(request: Request) {
    try {
        const { client, comments, ...rest} = await request.json();

        const OrderItem: OrderItem = rest;

        const order = await prisma.order.create({
            data: {
                customer: {
                    connectOrCreate: {
                        where: {
                            phone_number: client.phoneNumber,
                        },
                        create: {
                            first_name: client.firstName,
                            last_name: client.lastName,
                            nationality_id: client?.nationality?.id,
                            phone_number: client.phoneNumber,
                            // email: client.email,
                        },
                    },
                },
                order_code: `ORD-BRI${Date.now()}`,
                order_items: {
                    create: OrderItem.mainItems.map((orderItem: MenuItem) => ({
                        variant_id: orderItem.variant_id,
                        quantity: orderItem.quantity,
                        unit_price: orderItem.price,
                    })),    
                },
                order_item_extras: {
                    create: OrderItem.extraItems.map((extraItem: Extra) => ({
                        extra_id: extraItem.extra_id,
                        quantity: extraItem.quantity,
                        unit_price: extraItem.price,
                    })),    
                },
                comments,
            },
            include: {
                // client: true,
                // dishes: true,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
                order_items: {
                    include: {
                        ItemVariant: true,
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

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}