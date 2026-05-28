import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api/http";
export const runtime = "edge";

export async function GET() {
    try {
        const side = await prisma.menuExtras.findMany({
            where: {
                is_active: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(side);
    } catch (error) {
        return jsonError(error, "Failed to fetch extras");
    }
}
