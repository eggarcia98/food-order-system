"use client";

import { useState } from "react";
import EditVariantDish from "./EditVariantDish";

export default function VariantDishItem({ itemVariant }) {

    const [editMode, setEditMode] = useState(false);
    const [variantFormData, setVariantFormData] = useState({
        name: "",
        price: "",
    });

    const handleToggleVariantDishStatus = async (): Promise<void> => {
 try {
            const res = await fetch(`/api/dish/variant/toggleStatus`, {
                method: "PUT",
                body: JSON.stringify({ id: itemVariant.id, is_active: !itemVariant.is_active }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (err) {
            console.error("Error toggling dish:", err);
        }
    }

    if (editMode)
        return (
            <EditVariantDish
                itemVariant={itemVariant}
                setVariantFormData={setVariantFormData}
                variantFormData={variantFormData}
                setEditMode={setEditMode}
            />);

    return (
        <div
            className="flex flex-col gap-3 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between"
        >
            <div key={`${itemVariant.id}-${itemVariant.name}`}>
                <div className="flex-1"
                >
                    <p className="text-sm font-medium text-foreground">
                        {itemVariant.variant_name}
                    </p>
                    <p className="text-sm text-light">
                        ${itemVariant.price}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${itemVariant.is_active ?? true
                            ? "bg-[#eef5ff] text-brand-blue"
                            : "bg-[#faf0ef] text-brand-red"
                            }`}
                    >
                        {itemVariant.is_active ?? true
                            ? "Active"
                            : "Inactive"}
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setVariantFormData({
                                name: itemVariant.variant_name || "",
                                price: String(itemVariant.price),
                            });
                            setEditMode(true);
                        }}
                        className="text-xs font-medium text-brand-blue hover:text-accent-blue"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            handleToggleVariantDishStatus()
                        }
                        className="text-xs font-medium text-brand-red hover:text-rose"
                    >
                        {itemVariant.is_active ?? true
                            ? "Disable"
                            : "Enable"}
                    </button>
                </div>
            </div>

        </div>
    )
} 