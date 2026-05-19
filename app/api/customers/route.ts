import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api/http";
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
        return jsonError(error, "Failed to fetch customers");
    }
}
