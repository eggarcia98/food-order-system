"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function HeaderComponent() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <header className="bg-white border-b border-brand-blue font-bungee font-bold text-xs sm:text-[16px] h-fit ">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 items-center md:flex sm:justify-between relative top-0 z-50">
                {/* Mobile menu button */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((v) => !v)}
                        className="md:hidden justify-self-start p-2 focus:outline-none"
                    >
                        {menuOpen ? (
                            <X size={20} className="text-foreground" />
                        ) : (
                            <Menu size={20} className="text-foreground" />
                        )}
                    </button>
                </div>

                {/* Mobile menu items (toggle) */}
                <div
                    id="mobile-menu"
                    className={`${
                        menuOpen ? "block" : "hidden"
                    } md:hidden bg-white border-t absolute left-0 right-0 top-full w-1/2 shadow-md z-40`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            href="/menu"
                            onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2 text-gray-700 hover:bg-red-50 rounded"
                        >
                            Menu
                        </Link>

                        <Link
                            href="#contact"
                            onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2 text-gray-700 hover:bg-red-50 rounded"
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                <Link href="/" className="justify-self-center">
                    <Image
                        src="/media/logo.png"
                        alt="Los Guayacos Restaurant"
                        width={250}
                        height={250}
                        className="object-contain w-[170px] sm:w-[180px] md:w-[210px] lg:w-[250px] min-w-[170px] h-auto my-2"
                    />
                </Link>

                <nav
                    aria-label="Main Navigation"
                    className="flex gap-6 justify-self-end "
                >
                    <ul className="hidden md:flex items-center gap-6 underline underline-offset-4 ">
                        <li>
                            <Link
                                href="/menu"
                                className="text-secondary hover:text-brand-blue decoration-3"
                            >
                                Menu
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/orders"
                                className="text-secondary hover:text-brand-blue decoration-3"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                    <Link
                        className="btn-brand-blue p-2 font-semibold rounded-lg disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl "
                        href={"/new_order"}
                    >
                        Order Now
                    </Link>
                </nav>
            </div>
        </header>
    );
}
