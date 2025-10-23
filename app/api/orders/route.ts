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
        const { client, dishes, comments } = await request.json();
        const parsedDishes: OrderItem[] = dishes.map((item: OrderItem) => ({
            id: item.dish.id,
            quantity: item.quantity,
            sides: item.sides,
        }));

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
                    create: parsedDishes.map((dish: any) => ({
                        dish_id: dish.id,
                        quantity: dish.quantity,
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
