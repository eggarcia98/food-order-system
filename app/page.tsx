// app/page.tsx
"use client";

import NewOrderModal from "@/components/NewOrderModal";
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
            <button
                className="btn-brand-blue p-4 font-semibold rounded-lg disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl "
                onClick={() => handleOpenNewOrderModal(true)}
            >
                Open New Order Modal
            </button>
        </div>
    );
}
