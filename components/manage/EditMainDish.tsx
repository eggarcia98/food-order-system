"use client";

import { useState } from "react";

export default function EditMainDish({ dish, setEditMode }) {
    const [dishFormData, setDishFormData] = useState({
        name: dish?.name || "",
        description: dish?.description || "",
        img_url: dish?.img_url || "",
        is_active: dish?.is_active || false,
    });

    const handleUpdateDish = async (dishId) => {
        try {
            const res = await fetch(`/api/items/${dishId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dishFormData),
            });
        } catch (err) {
            console.error("Error updating dish:", err);
        }
    };
  
    return (
        <div className="space-y-3">
            <input
                type="text"
                value={dishFormData.name}
                onChange={(e) =>
                    setDishFormData({
                        ...dishFormData,
                        name: e.target.value,
                    })
                }
                className="input-brand w-full rounded-2xl border-0 bg-[#faf7f2] text-sm"
            />
            <textarea
                value={dishFormData.description}
                onChange={(e) =>
                    setDishFormData({
                        ...dishFormData,
                        description: e.target.value,
                    })
                }
                rows={2}
                className="input-brand w-full rounded-2xl border-0 bg-[#faf7f2] text-sm"
            />
            <div className="flex gap-2">
                <button
                    onClick={() => handleUpdateDish(dish.id)}
                    className="flex-1 rounded-full bg-brand-blue py-2 text-sm font-medium text-white"
                >
                    Save
                </button>
                <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 rounded-full bg-[#f7f3ee] py-2 text-sm font-medium text-foreground"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}