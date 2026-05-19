import { HttpError } from "@/lib/api/http";

export function getAuthToken(request: Request): string | null {
    const cookieHeader = request.headers.get("cookie") || "";
    const accessTokenMatch = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
    const legacyTokenMatch = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]+)/);

    return accessTokenMatch?.[1] ?? legacyTokenMatch?.[1] ?? null;
}

export function requireAuth(request: Request): string {
    const token = getAuthToken(request);
    if (!token) {
        throw new HttpError("Unauthorized - Authentication required", 401);
    }
    return token;
}
