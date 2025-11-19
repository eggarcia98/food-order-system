// app/page.tsx
"use client";

import NewOrderModal from "@/components/NewOrderModal";
import Link from "next/link";
import { useState } from "react";

// Dis is a comment
export default function Page() {
    const [openNewOrderModal, setOpenNewOrderModal] = useState(false);

    const handleOpenNewOrderModal = (value: any) => {
        setOpenNewOrderModal(value);
    };

    return (
        <div className="bg-background h-dvh flex items-center justify-center">
            <NewOrderModal
                openNewOrderModal={openNewOrderModal}
                setOpenNewOrderModal={handleOpenNewOrderModal}
            />
            <Link
                className="btn-brand-blue p-4 font-semibold rounded-lg disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl "
                href={"/new_order"}
            >
                Order Now
            </Link>
        </div>
    );
}
