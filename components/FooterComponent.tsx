import Image from "next/image";
import Link from "next/link";

export default function FooterComponent() {
    return (
        <footer className="bg-gradient-to-t from-background via-cream/40 to-transparent backdrop-blur-sm shadow-lg shadow-foreground/3 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-light text-foreground mb-2">Los Guayacos</h3>
                        <p className="text-sm font-light text-text-light">Authentic Ecuadorian Cuisine</p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h4 className="text-sm font-light text-foreground mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/menu" className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/new_order" className="text-sm font-light text-text-light hover:text-brand-red transition-colors duration-200">
                                    Order Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="text-center md:text-right">
                        <h4 className="text-sm font-light text-foreground mb-3">Get in Touch</h4>
                        <p className="text-sm font-light text-text-light">Follow us for updates</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-soft-pink/20 pt-6 text-center">
                    <p className="text-xs font-light text-text-light">
                        © {new Date().getFullYear()} Los Guayacos Restaurant. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}