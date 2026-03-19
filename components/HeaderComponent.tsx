"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { AUTH_SESSION_KEY, useAuthSession } from "@/lib/useAuthSession";

export default function HeaderComponent() {
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const desktopUserMenuRef = useRef<HTMLDivElement | null>(null);
    const mobileUserMenuRef = useRef<HTMLDivElement | null>(null);
    const { isAuthenticated, isSessionLoading, userEmail } = useAuthSession();
    const userInitial = (userEmail?.charAt(0) ?? "U").toUpperCase();

    useEffect(() => {
        if (!userMenuOpen) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            const clickedDesktop = desktopUserMenuRef.current?.contains(target);
            const clickedMobile = mobileUserMenuRef.current?.contains(target);

            if (!clickedDesktop && !clickedMobile) {
                setUserMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [userMenuOpen]);

    useEffect(() => {
        if (isAuthenticated !== true) {
            setUserMenuOpen(false);
        }
    }, [isAuthenticated]);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            await mutate(
                AUTH_SESSION_KEY,
                { isAuthenticated: false, userEmail: null },
                false,
            );

            setMenuOpen(false);
            setUserMenuOpen(false);
            router.replace("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gradient-to-b from-cream/95 to-cream/90 shadow-sm shadow-foreground/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

                <Link href="/" className="logo-container flex-shrink-0">
                    <Image
                        src="/media/logo.png"
                        alt="Los Guayacos Restaurant"
                        width={250}
                        height={250}
                        className="object-contain w-[140px] sm:w-[160px] md:w-[180px] h-auto"
                    />
                </Link>

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
                        {isAuthenticated === true && (
                            <li>
                                <Link
                                    href="/orders"
                                    className="text-sm font-light text-foreground hover:text-brand-red transition-colors duration-200 relative group"
                                >
                                    Orders
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                        )}
                    </ul>
                    <Link
                        className="btn-brand-blue px-6 py-2.5 rounded-lg font-light text-sm transition-all duration-200"
                        href="/new_order"
                    >
                        Order Now
                    </Link>
                    {isAuthenticated === true ? (
                        <div className="relative ml-4" ref={desktopUserMenuRef}>
                            <button
                                type="button"
                                title={userEmail ?? "Signed in"}
                                aria-label="Open account menu"
                                aria-haspopup="menu"
                                aria-expanded={userMenuOpen}
                                onClick={() => setUserMenuOpen((value) => !value)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
                                disabled={isLoggingOut}
                            >
                                {userInitial}
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-soft-pink/20 bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
                                    <div className="px-4 py-3 border-b border-soft-pink/20">
                                        <p className="text-xs text-text-light font-light">Signed in as</p>
                                        <p className="text-sm text-foreground truncate">{userEmail ?? "User"}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="w-full flex items-center justify-between px-4 py-3 text-foreground font-light hover:bg-soft-pink/20 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : !isSessionLoading ? (
                        <Link
                            className="px-5 py-2.5 rounded-lg font-light text-sm transition-all duration-200 border border-brand-blue text-brand-blue hover:bg-soft-blue/10"
                            href="/login"
                        >
                            Sign In
                        </Link>
                    ) : null}
                </nav>

                <div className="flex md:hidden items-center gap-3">
                    {isAuthenticated === true ? (
                        <div className="relative" ref={mobileUserMenuRef}>
                            <button
                                type="button"
                                title={userEmail ?? "Signed in"}
                                aria-label="Open account menu"
                                aria-haspopup="menu"
                                aria-expanded={userMenuOpen}
                                onClick={() => setUserMenuOpen((value) => !value)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
                                disabled={isLoggingOut}
                            >
                                {userInitial}
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-soft-pink/20 bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden">
                                    <div className="px-4 py-3 border-b border-soft-pink/20">
                                        <p className="text-xs text-text-light font-light">Signed in as</p>
                                        <p className="text-sm text-foreground truncate">{userEmail ?? "User"}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="w-full flex items-center justify-between px-4 py-3 text-foreground font-light hover:bg-soft-pink/20 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : !isSessionLoading ? (
                        <Link
                            className="px-3 py-2 rounded-lg border border-brand-blue text-brand-blue text-sm font-light"
                            href="/login"
                        >
                            Sign In
                        </Link>
                    ) : null}
                    <button
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => {
                            setMenuOpen((v) => !v);
                            setUserMenuOpen(false);
                        }}
                        className="p-2 text-foreground transition-colors duration-200 hover:text-brand-blue"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

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
                    {isAuthenticated === true && (
                        <Link
                            href="/orders"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-2.5 text-foreground font-light hover:bg-soft-pink/20 rounded-lg transition-colors duration-200"
                        >
                            Orders
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
