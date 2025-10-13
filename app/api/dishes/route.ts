import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const dish = await prisma.dish.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(dish);
    } catch (error) {
        console.error("Error fetching dish:", error);
        return NextResponse.json(
            { error: "Failed to fetch dish" },
            { status: 500 }
        );
    }
}
