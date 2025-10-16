import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "edge";

export async function POST(request: Request) {
    try {
        const { client, dishes, comments } = await request.json();
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
                    create: dishes.map((dish: any) => ({
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
