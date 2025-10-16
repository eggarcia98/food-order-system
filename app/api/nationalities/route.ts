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
        return NextResponse.json(
            { error },
            { status: 500 }
        );
    }
}
