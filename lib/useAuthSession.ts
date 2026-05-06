"use client";

import useSWR from "swr";
import { normalizeAuthSession, parseJsonSafely, type AuthSessionState } from "@/lib/auth";

export const AUTH_SESSION_KEY = "auth-session";

const authSessionFetcher = async (): Promise<AuthSessionState> => {
    try {
        const response = await fetch("/api/auth/refreshSession", {
            method: "POST",
            credentials: "include",
        });

        const text = await response.text();
        const data = text.length > 0 ? parseJsonSafely(text) : null;

        return normalizeAuthSession(response.ok, data);
    } catch {
        return {
            isAuthenticated: false,
            userEmail: null,
        };
    }
};

export function useAuthSession() {
    const { data, isLoading } = useSWR<AuthSessionState>(
        AUTH_SESSION_KEY,
        authSessionFetcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            dedupingInterval: 30_000,
        },
    );

    return {
        isAuthenticated: isLoading ? null : (data?.isAuthenticated ?? false),
        userEmail: data?.userEmail ?? null,
        isSessionLoading: isLoading,
    };
}