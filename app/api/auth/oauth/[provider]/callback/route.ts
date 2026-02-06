export const runtime = "edge";

import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    ctx: RouteContext<"/api/auth/oauth/[provider]/callback">,
) {
    try {
        const { provider } = await ctx.params;
        const authUrl = process.env.AUTH_ENDPOINT;

        if (!authUrl) {
            return NextResponse.json(
                { error: "Missing AUTH_ENDPOINT env var" },
                { status: 500 },
            );
        }

        const body = await request.json();

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json(
                { error: "No tokens provided" },
                { status: 400 },
            );
        }

        const response = await fetch(`${authUrl}/oauth/${provider}/callback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });


        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            console.error(`[OAuth ${provider}] Auth backend error:`, data);
            return NextResponse.json(
                { error: data?.error || "OAuth callback failed" },
                { status: response.status },
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error processing OAuth callback:", error);
        return NextResponse.json(
            { error: "Failed to process OAuth callback" },
            { status: 500 },
        );
    }
}
