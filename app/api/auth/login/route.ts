export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({ message: "Login route is operational" });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
