"use client";

import { useState } from "react";
import type { MenuItem } from "@/lib/domain";

interface EditMainDishProps {
    dish: MenuItem;
    setEditMode: (editMode: boolean) => void;
}

type DishUpdatePayload = {
    name: string;
    description: string;
    img_url: string;
    is_active: boolean;
    img_data?: string;
};

export default function EditMainDish({ dish, setEditMode }: EditMainDishProps) {
    const [dishFormData, setDishFormData] = useState({
        name: dish?.name || "",
        description: dish?.description || "",
        img_url: dish?.img_url || "",
        // editing will not expose active toggle; default to false
        is_active: false,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(dish?.img_url || null);


    const handleUpdateDish = async (dishId: number) => {
        try {
            const payload: DishUpdatePayload = { ...dishFormData };

            if (imageFile) {
                // convert to data URL for now (small images only). Backend can handle img_data if supported.
                const dataUrl = await new Promise<string | null>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
                    reader.onerror = () => resolve(null);
                    reader.readAsDataURL(imageFile);
                });

                if (dataUrl) payload.img_data = dataUrl;
            }

            const res = await fetch(`/api/items/${dishId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setEditMode(false);
            }
        } catch (err) {
            console.error("Error updating dish:", err);
        }
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 flex flex-row gap-4 items-center">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-[#f3f2ef] ring-1 ring-black/5">
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt={dish?.name || "preview"} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-text-light">No image</div>
                    )}

                    <label htmlFor="dish-image-upload" className="absolute bottom-1 right-1 inline-flex items-center justify-center h-7 w-7 rounded-full bg-white/90 ring-1 ring-black/5 cursor-pointer hover:opacity-95">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4M12 7v10" />
                        </svg>
                        <input id="dish-image-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            setImageFile(file);
                            if (file) {
                                const url = URL.createObjectURL(file);
                                setPreviewUrl(url);
                            } else {
                                setPreviewUrl(dish?.img_url || null);
                            }
                        }} />
                    </label>
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                    <div className="inline-flex max-w-full items-center gap-1">
                        <input
                            type="text"
                            value={dishFormData.name}
                            onChange={(e) =>
                                setDishFormData({
                                    ...dishFormData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="Dish name"
                            className="min-w-0 bg-transparent text-xl font-guayacos text-foreground outline-none border-b border-gray-300"
                        />

                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                    </div>


                    <div className="relative">
                        <textarea
                            value={dishFormData.description}
                            onChange={(e) =>
                                setDishFormData({
                                    ...dishFormData,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Short description"
                            rows={1}
                            wrap="off"
                            className="max-w-3xl w-full resize-none overflow-x-auto whitespace-nowrap bg-transparent pr-7 font-guayacos text-sm leading-6 text-light placeholder:text-text-light outline-none border-b border-gray-300 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        />
                        <button type="button" className="absolute right-0 bottom-0 p-1 text-text-light">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                        </button>
                    </div>
                    <button
                        onClick={() => handleUpdateDish(dish.id)}
                        className="text-sm font-medium text-brand-red hover:text-accent"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:mt-0">
                <button
                    onClick={() => handleUpdateDish(dish.id)}
                    className="rounded-full bg-foreground text-white px-4 py-2 text-sm font-medium"
                >
                    Save
                </button>
                <button
                    onClick={() => setEditMode(false)}
                    className="rounded-full bg-[#f3f2ef] px-4 py-2 text-sm font-medium text-foreground"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
