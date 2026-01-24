"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

export default function HeaderComponent() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gradient-to-b from-cream/95 to-cream/90 shadow-sm shadow-foreground/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="logo-container flex-shrink-0">
                    <Image
                        src="/media/logo.png"
                        alt="Los Guayacos Restaurant"
                        width={250}
                        height={250}
                        className="object-contain w-[140px] sm:w-[160px] md:w-[180px] h-auto"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav
                    aria-label="Main Navigation"
                    className="hidden md:flex items-center gap-8"
                >
                    <ul className="flex items-center gap-8">
                        <li>
                            <Link
                                href="/menu"
                                className="text-sm font-light text-foreground hover:text-brand-red transition-colors duration-200 relative group"
                            >
                                Menu
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                href="/orders"
                                className="text-sm font-light text-foreground hover:text-brand-red transition-colors duration-200 relative group"
                            >
                                Orders
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </li> */}
                    </ul>
                    <Link
                        className="btn-brand-blue px-6 py-2.5 rounded-lg font-light text-sm transition-all duration-200"
                        href="/new_order"
                    >
                        Order Now
                    </Link>
                    <Link
                        className="px-5 py-2.5 rounded-lg font-light text-sm transition-all duration-200 border border-brand-blue text-brand-blue hover:bg-soft-blue/10"
                        href="/login"
                    >
                        Sign In
                    </Link>
                </nav>

                {/* Mobile menu button */}
                <div className="flex md:hidden items-center gap-3">
                    <Link
                        className="px-3 py-2 rounded-lg border border-brand-blue text-brand-blue text-sm font-light"
                        href="/login"
                    >
                        Sign In
                    </Link>
                    {/* <Link
                        className="btn-brand-blue p-2 rounded-lg transition-all duration-200"
                        href="/new_order"
                    >
                        <UtensilsCrossed size={20} />
                    </Link> */}
                    <button
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="p-2 text-foreground transition-colors duration-200 hover:text-brand-blue"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu items */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-48" : "max-h-0"
                }`}
            >
                <nav className="bg-white/95 backdrop-blur-sm border-t border-soft-pink/20 px-4 py-4 space-y-2">
                    <Link
                        href="/new_order"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-white font-light bg-brand-blue rounded-sm transition-colors duration-200"
                    >
                        Order Now
                    </Link>
                    <Link
                        href="/menu"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-foreground font-light hover:bg-soft-pink/20 rounded-lg transition-colors duration-200"
                    >
                        Menu
                    </Link>
                    {/* <Link
                        href="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-foreground font-light hover:bg-soft-pink/20 rounded-lg transition-colors duration-200"
                    >
                        Orders
                    </Link> */}
                </nav>
            </div>
        </header>
    );
}
