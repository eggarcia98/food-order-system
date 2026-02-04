"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function FooterComponent() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            // Simple mailto implementation - replace with your email service
            window.location.href = `mailto:info@losguayacos.com?subject=Newsletter Subscription&body=Email: ${email}`;
            setMessage("Thank you for subscribing!");
            setEmail("");
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-gradient-to-t from-background/95 via-cream/20 to-transparent border-t border-soft-pink/10 backdrop-blur-sm mt-12">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="text-center ">
                        <h3 className="text-2xl font-light text-foreground mb-3 tracking-wide">
                            Los Guayacos
                        </h3>
                        <p className="text-sm font-light text-text-light leading-relaxed">
                            Authentic Ecuadorian Cuisine
                        </p>
                        <p className="text-xs font-light text-text-light/70 mt-1">
                            Fresh, local, and traditional flavors
                        </p>

                        <div className="text-center ">
                            <h4 className="text-xs font-light text-foreground mt-5 tracking-widest uppercase opacity-80  ">
                                Connect With Us
                            </h4>
                            <div className="flex items-center justify-center  gap-4">
                                <a
                                    href="https://www.instagram.com/losguayacos.bne.au?igsh=NHVleTQ0Z2ZyeHJk&utm_source=qr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="Instagram"
                                >
                                    <div className="p-3 rounded-full bg-soft-pink/10 group-hover:bg-brand-red/10 transition-all duration-200">
                                        <Instagram className="h-5 w-5 text-text-light group-hover:text-brand-red transition-colors duration-200" />
                                    </div>
                                </a>
                                <a
                                    href="https://www.facebook.com/profile.php?id=61587087887121&sk=about"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="Facebook"
                                >
                                    <div className="p-3 rounded-full bg-soft-pink/10 group-hover:bg-brand-blue/10 transition-all duration-200">
                                        <Facebook className="h-5 w-5 text-text-light group-hover:text-brand-blue transition-colors duration-200" />
                                    </div>
                                </a>
                                <a
                                    href="https://wa.me/61433807915"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group"
                                    aria-label="WhatsApp"
                                >
                                    <div className="p-3 rounded-full bg-soft-pink/10 group-hover:bg-green-500/10 transition-all duration-200">
                                        <MessageCircle className="h-5 w-5 text-text-light group-hover:text-green-600 transition-colors duration-200" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Quick Links - Desktop only */}
                    <nav className="hidden md:flex md:flex-col text-center justify-center">
                        <h2 className="mb-4">Quick Links</h2>

                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/menu"
                                    className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200"
                                >
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/new_order"
                                    className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200"
                                >
                                    Order Now
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/orders"
                                    className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200"
                                >
                                    Orders
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Email Subscribe Form */}
                    <div className="text-center flex flex-col justify-center ">
                        <h2 className="font-light text-foreground mb-4 opacity-80">
                            Stay Updated
                        </h2>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col items-center justify-center  gap-2"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-soft-pink/30 bg-white/80 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all min-w-2xs"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-brand-red text-white rounded-lg hover:bg-brand-red/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                            >
                                {isSubmitting ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        <span className="text-sm font-light">
                                            Subscribe
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>
                        {message && (
                            <p className="mt-2 text-xs font-light text-brand-red">
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Social Links */}
                </div>

                {/* Quick Links - Mobile only */}
                <nav className="md:hidden mt-8">
                    <ul className="flex items-center justify-center gap-6">
                        <li>
                            <Link
                                href="/menu"
                                className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200"
                            >
                                Menu
                            </Link>
                        </li>
                        <li className="text-text-light/30">•</li>
                        <li>
                            <Link
                                href="/new_order"
                                className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200"
                            >
                                Order Now
                            </Link>
                        </li>
                        <li className="text-text-light/30">•</li>
                        <li>
                            <Link
                                href="/orders"
                                className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200"
                            >
                                Orders
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
}
