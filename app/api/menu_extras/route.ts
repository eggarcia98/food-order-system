import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "edge";

export async function GET() {
    try {
        const side = await prisma.menuExtras.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(side);
    } catch (error) {

        return NextResponse.json(
            { error: "Failed to fetch side" },
            { status: 500 }
        );
    }
}
