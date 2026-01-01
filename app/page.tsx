// app/page.tsx
"use client";

import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream/50 via-background to-cream/30 flex flex-col items-center justify-center px-6 sm:px-8\">
            {/* Main Content */}
            <div className="max-w-md w-full text-center space-y-8">
                {/* Logo/Title Section */}
                <div className="space-y-3">
                    <h1 className="text-5xl font-light text-foreground tracking-tight">
                        Los Guayacos
                    </h1>
                    <div className="h-1 w-12 bg-brand-red mx-auto rounded-full"></div>
                    <p className="text-sm font-light text-text-light uppercase tracking-widest">
                        Authentic Ecuadorian Cuisine
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
