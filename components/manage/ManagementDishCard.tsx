import { useState } from "react";
import EditMainDish from "./EditMainDish";
import MainDishComponent from "./MainDishComponent";
import VariantDishComponent from "./VariantDishComponent";

interface EditingState {
    type: "none" | "dish" | "variant";
    dishId?: number;
    variantId?: number;
}

export default function ManagementDishCard({ dish }) {

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
            <MainDishComponent dish={dish} setMainDishFormData={setDishFormData} />


            {/* Variants Section */}
            <VariantDishComponent itemVariants={dish.item_variants} />
        </div>
    );
}   