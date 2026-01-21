export const runtime = "edge";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const orders = await prisma.menuItems.findMany({
            include: {
                item_variants: true,
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
