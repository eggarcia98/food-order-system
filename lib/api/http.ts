import { NextResponse } from "next/server";

export class HttpError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.name = "HttpError";
        this.status = status;
    }
}

export function getErrorStatus(error: Error): number | undefined {
    return "status" in error && typeof error.status === "number"
        ? error.status
        : undefined;
}

export async function parseJsonBody<T = unknown>(request: Request): Promise<T> {
    try {
        return (await request.json()) as T;
    } catch {
        throw new HttpError("Invalid JSON in request body", 400);
    }
}

export function jsonError(error: unknown, fallback = "Internal server error") {
    if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error(fallback, error);
    return NextResponse.json({ error: fallback }, { status: 500 });
}

export function parsePositiveInt(value: unknown, fieldName: string): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new HttpError(`Invalid ${fieldName}`, 400);
    }
    return parsed;
}

export function getString(value: unknown, fieldName: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new HttpError(`${fieldName} is required`, 400);
    }
    return value.trim();
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
