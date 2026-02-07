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
        const code = body?.code;

        if (!code) {
            return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
        }

        const upstreamRes = await fetch(`${authUrl}/oauth/${provider}/callback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        });

        const text = await upstreamRes.text();
        let data: unknown;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        console.log("Upstream response:", { status: upstreamRes.status, data });
        if (!upstreamRes.ok) {
            return NextResponse.json({ error: "Upstream error", details: data }, { status: upstreamRes.status });
        }

        return NextResponse.json(data, { status: upstreamRes.status });
    } catch (error) {
        console.error("Error processing OAuth callback:", error);
        return NextResponse.json(
            { error: "Failed to process OAuth callback" },
            { status: 500 },
        );
    }
}
