import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Los Guayacos Restaurant",
    description: "Ecuadorian Food",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white border-b border-brand-blue">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-foreground text-lg font-bold">Los Guayacos</span>
              <span className="text-brand-blue font-semibold">Restaurant</span>
            </Link>

            <nav aria-label="Main Navigation">
              <ul className="flex items-center gap-6">
                <li>
                  <Link href="/" className="text-secondary hover:text-brand-blue">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="text-secondary hover:text-brand-blue">
                    Orders
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
