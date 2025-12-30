import { NextResponse } from "next/server";

export async function GET() {
    try {
        
        return NextResponse.json({ message: "signUp route is operational" });
    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 }
        );
    }
}