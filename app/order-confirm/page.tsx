export default function OrderConfirmLandingPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream/50 via-background to-cream/30 flex items-center justify-center px-6 sm:px-8">
            <div className="max-w-xl w-full rounded-3xl border border-soft-pink/30 bg-white/80 backdrop-blur-sm shadow-lg p-8 sm:p-10 text-center space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] text-text-light font-light">Order confirmation</p>
                <h1 className="text-4xl sm:text-5xl font-light text-foreground tracking-tight">
                    Thanks for being here
                </h1>
                <p className="text-base sm:text-lg text-text-light leading-relaxed">
                    This page is just for confirming your order. Please open the link we sent you in WhatsApp or email to finish.
                </p>
                <p className="text-sm text-text-light/90 leading-relaxed">
                    If you need help, reply to our message and we’ll take care of it.
                </p>
            </div>
        </div>
    );
}