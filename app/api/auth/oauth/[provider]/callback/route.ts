export const runtime = "edge";

import { NextResponse } from "next/server";
import {
    AUTH_COOKIE_OPTIONS,
    extractAuthTokens,
    parseJsonSafely,
} from "@/lib/auth";

const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * POST /api/auth/oauth/:provider/callback
 * - Accepts { code } in the request body
 * - Forwards the code to the upstream AUTH_ENDPOINT
 * - Sets token cookies when upstream returns tokens
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

        const authEndpoint = getAuthEndpoint();

        const body = await safeParseJson(request);
        const code = isObject(body) && typeof body.code === "string" ? body.code : null;
        if (!code) {
            return NextResponse.json({ error: "Missing or invalid code parameter" }, { status: 400 });
        }

        const upstreamResponse = await postCodeToAuthServer({
            authEndpoint,
            provider,
            code,
            timeoutMs: DEFAULT_TIMEOUT_MS,
        });

        const text = await upstreamResponse.text();
        const parsed = parseJsonSafely(text);

        if (!upstreamResponse.ok) {
            return NextResponse.json(
                { error: "Upstream error", details: parsed },
                { status: upstreamResponse.status },
            );
        }

        const data =
            isObject(parsed) && "data" in parsed
                ? (parsed as Record<string, unknown>).data
                : parsed;

        const tokens = extractAuthTokens(data);
        const payload =
            tokens && isObject(data)
                ? (() => {
                      const { tokens: _ignoredTokens, ...rest } = data;
                      void _ignoredTokens;
                      return rest;
                  })()
                : data;

        const response = NextResponse.json(payload ?? null, {
            status: upstreamResponse.status,
        });

        if (tokens) {
            response.cookies.set("accessToken", tokens.accessToken, {
                ...AUTH_COOKIE_OPTIONS,
                maxAge: 60 * 60 * 24 * 7,
            });
            response.cookies.set("refreshToken", tokens.refreshToken, {
                ...AUTH_COOKIE_OPTIONS,
                maxAge: 60 * 60 * 24 * 30,
            });
        }

        return response;
    } catch (err) {
        console.error("Error processing OAuth callback:", err);
        const isAbort = err instanceof Error && err.name === "AbortError";
        return NextResponse.json(
            { error: isAbort ? "Upstream request timed out" : "Failed to process OAuth callback" },
            { status: 500 },
        );
    }
}

function getAuthEndpoint(): string {
    const raw = process.env.AUTH_ENDPOINT;
    if (!raw) throw new Error("MISSING_AUTH_ENDPOINT");
    return raw.replace(/\/+$/, "");
}

async function postCodeToAuthServer(opts: {
    authEndpoint: string;
    provider: string;
    code: string;
    timeoutMs?: number;
}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    try {
        return await fetch(`${opts.authEndpoint}/oauth/${encodeURIComponent(opts.provider)}/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: opts.code }),
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeout);
    }
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

async function safeParseJson(request: Request): Promise<unknown | null> {
    try {
        return await request.json();
    } catch {
        return null;
    }
}
