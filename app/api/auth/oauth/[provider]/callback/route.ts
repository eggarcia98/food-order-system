export const runtime = "edge";

import { NextResponse } from "next/server";

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface UpstreamResponse<T = unknown> {
    data?: T;
    [k: string]: any;
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
};

/**
 * POST /api/auth/oauth/:provider/callback
 * Expects { code } in the request body and forwards only that to the configured
 * AUTH_ENDPOINT, then returns the upstream response while setting secure cookies
 * for tokens when present.
 */
export async function POST(
    request: Request,
    ctx: RouteContext<"/api/auth/oauth/[provider]/callback">,
) {
    try {
        const { provider } = await ctx.params;

        if (!provider || Array.isArray(provider)) {
            return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
        }

        const authUrlRaw = process.env.AUTH_ENDPOINT;
        if (!authUrlRaw) {
            return NextResponse.json({ error: "Missing AUTH_ENDPOINT env var" }, { status: 500 });
        }

        const authUrl = authUrlRaw.replace(/\/+$/, ""); // remove trailing slash

        const body = await safeParseJson(request);
        const code = body?.code;
        if (!code || typeof code !== "string") {
            return NextResponse.json({ error: "Missing or invalid code parameter" }, { status: 400 });
        }

        // Set a short timeout for upstream requests
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        const upstreamRes = await fetch(`${authUrl}/oauth/${encodeURIComponent(provider)}/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
            signal: controller.signal,
        }).finally(() => clearTimeout(timeout));

        const text = await upstreamRes.text();
        let parsed: UpstreamResponse | string = text;
        try {
            parsed = JSON.parse(text);
        } catch {
            // leave as text
        }

        if (!upstreamRes.ok) {
            return NextResponse.json({ error: "Upstream error", details: parsed }, { status: upstreamRes.status });
        }

        const data = (parsed && typeof parsed === "object" && "data" in parsed) ? (parsed as UpstreamResponse).data : parsed;

        // If tokens are present, set them as secure cookies and return remaining data
        const tokens = (data && typeof data === "object" && (data as any).tokens) ? (data as any).tokens as AuthTokens : null;
        const payload = tokens ? { ...(data as any), tokens: undefined } : data;

        const response = NextResponse.json(payload ?? null, { status: upstreamRes.status });

        if (tokens) {
            response.cookies.set("accessToken", tokens.accessToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 7 });
            response.cookies.set("refreshToken", tokens.refreshToken, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });
        }

        return response;
    } catch (error) {
        console.error("Error processing OAuth callback:", error);
        const isAbort = (error as any)?.name === "AbortError";
        return NextResponse.json(
            { error: isAbort ? "Upstream request timed out" : "Failed to process OAuth callback" },
            { status: 500 },
        );
    }
}

async function safeParseJson(request: Request): Promise<any | null> {
    try {
        return await request.json();
    } catch {
        return null;
    }
}
