// lib/seo.ts
import type { Metadata } from "next";

export const baseMetadata: Metadata = {
    title: {
        template: "%s | Los Guayacos",
        default: "Los Guayacos - Authentic Ecuadorian Cuisine",
    },
    description: "Experience authentic Ecuadorian cuisine at Los Guayacos. Fresh, local, and traditional dishes delivered to your door.",
    keywords: [
        "Ecuadorian food",
        "authentic cuisine",
        "food delivery",
        "Los Guayacos",
        "restaurant",
        "traditional recipes",
        "fresh ingredients",
    ],
    metadataBase: new URL("https://app.losguayacos.com"),
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Los Guayacos Restaurant",
    },
};

export const createPageMetadata = (
    title: string,
    description: string,
    path: string,
    image?: string
): Metadata => ({
    title,
    description,
    alternates: {
        canonical: `https://app.losguayacos.com${path}`,
    },
    openGraph: {
        title,
        description,
        url: `https://app.losguayacos.com${path}`,
        type: "website",
        images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : [],
    },
});
