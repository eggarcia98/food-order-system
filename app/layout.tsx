import { Fredoka, Bungee, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import HeaderComponent from "@/components/HeaderComponent";

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
                <main className="flex-1  transition-all duration-300 bg-linear-to-b from-background via-cream/30 to-background">
                    {children}
                </main>
            </body>
        </html>
    );
}
