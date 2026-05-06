import { useState } from "react";
import EditMainDish from "./EditMainDish";

interface EditingState {
    type: "none" | "dish" | "variant";
    dishId?: number;
    variantId?: number;
}

export default function CrudDishCard({ dish }) {

    const [editing, setEditing] = useState<EditingState>({ type: "none" });
    const [editModeMainDish, setEditModeMainDish] = useState(false);
    // Form states
    const [dishFormData, setDishFormData] = useState({
        name: "",
        description: "",
    });
    const [variantFormData, setVariantFormData] = useState({
        name: "",
        price: "",
    });

    const handleUpdateDish = async (dishId: number) => {
        // const dish = dishes.find((d) => d.id === dishId);
        // if (!dish) return;

        // if (!dishFormData.name.trim()) {
        //     setError("Dish name is required");
        //     return;
        // }

        // try {
        //     const res = await fetch(`/api/menu_items/${dishId}`, {
        //         method: "PATCH",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             name: dishFormData.name,
        //             description: dishFormData.description,
        //         }),
        //         credentials: "include",
        //     });

        //     if (!res.ok) throw new Error("Failed to update dish");

        //     showSuccess("Dish updated successfully!");
        //     // setEditing({ type: "none" });
        //     setError(null);
        //     fetchMenuData();
        // } catch (err) {
        //     setError(err instanceof Error ? err.message : "Failed to update dish");
        // }
    };

    function handleToggleDish(id: any, arg1: any): void {
        throw new Error("Function not implemented.");
    }

    // CREATE: Add variant
    const handleCreateVariant = async (dishId: number) => {
        // if (!variantFormData.name.trim() || !variantFormData.price.trim()) {
        //     setError("Variant name and price required");
        //     return;
        // }

        // try {
        //     const res = await fetch(`/api/menu_items/${dishId}`, {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             variant_name: variantFormData.name,
        //             price: parseFloat(variantFormData.price),
        //             is_active: true,
        //         }),
        //         credentials: "include",
        //     });

        //     if (!res.ok) throw new Error("Failed to create variant");

        //     showSuccess("Variant created!");
        //     setVariantFormData({ name: "", price: "" });
        //     setError(null);
        //     fetchMenuData();
        // } catch (err) {
        //     setError(
        //         err instanceof Error ? err.message : "Failed to create variant",
        //     );
        // }
    };

    function handleToggleVariant(id: any, arg1: any): void {
        throw new Error("Function not implemented.");
    }

    // UPDATE: Edit variant
    const handleUpdateVariant = async (variantId: number) => {
        // if (!variantFormData.name.trim() || !variantFormData.price.trim()) {
        //     setError("Variant name and price required");
        //     return;
        // }

        // try {
        //     const res = await fetch(`/api/menu_items/variants/${variantId}`, {
        //         method: "PATCH",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({
        //             variant_name: variantFormData.name,
        //             price: parseFloat(variantFormData.price),
        //         }),
        //         credentials: "include",
        //     });

        //     if (!res.ok) throw new Error("Failed to update variant");

        //     showSuccess("Variant updated!");
        //     setEditing({ type: "none" });
        //     setVariantFormData({ name: "", price: "" });
        //     setError(null);
        //     fetchMenuData();
        // } catch (err) {
        //     setError(err instanceof Error ? err.message : "Failed to update variant");
        // }
    };

    return (
        <div
            key={dish.id}
            className="rounded-3xl bg-white/85 p-6 shadow-[0_18px_60px_rgba(31,26,23,0.08)] ring-1 ring-black/5"
        >
            {/* Dish Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-3">
                    {editModeMainDish ? (
                        <EditMainDish dish={dish} setEditMode={setEditModeMainDish} />
                    ) : (
                        <>
                            <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-xl font-bold font-bungee text-foreground">
                                    {dish.name} - {dish.id}
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
                                onClick={() => {
                                    setDishFormData({
                                        name: dish.name,
                                        description: dish.description || "",
                                    });
                                    setEditing({ type: "dish", dishId: dish.id });
                                }}
                                className="text-sm font-medium text-brand-blue hover:text-accent-blue"
                            >
                                Edit Dish
                            </button>
                        </>
                    )}
                </div>
                <button
                    onClick={() =>
                        handleToggleDish(dish.id, dish.is_active ?? true)
                    }
                    className={`rounded-full px-4 py-2 font-medium transition-all duration-200 ${dish.is_active ?? true
                        ? "bg-[#fdf0ef] text-brand-red"
                        : "bg-[#eef5ff] text-brand-blue"
                        }`}
                >
                    {dish.is_active ?? true ? "Disable" : "Enable"}
                </button>
            </div>

            {/* Variants Section */}
            {dish.item_variants && (
                <div className="mt-6 border-t border-black/5 pt-6">
                    <p className="mb-4 text-sm font-bold text-foreground">
                        Variants ({dish.item_variants.length})
                    </p>

                  

                    {/* Variants List */}
                    {dish.item_variants.length === 0 ? (
                        <p className="text-sm text-light">No variants</p>
                    ) : (
                        <div className="space-y-2">
                            {dish.item_variants.map((variant) => (
                                <div
                                    key={`${variant.id}-${variant.name}`}
                                    className="flex flex-col gap-3 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    {editing.type === "variant" &&
                                        editing.variantId === variant.id ?
                                        (
                                            <div className="flex-1 grid gap-2 md:grid-cols-[minmax(0,1fr)_120px_auto_auto]"
                                                key={`${variant.id}`}
                                            >
                                                `${variant.id}-${variant.name}`
                                            <input
                                                    type="text"
                                                value={variantFormData.name}
                                                onChange={(e) =>
                                                    setVariantFormData({
                                                        ...variantFormData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="input-brand rounded-2xl border-0 bg-white text-sm"
                                            />
                                            <input
                                                type="number"
                                                value={variantFormData.price}
                                                onChange={(e) =>
                                                    setVariantFormData({
                                                        ...variantFormData,
                                                        price: e.target.value,
                                                    })
                                                }
                                                step="0.01"
                                                className="input-brand rounded-2xl border-0 bg-white text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateVariant(variant.id)
                                                }
                                                className="rounded-2xl bg-brand-blue px-4 py-2 text-sm font-medium text-white"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditing({ type: "none" })}
                                                className="rounded-2xl bg-[#f7f3ee] px-4 py-2 text-sm font-medium text-foreground"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div key={`${variant.id}-${variant.name}`}>
                                                <div className="flex-1"
                                                >
                                                    `${variant.id}-${variant.name}`
                                                <p className="text-sm font-medium text-foreground">
                                                    {variant.variant_name ||
                                                        `Variant ${variant.id}`}
                                                </p>
                                                <p className="text-sm text-light">
                                                    ${variant.price}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${variant.is_active ?? true
                                                        ? "bg-[#eef5ff] text-brand-blue"
                                                        : "bg-[#faf0ef] text-brand-red"
                                                        }`}
                                                >
                                                    {variant.is_active ?? true
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setVariantFormData({
                                                            name: variant.variant_name || "",
                                                            price: String(variant.price),
                                                        });
                                                        setEditing({
                                                            type: "variant",
                                                            variantId: variant.id,
                                                        });
                                                    }}
                                                    className="text-xs font-medium text-brand-blue hover:text-accent-blue"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleVariant(
                                                            variant.id,
                                                            variant.is_active ?? true,
                                                        )
                                                    }
                                                    className="text-xs font-medium text-brand-red hover:text-rose"
                                                >
                                                    {variant.is_active ?? true
                                                        ? "Disable"
                                                        : "Enable"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}   