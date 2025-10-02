// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phoneNumber, name, dishes, comments } = body;

        // Validate required fields
        if (!phoneNumber || !name || !dishes || dishes.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create order with dishes
        const order = await prisma.order.create({
            data: {
                phoneNumber,
                name,
                comments,
                dishes: {
                    create: dishes.map((dish: any) => ({
                        dish: dish.dish,
                        quantity: dish.quantity,
                        extras: dish.extras || "",
                    })),
                },
            },
            include: {
                dishes: true,
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                dishes: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
