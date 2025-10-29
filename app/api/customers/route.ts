import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "edge";

export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                first_name: "asc",
            },
        });

        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 }
        );
    }
}
