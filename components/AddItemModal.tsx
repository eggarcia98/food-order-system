"use client";

import React, { useCallback, useEffect } from "react";
import { OrderModalShell } from "@/components/OrderModalShell";
import { useQuantityMap } from "@/lib/useQuantityMap";

interface ItemVariant {
    id: number;
    item_id: number;
    variant_name: string;
    price: number;
    is_active: boolean;
    image_url?: string;
}

interface MenuItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    item_variants: ItemVariant[];
}

interface SelectedVariant {
    item_id: number;
    item_name: string;
    variant_id: number;
    variant_name: string;
    price: number;
    quantity: number;
}

interface SideItem {
    id: number;
    name: string;
    price?: number;
    quantity?: number;
}

export default function AddItemModal({
    open,
    setOpen,
    sides,
    menuItems,
    setConfirmedOrderList,
}: any) {
    const [selectedVariant, setSelectedVariant] =
        React.useState<SelectedVariant | null>(null);
    const [sidesSelected, setSidesSelected] = React.useState<any>([]);
    const [quantity, setQuantity] = React.useState<number>(1);
    const [expandedCategory, setExpandedCategory] = React.useState<number | null>(null);

    const sideIds = sides.map((s: SideItem) => s.id);
    const { quantities: sideQuantities, increment, decrement, reset: resetSideQuantities } = useQuantityMap(
        sideIds,
        0,
    );

    useEffect(() => {
        const updatedSides = sides
            .filter((side: SideItem) => sideQuantities[side.id] > 0)
            .map((side: SideItem) => ({
                id: side.id,
                name: side.name,
                quantity: sideQuantities[side.id],
                price: side.price,
            }));

        setSidesSelected(updatedSides);
    }, [sideQuantities, sides]);

    const resetOrderForm = useCallback(() => {
        setSelectedVariant(null);
        setSidesSelected([]);
        resetSideQuantities();
        setQuantity(1);
    }, [resetSideQuantities]);

    const handleVariantSelect = (menuItem: MenuItem, variant: ItemVariant) => {
        setSelectedVariant({
            item_id: menuItem.id,
            item_name: menuItem.name,
            variant_id: variant.id,
            variant_name: variant.variant_name,
            price: variant.price,
            quantity: 1,
        });
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(Math.max(1, Number(e.target.value) || 1));
    };

    const toggleCategory = (categoryId: number) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
        }
    };

    const confirmOrderItem = useCallback(() => {
        if (!selectedVariant) return;
        setConfirmedOrderList((prev: any) => [
            ...prev,
            {
                variant: selectedVariant,
                quantity,
                sides: sidesSelected,
            },
        ]);
        resetOrderForm();
        setOpen(false);
    }, [selectedVariant, quantity, sidesSelected, setConfirmedOrderList, resetOrderForm, setOpen]);

    return (
        <OrderModalShell
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={confirmOrderItem}
            title="Add Item"
            confirmDisabled={!selectedVariant}
        >
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 rounded-full bg-brand-blue"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Menu Items
                    </h3>
                </div>
                <div className="space-y-6">
                    {menuItems.map((menuItem: MenuItem) => (
                        <div key={menuItem.id}>
                            <button
                                type="button"
                                onClick={() => toggleCategory(menuItem.id)}
                                className="w-full flex items-center justify-between cursor-pointer mb-3 p-2 rounded-lg hover:bg-gray-50 transition text-left"
                            >
                                <h4 className="font-semibold text-foreground">
                                    {menuItem.name}
                                </h4>
                                <span
                                    className={`text-lg transition-transform ${expandedCategory === menuItem.id ? "rotate-180" : ""}`}
                                >
                                    ▼
                                </span>
                            </button>
                            {expandedCategory === menuItem.id && (
                                <div className="grid grid-cols-2 gap-3">
                                    {menuItem.item_variants
                                        .filter(
                                            (variant) => variant.is_active,
                                        )
                                        .map((variant) => (
                                            <button
                                                key={variant.id}
                                                type="button"
                                                onClick={() =>
                                                    handleVariantSelect(
                                                        menuItem,
                                                        variant,
                                                    )
                                                }
                                                className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer transition ${
                                                    selectedVariant?.variant_id ===
                                                    variant.id
                                                        ? "border-brand-blue bg-brand-blue-15"
                                                        : "border-brand"
                                                }`}
                                            >
                                                <img
                                                    src={variant.image_url}
                                                    alt={
                                                        variant.variant_name
                                                    }
                                                    className="w-20 h-20 object-cover rounded-lg mb-2"
                                                />
                                                <p className="font-medium text-foreground text-sm text-center">
                                                    {variant.variant_name}
                                                </p>
                                                <p className="text-sm text-brand-red">
                                                    ${variant.price}
                                                </p>
                                            </button>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <label className="text-lg font-semibold text-foreground">
                    Quantity
                </label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e)}
                    min={1}
                    className="border rounded-lg w-20 text-center transition input-brand"
                />
            </div>

            <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 rounded-full bg-brand-blue"></div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Sides
                    </h3>
                </div>
                <div className="flex flex-col gap-2">
                    {sides.map((side: SideItem) => (
                        <div
                            key={side.id}
                            className="flex justify-between items-center border-b p-2 px-3 text-sm border-brand"
                        >
                            <span className="text-secondary">
                                {side.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="px-2 rounded font-bold cursor-pointer transition bg-bg-light hover:bg-gray-100"
                                    onClick={() => decrement(side.id)}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="w-6 text-center text-brand-red">
                                    {sideQuantities[side.id] ?? 0}
                                </span>
                                <button
                                    type="button"
                                    className="px-2 rounded font-bold cursor-pointer transition bg-bg-light hover:bg-gray-100"
                                    onClick={() => increment(side.id)}
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
