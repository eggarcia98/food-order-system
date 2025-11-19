// app/page.tsx
"use client";

import Link from "next/link";

// Dis is a comment
export default function Page() {
  

    return (
        <div className="bg-background h-dvh flex items-center justify-center">
            <Link
                className="btn-brand-blue p-4 font-semibold rounded-lg disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl "
                href={"/new_order"}
            >
                Order Now
            </Link>
        </div>
    );
}
