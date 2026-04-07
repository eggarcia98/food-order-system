import Link from "next/link";

export default function OrderConfirmLandingPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream/50 via-background to-cream/30 flex items-center justify-center px-6 sm:px-8">
            <div className="max-w-xl w-full rounded-3xl border border-soft-pink/30 bg-white/80 backdrop-blur-sm shadow-lg p-8 sm:p-10 text-center space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] text-text-light font-light">Order confirmation</p>
                <h1 className="text-4xl sm:text-5xl font-light text-foreground tracking-tight">
                    Open your confirmation link
                </h1>
                <p className="text-base sm:text-lg text-text-light leading-relaxed">
                    This domain is reserved for order confirmations. Use the link you received by WhatsApp or email to continue.
                </p>
                <div className="pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-lg px-6 py-3 bg-brand-blue text-white font-light transition hover:shadow-lg"
                    >
                        Go to main site
                    </Link>
                </div>
            </div>
        </div>
    );
}