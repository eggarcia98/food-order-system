"use client";

import React, { useCallback } from "react";
import { OrderModalShell } from "@/components/OrderModalShell";
import { useQuantityMap } from "@/lib/useQuantityMap";
import { AddExtraItemModalProps } from "@/lib/domain";

export default function AddExtraItemModal({
    open,
    setOpen,
    extraItems,
    setConfirmedExtraItems,
}: AddExtraItemModalProps) {
    const extraIds = extraItems.map((e) => e.extra_id);
    const { quantities, increment, decrement, reset } = useQuantityMap(
        extraIds,
        0,
    );

    const handleConfirm = useCallback(() => {
        const selectedExtras = extraItems
            .filter((extra) => quantities[extra.extra_id] > 0)
            .map((extra) => ({
                extra_id: extra.extra_id,
                name: extra.name,
                quantity: quantities[extra.extra_id],
                price: extra.price,
            }));

        if (selectedExtras.length === 0) return;

        setConfirmedExtraItems((prev) => [...prev, ...selectedExtras]);
        reset();
        setOpen(false);
    }, [quantities, extraItems, setConfirmedExtraItems, reset, setOpen]);

    return (
        <OrderModalShell
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={handleConfirm}
            title="Add Extra Items"
            confirmDisabled={Object.values(quantities).every((q) => q === 0)}
        >
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 rounded-full bg-brand-blue"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Available Extras
                    </h3>
                </div>
                <div className="flex flex-col gap-2">
                    {extraItems.map((extra) => (
                        <div
                            key={extra.extra_id}
                            className="flex justify-between items-center border-b p-2 px-3 text-sm border-brand"
                        >
                            <div className="flex flex-col">
                                <span className="text-secondary font-medium">
                                    {extra.name}
                                </span>
                                <span className="text-xs text-brand-red">
                                    ${extra.price}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="px-2 rounded font-bold cursor-pointer transition bg-bg-light hover:bg-gray-100"
                                    onClick={() => decrement(extra.extra_id)}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="w-6 text-center text-brand-red">
                                    {quantities[extra.extra_id] ?? 0}
                                </span>
                                <button
                                    type="button"
                                    className="px-2 rounded font-bold cursor-pointer transition bg-bg-light hover:bg-gray-100"
                                    onClick={() => increment(extra.extra_id)}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </OrderModalShell>
    );
}
