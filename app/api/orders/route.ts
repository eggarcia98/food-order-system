import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "edge";

interface OrderItem {
    dish: Dish;
    quantity: number;
    sides: Side[];
}

interface Dish {
    id: number;
    name: string;
    price: number;
    img?: string;
}

interface Side {
    id: number;
    name: string;
    price: number;
}

export async function POST(request: Request) {
    try {
        const { client, dishes: itemsOrder, comments } = await request.json();
        const parsedDishes: OrderItem[] = [...itemsOrder]

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
                order_item: {
                    create: parsedDishes.map((orderItem: OrderItem) => ({
                        dish_id: orderItem.dish.id,
                        quantity: orderItem.quantity
                    })),
                },
                order_side_item: {
                    create: parsedDishes.flatMap((orderItem: OrderItem) =>
                        orderItem.sides.map((side: Side) => ({
                            side_id: side.id,
                            quantity: orderItem.quantity,
                        }))
                    ),
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
                order_item: {
                    include: {
                        dish: true,
                    },
                },
                order_side_item: {
                    include: {
                        side: true,
                    },
                },
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}