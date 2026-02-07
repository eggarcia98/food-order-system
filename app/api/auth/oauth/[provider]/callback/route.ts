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

        // check if body has accessToken and refreshToken
        if (!body.access_token || !body.refresh_token) {
            return NextResponse.json(
                { error: "Missing accessToken or refreshToken in request body" },
                { status: 400 },
            );
        }

   
        const nextResponse = NextResponse.json({
            message: `Successfully processed OAuth callback for provider: ${provider}`,
        }, { status: 200 });

        nextResponse.cookies.set("access_token", body.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // en prod
            sameSite: "lax",
            path: "/",
        });
        nextResponse.cookies.set("refresh_token", body.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // en prod
            sameSite: "lax",
            path: "/",
        });
      
        return nextResponse;
    } catch (error) {
        console.error("Error processing OAuth callback:", error);
        return NextResponse.json(
            { error: "Failed to process OAuth callback" },
            { status: 500 },
        );
    }
}
