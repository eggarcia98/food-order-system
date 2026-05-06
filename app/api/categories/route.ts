import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "edge";

export async function GET() {
    try {
        const categories = await prisma.categories.findMany({
            orderBy: {
                category_id: "asc",
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
