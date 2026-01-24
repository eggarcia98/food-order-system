"use client";

import React, { useEffect } from "react";

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

export default function AddMainItemModal({
    open,
    setOpen,
    menuItems,
    setConfirmedMainItems,
}: any) {
    const [selectedVariant, setSelectedVariant] =
        React.useState<SelectedVariant | null>(null);
    const [quantity, setQuantity] = React.useState<number>(1);
    const [expandedCategory, setExpandedCategory] = React.useState<number | null>(null);

    const resetOrderForm = () => {
        setSelectedVariant(null);
        setQuantity(1);
    };

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

    const confirmOrderItem = () => {
        if (!selectedVariant) return;
        setConfirmedMainItems((prev: any) => [
            ...prev,
            {
                ...selectedVariant,
                quantity,
            },
        ]);
        resetOrderForm();
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-50 bg-white shadow-xl transition-transform duration-500 ease-out
    ${open ? "translate-y-0" : "translate-y-full"}
    rounded-t-3xl max-h-[80vh] flex flex-col
    md:rounded-2xl md:left-1/2 md:top-1/2 md:bottom-auto md:translate-x-[-50%] md:translate-y-[-50%]
    md:max-w-lg md:w-[90%] md:h-auto
  `}
        >
            <div className="p-4 border-b flex justify-between items-center border-brand">
                <h2 className="text-lg font-semibold text-foreground">
                    Add Main Item
                </h2>
                <button
                    onClick={() => setOpen(false)}
                    className="transition text-secondary"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 smooth-scroll">
                {/* Menu Items */}
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
                                <div
                                    onClick={() => toggleCategory(menuItem.id)}
                                    className="flex items-center justify-between cursor-pointer mb-3 p-2 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <h4 className="font-semibold text-foreground">
                                        {menuItem.name}
                                    </h4>
                                    <span
                                        className={`text-lg transition-transform ${expandedCategory === menuItem.id ? "rotate-180" : ""}`}
                                    >
                                        ▼
                                    </span>
                                </div>
                                {expandedCategory === menuItem.id && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {menuItem.item_variants
                                            .filter(
                                                (variant) => variant.is_active,
                                            )
                                            .map((variant) => (
                                                <div
                                                    key={variant.id}
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
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quantity */}
                <div className="mt-6 flex items-center justify-between">
                    <label className="text-lg font-semibold text-foreground">
                        Quantity
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={decrementQuantity}
                            className="px-3 py-1 rounded-lg font-bold bg-bg-light text-secondary transition"
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
                            className="px-3 py-1 rounded-lg font-bold bg-bg-light text-secondary transition"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                    <div
                        onClick={() => {
                            setOpen(false);
                        }}
                        className="px-4 py-2 rounded-xl cursor-pointer transition bg-bg-light text-secondary"
                    >
                        Cancel
                    </div>
                    <div
                        onClick={() => confirmOrderItem()}
                        className="px-4 py-2 rounded-xl cursor-pointer transition btn-brand-blue"
                    >
                        Add
                    </div>
                </div>
            </div>
        </div>
    );
}
