"use client";
export const runtime = 'edge';

import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallbackPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const provider = params.provider as string;

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const fragments: Record<string, string> = {};

        if (hash) {
            const hashParams = new URLSearchParams(hash);
            hashParams.forEach((value, key) => {
                fragments[key] = value;
            });
        }

        const combined: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            combined[key] = value;
        });

        Object.entries(fragments).forEach(([key, value]) => {
            combined[key] = value;
        });

        if (Object.keys(combined).length > 0) {
            sendTokensToBackend(combined);
        }
    }, [searchParams]);

    const sendTokensToBackend = async (tokens: Record<string, string>) => {
            console.log("Response from backend:", (tokens));
        try {
            const response = await fetch(`/api/auth/oauth/${provider}/callback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tokens),
            });

            if (!response.ok) {
                window.location.href = "/login";
                return;
            }

            await response.json();
            window.location.href = "/";
        } catch (error) {
            window.location.href = "/login";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <img src="/loading-icon.svg" alt="Loading..." className="w-12 h-12" />
        </div>
    );
}
