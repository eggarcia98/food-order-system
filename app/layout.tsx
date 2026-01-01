import type { Metadata } from "next";
import { Fredoka, Bungee, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

const fredoka = Fredoka({
    variable: "--font-guayacos",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

const bungee = Bungee({
    variable: "--font-bungee",
    subsets: ["latin"],
    weight: ["400"],
});

const ibmPlexMono = IBM_Plex_Mono({
    variable: "--font-ibm-plex-mono",
    subsets: ["latin"],
    style: ["normal", "italic"],
    weight: ["100", "200", "300", "400", "500", "600", "700"],
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
                className={`${fredoka.variable} ${bungee.variable} ${ibmPlexMono.variable} antialiased flex flex-col bg-background min-h-screen`}
            >
                <HeaderComponent />

                {/* Main content with top padding for fixed navbar */}
                <main className="flex-1 pt-16 transition-all duration-300 bg-gradient-to-b from-background via-cream/30 to-background">
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>

                <FooterComponent />
            </body>
        </html>
    );
}
