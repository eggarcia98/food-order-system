"use client";
export const runtime = 'edge';

import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallbackPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const provider = params.provider as string;

    useEffect(() => {
        const code = searchParams.get("code");

        if (code) {
            sendCodeToBackend(code);
        }
    }, [searchParams]);

    const sendCodeToBackend = async (code: string) => {
        try {
            const response = await fetch(`/api/auth/oauth/${provider}/callback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                window.location.href = "/login?error=oauth_failed";
                return;
            }

            await response.json();
            window.location.href = "/";
        } catch (error) {
            console.error("Error sending code to backend:", error);
            window.location.href = "/login?error=oauth_failed";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <img src="/loading-icon.svg" alt="Loading..." className="w-12 h-12" />
        </div>
    );
}
