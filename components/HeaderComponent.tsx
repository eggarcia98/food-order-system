"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function HeaderComponent() {
    return (
        <header className="bg-white border-b border-brand-blue font-bungee font-bold text-xs sm:text-[16px] ">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 items-center md:flex sm:justify-between ">
                {/* Mobile menu button */}
                <button className="md:hidden  justify-self-start">
                    <Menu size={"20"} className="text-lg" />
                </button>

                <Link href="/" className="justify-self-center">
                    <Image
                        src="/media/logo.png"
                        alt="Los Guayacos Restaurant"
                        width={250}
                        height={250}
                        className="object-contain w-[170px] sm:w-[180px] md:w-[210px] lg:w-[250px] h-auto my-2"
                    />
                </Link>

                <nav
                    aria-label="Main Navigation"
                    className="flex gap-6 justify-self-end"
                >
                    <ul className="hidden md:flex items-center gap-6 underline underline-offset-4 ">
                        <li>
                            <Link
                                href="/"
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
