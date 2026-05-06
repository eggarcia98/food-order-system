import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_OPTIONS,
  extractAuthTokens,
  parseJsonSafely,
} from "@/lib/auth";

export const runtime = "edge";

const AUTH_ENDPOINT =
  process.env.AUTH_ENDPOINT || "http://localhost:8080/api/v1/auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ?? null;
    const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { valid: false, message: "Missing tokens in cookies" },
        { status: 401 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const cookieParts: string[] = [];
    if (accessToken) {
      cookieParts.push(`accessToken=${encodeURIComponent(accessToken)}`);
    }
    if (refreshToken) {
      cookieParts.push(`refreshToken=${encodeURIComponent(refreshToken)}`);
    }
    const cookieHeader = cookieParts.join("; ");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    const upstreamRes = await fetch(`${AUTH_ENDPOINT}/validate-token`, {
      method: "POST",
      headers,
      body: JSON.stringify({}),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const text = await upstreamRes.text();
    const upstreamData = parseJsonSafely(text);

    if (!upstreamRes.ok) {
      return NextResponse.json(
        {
          valid: false,
          message: "Token validation failed",
          details: upstreamData,
        },
        { status: upstreamRes.status },
      );
    }

    const newTokens = extractAuthTokens(upstreamData);
    const payload =
      typeof upstreamData === "object" && upstreamData !== null && "data" in upstreamData
        ? (upstreamData as Record<string, unknown>).data
        : upstreamData;

    const response = NextResponse.json(
      { valid: true, ...(payload as Record<string, unknown>) },
      { status: upstreamRes.status },
    );

    if (newTokens) {
      response.cookies.set("accessToken", newTokens.accessToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("refreshToken", newTokens.refreshToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error("Session refresh error:", error);
    const isAbort = error instanceof Error && error.name === "AbortError";
    return NextResponse.json(
      {
        valid: false,
        message: isAbort
          ? "Upstream request timed out"
          : error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 },
    );
  }
}
