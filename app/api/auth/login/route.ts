export const runtime = "edge";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();
        const authUrl = process.env.AUTH_ENDPOINT;
        console.log("Auth URL:", authUrl);

        const response = await fetch(`${authUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            console.error("Login failed:", response.statusText);
            const data = await response.json();
            console.log("Error data:", data);
            return NextResponse.json(
                { error: data.error || "Login failed" },
                { status: response.status }
            );
        }

        const data = await response.json();
        const nextResponse = NextResponse.json(data, { status: 200 });
        
       
        
        return nextResponse;
    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
