import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const nationalities = await prisma.nationality.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json(nationalities);
    } catch (error) {
        console.error("Error fetching nationalities:", error);
        return NextResponse.json(
            { error: "Failed to fetch nationalities" },
            { status: 500 }
        );
    }
}
