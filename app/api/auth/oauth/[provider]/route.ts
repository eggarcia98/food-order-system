export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    ctx: RouteContext<'/api/auth/oauth/[provider]'>,
) {
    try {
        const authUrl = process.env.AUTH_ENDPOINT;
        const { provider } = await ctx.params;
        console.log("Received request to start OAuth with provider:", provider);

        if (!authUrl) {
            return NextResponse.json(
                { error: "Missing AUTH_ENDPOINT env var" },
                { status: 500 },
            );
        }

        const response = await fetch(`${authUrl}/oauth/${provider}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: data?.error || "Failed to start OAuth" },
                { status: response.status },
            );
        }

        // print cookies for debugging
        const setCookieHeader = response.headers.get("Set-Cookie");
        console.log(
            "Set-Cookie header from auth response HERE:",
            setCookieHeader,
        );

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error starting Google OAuth:", error);
        return NextResponse.json(
            { error: "Failed to start OAuth" },
            { status: 500 },
        );
    }
}
