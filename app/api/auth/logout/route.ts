import { NextResponse } from "next/server";

export const runtime = "edge";

const EXPIRED_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
};

function clearAuthCookies(response: NextResponse) {
    response.cookies.set("accessToken", "", EXPIRED_COOKIE_OPTIONS);
    response.cookies.set("refreshToken", "", EXPIRED_COOKIE_OPTIONS);
}

export async function POST() {
    const response = NextResponse.json({ success: true, message: "Logged out" });
    clearAuthCookies(response);
    return response;
}

export async function GET() {
    return POST();
}
