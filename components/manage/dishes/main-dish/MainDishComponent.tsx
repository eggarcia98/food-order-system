"use client";

import { useState } from "react";
import EditMainDish from "./EditMainDish";
import type { MenuItem } from "@/lib/domain";

interface MainDishComponentProps {
    dish: MenuItem;
}

export default function MainDishComponent({ dish }: MainDishComponentProps) {
    const [editMode, setEditMode] = useState(false);

    const handleToggleMainDishStatus = async (): Promise<void> => {
        try {
            const res = await fetch(`/api/dish/toggleStatus`, {
                method: "PUT",
                body: JSON.stringify({ id: dish.id, is_active: !dish.is_active }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (err) {
            console.error("Error toggling dish:", err);
        }
    };

    if (editMode) {
        return (
            <EditMainDish dish={dish} setEditMode={setEditMode} />
        )
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 flex flex-row gap-4 items-center">
                {dish.img_url && (
                    <img
                        src={dish.img_url}
                        alt={dish.name}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover ring-1 ring-black/5"
                    />
                )}
                <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold font-bungee text-foreground">
                            {dish.name}
                        </h3>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${dish.is_active ?? true
                                ? "bg-[#eef8f4] text-[#2c7a5a]"
                                : "bg-[#faf0ef] text-brand-red"
                                }`}
                        >
                            {dish.is_active ?? true ? "Active" : "Inactive"}
                        </span>
                    </div>
                    {dish.description && <p className="max-w-3xl text-sm leading-6 text-light">{dish.description}</p>}
                    <button
                        onClick={() => setEditMode(true)}
                        className="text-sm font-medium text-brand-blue hover:text-accent-blue"
                    >
                        Edit Dish
                    </button>
                </div>
            </div >
            <button
                className={`rounded-full px-4 py-2 font-medium transition-all duration-200 ${dish.is_active ?? true
                    ? "bg-[#fdf0ef] text-brand-red"
                    : "bg-[#eef5ff] text-brand-blue"
                    }`}
                onClick={() =>
                    handleToggleMainDishStatus()
                }
            >
                {dish.is_active ?? true ? "Disable" : "Enable"}
            </button>
        </div>
    )
}
