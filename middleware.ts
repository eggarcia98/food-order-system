import { NextRequest, NextResponse } from "next/server";

const BLOCKED_DOMAIN = process.env.BLOCKED_DOMAIN;

function shouldBypass(pathname: string) {
    return (
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/api/") ||
        pathname === "/favicon.ico" ||
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml" ||
        pathname === "/manifest.json" ||
        pathname.startsWith("/media/")
    );
}

function isOrderConfirmPath(pathname: string) {
    return pathname === "/order-confirm" || pathname.startsWith("/order-confirm/");
}

export function middleware(request: NextRequest) {
    if (!BLOCKED_DOMAIN) {
        return NextResponse.next();
    }

    if (request.nextUrl.hostname !== BLOCKED_DOMAIN) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    if (shouldBypass(pathname) || isOrderConfirmPath(pathname)) {
        return NextResponse.next();
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/order-confirm";
    redirectUrl.search = "";

    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};