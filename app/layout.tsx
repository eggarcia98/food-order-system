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
    title: "Los Guayacos - Authentic Ecuadorian Cuisine | Food Delivery",
    description: "Experience authentic Ecuadorian cuisine at Los Guayacos. Fresh, local, and traditional dishes delivered to your door. Order online now.",
    keywords: "Ecuadorian food, authentic cuisine, food delivery, Los Guayacos restaurant, traditional recipes",
    authors: [{ name: "Los Guayacos Restaurant" }],
    creator: "Los Guayacos",
    publisher: "Los Guayacos Restaurant",
    formatDetection: {
        email: true,
        telephone: true,
        address: true,
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://app.losguayacos.com",
        siteName: "Los Guayacos Restaurant",
        title: "Los Guayacos - Authentic Ecuadorian Cuisine",
        description: "Experience authentic Ecuadorian cuisine with fresh, local, and traditional dishes. Order online for delivery.",
        images: [
            {
                url: "https://app.losguayacos.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Los Guayacos Restaurant",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Los Guayacos - Authentic Ecuadorian Cuisine",
        description: "Experience authentic Ecuadorian cuisine with fresh, local, and traditional dishes.",
        images: ["https://app.losguayacos.com/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "https://app.losguayacos.com",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta name="theme-color" content="#8B0000" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="canonical" href="https://app.losguayacos.com" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body
                className={`${fredoka.variable} ${bungee.variable} ${ibmPlexMono.variable} antialiased flex flex-col bg-background min-h-screen`}
            >
                <HeaderComponent />

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
