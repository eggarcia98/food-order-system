"use client";

import useSWR from "swr";

export const AUTH_SESSION_KEY = "auth-session";

type AuthSession = {
    isAuthenticated: boolean;
    userEmail: string | null;
};

const getEmailFromSession = (data: any): string | null => {
    const email = data?.email ?? data?.data?.email ?? data?.user?.email ?? null;
    return typeof email === "string" ? email : null;
};

const authSessionFetcher = async (): Promise<AuthSession> => {
    try {
        const response = await fetch("/api/auth/refreshSession", {
            method: "POST",
            credentials: "include",
        });

        const data = await response.json().catch(() => null);
        const userEmail = getEmailFromSession(data);

        return {
            isAuthenticated:
                response.ok && (data?.valid === true || userEmail !== null),
            userEmail,
        };
    } catch {
        return {
            isAuthenticated: false,
            userEmail: null,
        };
    }
};

export function useAuthSession() {
    const { data, isLoading } = useSWR<AuthSession>(
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