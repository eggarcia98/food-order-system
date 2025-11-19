import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { Fredoka } from "next/font/google";
import "./globals.css";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

const bungee = Fredoka({
    variable: "--font-bungee",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Los Guayacos Restaurant",
    description: "Ecuadorian Food",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${bungee.variable} antialiased h-screen flex flex-col `}
            >
                <HeaderComponent />

                <main className="flex-1 overflow-auto font-bungee">
                    {children}
                </main>

                {/* Infinite scrolling banner below header */}
                <FooterComponent />
            </body>
        </html>
    );
}
