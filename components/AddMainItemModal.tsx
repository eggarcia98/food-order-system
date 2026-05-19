"use client";

import React, { useCallback } from "react";
import { OrderModalShell } from "@/components/OrderModalShell";
import {
    MenuItem,
    ItemVariant,
    SelectedVariant,
    AddMainItemModalProps,
} from "@/lib/domain";

export default function AddMainItemModal({
    open,
    setOpen,
    menuItems,
    setConfirmedMainItems,
}: AddMainItemModalProps) {
    const [selectedVariant, setSelectedVariant] =
        React.useState<SelectedVariant | null>(null);
    const [quantity, setQuantity] = React.useState<number>(1);
    const [expandedCategory, setExpandedCategory] = React.useState<number | null>(null);

    const resetOrderForm = useCallback(() => {
        setSelectedVariant(null);
        setQuantity(1);
    }, []);

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
        const nextValue = Math.max(1, Number(e.target.value) || 1);
        setQuantity(nextValue);
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);

    const decrementQuantity = () =>
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const toggleCategory = (categoryId: number) => {

        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
        }
    };

    const confirmOrderItem = useCallback(() => {
        if (!selectedVariant) return;
        setConfirmedMainItems((prev) => [
            ...prev,
            {
                ...selectedVariant,
                quantity,
            },
        ]);
        resetOrderForm();
        setOpen(false);
    }, [selectedVariant, quantity, setConfirmedMainItems, resetOrderForm, setOpen]);

    return (
        <OrderModalShell
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={confirmOrderItem}
            title="Add Main Item"
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
                    {menuItems
                        .filter((item: MenuItem) => item.is_active)
                        .map((menuItem: MenuItem) => (
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
                                                    src={variant.image_url || menuItem.img_url}
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
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={decrementQuantity}
                        className="px-3 py-1 rounded-lg font-bold bg-bg-light text-secondary transition hover:bg-gray-100"
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e)}
                        min={1}
                        className="border rounded-lg w-16 text-center transition input-brand"
                    />
                    <button
                        type="button"
                        onClick={incrementQuantity}
                        className="px-3 py-1 rounded-lg font-bold bg-bg-light text-secondary transition hover:bg-gray-100"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </div>
        </OrderModalShell>
    );
}
