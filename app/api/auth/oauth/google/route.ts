export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET() {
    try {
        const authUrl = process.env.AUTH_ENDPOINT;

        console.log("AUTH_ENDPOINT:", authUrl);

        if (!authUrl) {
            return NextResponse.json(
                { error: "Missing AUTH_ENDPOINT env var" },
                { status: 500 }
            );
        }

        const response = await fetch(`${authUrl}/oauth/google`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: data?.error || "Failed to start OAuth" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error starting Google OAuth:", error);
        return NextResponse.json(
            { error: "Failed to start OAuth" },
            { status: 500 }
        );
    }
}
