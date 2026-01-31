"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Los Guayacos",
            description: "Authentic Ecuadorian cuisine with fresh, local, and traditional dishes",
            url: "https://app.losguayacos.com",
            image: "https://app.losguayacos.com/og-image.jpg",
            priceRange: "$$",
            servesCuisine: "Ecuadorian",
            telephone: "+1-XXX-XXX-XXXX",
            address: {
                "@type": "PostalAddress",
                addressCountry: "US",
            },
            sameAs: [],
        };

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(schemaData);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream/50 via-background to-cream/30 flex flex-col items-center justify-center px-6 sm:px-8">
            {/* Main Content */}
            <div className="max-w-md w-full text-center space-y-8">
                {/* Logo/Title Section */}
                <div className="space-y-3">
                    <h1 className="text-5xl font-light text-foreground tracking-tight">
                        Los Guayacos
                    </h1>
                    <div className="h-1 w-12 bg-brand-red mx-auto rounded-full"></div>
                    <p className="text-sm font-light text-text-light uppercase tracking-widest">
                        Authentic
                        <span className="mx-1 bg-gradient-to-r from-[#FAD201] via-[#0050A0] to-[#EF3340] bg-clip-text text-transparent font-semibold">
                            Ecuadorian
                        </span>
                        Cuisine
                    </p>
                </div>

                {/* Subtitle */}
                <p className="text-lg text-text-light font-light leading-relaxed">
                    Discover genuine flavors and warm hospitality in every dish
                </p>

                {/* CTA Section */}
                <div className="space-y-3 pt-6">
                    <Link
                        href="/new_order"
                        className="block btn-brand-blue px-8 py-3.5 rounded-lg font-light transition hover:shadow-lg"
                    >
                        Start Ordering
                    </Link>
                    <Link
                        href="/menu"
                        className="block px-8 py-3.5 rounded-lg font-light border border-brand-blue text-brand-blue bg-white hover:bg-soft-blue/10 transition"
                    >
                        Browse Menu
                    </Link>
                </div>

                {/* Footer Text */}
                <div className="pt-6 border-t border-soft-pink/30">
                    <p className="text-xs text-text-light font-light">
                        Fresh • Local • Traditional
                    </p>
                </div>
            </div>
        </div>
    );
}
