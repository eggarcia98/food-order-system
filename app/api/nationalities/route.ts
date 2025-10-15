import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "edge";

export async function GET() {
    try {
        const nationality = await prisma.nationality.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(nationality);
    } catch (error) {
        console.error("Error fetching nationality:", error);
        return NextResponse.json(
            { error: "Failed to fetch nationality" },
            { status: 500 }
        );
    }
}
